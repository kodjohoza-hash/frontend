const { sequelize } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { agencyRepository } = require('../repositories');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

/** Génère un identifiant agence CHAR(10) unique (ex: AG00000042). */
const generateAgencyId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `AG${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
    const exists = await agencyRepository.findById(id);
    if (!exists) return id;
  }
  throw new ApiError(500, "Impossible de générer un identifiant d'agence unique.");
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return { compagnieIds: null };
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    return { compagnieIds: [actor.compagnieId] };
  }
  throw new ApiError(403, 'Accès refusé : gestion des agences non autorisée.');
};

/** Vérifie que l'acteur peut gérer l'agence cible. */
const assertCanManage = (actor, target) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (target.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : agence hors de votre périmètre.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des agences non autorisée.');
};

const toHhMm = (t) => (t ? String(t).slice(0, 5) : null);

const parseJson = (value) => {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeCounterRef = (g) => ({
  id: g.id,
  code: g.code,
  nom: g.nom ?? null,
  type: g.type,
  statut: g.statut,
});

const serializeAgentRef = (a) => ({
  id: a.id,
  matricule: a.matricule,
  prenom: a.prenom,
  nom: a.nom,
  role: a.role,
  statut: a.statut,
  guichetId: a.guichet_id ?? null,
});

/** Sérialise une agence (avec ville + compteurs optionnels). */
const serializeAgency = (a, counts = null) => {
  const c = counts || {};
  return {
    id: a.id,
    name: a.nom,
    villeId: a.ville_id,
    city: a.ville?.nom ?? null,
    region: a.region ?? null,
    address: a.adresse ?? null,
    quartier: a.quartier ?? null,
    phone: a.telephone ?? null,
    email: a.email ?? null,
    description: a.description ?? null,
    type: a.type ?? 'agence',
    statut: a.statut,
    statutAbonnement: a.statut_abonnement,
    lat: a.latitude != null ? Number(a.latitude) : null,
    lng: a.longitude != null ? Number(a.longitude) : null,
    distanceKm: a.distance_km != null ? Number(a.distance_km) : null,
    openTime: toHhMm(a.heure_ouverture),
    closeTime: toHhMm(a.heure_fermeture),
    openDays: parseJson(a.jours_ouverture),
    services: parseJson(a.services),
    compagnieId: a.compagnie_id ?? null,
    companyName: a.compagnie?.nom ?? null,
    stats: {
      agents: Number(c.agents) || 0,
      counters: Number(c.guichets) || 0,
      guichetsOuverts: Number(c.guichets_ouverts) || 0,
      bookings: Number(c.reservations) || 0,
      confirmedBookings: Number(c.reservations_confirmees) || 0,
      trips: Number(c.voyages) || 0,
      revenue: Number(c.revenus) || 0,
    },
    counters: a.guichets?.map(serializeCounterRef) ?? null,
    agents: a.agents?.map(serializeAgentRef) ?? null,
  };
};

/** Attache les compteurs (SQL brut) à une agence sérialisée. */
const withCounts = async (serialized) => {
  const row = await agencyRepository.countsForAgency(serialized.id);
  const c = row || {};
  return {
    ...serialized,
    stats: {
      agents: Number(c.agents) || 0,
      counters: Number(c.guichets) || 0,
      guichetsOuverts: Number(c.guichets_ouverts) || 0,
      bookings: Number(c.reservations) || 0,
      confirmedBookings: Number(c.reservations_confirmees) || 0,
      trips: Number(c.voyages) || 0,
      revenue: Number(c.revenus) || 0,
    },
  };
};

const toCounts = (c) => ({
  agents: Number(c.agents) || 0,
  counters: Number(c.guichets) || 0,
  guichetsOuverts: Number(c.guichets_ouverts) || 0,
  bookings: Number(c.reservations) || 0,
  confirmedBookings: Number(c.reservations_confirmees) || 0,
  trips: Number(c.voyages) || 0,
  revenue: Number(c.revenus) || 0,
});

/* ══════════════════════════════════════════════════════════════
   Liste / détail
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = resolveScope(actor);
  const where = agencyRepository.buildWhere(query, scope);

  const { rows, count } = await agencyRepository.findPage({
    where,
    page: query.page,
    limit: query.limit,
    sort: query.sort,
  });

  const countRows = await agencyRepository.countsForAgencies(rows.map((r) => r.id));
  const countMap = new Map(countRows.map((r) => [r.id, r]));

  return {
    items: rows.map((r) => {
      const c = countMap.get(r.id);
      return serializeAgency(r, c ? toCounts(c) : null);
    }),
    total: count,
    page: query.page,
    limit: query.limit,
    totalPages: Math.max(1, Math.ceil(count / query.limit)),
  };
};

const getById = async ({ id, actor }) => {
  const target = await agencyRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Agence introuvable.');
  assertCanManage(actor, target);
  return withCounts(serializeAgency(target));
};

/** Agences proches d'un point GPS (préparation carte + agences proches). */
const nearby = async ({ query, actor }) => {
  resolveScope(actor);
  const lat = Number(query.lat);
  const lng = Number(query.lng);
  const radiusKm = Number(query.radiusKm || 25);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new ApiError(400, 'Paramètres latitude/longitude requis.');
  }
  const rows = await agencyRepository.findNearby({ lat, lng, radiusKm, limit: Number(query.limit) || 10 });
  return rows.map(serializeAgency);
};

/* ══════════════════════════════════════════════════════════════
   Création
   ══════════════════════════════════════════════════════════════ */

const create = async ({ data, actor }) => {
  const compagnieId = actor.role === ROLES.SUPER_ADMIN ? data.compagnieId || null : actor.compagnieId;
  if (!compagnieId) {
    throw new ApiError(400, 'Une agence doit être rattachée à une compagnie (champ `compagnieId`).');
  }

  const compagnie = await agencyRepository.Compagnie.findByPk(compagnieId);
  if (!compagnie) throw new ApiError(400, 'Compagnie inconnue.');

  const ville = await agencyRepository.findVilleById(data.villeId);
  if (!ville) throw new ApiError(400, 'Ville inconnue.');

  const existant = await agencyRepository.findByName(data.nom.trim(), compagnieId);
  if (existant) throw new ApiError(409, 'Une agence portant ce nom existe déjà pour cette compagnie.');

  const id = await generateAgencyId();
  const agence = await agencyRepository.create({
    id,
    nom: data.nom.trim(),
    ville_id: data.villeId,
    region: data.region || null,
    adresse: data.adresse || null,
    quartier: data.quartier || null,
    telephone: data.telephone || null,
    description: data.description || null,
    email: data.email ? String(data.email).trim().toLowerCase() : null,
    compagnie_id: compagnieId,
    statut_abonnement: data.statut === 'actif' ? 'actif' : 'suspendu',
    statut: data.statut || 'actif',
    type: data.type || 'agence',
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    heure_ouverture: data.heureOuverture || null,
    heure_fermeture: data.heureFermeture || null,
    jours_ouverture: data.joursOuverture ? JSON.stringify(data.joursOuverture) : null,
    services: data.services || null,
  });

  logger.info(`Agence créée : ${id} (${agence.nom}) par ${actor.role}`);
  return withCounts(serializeAgency(await agencyRepository.findByIdFull(id)));
};

/* ══════════════════════════════════════════════════════════════
   Mise à jour
   ══════════════════════════════════════════════════════════════ */

const update = async ({ id, data, actor }) => {
  const target = await agencyRepository.findByIdFull(id);
  if (!target) throw new ApiError(404, 'Agence introuvable.');
  assertCanManage(actor, target);

  if (data.villeId) {
    const ville = await agencyRepository.findVilleById(data.villeId);
    if (!ville) throw new ApiError(400, 'Ville inconnue.');
  }
  if (data.nom && data.nom.trim() !== target.nom) {
    const existant = await agencyRepository.findByName(data.nom.trim(), target.compagnie_id);
    if (existant && existant.id !== target.id) {
      throw new ApiError(409, 'Une agence portant ce nom existe déjà pour cette compagnie.');
    }
  }

  const patch = {
    ...data,
    nom: data.nom ? data.nom.trim() : undefined,
    email: data.email !== undefined ? (String(data.email).trim().toLowerCase() || null) : undefined,
    jours_ouverture:
      data.joursOuverture !== undefined
        ? data.joursOuverture.length
          ? JSON.stringify(data.joursOuverture)
          : null
        : undefined,
    ville_id: data.villeId,
    latitude: data.latitude !== undefined ? data.latitude : undefined,
    longitude: data.longitude !== undefined ? data.longitude : undefined,
    heure_ouverture: data.heureOuverture !== undefined ? data.heureOuverture || null : undefined,
    heure_fermeture: data.heureFermeture !== undefined ? data.heureFermeture || null : undefined,
  };
  delete patch.villeId;
  delete patch.heureOuverture;
  delete patch.heureFermeture;
  delete patch.joursOuverture;
  delete patch.compagnieId;

  await agencyRepository.update(target, patch);

  logger.info(`Agence mise à jour : ${target.id} par ${actor.role}`);
  return withCounts(serializeAgency(await agencyRepository.findByIdFull(target.id)));
};

/* ══════════════════════════════════════════════════════════════
   Statut / suppression
   ══════════════════════════════════════════════════════════════ */

const updateStatus = async ({ id, statut, raison, actor }) => {
  const target = await agencyRepository.findById(id);
  if (!target) throw new ApiError(404, 'Agence introuvable.');
  assertCanManage(actor, target);

  await agencyRepository.update(target, { statut });

  logger.info(`Statut agence modifié : ${id} → ${statut}`, { raison: raison || null, by: actor.role });
  return {
    id,
    statut,
    message: `Statut de l'agence mis à jour : ${statut}.`,
  };
};

const remove = async ({ id, actor }) => {
  const target = await agencyRepository.findById(id);
  if (!target) throw new ApiError(404, 'Agence introuvable.');
  assertCanManage(actor, target);

  /* Soft delete : désactivation (pas de hard delete : FK multiples). */
  await agencyRepository.update(target, { statut: 'inactif' });

  logger.info(`Agence supprimée (soft) : ${id} par ${actor.role}`);
  return { id, statut: 'inactif', message: 'Agence supprimée.' };
};

/* ══════════════════════════════════════════════════════════════
   KPIs (super admin / company admin)
   ══════════════════════════════════════════════════════════════ */

const stats = async ({ actor }) => {
  const scope = resolveScope(actor);
  const where = agencyRepository.buildWhere({}, scope);
  const rows = await agencyRepository.findAll(where);
  const ids = rows.map((r) => r.id);

  const parStatut = { actif: 0, inactif: 0, suspendu: 0 };
  const parType = { gare: 0, agence: 0, bouette: 0, bureau: 0 };
  rows.forEach((r) => {
    parStatut[r.statut] = (parStatut[r.statut] || 0) + 1;
    const type = r.type || 'agence';
    parType[type] = (parType[type] || 0) + 1;
  });

  const countRows = await agencyRepository.countsForAgencies(ids);
  const totaux = countRows.reduce(
    (acc, c) => {
      acc.agents += Number(c.agents) || 0;
      acc.counters += Number(c.guichets) || 0;
      acc.guichetsOuverts += Number(c.guichets_ouverts) || 0;
      acc.bookings += Number(c.reservations) || 0;
      acc.confirmedBookings += Number(c.reservations_confirmees) || 0;
      acc.trips += Number(c.voyages) || 0;
      acc.revenue += Number(c.revenus) || 0;
      return acc;
    },
    {
      agents: 0,
      counters: 0,
      guichetsOuverts: 0,
      bookings: 0,
      confirmedBookings: 0,
      trips: 0,
      revenue: 0,
    }
  );

  const countMap = new Map(countRows.map((r) => [r.id, r]));
  const byBookings = rows
    .map((r) => ({ agency: serializeAgency(r), counts: toCounts(countMap.get(r.id)) }))
    .sort((a, b) => b.counts.confirmedBookings - a.counts.confirmedBookings)
    .slice(0, 5);
  const byTrips = [...byBookings].sort((a, b) => b.counts.trips - a.counts.trips).slice(0, 5);

  return {
    total: rows.length,
    parStatut,
    parType,
    totaux,
    reservationsParAgence: byBookings,
    voyagesParAgence: byTrips,
  };
};

/* ══════════════════════════════════════════════════════════════
   Villes (filtres + formulaires)
   ══════════════════════════════════════════════════════════════ */

const listVilles = async () => {
  const villes = await agencyRepository.listVilles();
  return villes.map((v) => ({ id: v.id, nom: v.nom }));
};

module.exports = {
  list,
  getById,
  nearby,
  create,
  update,
  updateStatus,
  remove,
  stats,
  listVilles,
  assertCanManage,
  serializeAgency,
  serializeCounterRef,
  serializeAgentRef,
  ROLES,
};
