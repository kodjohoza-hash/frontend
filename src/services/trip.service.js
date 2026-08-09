import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Trip Service (API réelle)
 * Endpoints backend (module trips) :
 *   GET    /trips                   (liste paginée + filtres, scope par rôle)
 *   GET    /trips/available         (recherche publique, sans authentification)
 *   GET    /trips/stats             (KPIs : total, today, active, completed, cancelled, occupancy)
 *   GET    /trips/:id               (détail ; public si voyage réservable, sinon géré)
 *   POST   /trips                   (création)
 *   PATCH  /trips/:id               (mise à jour)
 *   PATCH  /trips/:id/status        (changement de statut, transitions contrôlées)
 *   DELETE /trips/:id               (suppression protégée → 409 si réservations)
 *
 * Les statuts API (programme / embarquement / en_cours / termine / annule / retarde)
 * sont traduits vers les codes UI des composants AgencyTrip* (programmee /
 * embarquement / en_cours / terminee / annulee). « retarde » n'a pas d'équivalent
 * dans l'UI : il est affiché comme « programmee ».
 */

/* ── Traduction statuts ────────────────────────────────────────── */
export const STATUS_TO_UI = {
  programme: 'programmee',
  embarquement: 'embarquement',
  en_cours: 'en_cours',
  termine: 'terminee',
  annule: 'annulee',
  retarde: 'programmee',
};

export const UI_TO_STATUS = {
  programmee: 'programme',
  embarquement: 'embarquement',
  en_cours: 'en_cours',
  terminee: 'termine',
  annulee: 'annule',
  complete: 'programme',
  retarde: 'retarde',
};

/* ── Helpers ───────────────────────────────────────────────────── */
const toInt = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

/** Méta un voyage API → structure attendue par les composants AgencyTrip*. */
export const mapTrip = (t) => ({
  id: t.id,
  code: t.code || '',
  routeId: t.routeId,
  agencyId: t.agencyId,
  driverId: t.driverId,
  company: t.company?.name || '',
  companyColor: t.company?.color || null,
  from: t.route?.departureCity || '',
  to: t.route?.arrivalCity || '',
  fromPoint: t.quai || '',
  toPoint: '',
  date: t.date || '',
  arrivalDate: t.arrivalDate || '',
  departure: t.departureTime || '',
  arrival: t.arrivalTime || '',
  price: Number(t.price) || 0,
  currency: t.currency || 'XAF',
  totalSeats: Number(t.totalSeats) || 0,
  soldSeats: Number(t.occupiedSeats) || 0,
  availableSeats: Number(t.availableSeats) || 0,
  bus: {
    id: t.bus?.id || '',
    name: t.bus?.internalNumber || t.bus?.plate || t.bus?.model || '',
    plate: t.bus?.plate || '',
    model: t.bus?.model || '',
    type: t.bus?.type || '',
    capacity: Number(t.bus?.capacity) || 0,
    status: t.bus?.status || '',
  },
  driver: { id: t.driver?.id || '', name: t.driver?.name || '—' },
  substituteDriver: t.substituteDriver ? { id: t.substituteDriver.id, name: t.substituteDriver.name } : null,
  status: STATUS_TO_UI[t.status] || t.status || 'programme',
  type: t.bus?.type || '',
  luggage: 0,
  notes: t.observations || '',
  createdAt: t.createdAt || '',
  updatedAt: t.updatedAt || '',
});

/** Construit les KPIs de la page à partir de l'API /trips/stats. */
export const mapStats = (s = {}) => ({
  total: Number(s.total) || 0,
  today: Number(s.today) || 0,
  planned: Number(s.planned) || 0,
  active: Number(s.active) || 0,
  completed: Number(s.completed) || 0,
  cancelled: Number(s.cancelled) || 0,
  full: Number(s.full) || 0,
  occupancy: Number(s.occupancy) || 0,
});

/** Retrouve l'itinéraire correspondant au trajet « ville → ville ». */
export const findRouteForTrip = (routes, from, to) =>
  (Array.isArray(routes) ? routes : []).find(
    (r) => (r.departCity || r.departureCity || '').trim().toLowerCase() === String(from || '').trim().toLowerCase()
      && (r.arrivalCity || '').trim().toLowerCase() === String(to || '').trim().toLowerCase()
  ) || null;

/**
 * Construit le payload d'écriture (formulaire modal → API).
 * Le formulaire UI (from/to = noms de villes) nécessite la résolution du
 * routeId : il est injecté via `options.routes` (liste du route store) ou
 * `options.routeId` directement. `existing` permet de ne transmettre que les
 * champs modifiés lors d'une mise à jour.
 */
export const buildTripPayload = (form = {}, options = {}) => {
  const existing = options.existing || null;
  const route = options.routeId
    ? { id: options.routeId }
    : findRouteForTrip(options.routes, form.from, form.to);

  const payload = {};
  if (form.routeId !== undefined) payload.routeId = form.routeId;
  else if (route?.id && (existing ? existing.routeId !== route.id : true)) payload.routeId = route.id;

  if (form.bus !== undefined) payload.busId = form.bus;
  if (form.driver !== undefined) payload.driverId = form.driver;
  if (form.substituteDriver !== undefined) payload.substituteDriverId = form.substituteDriver || null;
  if (form.agencyId !== undefined) payload.agencyId = form.agencyId || null;
  if (form.companyId !== undefined) payload.companyId = form.companyId;
  if (form.date !== undefined) payload.date = form.date;
  if (form.arrivalDate !== undefined) payload.arrivalDate = form.arrivalDate || null;
  if (form.departure !== undefined) payload.departureTime = form.departure;
  if (form.arrival !== undefined) payload.arrivalTime = form.arrival;
  if (form.price !== undefined) payload.price = toInt(form.price);
  if (form.quai !== undefined) payload.quai = form.quai || null;
  if (form.notes !== undefined) payload.observations = form.notes || null;
  if (form.observations !== undefined) payload.observations = form.observations || null;
  if (form.code !== undefined) payload.code = form.code || null;
  if (form.status !== undefined) payload.status = UI_TO_STATUS[form.status] || form.status;
  return payload;
};

/* ── Méthodes API ─────────────────────────────────────────────── */
const tripService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/trips', { params });
    return data;
  },

  /** Tous les voyages (pages cumulées) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await tripService.list({ ...params, page: 1, limit: 100 });
    let items = [...(first.items || [])];
    let page = 2;
    while (page <= (first.totalPages || 1) && items.length < (first.total || 0)) {
      const next = await tripService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items || []);
      page += 1;
    }
    return items.map(mapTrip);
  },

  /** Recherche publique (voyages réservables), non authentifiée. */
  searchPublic: async (params = {}) => {
    const data = await apiClient.get('/trips/available', { params });
    return {
      items: (data.items || []).map(mapTrip),
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit,
      totalPages: data.totalPages || 0,
    };
  },

  getById: async (id) => {
    const data = await apiClient.get(`/trips/${id}`);
    return mapTrip(data);
  },

  create: async (form, options = {}) => {
    const data = await apiClient.post('/trips', buildTripPayload(form, options));
    return mapTrip(data);
  },

  update: async (id, form, options = {}) => {
    const data = await apiClient.patch(`/trips/${id}`, buildTripPayload(form, options));
    return mapTrip(data);
  },

  /** Changement de statut (statut API : programme/embarquement/en_cours/termine/annule/retarde). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/trips/${id}/status`, {
      statut: UI_TO_STATUS[statut] || statut,
      raison: raison || null,
    });
    return data;
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/trips/${id}`);
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/trips/stats');
    return mapStats(data);
  },
};

export default tripService;
