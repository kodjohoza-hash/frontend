const { Op } = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
  sequelize,
  Agent,
  CompteAgent,
  Agence,
  Compagnie,
  Client,
  Ville,
  SessionConnexion,
  RefreshToken,
  PasswordResetToken,
  EmailVerificationToken,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { comparePassword, hashPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/token');
const { serializeUser, serializeClient } = require('../utils/serializeUser');
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

const loadClientFull = (id) =>
  Client.findOne({ where: { id }, include: [{ model: Ville, as: 'ville' }] });

/** Un client peut se connecter s'il est actif ou nouveau (inscription en cours). */
const clientCanLogin = (client) => ['actif', 'nouveau'].includes(client.statut);

const clientMeta = (req) => ({
  ip: req.ip || req.connection?.remoteAddress || null,
  userAgent: req.headers?.['user-agent'] || null,
});

const logSession = ({ agentId, clientId, type, req }) =>
  SessionConnexion.create({
    agent_id: agentId ?? null,
    client_id: clientId ?? null,
    date: new Date(),
    ip: (req.ip || req.connection?.remoteAddress || '0.0.0.0').slice(0, 45),
    navigateur: (req.headers?.['user-agent'] || '').slice(0, 120),
    appareil: null,
    localisation: null,
    type,
  }).catch(() => null); /* le journal ne doit jamais faire échouer le flux */

/**
 * Payload de l'access token selon le type de compte.
 * Agent : id + email + role + rattachements. Client : id + email + role.
 */
const buildAccessPayload = (actor) => {
  if (actor.role === 'client') {
    return { id: actor.id, email: actor.email, role: 'client' };
  }
  return {
    id: actor.id,
    email: actor.email,
    role: actor.role,
    agenceId: actor.agence_id,
    compagnieId: actor.agence?.compagnie_id ?? undefined,
  };
};

/** Crée un refresh token (JWT), stocke son hash et retourne le jeton brut. */
const issueRefreshToken = async (actor, req) => {
  const isClient = actor.role === 'client';
  const raw = signRefreshToken({
    id: actor.id,
    role: actor.role,
    jti: crypto.randomUUID(),
  });

  await RefreshToken.create({
    agent_id: isClient ? null : actor.id,
    client_id: isClient ? actor.id : null,
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

/** Révoque tous les refresh tokens encore actifs d'un client. */
const revokeAllClientRefreshTokens = async (clientId) =>
  RefreshToken.update(
    { revoked_at: new Date() },
    { where: { client_id: clientId, revoked_at: null } }
  );

const accessExpiryMs = (token) => {
  const decoded = jwt.decode(token);
  return decoded?.exp ? decoded.exp * 1000 : null;
};

/* ══════════════════════════════════════════════════════════════
   Connexion
   ══════════════════════════════════════════════════════════════ */

const login = async ({ email, motDePasse }, req) => {
  const loginEmail = email.trim().toLowerCase();
  const compte = await CompteAgent.findOne({ where: { email: loginEmail } });

  /* ── Agent (compte_agent) ─────────────────────────────────── */
  if (compte && compte.mot_de_passe_hash) {
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
        await logSession({ agentId: compte.agent_id, type: 'suspect', req });
      } else {
        await logSession({ agentId: compte.agent_id, type: 'echec', req });
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
    await logSession({ agentId: agent.id, type: 'connexion', req });

    const token = signAccessToken(buildAccessPayload(agent));
    const refreshToken = await issueRefreshToken(agent, req);

    return {
      user: serializeUser(agent),
      token,
      refreshToken,
      expiresAt: accessExpiryMs(token),
    };
  }

  /* ── Client (table client, mot_de_passe_hash) ─────────────── */
  const client = await Client.findOne({ where: { email: loginEmail } });
  if (!client || !client.mot_de_passe_hash) {
    throw new ApiError(401, 'Identifiants invalides.');
  }

  const valide = await comparePassword(motDePasse, client.mot_de_passe_hash);
  if (!valide) {
    throw new ApiError(401, 'Identifiants invalides.');
  }
  if (!clientCanLogin(client)) {
    throw new ApiError(403, 'Ce compte est inactif ou suspendu.');
  }

  await Client.update({ statut: 'actif' }, { where: { id: client.id } });
  client.statut = 'actif';
  await logSession({ clientId: client.id, type: 'connexion', req });

  const token = signAccessToken(buildAccessPayload(client));
  const refreshToken = await issueRefreshToken(client, req);

  return {
    user: serializeClient(client),
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
  const ownerId = row?.client_id || row?.agent_id;
  if (!row || !ownerId || payload.id !== ownerId) {
    throw new ApiError(401, 'Refresh token invalide.');
  }

  /* 3. Réutilisation d'un token déjà révoqué → famille compromise */
  if (row.revoked_at) {
    if (row.client_id) await revokeAllClientRefreshTokens(row.client_id);
    else await revokeAllRefreshTokens(row.agent_id);
    throw new ApiError(401, 'Session révoquée. Veuillez vous reconnecter.');
  }

  /* 4. Expiration */
  if (new Date(row.expires_at) <= new Date()) {
    await RefreshToken.update({ revoked_at: new Date() }, { where: { id: row.id } });
    throw new ApiError(401, 'Session expirée. Veuillez vous reconnecter.');
  }

  /* 5. Compte toujours actif ? */
  const isClientToken = Boolean(row.client_id);
  let actor;
  if (isClientToken) {
    actor = await loadClientFull(row.client_id);
    if (!actor || !clientCanLogin(actor)) {
      throw new ApiError(403, 'Ce compte est inactif ou suspendu.');
    }
  } else {
    actor = await loadAgentFull(row.agent_id);
    if (!actor || actor.statut !== 'actif') {
      throw new ApiError(403, 'Ce compte est inactif ou suspendu.');
    }
  }

  /* 6. Rotation : nouveau jeton + révocation de l'ancien */
  const rawNew = signRefreshToken({ id: actor.id, role: actor.role, jti: crypto.randomUUID() });
  const newRow = await RefreshToken.create({
    agent_id: isClientToken ? null : actor.id,
    client_id: isClientToken ? actor.id : null,
    token_hash: hashToken(rawNew),
    ip: (req.ip || req.connection?.remoteAddress || '').slice(0, 45) || null,
    user_agent: (req.headers?.['user-agent'] || '').slice(0, 255) || null,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * MINUTES),
  });
  await RefreshToken.update(
    { revoked_at: new Date(), replaced_by_token_id: newRow.id },
    { where: { id: row.id } }
  );

  const token = signAccessToken(buildAccessPayload(actor));

  return {
    user: isClientToken ? serializeClient(actor) : serializeUser(actor),
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
      await logSession({
        agentId: row.agent_id ?? undefined,
        clientId: row.client_id ?? undefined,
        type: 'deconnexion',
        req,
      });
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
  await logSession({ agentId: req.agent.id, type: 'suspect', req });

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

/* ══════════════════════════════════════════════════════════════
   Identifiants
   ══════════════════════════════════════════════════════════════ */

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const randomId = (length) => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
};

/** Identifiant client CHAR(12) unique (ex: CLT9FK2XQ7RA). */
const generateClientId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `CLT${randomId(9)}`;
    if (!(await Client.findByPk(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant client unique.');
};

/** Identifiant compagnie CHAR(4) unique (ex: C7F3). */
const generateCompanyId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `C${randomId(3)}`;
    if (!(await Compagnie.findByPk(id))) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant compagnie unique.');
};

/** Identifiant agence CHAR(10) unique (ex: AG00000042). */
const generateAgencyId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `AG${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
    if (!(await Agence.findByPk(id))) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant d'agence unique.");
};

/** Identifiant agent CHAR(10) + matricule uniques. */
const generateAgentId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `AGT${randomId(7)}`;
    if (!(await Agent.findByPk(id))) {
      const matricule = `ADM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      return { id, matricule };
    }
  }
  throw new ApiError(500, "Impossible de générer un identifiant utilisateur unique.");
};

/* ══════════════════════════════════════════════════════════════
   Inscription client (publique)
   ══════════════════════════════════════════════════════════════ */

const registerClient = async (data, req) => {
  const email = data.email.trim().toLowerCase();

  const [existingClient, existingCompte] = await Promise.all([
    Client.findOne({ where: { email } }),
    CompteAgent.findOne({ where: { email } }),
  ]);
  if (existingClient || existingCompte) {
    throw new ApiError(409, 'Un compte existe déjà avec cet email.');
  }

  /* Rattache la ville si elle existe dans la table ville, sinon NULL */
  let villeId = null;
  if (data.ville) {
    const ville = await Ville.findOne({ where: { nom: { [Op.like]: `%${data.ville}%` } } });
    villeId = ville ? ville.id : null;
  }

  const id = await generateClientId();
  const client = await sequelize.transaction(async (t) =>
    Client.create(
      {
        id,
        prenom: data.prenom,
        nom: data.nom,
        telephone: data.telephone,
        email,
        adresse: data.adresse || null,
        ville_id: villeId,
        pays: data.pays,
        date_inscription: new Date(),
        statut: 'nouveau',
        mot_de_passe_hash: await hashPassword(data.motDePasse),
      },
      { transaction: t }
    )
  );

  await logSession({ clientId: client.id, type: 'connexion', req });

  const token = signAccessToken(buildAccessPayload(client));
  const refreshToken = await issueRefreshToken(client, req);

  return {
    user: serializeClient(client),
    token,
    refreshToken,
    expiresAt: accessExpiryMs(token),
  };
};

/* ══════════════════════════════════════════════════════════════
   Inscription compagnie (publique — validation requise)
   Crée compagnie + agence principale + administrateur en attente.
   ══════════════════════════════════════════════════════════════ */

const registerCompany = async (data) => {
  const email = data.email.trim().toLowerCase();

  const [existingCompte, existingClient] = await Promise.all([
    CompteAgent.findOne({ where: { email } }),
    Client.findOne({ where: { email } }),
  ]);
  if (existingCompte || existingClient) {
    throw new ApiError(409, 'Un compte existe déjà avec cet email.');
  }

  let ville = await Ville.findOne({ where: { nom: { [Op.like]: `%${data.city}%` } } });
  if (!ville) ville = await Ville.findByPk('DLA');
  if (!ville) throw new ApiError(400, 'Ville introuvable. Veuillez réessayer plus tard.');

  const compagnieId = await generateCompanyId();
  const agenceId = await generateAgencyId();
  const { id: agentId, matricule } = await generateAgentId();
  const today = todayIso();
  const motDePasseHash = await hashPassword(data.motDePasse);

  await sequelize.transaction(async (t) => {
    await Compagnie.create(
      {
        id: compagnieId,
        nom: data.companyName,
        description: data.description || null,
        telephone: data.phone,
        email,
        site_web: data.website || null,
        adresse: data.address || null,
        ville: data.city,
        pays: data.country,
        rccm: data.rccm,
        numero_contribuable: data.taxpayerNumber,
        date_creation: today,
        actif: true,
        statut: 'en_attente',
        statut_abonnement: 'suspendu',
      },
      { transaction: t }
    );

    await Agence.create(
      {
        id: agenceId,
        nom: `Agence principale ${data.companyName}`,
        ville_id: ville.id,
        adresse: data.address || null,
        telephone: data.phone,
        email,
        compagnie_id: compagnieId,
        statut_abonnement: 'suspendu',
      },
      { transaction: t }
    );

    await Agent.create(
      {
        id: agentId,
        matricule,
        prenom: data.managerFirstName,
        nom: data.managerLastName,
        email,
        telephone: data.phone,
        role: 'company_admin',
        date_embauche: today,
        date_creation: today,
        statut: 'inactif',
        verifie: false,
        agence_id: agenceId,
      },
      { transaction: t }
    );

    await CompteAgent.create(
      {
        agent_id: agentId,
        email,
        telephone: data.phone,
        mot_de_passe_hash: motDePasseHash,
        langue_preferee: 'fr',
      },
      { transaction: t }
    );
  });

  const agent = await loadAgentFull(agentId);
  return {
    user: serializeUser(agent),
    message: 'Votre demande de création de compte a été enregistrée. En attente de validation.',
  };
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
  registerClient,
  registerCompany,
};
