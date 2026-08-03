import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Route Service (API réelle)
 * Endpoints backend :
 *   GET    /routes                     (liste paginée + filtres, scope par rôle)
 *   GET    /routes/stats               (KPIs : total, actifs, distance, villes)
 *   GET    /routes/:id                 (détail : escales + villes + voyages)
 *   POST   /routes                     (création)
 *   PATCH  /routes/:id                 (mise à jour)
 *   PATCH  /routes/:id/status          (changement de statut)
 *   DELETE /routes/:id                 (archivage)
 *   GET    /routes/:id/calculs         (durées, escales, heure d'arrivée)
 *   GET    /routes/:id/stops           (liste des escales)
 *   POST   /routes/:id/stops           (ajouter une escale)
 *   PATCH  /routes/:id/stops/:stopId   (mettre à jour une escale)
 *   DELETE /routes/:id/stops/:stopId   (supprimer une escale)
 *   GET    /routes/villes              (villes desservies)
 *   POST   /routes/villes              (créer une ville)
 *   PATCH  /routes/villes/:villeId     (mettre à jour une ville)
 *   DELETE /routes/villes/:villeId     (archiver une ville)
 *
 * Les statuts API (active / inactive / archived) sont conservés tels quels
 * pour les composants AgencyRoute*.
 */

/* ── Statuts ──────────────────────────────────────────────────── */
export const STATUS_TO_UI = {
  active: 'active',
  inactive: 'inactive',
  archived: 'archived',
};

export const UI_TO_STATUS = {
  active: 'active',
  inactive: 'inactive',
  archived: 'archived',
};

/* ── Helpers ──────────────────────────────────────────────────── */
/** « 4h30 » → « 4h 30min » ; « 45min » → « 45min ». */
export const formatDuration = (d) => {
  if (!d) return '';
  const s = String(d);
  const m = s.match(/^(\d{1,2})h(?::?(\d{1,2}))?$/);
  if (m) {
    const h = Number(m[1]);
    const min = m[2] ? Number(m[2]) : 0;
    return min ? `${h}h ${min}min` : `${h}h`;
  }
  return s;
};

/** 270 → « 04:30 » (format backend). */
export const formatMinutes = (total) => {
  if (total === null || total === undefined) return '—';
  const h = Math.floor(total / 60);
  const min = total % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

const toInt = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

const serializeStop = (s) => ({
  id: s.id,
  routeId: s.routeId,
  villeId: s.villeId,
  cityName: s.city?.name || '',
  ordre: Number(s.ordre) || 0,
  heureEstimee: s.heureEstimee || '',
  dureeArret: toInt(s.dureeArret),
  description: s.description || '',
});

const serializeVille = (v) => ({
  id: v.id,
  name: v.name || '',
  region: v.region || '',
  country: v.country || 'Cameroun',
  latitude: toInt(v.latitude),
  longitude: toInt(v.longitude),
  status: v.status || 'active',
});

/** Mét en forme un itinéraire API → structure attendue par les composants AgencyRoute*. */
export const mapRoute = (r) => ({
  id: r.id,
  name: r.name || '',
  code: r.code || '',
  departCityId: r.departureCityId,
  arrivalCityId: r.arrivalCityId,
  departCity: r.departureCity?.name || '',
  arrivalCity: r.arrivalCity?.name || '',
  distanceKm: toInt(r.distanceKm),
  duration: r.duration || '',
  durationLabel: formatDuration(r.duration),
  priceMin: toInt(r.priceMin),
  priceMax: toInt(r.priceMax),
  stopCount: Number(r.stopCount) || 0,
  status: STATUS_TO_UI[r.status] || r.status || 'active',
  description: r.description || '',
  createdAt: r.createdAt || '',
  companyId: r.companyId || '',
  companyName: r.company?.name || '',
  companyColor: r.company?.color || null,
  departCount: Number(r.departCount) || 0,
  stops: Array.isArray(r.stops) ? r.stops.map(serializeStop) : [],
});

/** Construit les KPIs de la page à partir de l'API /routes/stats. */
export const mapStats = (s = {}) => ({
  total: Number(s.total) || 0,
  actifs: Number(s.actifs) || 0,
  inactifs: Number(s.inactifs) || 0,
  archives: Number(s.archives) || 0,
  totalDistanceKm: Number(s.totalDistanceKm) || 0,
  villesDesservies: Number(s.villesDesservies) || 0,
});

/** Construit le payload d'écriture (formulaire modal → API). */
const buildPayload = (form) => {
  const payload = {};
  if (form.name !== undefined) payload.name = form.name;
  if (form.code !== undefined) payload.code = form.code || null;
  if (form.departCityId !== undefined) payload.departureCityId = form.departCityId;
  if (form.arrivalCityId !== undefined) payload.arrivalCityId = form.arrivalCityId;
  if (form.distanceKm !== undefined) payload.distanceKm = toInt(form.distanceKm);
  if (form.duration !== undefined) payload.duration = form.duration;
  if (form.priceMin !== undefined) payload.priceMin = toInt(form.priceMin);
  if (form.priceMax !== undefined) payload.priceMax = toInt(form.priceMax);
  if (form.status !== undefined) payload.status = UI_TO_STATUS[form.status] || form.status || 'active';
  if (form.description !== undefined) payload.description = form.description || null;
  return payload;
};

/* ── Méthodes API ─────────────────────────────────────────────── */
const routeService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/routes', { params });
    return data;
  },

  /** Tous les itinéraires (pages cumulées, sans archivés) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await routeService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await routeService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.filter((r) => r.status !== 'archived').map(mapRoute);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/routes/${id}`);
    return mapRoute(data);
  },

  create: async (form) => {
    const data = await apiClient.post('/routes', buildPayload(form));
    return mapRoute(data);
  },

  update: async (id, form) => {
    const data = await apiClient.patch(`/routes/${id}`, buildPayload(form));
    return mapRoute(data);
  },

  /** Changement de statut (statut API : active / inactive / archived). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/routes/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/routes/${id}`);
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/routes/stats');
    return mapStats(data);
  },

  getCalculs: async (id, heureDepart = '') => {
    const data = await apiClient.get(`/routes/${id}/calculs`, { params: { heureDepart } });
    return data;
  },

  /* ── Villes ──────────────────────────────────────────────────── */
  listVilles: async (params = {}) => {
    const data = await apiClient.get('/routes/villes', { params });
    return (Array.isArray(data) ? data : []).map(serializeVille);
  },

  createVille: async (form) => {
    const data = await apiClient.post('/routes/villes', {
      id: form.id,
      name: form.name,
      region: form.region || null,
      country: form.country || 'Cameroun',
      latitude: toInt(form.latitude),
      longitude: toInt(form.longitude),
      status: form.status || 'active',
    });
    return serializeVille(data);
  },

  updateVille: async (villeId, form) => {
    const payload = {};
    if (form.name !== undefined) payload.name = form.name;
    if (form.region !== undefined) payload.region = form.region || null;
    if (form.country !== undefined) payload.country = form.country || 'Cameroun';
    if (form.latitude !== undefined) payload.latitude = toInt(form.latitude);
    if (form.longitude !== undefined) payload.longitude = toInt(form.longitude);
    if (form.status !== undefined) payload.status = form.status;
    const data = await apiClient.patch(`/routes/villes/${villeId}`, payload);
    return serializeVille(data);
  },

  removeVille: async (villeId) => {
    const data = await apiClient.delete(`/routes/villes/${villeId}`);
    return data;
  },

  /* ── Escales ─────────────────────────────────────────────────── */
  listStops: async (routeId) => {
    const data = await apiClient.get(`/routes/${routeId}/stops`);
    return (Array.isArray(data) ? data : []).map(serializeStop);
  },

  addStop: async (routeId, form) => {
    const payload = {
      villeId: form.villeId,
      ordre: form.ordre === '' || form.ordre === null ? undefined : Number(form.ordre),
      heureEstimee: form.heureEstimee || null,
      dureeArret: toInt(form.dureeArret),
      description: form.description || null,
    };
    const data = await apiClient.post(`/routes/${routeId}/stops`, payload);
    return (Array.isArray(data) ? data : []).map(serializeStop);
  },

  updateStop: async (routeId, stopId, form) => {
    const payload = {};
    if (form.villeId !== undefined) payload.villeId = form.villeId;
    if (form.ordre !== undefined) payload.ordre = form.ordre === '' || form.ordre === null ? undefined : Number(form.ordre);
    if (form.heureEstimee !== undefined) payload.heureEstimee = form.heureEstimee || null;
    if (form.dureeArret !== undefined) payload.dureeArret = toInt(form.dureeArret);
    if (form.description !== undefined) payload.description = form.description || null;
    const data = await apiClient.patch(`/routes/${routeId}/stops/${stopId}`, payload);
    return (Array.isArray(data) ? data : []).map(serializeStop);
  },

  removeStop: async (routeId, stopId) => {
    const data = await apiClient.delete(`/routes/${routeId}/stops/${stopId}`);
    return data;
  },
};

export default routeService;
