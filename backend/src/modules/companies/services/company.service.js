const crypto = require('crypto');
const { sequelize, CompteAgent } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { hashPassword } = require('../../../utils/password');
const { companyRepository } = require('../repositories');
const logoService = require('./logo.service');
const documentService = require('./document.service');
const { ROLES } = require('../../../middlewares/auth');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Génère un identifiant compagnie CHAR(4) unique (ex: C7F3). */
const generateCompanyId = async () => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 6; i += 1) {
    const suffix = Array.from({ length: 3 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
    const id = `C${suffix}`;
    const exists = await companyRepository.findById(id);
    if (!exists) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant compagnie unique.');
};

/** Génère un identifiant agence CHAR(10) unique (ex: AG00000042). */
const generateAgencyId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `AG${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
    const exists = await companyRepository.Agence.findByPk(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant d'agence unique.");
};

/** Génère un identifiant agent CHAR(10) + un matricule uniques. */
const generateAgentCredentials = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `USR${Date.now().toString(36).slice(-7).toUpperCase()}`.padEnd(10, 'X');
    const matricule = `ADM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const exists = await companyRepository.Agent.findByPk(id);
    if (!exists) return { id, matricule };
  }
  throw new ApiError(500, "Impossible de générer un identifiant utilisateur unique.");
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return { compagnieIds: null };
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    return { compagnieIds: [actor.compagnieId] };
  }
  throw new ApiError(403, "Accès refusé : gestion des compagnies non autorisée.");
};

/** Vérifie que l'acteur peut gérer la compagnie cible. */
const assertCanManage = (actor, target) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (target.id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : compagnie hors de votre périmètre.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des compagnies non autorisée.');
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeDocument = (d) => ({
  id: d.id,
  categorie: d.categorie,
  nomOriginal: d.nom_original,
  fichier: d.fichier,
  mime: d.mime,
  taille: d.taille,
  televerseLe: d.televerse_le ?? null,
});

/** Sérialise une compagnie (avec abonnement + compteurs optionnels). */
const serializeCompany = (c, counts = null) => {
  const abonnement = c.abonnementSaaS;
  const plan = abonnement?.plan;
  return {
    id: c.id,
    name: c.nom,
    description: c.description ?? null,
    phone: c.telephone ?? null,
    email: c.email ?? null,
    website: c.site_web ?? null,
    address: c.adresse ?? null,
    city: c.ville ?? null,
    country: c.pays ?? null,
    rccm: c.rccm ?? null,
    taxpayerId: c.numero_contribuable ?? null,
    color: c.couleur ?? null,
    logo: c.logo ?? null,
    statut: c.statut,
    actif: c.actif,
    createdAt: c.date_creation ?? null,
    subscription: plan?.code ?? null,
    plan: plan ? { id: plan.id, code: plan.code, nom: plan.nom } : null,
    abonnement: abonnement
      ? {
          statut: abonnement.statut,
          dateDebut: abonnement.date_debut,
          dateFin: abonnement.date_fin,
          renouvellementAuto: abonnement.renouvellement_auto,
        }
      : null,
    stats: counts || {
      buses: 0, agences: 0, agents: 0, chauffeurs: 0, voyages: 0,
      reservations: 0, reservationsConfirmees: 0, tickets: 0, revenus: 0,
    },
    agences: c.agences?.map((a) => ({
      id: a.id, nom: a.nom, villeId: a.ville_id, adresse: a.adresse, telephone: a.telephone,
    })) ?? null,
    documents: c.documents?.map(serializeDocument) ?? null,
  };
};

/** Attache les compteurs (SQL brut) à une compagnie sérialisée. */
const withCounts = async (serialized) => {
  const row = await companyRepository.countsForCompany(serialized.id);
  const c = row || {};
  return {
    ...serialized,
    stats: {
      buses: Number(c.buses) || 0,
      agences: Number(c.agences) || 0,
      agents: Number(c.agents) || 0,
      chauffeurs: Number(c.chauffeurs) || 0,
      voyages: Number(c.voyages) || 0,
      reservations: Number(c.reservations) || 0,
      reservationsConfirmees: Number(c.reservations_confirmees) || 0,
      tickets: Number(c.tickets) || 0,
      revenus: Number(c.revenus) || 0,
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   Liste / détail / profil
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = resolveScope(actor);
  const where = companyRepository.buildWhere(query, scope);

  const { rows, count } = await companyRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  const countRows = await companyRepository.countsForCompanies(rows.map((r) => r.id));
  const countMap = new Map(countRows.map((r) => [r.id, r]));

  return {
    items: rows.map((r) => {
      const c = countMap.get(r.id);
      return serializeCompany(r, c ? {
        buses: Number(c.buses) || 0,
        agences: Number(c.agences) || 0,
        agents: Number(c.agents) || 0,
        chauffeurs: Number(c.chauffeurs) || 0,
        voyages: Number(c.voyages) || 0,
        reservations: Number(c.reservations) || 0,
        reservationsConfirmees: Number(c.reservations_confirmees) || 0,
        tickets: Number(c.tickets) || 0,
        revenus: Number(c.revenus) || 0,
      } : null);
    }),
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await companyRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);
  return withCounts(serializeCompany(target));
};

const getProfile = async ({ actor }) => {
  if (!actor.compagnieId) throw new ApiError(403, "Aucune compagnie rattachée à votre compte.");
  return getById({ id: actor.compagnieId, actor: { ...actor, role: ROLES.SUPER_ADMIN } });
};

const updateProfile = async ({ data, actor, req }) => {
  if (!actor.compagnieId) throw new ApiError(403, "Aucune compagnie rattachée à votre compte.");
  return update({ id: actor.compagnieId, data, actor, req });
};

/* ══════════════════════════════════════════════════════════════
   Création (compagnie + abonnement + admin principal optionnel)
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor, req }) => {
  if (actor.role !== ROLES.SUPER_ADMIN) {
    throw new ApiError(403, "Création de compagnie réservée au Super Admin.");
  }
  if (data.admin && !data.agence) {
    throw new ApiError(400, "La création d'un administrateur requiert une agence (champ `agence`).");
  }

  const email = data.email ? String(data.email).trim().toLowerCase() : null;
  if (email) {
    const existant = await companyRepository.findByEmail(email);
    if (existant) throw new ApiError(409, "Une compagnie avec cet email existe déjà.");
  }

  const id = await generateCompanyId();
  const plan = await companyRepository.PlanAbonnement.findOne({ where: { code: data.plan || 'gratuit' } });
  if (!plan) throw new ApiError(400, 'Plan abonnement inconnu.');

  const adminEmail = data.admin?.email ? String(data.admin.email).trim().toLowerCase() : null;
  if (adminEmail) {
    const existant = await companyRepository.Agent.findOne({ where: { email: adminEmail } });
    if (existant) throw new ApiError(409, "Un utilisateur avec cet email existe déjà.");
  }

  let created;
  try {
    created = await sequelize.transaction(async (t) => {
      const compagnie = await companyRepository.create(
        {
          id,
          nom: data.nom,
          description: data.description ?? null,
          telephone: data.telephone ?? null,
          email,
          site_web: data.site_web ?? null,
          adresse: data.adresse ?? null,
          ville: data.ville ?? null,
          pays: data.pays ?? null,
          rccm: data.rccm ?? null,
          numero_contribuable: data.numero_contribuable ?? null,
          couleur: data.couleur ?? null,
          date_creation: data.date_creation || todayIso(),
          actif: true,
          statut: 'actif',
        },
        { transaction: t }
      );

      const debut = todayIso();
      const fin = new Date(Date.now() + (plan.duree_jours || 30) * 24 * 60 * 60 * 1000);
      const finIso = `${fin.getFullYear()}-${String(fin.getMonth() + 1).padStart(2, '0')}-${String(fin.getDate()).padStart(2, '0')}`;
      await companyRepository.AbonnementCompagnie.create(
        {
          compagnie_id: id,
          plan_id: plan.id,
          date_debut: debut,
          date_fin: finIso,
          renouvellement_auto: false,
          statut: 'actif',
        },
        { transaction: t }
      );

      if (data.admin) {
        const agenceId = await generateAgencyId();
        await companyRepository.Agence.create(
          {
            id: agenceId,
            nom: data.agence.nom || `Agence principale ${data.nom}`,
            ville_id: data.agence.villeId,
            adresse: data.agence.adresse ?? null,
            telephone: data.agence.telephone ?? null,
            compagnie_id: id,
            statut_abonnement: 'actif',
          },
          { transaction: t }
        );

        const { id: agentId, matricule } = await generateAgentCredentials();
        await companyRepository.Agent.create(
          {
            id: agentId,
            matricule,
            prenom: data.admin.prenom,
            nom: data.admin.nom,
            email: adminEmail,
            telephone: data.admin.telephone,
            role: ROLES.COMPANY_ADMIN,
            date_embauche: todayIso(),
            date_creation: todayIso(),
            statut: 'actif',
            verifie: false,
            agence_id: agenceId,
          },
          { transaction: t }
        );

        await CompteAgent.create(
          {
            agent_id: agentId,
            email: adminEmail,
            telephone: data.admin.telephone,
            mot_de_passe_hash: await hashPassword(data.admin.motDePasse),
            langue_preferee: 'fr',
          },
          { transaction: t }
        );
      }

      return compagnie;
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new ApiError(409, 'Une compagnie avec ces valeurs existe déjà.');
    }
    throw err;
  }

  logger.info(`Compagnie créée : ${created.id} (${created.nom}) par ${actor.role}`);
  return withCounts(serializeCompany(await companyRepository.findByIdFull(id)));
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor, req }) => {
  const target = await companyRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);

  if (data.email !== undefined) {
    const email = String(data.email).trim().toLowerCase();
    const existant = await companyRepository.findByEmail(email);
    if (existant && existant.id !== target.id) {
      throw new ApiError(409, "Une compagnie avec cet email existe déjà.");
    }
    data.email = email || null;
  }

  const patch = { ...data };
  await companyRepository.update(target, patch);

  logger.info(`Compagnie mise à jour : ${target.id} par ${actor.role}`);
  return withCounts(serializeCompany(await companyRepository.findByIdFull(target.id)));
};

/* ══════════════════════════════════════════════════════════════
   Statut / suppression
   ══════════════════════════════════════════════════════════════ */

/** Statut → booléen `actif` (la compagnie est-elle opérationnelle). */
const statutToActif = (statut) => statut === 'actif' || statut === 'en_attente';

const updateStatus = async ({ id, statut, raison, actor, req }) => {
  if (actor.role !== ROLES.SUPER_ADMIN) {
    throw new ApiError(403, 'Changement de statut réservé au Super Admin.');
  }
  const target = await companyRepository.findById(id);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');

  await companyRepository.update(target, { statut, actif: statutToActif(statut) });

  logger.info(`Statut compagnie modifié : ${id} → ${statut}`, { raison: raison || null, by: actor.role });
  return {
    id,
    statut,
    actif: statutToActif(statut),
    message: `Statut de la compagnie mis à jour : ${statut}.`,
  };
};

const remove = async ({ id, actor, req }) => {
  if (actor.role !== ROLES.SUPER_ADMIN) {
    throw new ApiError(403, 'Suppression réservée au Super Admin.');
  }
  const target = await companyRepository.findById(id);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');

  /* Soft delete : bannissement + désactivation (pas de hard delete : FK multiples). */
  await companyRepository.update(target, { statut: 'banni', actif: false });

  logger.info(`Compagnie supprimée (soft) : ${id} par ${actor.role}`);
  return { id, statut: 'banni', message: 'Compagnie supprimée.' };
};

/* ══════════════════════════════════════════════════════════════
   Logo
   ══════════════════════════════════════════════════════════════ */

const updateLogo = async ({ file, id, actor, req }) => {
  if (!file) throw new ApiError(400, 'Aucun logo fourni (champ "logo").');
  const companyId = id || actor.compagnieId;
  if (!companyId) throw new ApiError(403, "Aucune compagnie rattachée à votre compte.");

  const target = await companyRepository.findById(companyId);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);

  const url = await logoService.saveLogo(file.buffer, target.id);
  const oldLogo = target.logo;
  await companyRepository.update(target, { logo: url });

  if (oldLogo && oldLogo !== url && logoService.isCompanyLogoUrl(oldLogo)) {
    logoService.deleteLogo(oldLogo);
  }

  logger.info(`Logo mis à jour : ${target.id}`);
  return { logo: url };
};

const removeLogo = async ({ id, actor, req }) => {
  const companyId = id || actor.compagnieId;
  if (!companyId) throw new ApiError(403, "Aucune compagnie rattachée à votre compte.");

  const target = await companyRepository.findById(companyId);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);

  if (target.logo && logoService.isCompanyLogoUrl(target.logo)) {
    logoService.deleteLogo(target.logo);
  }
  await companyRepository.update(target, { logo: null });

  logger.info(`Logo supprimé : ${target.id}`);
  return { logo: null };
};

/* ══════════════════════════════════════════════════════════════
   Documents
   ══════════════════════════════════════════════════════════════ */

const resolveCompanyId = (id, actor) => {
  const companyId = id || actor.compagnieId;
  if (!companyId) throw new ApiError(403, "Aucune compagnie rattachée à votre compte.");
  return companyId;
};

const listDocuments = async ({ id, query, actor }) => {
  const companyId = resolveCompanyId(id, actor);
  const target = await companyRepository.findById(companyId);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);

  const docs = await companyRepository.findDocuments(companyId, query.categorie);
  return docs.map(serializeDocument);
};

const uploadDocument = async ({ file, id, body, actor, req }) => {
  if (!file) throw new ApiError(400, 'Aucun document fourni (champ "document").');
  const companyId = resolveCompanyId(id, actor);
  const target = await companyRepository.findById(companyId);
  if (!target) throw new ApiError(404, 'Compagnie introuvable.');
  assertCanManage(actor, target);

  const categorie = body.categorie || 'autre';
  const chemin = await documentService.saveDocument(file.buffer, target.id, file.originalname);
  const doc = await companyRepository.createDocument({
    compagnie_id: target.id,
    categorie,
    nom_original: (file.originalname || 'document').slice(0, 255),
    fichier: chemin,
    mime: file.mimetype,
    taille: file.size,
  });

  logger.info(`Document ajouté : ${target.id} (${categorie})`);
  return serializeDocument(doc);
};

const removeDocument = async ({ documentId, id, actor, req }) => {
  const companyId = resolveCompanyId(id, actor);
  const doc = await companyRepository.findDocumentById(documentId);
  if (!doc || doc.compagnie_id !== companyId) {
    throw new ApiError(404, 'Document introuvable.');
  }
  assertCanManage(actor, { id: companyId });

  if (documentService.isDocumentUrl(doc.fichier)) {
    documentService.deleteDocumentFile(doc.fichier);
  }
  await companyRepository.removeDocument(doc);

  logger.info(`Document supprimé : ${doc.id} (${companyId})`);
  return { id: doc.id, message: 'Document supprimé.' };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = resolveScope(actor);
  const where = companyRepository.buildWhere({}, scope);
  const rows = await companyRepository.findAllWithSubscription(where);
  const ids = rows.map((r) => r.id);

  const parStatut = { actif: 0, en_attente: 0, suspendu: 0, banni: 0, expire: 0 };
  const parPlan = { gratuit: 0, standard: 0, premium: 0, enterprise: 0 };
  rows.forEach((r) => {
    parStatut[r.statut] = (parStatut[r.statut] || 0) + 1;
    const code = r.abonnementSaaS?.plan?.code;
    if (code) parPlan[code] = (parPlan[code] || 0) + 1;
  });

  const trenteJours = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentes = rows.filter((r) => {
    if (!r.date_creation) return false;
    const d = new Date(r.date_creation);
    return d.getTime() >= trenteJours;
  });

  const countRows = await companyRepository.countsForCompanies(ids);
  const totaux = countRows.reduce(
    (acc, c) => {
      acc.buses += Number(c.buses) || 0;
      acc.agences += Number(c.agences) || 0;
      acc.agents += Number(c.agents) || 0;
      acc.chauffeurs += Number(c.chauffeurs) || 0;
      acc.voyages += Number(c.voyages) || 0;
      acc.reservations += Number(c.reservations) || 0;
      acc.reservationsConfirmees += Number(c.reservations_confirmees) || 0;
      acc.tickets += Number(c.tickets) || 0;
      acc.revenus += Number(c.revenus) || 0;
      return acc;
    },
    {
      buses: 0, agences: 0, agents: 0, chauffeurs: 0, voyages: 0,
      reservations: 0, reservationsConfirmees: 0, tickets: 0, revenus: 0,
    }
  );

  const countMap = new Map(countRows.map((r) => [r.id, r]));
  const recentesSerialisees = recentes.slice(0, 5).map((r) => {
    const c = countMap.get(r.id);
    return serializeCompany(r, c ? {
      buses: Number(c.buses) || 0,
      agences: Number(c.agences) || 0,
      agents: Number(c.agents) || 0,
      chauffeurs: Number(c.chauffeurs) || 0,
      voyages: Number(c.voyages) || 0,
      reservations: Number(c.reservations) || 0,
      reservationsConfirmees: Number(c.reservations_confirmees) || 0,
      tickets: Number(c.tickets) || 0,
      revenus: Number(c.revenus) || 0,
    } : null);
  });

  return {
    total: rows.length,
    parStatut,
    parPlan,
    recentes30j: recentes.length,
    totaux,
    recentes: recentesSerialisees,
  };
};

module.exports = {
  list,
  getById,
  getProfile,
  updateProfile,
  create,
  update,
  updateStatus,
  remove,
  updateLogo,
  removeLogo,
  listDocuments,
  uploadDocument,
  removeDocument,
  stats,
  assertCanManage,
  serializeCompany,
  ROLES,
};
