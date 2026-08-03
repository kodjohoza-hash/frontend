import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Companies Service (API réelle)
 * Endpoints backend :
 *   GET    /companies              (liste paginée + filtres, scope par rôle)
 *   GET    /companies/:id          (détail complet : agences + documents)
 *   POST   /companies              (création compagnie + admin principal)
 *   PATCH  /companies/:id          (mise à jour)
 *   PATCH  /companies/:id/status   (changement de statut — super admin)
 *   DELETE /companies/:id          (suppression douce — super admin)
 *   GET    /companies/stats        (KPIs : par statut / plan + totaux)
 *   GET/PATCH /companies/profile   (profil de ma compagnie)
 *
 * Les statuts API (actif/en_attente/suspendu/banni/expire) et les plans
 * (gratuit/standard/premium/enterprise) sont traduits vers les codes UI
 * existants (active/pending/suspended/refused et standard/premium) pour
 * conserver les composants AdminCompany* inchangés.
 */

/* ── Traduction statuts ────────────────────────────────────────── */
export const STATUS_TO_UI = {
  actif: 'active',
  en_attente: 'pending',
  suspendu: 'suspended',
  banni: 'refused',
  expire: 'suspended',
};

export const UI_TO_STATUS = {
  active: 'actif',
  pending: 'en_attente',
  suspended: 'suspendu',
  refused: 'banni',
};

/* ── Traduction abonnement ─────────────────────────────────────── */
export const PLAN_TO_UI = {
  gratuit: 'standard',
  standard: 'standard',
  premium: 'premium',
  enterprise: 'premium',
};

export const UI_TO_PLAN = {
  standard: 'standard',
  premium: 'premium',
};

/* ── Helpers ───────────────────────────────────────────────────── */
const initials = (name) =>
  String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w.charAt(0) || '').toUpperCase())
    .join('') || '?';

/** Met en forme une compagnie API → structure attendue par les composants Admin*. */
export const mapCompany = (c) => {
  const s = c.stats || {};
  const revenue = Number(s.revenus) || 0;
  return {
    id: c.id,
    name: c.name,
    logo: c.logo || initials(c.name),
    description: c.description || '',
    manager: '',
    email: c.email || '',
    phone: c.phone || '',
    address: c.address || '',
    city: c.city || '',
    country: c.country || '',
    rccm: c.rccm || '',
    taxpayerId: c.taxpayerId || '',
    createdAt: c.createdAt || null,
    subscription: PLAN_TO_UI[c.subscription] || c.subscription || 'standard',
    status: STATUS_TO_UI[c.statut] || c.statut,
    stats: {
      buses: Number(s.buses) || 0,
      drivers: Number(s.chauffeurs) || 0,
      agents: Number(s.agents) || 0,
      branches: Number(s.agences) || 0,
      trips: Number(s.voyages) || 0,
      bookings: Number(s.reservations) || 0,
      tickets: Number(s.tickets) || 0,
      revenue,
      commission: Math.round(revenue * 0.05),
    },
    plan: c.plan || null,
    abonnement: c.abonnement || null,
    documents: Array.isArray(c.documents) ? c.documents : null,
  };
};

/** Construit les KPIs de la page à partir de la réponse /companies/stats. */
export const mapStats = (raw) => {
  const statut = raw.parStatut || {};
  const plan = raw.parPlan || {};
  const totaux = raw.totaux || {};
  return [
    { id: 'total', label: 'Total compagnies', value: raw.total || 0, icon: 'bi-building', color: 'primary', trend: 0, trendUp: true },
    { id: 'active', label: 'Compagnies actives', value: statut.actif || 0, icon: 'bi-building-check', color: 'success', trend: 0, trendUp: true },
    { id: 'pending', label: 'En attente', value: statut.en_attente || 0, icon: 'bi-hourglass-split', color: 'warning', trend: 0, trendUp: true },
    { id: 'suspended', label: 'Suspendues', value: statut.suspendu || 0, icon: 'bi-pause-circle', color: 'danger', trend: 0, trendUp: false },
    { id: 'refused', label: 'Refusées', value: statut.banni || 0, icon: 'bi-x-circle', color: 'danger', trend: 0, trendUp: false },
    { id: 'new', label: 'Nouvelles (30j)', value: raw.recentes30j || 0, icon: 'bi-building-add', color: 'info', trend: 0, trendUp: true },
    { id: 'premium', label: 'Compagnies Premium', value: plan.premium || 0, icon: 'bi-star-fill', color: 'accent', trend: 0, trendUp: true },
    { id: 'standard', label: 'Compagnies Standard', value: (plan.standard || 0) + (plan.gratuit || 0), icon: 'bi-building', color: 'purple', trend: 0, trendUp: true },
    { id: 'buses', label: 'Bus (total)', value: totaux.buses || 0, icon: 'bi-bus-front', color: 'primary', trend: 0, trendUp: true },
    { id: 'agents', label: 'Agents (total)', value: totaux.agents || 0, icon: 'bi-people', color: 'info', trend: 0, trendUp: true },
  ];
};

/** Options des filtres avancés, dérivées des compagnies réelles. */
export const buildFilterOptions = (companies) => ({
  cities: [...new Set(companies.map((c) => c.city).filter(Boolean))],
  countries: [...new Set(companies.map((c) => c.country).filter(Boolean))],
});

/** Filtre client-side — même logique que le mock d'origine. */
export const filterCompanies = (list, filters) => {
  return list.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.manager.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
    }
    if (filters.city && filters.city !== 'all' && c.city !== filters.city) return false;
    if (filters.country && filters.country !== 'all' && c.country !== filters.country) return false;
    if (filters.subscription && filters.subscription !== 'all' && c.subscription !== filters.subscription) return false;
    if (filters.status && filters.status !== 'all' && c.status !== filters.status) return false;
    if (filters.busesMin && c.stats.buses < parseInt(filters.busesMin)) return false;
    if (filters.busesMax && c.stats.buses > parseInt(filters.busesMax)) return false;
    if (filters.agentsMin && c.stats.agents < parseInt(filters.agentsMin)) return false;
    if (filters.agentsMax && c.stats.agents > parseInt(filters.agentsMax)) return false;
    return true;
  });
};

/** Tri client-side — même logique que le mock d'origine. */
export const sortCompanies = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'revenue_desc': return sorted.sort((a, b) => b.stats.revenue - a.stats.revenue);
    case 'revenue_asc': return sorted.sort((a, b) => a.stats.revenue - b.stats.revenue);
    case 'tickets_desc': return sorted.sort((a, b) => b.stats.tickets - a.stats.tickets);
    default: return sorted;
  }
};

/* ── Méthodes API ───────────────────────────────────────────────── */
const companiesService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/companies', { params });
    return data;
  },

  /** Toutes les compagnies (pages cumulées) mappées pour l'UI. */
  getAll: async (params = {}) => {
    const first = await companiesService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await companiesService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.map(mapCompany);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/companies/${id}`);
    return mapCompany(data);
  },

  create: async (company) => {
    const data = await apiClient.post('/companies', company);
    return mapCompany(data);
  },

  update: async (id, company) => {
    const data = await apiClient.patch(`/companies/${id}`, company);
    return mapCompany(data);
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/companies/${id}`);
    return data;
  },

  /** Changement de statut (statut API : actif/en_attente/suspendu/banni/expire). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/companies/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/companies/stats');
    return data;
  },

  getProfile: async () => {
    const data = await apiClient.get('/companies/profile');
    return mapCompany(data);
  },

  updateProfile: async (profile) => {
    const data = await apiClient.patch('/companies/profile', profile);
    return mapCompany(data);
  },
};

export default companiesService;
