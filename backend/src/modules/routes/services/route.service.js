const { sequelize } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { ROLES } = require('../../../middlewares/auth');
const { routeRepository } = require('../repositories');

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

/** Génère un identifiant itinéraire CHAR(10) unique (ex: RT0000001). */
const generateRouteId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `RT${String(Math.floor(Math.random() * 10 ** 8)).padStart(8, '0')}`;
    const exists = await routeRepository.findRoute(id);
    if (!exists) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant itinéraire unique.');
};

/** Génère un identifiant escale CHAR(10) unique (ex: ESC0000001). */
const generateEscaleId = async () => {
  for (let i = 0; i < 6; i += 1) {
    const id = `ESC${String(Math.floor(Math.random() * 10 ** 7)).padStart(7, '0')}`;
    const exists = await routeRepository.findEscale(id);
    if (!exists) return id;
  }
  throw new ApiError(500, 'Impossible de générer un identifiant escale unique.');
};

/** Normalise un entier optionnel ('' / null → null). */
const normInt = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/** Parse une durée au format « 6h30 », « 6h », « 6:30 », « 45min » → minutes. */
const parseDuration = (s) => {
  if (s === null || s === undefined || s === '') return null;
  const str = String(s).trim().toLowerCase();
  let m = str.match(/^(\d+)\s*h(?:\s*(\d{1,2})\s*(?:min)?)?$/);
  if (m) return Number(m[1]) * 60 + Number(m[2] || 0);
  m = str.match(/^(\d+)\s*min?$/);
  if (m) return Number(m[1]);
  m = str.match(/^(\d+):(\d{1,2})$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
};

/** Formatte des minutes → « HH:MM ». */
const minutesToTime = (m) => {
  const total = ((Math.round(m) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Convertit « HH:MM(:SS) » → minutes. */
const parseTime = (t) => {
  const parts = String(t).split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0) + (parts[2] ? parts[2] / 60 : 0);
};

/** Périmètre d'accès selon le rôle de l'acteur. */
const resolveScope = async (actor) => {
  if (actor.role === ROLES.SUPER_ADMIN) {
    return {};
  }
  if (actor.role === ROLES.COMPANY_ADMIN) {
    return { compagnieId: actor.compagnieId };
  }
  throw new ApiError(403, 'Accès refusé : gestion des itinéraires non autorisée.');
};

/** Vérifie que l'acteur peut gérer l'itinéraire cible. */
const assertCanManage = (actor, route) => {
  if (actor.role === ROLES.SUPER_ADMIN) return;
  if (actor.role === ROLES.COMPANY_ADMIN) {
    if (route.compagnie_id !== actor.compagnieId) {
      throw new ApiError(403, 'Accès refusé : itinéraire hors de votre compagnie.');
    }
    return;
  }
  throw new ApiError(403, 'Accès refusé : gestion des itinéraires non autorisée.');
};

/* ══════════════════════════════════════════════════════════════
   Sérialisation
   ══════════════════════════════════════════════════════════════ */

const serializeVilleRef = (v) => {
  if (!v) return null;
  return { id: v.id, name: v.nom };
};

const serializeVille = (v) => ({
  id: v.id,
  name: v.nom,
  region: v.region ?? null,
  country: v.pays ?? 'Cameroun',
  latitude: v.latitude !== null && v.latitude !== undefined ? Number(v.latitude) : null,
  longitude: v.longitude !== null && v.longitude !== undefined ? Number(v.longitude) : null,
  status: v.statut ?? 'active',
});

const serializeEscale = (e) => ({
  id: e.id,
  routeId: e.trajet_id,
  villeId: e.ville_id,
  city: serializeVilleRef(e.ville),
  ordre: e.ordre,
  heureEstimee: e.heure_estimee ?? null,
  dureeArret: e.duree_arret ?? null,
  description: e.description ?? null,
});

const serializeRoute = (r) => {
  if (!r) return null;
  const escales = r.escales || [];
  return {
    id: r.id,
    name: r.nom ?? null,
    code: r.code ?? null,
    departureCityId: r.ville_depart_id,
    arrivalCityId: r.ville_arrivee_id,
    departureCity: serializeVilleRef(r.villeDepart),
    arrivalCity: serializeVilleRef(r.villeArrivee),
    companyId: r.compagnie_id ?? null,
    company: r.compagnie
      ? { id: r.compagnie.id, name: r.compagnie.nom, color: r.compagnie.couleur ?? null, logo: r.compagnie.logo ?? null }
      : null,
    distanceKm: r.distance_km ?? null,
    duration: r.duree ?? null,
    priceMin: r.prix_min ?? null,
    priceMax: r.prix_max ?? null,
    status: r.statut ?? 'active',
    description: r.description ?? null,
    stopCount: escales.length,
    stops: escales.map(serializeEscale),
    departCount: r.departCount ?? null,
    createdAt: r.date_creation ?? null,
  };
};

/* ══════════════════════════════════════════════════════════════
   Itinéraires
   ══════════════════════════════════════════════════════════════ */

const list = async ({ query, actor }) => {
  const scope = await resolveScope(actor);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const sort = query.sort || 'newest';

  const where = routeRepository.buildWhere(query, scope);
  const { rows, count } = await routeRepository.findPage({ where, page, limit, sort });
  const stopCounts = await routeRepository.countEscalesByTrajets(rows.map((r) => r.id));

  const items = rows.map((r) => {
    const item = serializeRoute(r);
    item.stopCount = stopCounts.get(r.id) || 0;
    return item;
  });

  return { items, total: count, page, limit, totalPages: Math.ceil(count / limit) };
};

const getById = async ({ id, actor }) => {
  const scope = await resolveScope(actor);
  const route = await routeRepository.findByIdFull(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const serialized = serializeRoute(route);
  serialized.departCount = await routeRepository.countDeparts(route.id);
  serialized.stopCount = serialized.stops.length;
  if (scope.compagnieId) serialized.company = route.compagnie
    ? { id: route.compagnie.id, name: route.compagnie.nom, color: route.compagnie.couleur ?? null, logo: route.compagnie.logo ?? null }
    : null;

  return serialized;
};

const create = async ({ data, actor }) => {
  const scope = await resolveScope(actor);
  const compagnieId = actor.role === ROLES.SUPER_ADMIN ? data.companyId || null : scope.compagnieId;

  if (data.code) {
    const existing = await routeRepository.findByCode(data.code);
    if (existing) throw new ApiError(409, `Le code « ${data.code} » est déjà utilisé.`);
  }

  const villeDepart = await routeRepository.findVille(data.departureCityId);
  if (!villeDepart) throw new ApiError(400, 'La ville de départ est introuvable.');
  const villeArrivee = await routeRepository.findVille(data.arrivalCityId);
  if (!villeArrivee) throw new ApiError(400, "La ville d'arrivée est introuvable.");

  const id = await generateRouteId();
  await routeRepository.createRoute({
    id,
    nom: data.name,
    code: data.code || null,
    ville_depart_id: data.departureCityId,
    ville_arrivee_id: data.arrivalCityId,
    compagnie_id: compagnieId,
    distance_km: normInt(data.distanceKm),
    duree: data.duration,
    prix_min: normInt(data.priceMin),
    prix_max: normInt(data.priceMax),
    statut: data.status || 'active',
    description: data.description || null,
  });

  const full = await routeRepository.findByIdFull(id);
  return serializeRoute(full);
};

const update = async ({ id, data, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const patch = {};
  if (data.name !== undefined) patch.nom = data.name;
  if (data.code !== undefined) {
    if (data.code) {
      const existing = await routeRepository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new ApiError(409, `Le code « ${data.code} » est déjà utilisé.`);
      }
    }
    patch.code = data.code || null;
  }
  if (data.departureCityId !== undefined) {
    const v = await routeRepository.findVille(data.departureCityId);
    if (!v) throw new ApiError(400, 'La ville de départ est introuvable.');
    patch.ville_depart_id = data.departureCityId;
  }
  if (data.arrivalCityId !== undefined) {
    const v = await routeRepository.findVille(data.arrivalCityId);
    if (!v) throw new ApiError(400, "La ville d'arrivée est introuvable.");
    patch.ville_arrivee_id = data.arrivalCityId;
  }
  if (data.companyId !== undefined) {
    if (actor.role !== ROLES.SUPER_ADMIN) {
      throw new ApiError(403, 'Accès refusé : seuls les super admins peuvent changer la compagnie.');
    }
    patch.compagnie_id = data.companyId || null;
  }
  if (data.distanceKm !== undefined) patch.distance_km = normInt(data.distanceKm);
  if (data.duration !== undefined) patch.duree = data.duration;
  if (data.priceMin !== undefined) patch.prix_min = normInt(data.priceMin);
  if (data.priceMax !== undefined) patch.prix_max = normInt(data.priceMax);
  if (data.status !== undefined) patch.statut = data.status;
  if (data.description !== undefined) patch.description = data.description || null;

  if (Object.keys(patch).length) {
    await routeRepository.updateRoute(route, patch);
  }

  const full = await routeRepository.findByIdFull(id);
  const serialized = serializeRoute(full);
  serialized.departCount = await routeRepository.countDeparts(route.id);
  return serialized;
};

const updateStatus = async ({ id, statut, raison, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  if (route.statut === statut) {
    const full = await routeRepository.findByIdFull(id);
    return { route: serializeRoute(full), message: 'Aucun changement de statut.' };
  }

  await routeRepository.updateRoute(route, { statut });
  if (raison) logger.info(`[routes] statut ${route.id} → ${statut} : ${raison}`);

  const full = await routeRepository.findByIdFull(id);
  return {
    route: serializeRoute(full),
    message: `Statut mis à jour : ${statut}.`,
  };
};

const remove = async ({ id, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  if (route.statut === 'archived') {
    return { id, message: 'Itinéraire déjà archivé.' };
  }

  await routeRepository.updateRoute(route, { statut: 'archived' });
  return { id, message: 'Itinéraire archivé.' };
};

const calculs = async ({ id, heureDepart, actor }) => {
  const route = await routeRepository.findByIdFull(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const escales = route.escales || [];
  const baseMinutes = parseDuration(route.duree);
  const stopsMinutes = escales.reduce((acc, e) => acc + (Number(e.duree_arret) || 0), 0);
  const totalMinutes = (baseMinutes ?? 0) + stopsMinutes;

  const result = {
    id: route.id,
    stopCount: escales.length,
    distanceKm: route.distance_km ?? null,
    duration: route.duree ?? null,
    durationBaseMinutes: baseMinutes,
    stopsMinutes,
    totalMinutes,
    estimatedDuration: baseMinutes === null && stopsMinutes === 0 ? null : minutesToTime(totalMinutes),
    stops: escales.map(serializeEscale),
  };

  if (heureDepart) {
    const dep = parseTime(heureDepart);
    result.departureTime = minutesToTime(dep);
    result.estimatedArrival = minutesToTime(dep + totalMinutes);
  }

  return result;
};

const stats = async ({ actor }) => {
  const scope = await resolveScope(actor);
  return routeRepository.stats(scope);
};

/* ══════════════════════════════════════════════════════════════
   Villes
   ══════════════════════════════════════════════════════════════ */

const listVilles = async ({ query }) => {
  const where = {};
  if (query.statut) where.statut = query.statut;
  const villes = await routeRepository.listVilles(where);
  return villes.map(serializeVille);
};

const getVille = async ({ villeId }) => {
  const ville = await routeRepository.findVille(villeId);
  if (!ville) throw new ApiError(404, 'Ville introuvable.');
  return serializeVille(ville);
};

const createVille = async ({ data }) => {
  const id = String(data.id).trim().toUpperCase();
  if (id.length < 2 || id.length > 3) {
    throw new ApiError(400, 'Le code de la ville doit contenir 2 à 3 caractères.');
  }
  if (await routeRepository.findVille(id)) {
    throw new ApiError(409, `La ville « ${id} » existe déjà.`);
  }

  const ville = await routeRepository.createVille({
    id,
    nom: data.name,
    region: data.region || null,
    pays: data.country || 'Cameroun',
    latitude: normInt(data.latitude),
    longitude: normInt(data.longitude),
    statut: data.status || 'active',
  });
  return serializeVille(ville);
};

const updateVille = async ({ villeId, data }) => {
  const ville = await routeRepository.findVille(villeId);
  if (!ville) throw new ApiError(404, 'Ville introuvable.');

  const patch = {};
  if (data.name !== undefined) patch.nom = data.name;
  if (data.region !== undefined) patch.region = data.region || null;
  if (data.country !== undefined) patch.pays = data.country || 'Cameroun';
  if (data.latitude !== undefined) patch.latitude = normInt(data.latitude);
  if (data.longitude !== undefined) patch.longitude = normInt(data.longitude);
  if (data.status !== undefined) patch.statut = data.status;

  await routeRepository.updateVille(ville, patch);
  return serializeVille(ville);
};

const removeVille = async ({ villeId }) => {
  const ville = await routeRepository.findVille(villeId);
  if (!ville) throw new ApiError(404, 'Ville introuvable.');

  const usage = await routeRepository.countVilleUsage(villeId);
  const total = usage.agences + usage.trajets_depart + usage.trajets_arrivee + usage.escales;
  if (total > 0) {
    throw new ApiError(409, `Impossible d'archiver cette ville : elle est utilisée par ${total} élément(s) (agences, itinéraires ou escales).`);
  }

  if (ville.statut === 'archived') {
    return { id: villeId, message: 'Ville déjà archivée.' };
  }
  await routeRepository.updateVille(ville, { statut: 'archived' });
  return { id: villeId, message: 'Ville archivée.' };
};

/* ══════════════════════════════════════════════════════════════
   Escales
   ══════════════════════════════════════════════════════════════ */

const listStops = async ({ id, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const escales = await routeRepository.listEscales(id);
  return escales.map(serializeEscale);
};

/** Vérifie qu'une ville d'escale n'est pas déjà le départ / l'arrivée. */
const assertStopVille = (route, villeId) => {
  if (villeId === route.ville_depart_id || villeId === route.ville_arrivee_id) {
    throw new ApiError(400, "L'escale doit être une ville intermédiaire, différente du départ et de l'arrivée.");
  }
};

const addStop = async ({ id, data, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);
  assertStopVille(route, data.villeId);

  const ville = await routeRepository.findVille(data.villeId);
  if (!ville) throw new ApiError(400, 'La ville de l\'escale est introuvable.');

  await sequelize.transaction(async (t) => {
    const current = await routeRepository.listEscales(id, { transaction: t });
    const maxOrder = current.reduce((m, e) => Math.max(m, e.ordre), 0);
    const ordre =
      data.ordre !== undefined && data.ordre !== null && data.ordre !== ''
        ? Number(data.ordre)
        : maxOrder + 1;

    const existing = await routeRepository.findEscaleByOrder(id, ordre);
    if (existing) {
      throw new ApiError(409, `Une escale occupe déjà la position ${ordre}.`);
    }

    await routeRepository.createEscale(
      {
        id: await generateEscaleId(),
        trajet_id: id,
        ville_id: data.villeId,
        ordre,
        heure_estimee: data.heureEstimee || null,
        duree_arret: normInt(data.dureeArret),
        description: data.description || null,
      },
      { transaction: t }
    );
  });

  return listStops({ id, actor });
};

const updateStop = async ({ id, stopId, data, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const escale = await routeRepository.findEscale(stopId);
  if (!escale || escale.trajet_id !== id) {
    throw new ApiError(404, 'Escale introuvable sur cet itinéraire.');
  }

  const patch = {};
  if (data.villeId !== undefined) {
    assertStopVille(route, data.villeId);
    const ville = await routeRepository.findVille(data.villeId);
    if (!ville) throw new ApiError(400, 'La ville de l\'escale est introuvable.');
    patch.ville_id = data.villeId;
  }
  if (data.ordre !== undefined) {
    const ordre = Number(data.ordre);
    const existing = await routeRepository.findEscaleByOrder(id, ordre);
    if (existing && existing.id !== stopId) {
      throw new ApiError(409, `Une escale occupe déjà la position ${ordre}.`);
    }
    patch.ordre = ordre;
  }
  if (data.heureEstimee !== undefined) patch.heure_estimee = data.heureEstimee || null;
  if (data.dureeArret !== undefined) patch.duree_arret = normInt(data.dureeArret);
  if (data.description !== undefined) patch.description = data.description || null;

  if (Object.keys(patch).length) {
    await routeRepository.updateEscale(escale, patch);
  }

  return listStops({ id, actor });
};

const removeStop = async ({ id, stopId, actor }) => {
  const route = await routeRepository.findRoute(id);
  if (!route) throw new ApiError(404, 'Itinéraire introuvable.');
  assertCanManage(actor, route);

  const escale = await routeRepository.findEscale(stopId);
  if (!escale || escale.trajet_id !== id) {
    throw new ApiError(404, 'Escale introuvable sur cet itinéraire.');
  }

  await sequelize.transaction(async (t) => {
    await routeRepository.deleteEscale(escale, { transaction: t });
    const remaining = await routeRepository.listEscales(id, { transaction: t });
    for (let i = 0; i < remaining.length; i += 1) {
      await routeRepository.updateEscale(remaining[i], { ordre: i + 1 }, { transaction: t });
    }
  });

  return { id: stopId, message: 'Escale supprimée.' };
};

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove,
  calculs,
  stats,
  listVilles,
  getVille,
  createVille,
  updateVille,
  removeVille,
  listStops,
  addStop,
  updateStop,
  removeStop,
};
