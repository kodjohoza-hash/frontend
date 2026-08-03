const crypto = require('crypto');
const { sequelize, Agent, Agence, CompteAgent, RefreshToken, SessionConnexion, EmailVerificationToken } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { hashPassword, comparePassword } = require('../../../utils/password');
const { hashToken } = require('../../../utils/token');
const { serializeUser } = require('../../../utils/serializeUser');
const { sendMail } = require('../../../services/mailer.service');
const env = require('../../../config/env');
const { userRepository } = require('../repositories');
const photoService = require('./photo.service');
const { ROLES } = require('../validators');

const MINUTES = 60 * 1000;

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Génère un identifiant agent CHAR(10) unique. */
const generateId = async () => {
  for (let i = 0; i < 5; i += 1) {
    const id = `USR${Date.now().toString(36).slice(-7).toUpperCase()}`.padEnd(10, 'X');
    const exists = await Agent.findByPk(id);
    if (!exists) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant utilisateur unique.');
};

/** Génère un matricule unique (USR-XXXXXXXX). */
const generateMatricule = async () => {
  for (let i = 0; i < 5; i += 1) {
    const matricule = `USR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const exists = await userRepository.findByMatricule(matricule);
    if (!exists) return matricule;
  }
  throw new ApiError(500, 'Impossible de générer un matricule unique.');
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = (actor) => {
  if (actor.role === 'super_admin') {
    return { compagnieId: null, roleScope: null, excludeIds: null };
  }
  if (actor.role === 'company_admin') {
    return {
      compagnieId: actor.compagnieId,
      roleScope: ['client', 'company_admin', 'counter_agent'],
      excludeIds: null,
    };
  }
  /* counter_agent / client : gèrent uniquement leur propre profil */
  return { compagnieId: null, roleScope: null, excludeIds: null, selfOnly: true };
};

/** Vérifie que l'acteur peut gérer l'utilisateur cible. */
const assertCanManage = (actor, target) => {
  if (actor.role === 'super_admin') return;
  if (actor.role === 'company_admin') {
    const targetCompany = target.agence?.compagnie_id ?? target.compagnieId;
    if (targetCompany !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : utilisateur hors de votre compagnie.');
    }
    if (target.role === 'super_admin') {
      throw new ApiError(403, 'Accès refusé : gestion réservée au Super Admin.');
    }
    return;
  }
  if (target.id !== actor.id) {
    throw new ApiError(403, 'Accès refusé : vous ne pouvez gérer que votre propre profil.');
  }
};

/** Révoque toutes les sessions actives d'un agent (refresh tokens). */
const revokeAllSessions = async (agentId) =>
  RefreshToken.update(
    { revoked_at: new Date() },
    { where: { agent_id: agentId, revoked_at: null } }
  );

const logSession = (agentId, type, req) =>
  SessionConnexion.create({
    agent_id: agentId,
    date: new Date(),
    ip: (req.ip || req.connection?.remoteAddress || '0.0.0.0').slice(0, 45),
    navigateur: (req.headers?.['user-agent'] || '').slice(0, 120),
    appareil: null,
    localisation: null,
    type,
  }).catch(() => null);

/** Envoie le mail de vérification d'email (best-effort). */
const sendVerificationEmail = async (agent) => {
  const raw = crypto.randomBytes(32).toString('hex');
  await EmailVerificationToken.create({
    agent_id: agent.id,
    token_hash: hashToken(raw),
    email: agent.email,
    expires_at: new Date(Date.now() + 24 * 60 * MINUTES),
  });
  const lien = `${env.clientUrl}/auth/verify-email?token=${raw}`;
  await sendMail({
    to: agent.email,
    subject: 'Vérification de votre email — Bus Tix Connect',
    text: `Confirmez votre adresse email : ${lien}`,
    html: `<p>Bonjour ${agent.prenom},</p><p>Confirmez votre adresse email (lien valable 24h) :</p><p><a href="${lien}">Vérifier mon email</a></p>`,
  });
};

/* ══════════════════════════════════════════════════════════════
   Liste / détail
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = resolveScope(actor);
  const where = userRepository.buildWhere(query, {
    compagnieId: scope.compagnieId,
    roleScope: scope.roleScope,
    excludeIds: scope.excludeIds,
  });
  if (scope.selfOnly) where.id = actor.id;

  const { rows, count } = await userRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  return {
    items: rows.map(serializeUser),
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await userRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Utilisateur introuvable.');
  assertCanManage(actor, target);
  return serializeUser(target);
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor, req }) => {
  if (actor.role === 'super_admin') {
    /* tout rôle accepté */
  } else if (actor.role === 'company_admin') {
    if (data.role === 'super_admin') {
      throw new ApiError(403, 'Réservé au Super Admin.');
    }
    const agence = await Agence.findByPk(data.agence_id);
    if (!agence || agence.compagnie_id !== actor.compagnieId) {
      throw new ApiError(400, 'Agence invalide : hors de votre compagnie.');
    }
  } else {
    throw new ApiError(403, 'Accès refusé : création d\'utilisateurs non autorisée.');
  }

  const email = data.email.trim().toLowerCase();
  const existant = await userRepository.findByEmail(email);
  if (existant) throw new ApiError(409, 'Un utilisateur avec cet email existe déjà.');

  const id = await generateId();
  const matricule = await generateMatricule();
  const agentData = {
    ...data,
    id,
    matricule,
    email,
    date_embauche: data.date_embauche || todayIso(),
    date_creation: data.date_creation || todayIso(),
    verifie: false,
  };

  let agent;
  try {
    agent = await sequelize.transaction(async (t) => {
      const created = await userRepository.create(agentData, { transaction: t });
      await CompteAgent.create(
        {
          agent_id: created.id,
          email,
          telephone: data.telephone,
          mot_de_passe_hash: await hashPassword(data.motDePasse),
          langue_preferee: data.langue?.slice(0, 10) || 'fr',
        },
        { transaction: t }
      );
      return created;
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'Un utilisateur avec ces valeurs existe déjà.');
    }
    throw err;
  }

  /* Envoi du lien de vérification (best-effort, n'échoue jamais le flux) */
  try {
    await sendVerificationEmail(agent);
  } catch (err) {
    logger.warn('Envoi email de vérification impossible', { error: err.message });
  }

  logger.info(`Utilisateur créé : ${agent.email} (${agent.role}) par ${actor.role}`);
  await logSession(agent.id, 'creation', req);
  return serializeUser(await userRepository.findByIdFull(agent.id));
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor, req }) => {
  const target = await userRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Utilisateur introuvable.');
  assertCanManage(actor, target);

  /* Seul le Super Admin peut changer le rôle. */
  if (data.role !== undefined && data.role !== target.role && actor.role !== 'super_admin') {
    throw new ApiError(403, 'Changement de rôle réservé au Super Admin.');
  }

  /* Un company admin ne peut pas se promouvoir super_admin. */
  if (actor.role === 'company_admin' && data.role === 'super_admin') {
    throw new ApiError(403, 'Réservé au Super Admin.');
  }

  /* Vérification du changement d'agence (périmètre compagnie). */
  if (data.agence_id && data.agence_id !== target.agence_id) {
    if (actor.role !== 'super_admin') {
      const agence = await Agence.findByPk(data.agence_id);
      if (!agence || agence.compagnie_id !== actor.compagnieId) {
        throw new ApiError(400, 'Agence invalide : hors de votre compagnie.');
      }
    }
  }

  const emailChange = data.email && data.email.trim().toLowerCase() !== target.email;
  if (emailChange) {
    const email = data.email.trim().toLowerCase();
    const existant = await userRepository.findByEmail(email);
    if (existant && existant.id !== target.id) {
      throw new ApiError(409, 'Un utilisateur avec cet email existe déjà.');
    }
    data.email = email;
  }

  const agentPatch = { ...data };
  delete agentPatch.motDePasse;
  if (emailChange) agentPatch.verifie = false; // nouvel email → à revérifier

  try {
    await sequelize.transaction(async (t) => {
      if (Object.keys(agentPatch).length > 0) {
        await userRepository.update(target, agentPatch, { transaction: t });
      }
      if (data.motDePasse) {
        await CompteAgent.update(
          {
            mot_de_passe_hash: await hashPassword(data.motDePasse),
            nb_echecs_connexion: 0,
            bloque_jusque: null,
          },
          { where: { agent_id: target.id }, transaction: t }
        );
      }
      if (emailChange || data.motDePasse) {
        const comptePatch = {};
        if (emailChange) comptePatch.email = data.email;
        if (comptePatch.email) {
          await CompteAgent.update(comptePatch, { where: { agent_id: target.id }, transaction: t });
        }
      }
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'Un utilisateur avec ces valeurs existe déjà.');
    }
    throw err;
  }

  if (data.motDePasse) {
    await revokeAllSessions(target.id);
    await logSession(target.id, 'reset_pwd', req);
  }

  logger.info(`Utilisateur mis à jour : ${target.email} par ${actor.role}`);
  return serializeUser(await userRepository.findByIdFull(target.id));
};

/* ══════════════════════════════════════════════════════════════
   Suppression (soft delete)
   ══════════════════════════════════════════════════════════════ */

const remove = async ({ id, actor, req }) => {
  const target = await userRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Utilisateur introuvable.');
  assertCanManage(actor, target);
  if (target.id === actor.id) {
    throw new ApiError(400, 'Vous ne pouvez pas supprimer votre propre compte.');
  }

  await userRepository.update(target, { statut: 'supprime' });
  await revokeAllSessions(target.id);
  await logSession(target.id, 'suppression', req);
  logger.info(`Utilisateur supprimé (soft) : ${target.email} par ${actor.role}`);

  return { id: target.id, statut: 'supprime', message: 'Utilisateur supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   Profil (soi-même)
   ══════════════════════════════════════════════════════════════ */

const getProfile = async ({ actor }) => {
  const agent = await userRepository.findByIdFull(actor.id);
  if (!agent) throw new ApiError(404, 'Utilisateur introuvable.');
  return serializeUser(agent);
};

const updateProfile = async ({ data, actor }) => {
  const agent = await userRepository.findByIdFull(actor.id);
  if (!agent) throw new ApiError(404, 'Utilisateur introuvable.');

  const agentPatch = {};
  if (data.prenom !== undefined) agentPatch.prenom = data.prenom;
  if (data.nom !== undefined) agentPatch.nom = data.nom;
  if (data.telephone !== undefined) agentPatch.telephone = data.telephone;
  if (data.adresse !== undefined) agentPatch.adresse = data.adresse;
  if (data.date_naissance !== undefined) agentPatch.date_naissance = data.date_naissance;
  if (data.genre !== undefined) agentPatch.genre = data.genre;
  if (data.nationalite !== undefined) agentPatch.nationalite = data.nationalite;
  if (data.langue !== undefined) agentPatch.langue = data.langue;

  const comptePatch = {};
  if (data.langue !== undefined) comptePatch.langue_preferee = data.langue;
  if (data.theme !== undefined) comptePatch.theme = data.theme;

  await sequelize.transaction(async (t) => {
    if (Object.keys(agentPatch).length > 0) {
      await userRepository.update(agent, agentPatch, { transaction: t });
    }
    if (Object.keys(comptePatch).length > 0) {
      await CompteAgent.update(comptePatch, { where: { agent_id: actor.id }, transaction: t });
    }
  });

  logger.info(`Profil mis à jour : ${agent.email}`);
  return serializeUser(await userRepository.findByIdFull(actor.id));
};

/* ══════════════════════════════════════════════════════════════
   Photo de profil
   ══════════════════════════════════════════════════════════════ */

const updatePhoto = async ({ file, actor, req }) => {
  if (!file) throw new ApiError(400, 'Aucune photo fournie (champ "photo").');
  const agent = await userRepository.findByIdFull(actor.id);

  const url = await photoService.savePhoto(file.buffer, agent.matricule);
  const oldPhoto = agent.photo;
  await userRepository.update(agent, { photo: url });

  /* Remplacement : suppression de l'ancienne photo */
  if (oldPhoto && oldPhoto !== url && photoService.isUserPhotoUrl(oldPhoto)) {
    photoService.deletePhoto(oldPhoto);
  }

  logger.info(`Photo de profil mise à jour : ${agent.email}`);
  await logSession(agent.id, 'photo', req);
  return { photo: url };
};

const removePhoto = async ({ actor, req }) => {
  const agent = await userRepository.findByIdFull(actor.id);
  if (agent.photo && photoService.isUserPhotoUrl(agent.photo)) {
    photoService.deletePhoto(agent.photo);
  }
  await userRepository.update(agent, { photo: null });
  logger.info(`Photo de profil supprimée : ${agent.email}`);
  await logSession(agent.id, 'photo', req);
  return { photo: null };
};

/* ══════════════════════════════════════════════════════════════
   Statut (bloquer / débloquer / suspendre / supprimer…)
   ══════════════════════════════════════════════════════════════ */

const updateStatus = async ({ id, statut, raison, actor, req }) => {
  const target = await userRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Utilisateur introuvable.');
  assertCanManage(actor, target);

  /* Un admin ne peut pas se bloquer lui-même (évite les comptes orphelins). */
  if (target.id === actor.id && statut !== 'actif') {
    throw new ApiError(400, 'Vous ne pouvez pas modifier votre propre statut.');
  }

  await userRepository.update(target, { statut });

  if (statut === 'actif') {
    await CompteAgent.update(
      { nb_echecs_connexion: 0, bloque_jusque: null },
      { where: { agent_id: target.id } }
    );
  } else {
    await revokeAllSessions(target.id);
    await logSession(target.id, 'deconnexion_forcee', req);
  }

  logger.info(`Statut modifié : ${target.email} → ${statut}`, { raison: raison || null, by: actor.role });
  return {
    id: target.id,
    statut,
    message: `Statut de ${target.prenom} ${target.nom} mis à jour : ${statut}.`,
  };
};

/* ══════════════════════════════════════════════════════════════
   Mot de passe (soi-même)
   ══════════════════════════════════════════════════════════════ */

const changePassword = async ({ motDePasseActuel, nouveauMotDePasse, actor, req }) => {
  const compte = await userRepository.findCompte(actor.id);
  const valide = compte && (await comparePassword(motDePasseActuel, compte.mot_de_passe_hash));
  if (!valide) {
    throw new ApiError(401, 'Mot de passe actuel incorrect.');
  }

  await CompteAgent.update(
    {
      mot_de_passe_hash: await hashPassword(nouveauMotDePasse),
      nb_echecs_connexion: 0,
      bloque_jusque: null,
    },
    { where: { agent_id: actor.id } }
  );
  await revokeAllSessions(actor.id);
  await logSession(actor.id, 'suspect', req);
  logger.info(`Mot de passe modifié : ${actor.email}`);

  return { message: 'Mot de passe modifié avec succès.' };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = resolveScope(actor);
  const where = userRepository.buildWhere(
    {},
    { compagnieId: scope.compagnieId, roleScope: scope.roleScope }
  );
  if (scope.selfOnly) where.id = actor.id;
  return userRepository.countByRole(where);
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  getProfile,
  updateProfile,
  updatePhoto,
  removePhoto,
  updateStatus,
  changePassword,
  stats,
  assertCanManage,
  ROLES,
};
