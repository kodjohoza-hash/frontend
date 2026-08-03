import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Agencies Service (API réelle)
 * Endpoints backend :
 *   GET    /agencies              (liste paginée + filtres, scope par rôle)
 *   GET    /agencies/nearby       (agences proches d'un point GPS)
 *   GET    /agencies/villes       (villes disponibles)
 *   GET    /agencies/stats        (KPIs par statut / type + totaux)
 *   GET    /agencies/:id          (détail : guichets + agents)
 *   POST   /agencies              (création)
 *   PATCH  /agencies/:id          (mise à jour)
 *   PATCH  /agencies/:id/status   (changement de statut opérationnel)
 *   DELETE /agencies/:id          (suppression douce)
 *
 * Les statuts API (actif/inactif/suspendu) sont traduits vers les codes UI
 * (ouvert/ferme/temporairement_ferme) pour conserver les composants
 * AgencyBranch* inchangés.
 */

/* ── Traduction statuts ────────────────────────────────────────── */
export const STATUS_TO_UI = {
  actif: 'ouvert',
  inactif: 'ferme',
  suspendu: 'temporairement_ferme',
};

export const UI_TO_STATUS = {
  ouvert: 'actif',
  ferme: 'inactif',
  maintenance: 'actif',
  temporairement_ferme: 'suspendu',
  en_construction: 'inactif',
};

/* ── Helpers ───────────────────────────────────────────────────── */
const initials = (name) =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w.charAt(0) || '').toUpperCase())
    .join('') || '?';

const mapCounterRef = (g) => ({
  id: g.id,
  name: g.nom || g.code,
  code: g.code,
  type: g.type,
  status: g.statut,
});

const mapAgentRef = (a) => ({
  id: a.id,
  matricule: a.matricule,
  name: `${a.prenom} ${a.nom}`.trim(),
  role: a.role,
  status: a.statut,
  guichetId: a.guichetId ?? null,
});

/** Met en forme une agence API → structure attendue par les composants AgencyBranch*. */
export const mapBranch = (a) => {
  const s = a.stats || {};
  return {
    id: a.id,
    name: a.name || '',
    code: a.code || a.id,
    description: a.description || '',
    country: 'Cameroun',
    region: a.region || '',
    city: a.city || '',
    quartier: a.quartier || '',
    fullAddress: [a.address, a.quartier, a.city].filter(Boolean).join(', ') || '',
    lat: a.lat ?? null,
    lng: a.lng ?? null,
    phone: a.phone || '',
    email: a.email || '',
    manager: a.manager || null,
    openTime: a.openTime || '',
    closeTime: a.closeTime || '',
    openDays: a.openDays || [],
    services: a.services || [],
    status: STATUS_TO_UI[a.statut] || a.statut,
    actif: a.statut === 'actif',
    type: a.type || 'agence',
    counters: Number(s.counters) || 0,
    agentCount: Number(s.agents) || 0,
    photoUrl: null,
    statutAbonnement: a.statutAbonnement || null,
    createdAt: a.createdAt || null,
    stats: {
      todayBookings: Number(s.todayBookings) || 0,
      todayRevenue: Number(s.revenue) || 0,
      totalBookings: Number(s.bookings) || 0,
      totalRevenue: Number(s.revenue) || 0,
      confirmedBookings: Number(s.confirmedBookings) || 0,
      trips: Number(s.trips) || 0,
      avgDaily: 0,
      satisfaction: 0,
    },
    reservations: [],
    agents: (a.agents || []).map(mapAgentRef),
    history: [],
  };
};

/** Construit les KPIs de la page à partir de la réponse /agencies/stats. */
export const mapStats = (raw) => {
  const statut = raw.parStatut || {};
  const type = raw.parType || {};
  const totaux = raw.totaux || {};
  return [
    { id: 'total', label: 'Total agences', value: raw.total || 0, icon: 'bi-building', color: 'primary', trend: 0, trendUp: true },
    { id: 'ouvert', label: 'Agences ouvertes', value: statut.actif || 0, icon: 'bi-shop', color: 'success', trend: 0, trendUp: true },
    { id: 'ferme', label: 'Agences fermées', value: (statut.inactif || 0) + (statut.suspendu || 0), icon: 'bi-lock', color: 'danger', trend: 0, trendUp: false },
    { id: 'agents', label: 'Total agents', value: totaux.agents || 0, icon: 'bi-people', color: 'info', trend: 0, trendUp: true },
    { id: 'guichets', label: 'Guichets (total)', value: totaux.counters || 0, icon: 'bi-shop-window', color: 'accent', trend: 0, trendUp: true },
    { id: 'bookings', label: 'Réservations (total)', value: totaux.bookings || 0, icon: 'bi-ticket-perforated', color: 'purple', trend: 0, trendUp: true },
    { id: 'revenue', label: 'CA total', value: totaux.revenue || 0, icon: 'bi-cash-stack', color: 'warning', trend: 0, trendUp: true },
    { id: 'gares', label: 'Gares routières', value: type.gare || 0, icon: 'bi-bus-front', color: 'primary', trend: 0, trendUp: true },
    { id: 'bouettes', label: 'Bouettes', value: type.bouette || 0, icon: 'bi-shop', color: 'info', trend: 0, trendUp: true },
    { id: 'bureaux', label: 'Bureaux commerciaux', value: type.bureau || 0, icon: 'bi-briefcase', color: 'success', trend: 0, trendUp: true },
  ];
};

/** Options des filtres dérivées des agences réelles. */
export const buildFilterOptions = (branches) => ({
  cities: [...new Set(branches.map((b) => b.city).filter(Boolean))],
  regions: [...new Set(branches.map((b) => b.region).filter(Boolean))],
  types: [...new Set(branches.map((b) => b.type).filter(Boolean))],
});

/* ── Méthodes API ───────────────────────────────────────────────── */
const agencyService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/agencies', { params });
    return data;
  },

  /** Toutes les agences (pages cumulées) mappées pour l'UI. */
  getAll: async (params = {}) => {
    const first = await agencyService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await agencyService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.map(mapBranch);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/agencies/${id}`);
    return mapBranch(data);
  },

  create: async (branch) => {
    const data = await apiClient.post('/agencies', branch);
    return mapBranch(data);
  },

  update: async (id, branch) => {
    const data = await apiClient.patch(`/agencies/${id}`, branch);
    return mapBranch(data);
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/agencies/${id}`);
    return data;
  },

  /** Changement de statut (statut API : actif/inactif/suspendu). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/agencies/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/agencies/stats');
    return data;
  },

  getVilles: async () => {
    const data = await apiClient.get('/agencies/villes');
    return data;
  },

  getNearby: async (params = {}) => {
    const data = await apiClient.get('/agencies/nearby', { params });
    return data.map(mapBranch);
  },
};

export default agencyService;
