const { sequelize, CompteAgent } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { serializeClient } = require('../../../utils/serializeUser');
const { ROLES } = require('../../../middlewares/auth');
const { counterRepository } = require('../repositories');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

/** Génère un identifiant guichet CHAR(10) unique (ex: GC00000012). */
const generateGuichetId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `GC${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
    const exists = await counterRepository.findById(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant guichet unique.");
};

/** Génère un code guichet unique (ex: GC-XXXX). */
const generateCode = async () => {
  for (let i = 0; i < 6; i += 1) {
    const code = `GC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const exists = await counterRepository.findByCode(code);
    if (!exists) return code;
  }
  throw new ApiError(500, "Impossible de générer un code guichet unique.");
};

/** Caractères alphanumériques pour les identifiants clients. */
const CLIENT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Génère un identifiant client CHAR(12) unique (ex: CLT9FK2XQ7RA). */
const generateClientId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `CLT${Array.from(
      { length: 9 },
      () => CLIENT_ID_CHARS[Math.floor(Math.random() * CLIENT_ID_CHARS.length)]
    ).join('')}`;
    const exists = await counterRepository.findClientById(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant client unique.");
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return { agenceIds: null, compagnieId: null };
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agences = await counterRepository.Agence.findAll({
      where: { compagnie_id: actor.compagnieId },
      attributes: ['id'],
    });
    return { agenceIds: agences.map((a) => a.id), compagnieId: actor.compagnieId };
  }
  throw new ApiError(403, 'Accès refusé : gestion des guichets non autorisée.');
};

/** Vérifie que l'acteur peut gérer le guichet cible. */
const assertCanManage = async (actor, guichet) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    const agence = await counterRepository.Agence.findByPk(guichet.agence_id);
    if (!agence || agence.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : guichet hors de votre périmètre.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des guichets non autorisée.');
};

const parseJson = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return [];
  }
};

const toHhMm = (t) => (t ? String(t).slice(0, 5) : null);

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeAgentRef = (a) => ({
  id: a.id,
  matricule: a.matricule,
  prenom: a.prenom,
  nom: a.nom,
  role: a.role,
  statut: a.statut,
});

const serializeAgenceLight = (ag) => ({
  id: ag.id,
  nom: ag.nom,
  villeId: ag.ville_id,
  city: ag.ville?.nom ?? null,
  adresse: ag.adresse ?? null,
  telephone: ag.telephone ?? null,
  heureOuverture: toHhMm(ag.heure_ouverture),
  heureFermeture: toHhMm(ag.heure_fermeture),
  joursOuverture: parseJson(ag.jours_ouverture),
  lat: ag.latitude != null ? Number(ag.latitude) : null,
  lng: ag.longitude != null ? Number(ag.longitude) : null,
});

const toCounts = (c) => ({
  agents: Number(c.agents) || 0,
  todayBookings: Number(c.reservations_jour) || 0,
  weekBookings: Number(c.reservations_semaine) || 0,
  totalBookings: Number(c.reservations_total) || 0,
  todayRevenue: Number(c.revenu_jour) || 0,
  weekRevenue: Number(c.revenu_semaine) || 0,
  totalRevenue: Number(c.revenu_total) || 0,
});

/** Sérialise un guichet (avec agence + compteurs optionnels). */
const serializeGuichet = (g, counts = null) => {
  const c = counts || {};
  return {
    id: g.id,
    code: g.code,
    nom: g.nom ?? null,
    type: g.type,
    statut: g.statut,
    description: g.description ?? null,
    agenceId: g.agence_id,
    agenceName: g.agence?.nom ?? null,
    villeId: g.agence?.ville_id ?? null,
    city: g.agence?.ville?.nom ?? null,
    createdAt: g.date_creation ?? null,
    updatedAt: g.date_modification ?? null,
    stats: toCounts(c),
    agents: g.agents?.map(serializeAgentRef) ?? null,
    agence: g.agence ? serializeAgenceLight(g.agence) : null,
  };
};

/** Attache les compteurs (SQL brut) à un guichet sérialisé. */
const withCounts = async (serialized) => {
  const row = await counterRepository.countsForGuichet(serialized.id);
  return { ...serialized, stats: toCounts(row || {}) };
};

/* ══════════════════════════════════════════════════════════════
   Liste / détail
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const where = counterRepository.buildWhere(query, scope);

  const { rows, count } = await counterRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  const countRows = await counterRepository.countsForGuichets(rows.map((r) => r.id));
  const countMap = new Map(countRows.map((r) => [r.id, r]));

  return {
    items: rows.map((r) => {
      const c = countMap.get(r.id);
      return serializeGuichet(r, c ? toCounts(c) : null);
    }),
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await counterRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);
  return withCounts(serializeGuichet(target));
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor }) => {
  const scope = await resolveScope(actor);
  const agence = await counterRepository.Agence.findByPk(data.agenceId);
  if (!agence) throw new ApiError(400, 'Agence inconnue.');
  if (scope.compagnieId && agence.compagnie_id !== scope.compagnieId) {
    throw new ApiError(403, 'Accès refusé : agence hors de votre périmètre.');
  }

  const code = data.code ? data.code.trim() : await generateCode();
  const existant = await counterRepository.findByCode(code);
  if (existant) throw new ApiError(409, 'Un guichet avec ce code existe déjà.');

  const id = await generateGuichetId();
  const guichet = await counterRepository.create({
    id,
    agence_id: data.agenceId,
    code,
    nom: data.nom || null,
    type: data.type || 'vente_billets',
    statut: data.statut || 'ouvert',
    description: data.description || null,
    date_creation: new Date(),
  });

  logger.info(`Guichet créé : ${id} (${code}) par ${actor.role}`);
  return withCounts(serializeGuichet(await counterRepository.findByIdFull(id)));
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor }) => {
  const target = await counterRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);

  if (data.agenceId && data.agenceId !== target.agence_id) {
    const agence = await counterRepository.Agence.findByPk(data.agenceId);
    if (!agence) throw new ApiError(400, 'Agence inconnue.');
    if (actor.role !== ROLES.SUPER_ADMIN && agence.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : agence hors de votre périmètre.');
    }
  }

  if (data.code && data.code.trim() !== target.code) {
    const existant = await counterRepository.findByCode(data.code.trim());
    if (existant && existant.id !== target.id) {
      throw new ApiError(409, 'Un guichet avec ce code existe déjà.');
    }
  }

  const patch = { ...data, code: data.code !== undefined ? data.code.trim() : undefined };
  delete patch.agenceId;
  delete patch.agence_id;

  await counterRepository.update(target, {
    ...patch,
    agence_id: data.agenceId || undefined,
    nom: data.nom !== undefined ? data.nom || null : undefined,
    description: data.description !== undefined ? data.description || null : undefined,
  });

  logger.info(`Guichet mis à jour : ${target.id} par ${actor.role}`);
  return withCounts(serializeGuichet(await counterRepository.findByIdFull(target.id)));
};

/* ══════════════════════════════════════════════════════════════
   Statut / suppression
   ══════════════════════════════════════════════════════════════ */

const updateStatus = async ({ id, statut, raison, actor }) => {
  const target = await counterRepository.findById(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);

  await counterRepository.update(target, { statut, date_modification: new Date() });

  logger.info(`Statut guichet modifié : ${id} → ${statut}`, { raison: raison || null, by: actor.role });
  return {
    id,
    statut,
    message: `Statut du guichet mis à jour : ${statut}.`,
  };
};

const remove = async ({ id, actor }) => {
  const target = await counterRepository.findById(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);

  /* Soft delete : fermeture + retrait des agents (pas de hard delete : FK agents). */
  await sequelize.transaction(async (t) => {
    await counterRepository.unassignAgentsFromGuichet(id, await findAssignedAgentIds(id), { transaction: t });
    await counterRepository.update(target, { statut: 'ferme', date_modification: new Date() }, { transaction: t });
  });

  logger.info(`Guichet supprimé (soft) : ${id} par ${actor.role}`);
  return { id, statut: 'ferme', message: 'Guichet supprimé.' };
};

/** Ids des agents affectés à un guichet. */
const findAssignedAgentIds = async (guichetId) => {
  const agents = await counterRepository.Agent.findAll({
    where: { guichet_id: guichetId },
    attributes: ['id'],
  });
  return agents.map((a) => a.id);
};

/* ══════════════════════════════════════════════════════════════
   Affectation / retrait / transfert d'agents
   ══════════════════════════════════════════════════════════════ */

const assignAgents = async ({ id, agentIds, actor }) => {
  const target = await counterRepository.findById(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);

  const unique = [...new Set(agentIds)];
  const agents = await counterRepository.findAgentsByAgence(target.agence_id, unique);
  if (agents.length !== unique.length) {
    throw new ApiError(400, 'Certains agents ne sont pas rattachés à cette agence.');
  }

  await counterRepository.assignAgentsToGuichet(id, unique);

  logger.info(`${unique.length} agent(s) affecté(s) au guichet ${id} par ${actor.role}`);
  return withCounts(serializeGuichet(await counterRepository.findByIdFull(id)));
};

const removeAgents = async ({ id, agentIds, actor }) => {
  const target = await counterRepository.findById(id);
  if (!target) throw new ApiError(404, 'Guichet introuvable.');
  await assertCanManage(actor, target);

  const unique = [...new Set(agentIds)];
  const [affected] = await counterRepository.unassignAgentsFromGuichet(id, unique);

  logger.info(`${affected} agent(s) retiré(s) du guichet ${id} par ${actor.role}`);
  return {
    removed: affected,
    message: `${affected} agent(s) retiré(s) du guichet.`,
  };
};

const transferAgents = async ({ id, agentIds, toGuichetId, actor }) => {
  const from = await counterRepository.findById(id);
  if (!from) throw new ApiError(404, 'Guichet source introuvable.');
  await assertCanManage(actor, from);

  const to = await counterRepository.findById(toGuichetId);
  if (!to) throw new ApiError(404, 'Guichet de destination introuvable.');
  if (to.id === from.id) throw new ApiError(400, 'Les guichets source et destination sont identiques.');
  await assertCanManage(actor, to);

  const unique = [...new Set(agentIds)];
  const agents = await counterRepository.findAgentsByAgence(from.agence_id, unique);
  if (agents.length !== unique.length) {
    throw new ApiError(400, 'Certains agents ne sont pas rattachés à cette agence.');
  }

  await counterRepository.transferAgentsToGuichet(to.id, to.agence_id, unique);

  logger.info(`${unique.length} agent(s) transféré(s) du guichet ${id} vers ${to.id} par ${actor.role}`);
  return {
    fromGuichetId: from.id,
    toGuichetId: to.id,
    transferred: unique.length,
    message: `${unique.length} agent(s) transféré(s) vers ${to.code || to.nom}.`,
  };
};

/* ══════════════════════════════════════════════════════════════
   Dashboard agent de guichet (guichet courant + stats)
   ══════════════════════════════════════════════════════════════ */

const getMine = async ({ actor }) => {
  const agent = await counterRepository.findAgentWithGuichet(actor.id);
  if (!agent) throw new ApiError(404, 'Agent introuvable.');

  const guichet = agent.guichet;
  if (!guichet) {
    return {
      guichet: null,
      agent: {
        id: agent.id,
        matricule: agent.matricule,
        prenom: agent.prenom,
        nom: agent.nom,
        email: agent.email,
        role: agent.role,
        agenceId: agent.agence_id,
        guichetId: null,
        photo: agent.photo ?? null,
      },
    };
  }

  const stats = await counterRepository.statsForAgentGuichet(guichet.id);
  return {
    guichet: {
      ...serializeGuichet(guichet, stats ? toCounts(stats) : null),
      agence: serializeAgenceLight(guichet.agence),
    },
    agent: {
      id: agent.id,
      matricule: agent.matricule,
      prenom: agent.prenom,
      nom: agent.nom,
      email: agent.email,
      role: agent.role,
      agenceId: agent.agence_id,
      guichetId: agent.guichet_id,
      photo: agent.photo ?? null,
    },
  };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = await resolveScope(actor);
  const where = counterRepository.buildWhere({}, scope);
  const rows = await counterRepository.findAll(where);
  const ids = rows.map((r) => r.id);

  const parStatut = { ouvert: 0, ferme: 0, maintenance: 0 };
  const parType = { vente_billets: 0, reservation: 0, caisse: 0, renseignement: 0, autre: 0 };
  rows.forEach((r) => {
    parStatut[r.statut] = (parStatut[r.statut] || 0) + 1;
    parType[r.type] = (parType[r.type] || 0) + 1;
  });

  const countRows = await counterRepository.countsForGuichets(ids);
  const totaux = countRows.reduce(
    (acc, c) => {
      acc.agents += Number(c.agents) || 0;
      acc.todayBookings += Number(c.reservations_jour) || 0;
      acc.weekBookings += Number(c.reservations_semaine) || 0;
      acc.todayRevenue += Number(c.revenu_jour) || 0;
      acc.weekRevenue += Number(c.revenu_semaine) || 0;
      return acc;
    },
    {
      agents: 0,
      todayBookings: 0,
      weekBookings: 0,
      todayRevenue: 0,
      weekRevenue: 0,
    }
  );

  return {
    total: rows.length,
    parStatut,
    parType,
    totaux,
  };
};

/* ══════════════════════════════════════════════════════════════
   Clients au guichet (API métier dédiée au contexte guichet)
   Un counter_agent peut rechercher / créer un client SANS compte
   (vente au guichet), récupérer son clientId, puis l'utiliser dans
   POST /bookings. L'accès générique POST /users reste interdit.
   ══════════════════════════════════════════════════════════════ */

/** Sérialise un client du répertoire guichet (base serializeClient + pièce). */
const serializeCounterClient = (client) => ({
  ...serializeClient(client),
  typePiece: client.type_piece ?? 'aucune',
  numeroPiece: client.numero_piece ?? null,
});

/** Recherche de clients existants (scope compagnie de l'agence du guichetier). */
const searchClients = async ({ query, actor }) => {
  const agenceIds = await counterRepository.findAgenceIdsByCompagnie(actor.compagnieId);
  const items = await counterRepository.searchClientsByCompagnie({
    compagnieId: actor.compagnieId,
    agenceIds,
    recherche: query.recherche,
    limite: query.limite,
  });
  return {
    items: items.map(serializeCounterClient),
    total: items.length,
  };
};

/** Création d'un client au guichet (sans compte, sans mot de passe). */
const createClient = async ({ data, actor }) => {
  const email = data.email ? String(data.email).trim().toLowerCase() : null;
  const telephone = String(data.telephone || '').trim();

  /* Unicité : email (client + compte agent) puis téléphone. */
  if (email) {
    const [existingClient, existingCompte] = await Promise.all([
      counterRepository.findClientByEmail(email),
      CompteAgent.findOne({ where: { email } }),
    ]);
    if (existingClient || existingCompte) {
      throw new ApiError(409, 'Un compte existe déjà avec cet email.');
    }
  }
  if (telephone) {
    const byPhone = await counterRepository.findClientByTelephone(telephone);
    if (byPhone) {
      throw new ApiError(409, 'Ce numéro de téléphone est déjà utilisé par un client existant.');
    }
  }

  /* Rattache la ville si elle existe. */
  let villeId = null;
  if (data.villeId) {
    const ville = await counterRepository.Ville.findByPk(data.villeId);
    villeId = ville ? ville.id : null;
  }

  const id = await generateClientId();
  const client = await counterRepository.createClient({
    id,
    prenom: data.prenom.trim(),
    nom: data.nom.trim(),
    telephone,
    email,
    adresse: data.adresse || null,
    ville_id: villeId,
    pays: data.pays || 'Cameroun',
    type_piece: data.typePiece || 'aucune',
    numero_piece: data.numeroPiece || null,
    date_inscription: new Date(),
    statut: 'nouveau',
  });

  logger.info(`Client créé au guichet : ${client.id} (${client.prenom} ${client.nom}) par ${actor.role}`);
  return serializeCounterClient(await counterRepository.findClientById(client.id));
};

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove,
  assignAgents,
  removeAgents,
  transferAgents,
  getMine,
  stats,
  searchClients,
  createClient,
  assertCanManage,
  serializeGuichet,
  ROLES,
};
