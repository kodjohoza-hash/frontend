const { Op } = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  Agent,
  CompteAgent,
  Agence,
  Compagnie,
  SessionConnexion,
  RefreshToken,
  PasswordResetToken,
  EmailVerificationToken,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { comparePassword, hashPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/token');
const { serializeUser } = require('../utils/serializeUser');
const { sendMail } = require('./mailer.service');
const env = require('../config/env');

const MINUTES = 60 * 1000;
const lockoutMs = () => env.auth.lockoutMinutes * MINUTES;

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const loadAgentFull = (id) =>
  Agent.findOne({
    where: { id },
    include: [
      { model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] },
      { model: CompteAgent, as: 'compte' },
    ],
  });

const clientMeta = (req) => ({
  ip: req.ip || req.connection?.remoteAddress || null,
  userAgent: req.headers?.['user-agent'] || null,
});

const logSession = (agentId, type, req) =>
  SessionConnexion.create({
    agent_id: agentId,
    date: new Date(),
    ip: (req.ip || req.connection?.remoteAddress || '0.0.0.0').slice(0, 45),
    navigateur: (req.headers?.['user-agent'] || '').slice(0, 120),
    appareil: null,
    localisation: null,
    type,
  }).catch(() => null); /* le journal ne doit jamais faire échouer le flux */

/** Crée un refresh token (JWT), stocke son hash et retourne le jeton brut. */
const issueRefreshToken = async (agent, req) => {
  const raw = signRefreshToken({
    id: agent.id,
    role: agent.role,
    jti: crypto.randomUUID(),
  });

  await RefreshToken.create({
    agent_id: agent.id,
    token_hash: hashToken(raw),
    ip: (req.ip || req.connection?.remoteAddress || '').slice(0, 45) || null,
    user_agent: (req.headers?.['user-agent'] || '').slice(0, 255) || null,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * MINUTES),
  });
  return raw;
};

/** Révoque tous les refresh tokens encore actifs d'un agent. */
const revokeAllRefreshTokens = async (agentId) =>
  RefreshToken.update(
    { revoked_at: new Date() },
    { where: { agent_id: agentId, revoked_at: null } }
  );

const accessExpiryMs = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

/* ══════════════════════════════════════════════════════════════
   Connexion
   ══════════════════════════════════════════════════════════════ */

const login = async ({ email, motDePasse }, req) => {
  const compte = await CompteAgent.findOne({ where: { email: email.trim().toLowerCase() } });

  if (!compte || !compte.mot_de_passe_hash) {
    throw new ApiError(401, 'Identifiants invalides.');
  }

  /* Verrouillage temporaire après trop d'échecs */
  if (compte.bloque_jusque && new Date(compte.bloque_jusque) > new Date()) {
    const minutes = Math.ceil((new Date(compte.bloque_jusque) - new Date()) / MINUTES);
    throw new ApiError(423, `Trop de tentatives. Réessayez dans ${minutes} min.`);
  }

  const valide = await comparePassword(motDePasse, compte.mot_de_passe_hash);
  if (!valide) {
    const echecs = (compte.nb_echecs_connexion || 0) + 1;
    let bloqueJusque = null;
    if (echecs >= env.auth.maxLoginAttempts) {
      bloqueJusque = new Date(Date.now() + lockoutMs());
      await logSession(compte.agent_id, 'suspect', req);
    } else {
      await logSession(compte.agent_id, 'echec', req);
    }
    await CompteAgent.update(
      { nb_echecs_connexion: echecs, bloque_jusque: bloqueJusque },
      { where: { agent_id: compte.agent_id } }
    );
    throw new ApiError(401, 'Identifiants invalides.');
  }

  const agent = await loadAgentFull(compte.agent_id);
  if (!agent || agent.statut !== 'actif') {
    throw new ApiError(403, 'Ce compte est inactif ou suspendu.');
  }

  /* Succès : remise à zéro du compteur + journal */
  await CompteAgent.update(
    {
      nb_echecs_connexion: 0,
      bloque_jusque: null,
      derniere_connexion: new Date(),
    },
    { where: { agent_id: agent.id } }
  );
  await logSession(agent.id, 'connexion', req);

  const token = signAccessToken({
    id: agent.id,
    email: agent.email,
    role: agent.role,
    agenceId: agent.agence_id,
    compagnieId: agent.agence?.compagnie_id ?? undefined,
  });
  const refreshToken = await issueRefreshToken(agent, req);

  return {
    user: serializeUser(agent),
    token,
    refreshToken,
    expiresAt: accessExpiryMs(token),
  };
};

/* ══════════════════════════════════════════════════════════════
   Refresh token (rotation + détection de réutilisation)
   ══════════════════════════════════════════════════════════════ */

const refreshToken = async ({ refreshToken: raw }, req) => {
  /* 1. Signature JWT valide ? */
  let payload;
  try {
    payload = jwt.verify(raw, env.jwt.refreshSecret);
  } catch (_err) {
    throw new ApiError(401, 'Refresh token invalide.');
  }

  /* 2. Existe-t-il toujours (non révoqué) ? */
  const row = await RefreshToken.findOne({ where: { token_hash: hashToken(raw) } });
  if (!row || payload.id !== row.agent_id) {
    throw new ApiError(401, 'Refresh token invalide.');
  }

  /* 3. Réutilisation d'un token déjà révoqué → famille compromise */
  if (row.revoked_at) {
    await revokeAllRefreshTokens(row.agent_id);
    throw new ApiError(401, 'Session révoquée. Veuillez vous reconnecter.');
  }

  /* 4. Expiration */
  if (new Date(row.expires_at) <= new Date()) {
    await RefreshToken.update({ revoked_at: new Date() }, { where: { id: row.id } });
    throw new ApiError(401, 'Session expirée. Veuillez vous reconnecter.');
  }

  /* 5. Agent toujours actif ? */
  const agent = await loadAgentFull(row.agent_id);
  if (!agent || agent.statut !== 'actif') {
    throw new ApiError(403, 'Ce compte est inactif ou suspendu.');
  }

  /* 6. Rotation : nouveau jeton + révocation de l'ancien */
  const rawNew = signRefreshToken({ id: agent.id, role: agent.role, jti: crypto.randomUUID() });
  const newRow = await RefreshToken.create({
    agent_id: agent.id,
    token_hash: hashToken(rawNew),
    ip: (req.ip || req.connection?.remoteAddress || '').slice(0, 45) || null,
    user_agent: (req.headers?.['user-agent'] || '').slice(0, 255) || null,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * MINUTES),
  });
  await RefreshToken.update(
    { revoked_at: new Date(), replaced_by_token_id: newRow.id },
    { where: { id: row.id } }
  );

  const token = signAccessToken({
    id: agent.id,
    email: agent.email,
    role: agent.role,
    agenceId: agent.agence_id,
    compagnieId: agent.agence?.compagnie_id ?? undefined,
  });

  return {
    user: serializeUser(agent),
    token,
    refreshToken: rawNew,
    expiresAt: accessExpiryMs(token),
  };
};

/* ══════════════════════════════════════════════════════════════
   Déconnexion sécurisée
   ══════════════════════════════════════════════════════════════ */

const logout = async ({ refreshToken: raw }, req) => {
  if (raw) {
    const row = await RefreshToken.findOne({ where: { token_hash: hashToken(raw) } });
    if (row && !row.revoked_at) {
      await RefreshToken.update({ revoked_at: new Date() }, { where: { id: row.id } });
      await logSession(row.agent_id, 'deconnexion', req);
    }
  }
  return { message: 'Déconnexion réussie.' };
};

/* ══════════════════════════════════════════════════════════════
   Mot de passe oublié / réinitialisation
   ══════════════════════════════════════════════════════════════ */

const forgotPassword = async ({ email }) => {
  const compte = await CompteAgent.findOne({ where: { email: email.trim().toLowerCase() } });
  /* Ne jamais révéler si l'email existe : réponse identique dans tous les cas. */
  if (compte) {
    const raw = crypto.randomBytes(32).toString('hex');
    await PasswordResetToken.create({
      agent_id: compte.agent_id,
      token_hash: hashToken(raw),
      expires_at: new Date(Date.now() + 60 * MINUTES),
    });
    const lien = `${env.clientUrl}/auth/reset-password?token=${raw}`;
    await sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe — Bus Tix Connect',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe (valable 1h) : ${lien}`,
      html: `<p>Bonjour,</p><p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe (valable 1h) :</p><p><a href="${lien}">Réinitialiser mon mot de passe</a></p>`,
    });
  }
  return { message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.' };
};

const resetPassword = async ({ token, motDePasse }) => {
  const row = await PasswordResetToken.findOne({
    where: { token_hash: hashToken(token) },
    include: [{ model: Agent, as: 'agent' }],
  });
  if (!row || row.used_at) {
    throw new ApiError(400, 'Jeton invalide ou déjà utilisé.');
  }
  if (new Date(row.expires_at) <= new Date()) {
    throw new ApiError(400, 'Jeton expiré. Demandez un nouveau lien.');
  }

  await CompteAgent.update(
    {
      mot_de_passe_hash: await hashPassword(motDePasse),
      nb_echecs_connexion: 0,
      bloque_jusque: null,
    },
    { where: { agent_id: row.agent_id } }
  );
  await PasswordResetToken.update({ used_at: new Date() }, { where: { id: row.id } });
  await revokeAllRefreshTokens(row.agent_id);

  return { message: 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.' };
};

/* ══════════════════════════════════════════════════════════════
   Profil
   ══════════════════════════════════════════════════════════════ */

const updateProfile = async (data, req) => {
  const agentId = req.agent.id;
  const agentPatch = {};
  if (data.prenom !== undefined) agentPatch.prenom = data.prenom;
  if (data.nom !== undefined) agentPatch.nom = data.nom;
  if (data.telephone !== undefined) agentPatch.telephone = data.telephone;
  if (data.langue !== undefined) agentPatch.langue = data.langue;

  if (Object.keys(agentPatch).length > 0) {
    await Agent.update(agentPatch, { where: { id: agentId } });
  }

  const comptePatch = {};
  if (data.langue !== undefined) comptePatch.langue_preferee = data.langue;
  if (data.theme !== undefined) comptePatch.theme = data.theme;
  if (Object.keys(comptePatch).length > 0) {
    await CompteAgent.update(comptePatch, { where: { agent_id: agentId } });
  }

  const agent = await loadAgentFull(agentId);
  return serializeUser(agent);
};

const changePassword = async ({ motDePasseActuel, nouveauMotDePasse }, req) => {
  const compte = await CompteAgent.findByPk(req.agent.id);
  const valide = compte && (await comparePassword(motDePasseActuel, compte.mot_de_passe_hash));
  if (!valide) {
    throw new ApiError(401, 'Mot de passe actuel incorrect.');
  }

  await CompteAgent.update(
    { mot_de_passe_hash: await hashPassword(nouveauMotDePasse) },
    { where: { agent_id: req.agent.id } }
  );
  /* Révocation de toutes les sessions (y compris les autres appareils) */
  await revokeAllRefreshTokens(req.agent.id);
  await logSession(req.agent.id, 'suspect', req);

  return { message: 'Mot de passe modifié avec succès.' };
};

/* ══════════════════════════════════════════════════════════════
   Vérification d'email
   ══════════════════════════════════════════════════════════════ */

const verifyEmail = async ({ token }) => {
  const row = await EmailVerificationToken.findOne({
    where: { token_hash: hashToken(token) },
    include: [{ model: Agent, as: 'agent' }],
  });
  if (!row || row.used_at) {
    throw new ApiError(400, 'Jeton de vérification invalide ou déjà utilisé.');
  }
  if (new Date(row.expires_at) <= new Date()) {
    throw new ApiError(400, 'Jeton de vérification expiré. Demandez-en un nouveau.');
  }

  await Agent.update({ verifie: true }, { where: { id: row.agent_id } });
  await EmailVerificationToken.update({ used_at: new Date() }, { where: { id: row.id } });
  return { message: 'Email vérifié avec succès.' };
};

const resendVerificationEmail = async ({ email }) => {
  const compte = await CompteAgent.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!compte) {
    /* Ne pas révéler l'existence du compte */
    return { message: 'Si un compte existe pour cet email, un lien de vérification a été envoyé.' };
  }
  const agent = await Agent.findByPk(compte.agent_id);
  if (agent?.verifie) {
    return { message: 'Cet email est déjà vérifié.' };
  }

  const raw = crypto.randomBytes(32).toString('hex');
  await EmailVerificationToken.create({
    agent_id: compte.agent_id,
    token_hash: hashToken(raw),
    email: email.trim().toLowerCase(),
    expires_at: new Date(Date.now() + 24 * 60 * MINUTES),
  });
  const lien = `${env.clientUrl}/auth/verify-email?token=${raw}`;
  await sendMail({
    to: email,
    subject: 'Vérification de votre email — Bus Tix Connect',
    text: `Confirmez votre adresse email : ${lien}`,
    html: `<p>Bonjour,</p><p>Confirmez votre adresse email (lien valable 24h) :</p><p><a href="${lien}">Vérifier mon email</a></p>`,
  });
  return { message: 'Email de vérification envoyé.' };
};

/* ══════════════════════════════════════════════════════════════
   Création d'un agent + compte (réservée au super admin)
   ══════════════════════════════════════════════════════════════ */

const registerAgent = async (data) => {
  const { motDePasse, ...agentData } = data;

  const agent = await Agent.create(agentData);
  await CompteAgent.create({
    agent_id: agent.id,
    email: agentData.email,
    telephone: agentData.telephone,
    mot_de_passe_hash: await hashPassword(motDePasse),
  });

  /* Envoi d'un lien de vérification d'email au nouvel agent */
  const raw = crypto.randomBytes(32).toString('hex');
  await EmailVerificationToken.create({
    agent_id: agent.id,
    token_hash: hashToken(raw),
    email: agentData.email,
    expires_at: new Date(Date.now() + 24 * 60 * MINUTES),
  });
  const lien = `${env.clientUrl}/auth/verify-email?token=${raw}`;
  await sendMail({
    to: agentData.email,
    subject: 'Bienvenue sur Bus Tix Connect — vérifiez votre email',
    text: `Vérifiez votre adresse email : ${lien}`,
    html: `<p>Bienvenue ! Confirmez votre adresse email (lien valable 24h) :</p><p><a href="${lien}">Vérifier mon email</a></p>`,
  });

  const created = await loadAgentFull(agent.id);
  return serializeUser(created);
};

module.exports = {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  registerAgent,
};
