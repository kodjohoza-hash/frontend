import apiClient from './apiClient';

/**
 * BUS TIX CONNECT — Counters Service (API réelle)
 * Endpoints backend :
 *   GET    /guichets/mine         (guichet de l'agent courant — dashboard)
 *   GET    /guichets/stats        (KPIs par statut / type + totaux)
 *   GET    /guichets              (liste paginée + filtres, scope par rôle)
 *   POST   /guichets              (création)
 *   PATCH  /guichets/:id/agents   (affectation d'agents)
 *   DELETE /guichets/:id/agents   (retrait d'agents)
 *   POST   /guichets/:id/agents/transfer (transfert d'agents)
 *   GET    /guichets/:id          (détail)
 *   PATCH  /guichets/:id          (mise à jour)
 *   PATCH  /guichets/:id/status   (changement de statut : ouvert/ferme/maintenance)
 *   DELETE /guichets/:id          (suppression douce)
 *
 * Le mapper transforme un guichet API en la structure attendue par les
 * composants de la page « Guichets » (points de vente internes).
 */

/* ── Helpers ───────────────────────────────────────────────────── */
const mapAgentRef = (a) => ({
  id: a.id,
  matricule: a.matricule,
  name: `${a.prenom} ${a.nom}`.trim(),
  role: a.role,
  status: a.statut,
});

/** Met en forme un guichet API → structure attendue par l'UI. */
export const mapGuichet = (g) => {
  const s = g.stats || {};
  const agence = g.agence || null;
  return {
    id: g.id,
    code: g.code || '',
    name: g.nom || g.code || '',
    type: g.type,
    status: g.statut,
    description: g.description || '',
    agenceId: g.agenceId || agence?.id || null,
    agenceName: g.agenceName || agence?.nom || '',
    villeId: g.villeId || agence?.villeId || null,
    city: g.city || agence?.city || '',
    createdAt: g.createdAt || null,
    updatedAt: g.updatedAt || null,
    stats: {
      agents: Number(s.agents) || 0,
      todayBookings: Number(s.todayBookings) || 0,
      weekBookings: Number(s.weekBookings) || 0,
      totalBookings: Number(s.totalBookings) || 0,
      todayRevenue: Number(s.todayRevenue) || 0,
      weekRevenue: Number(s.weekRevenue) || 0,
      totalRevenue: Number(s.totalRevenue) || 0,
    },
    agents: (g.agents || []).map(mapAgentRef),
    agence,
  };
};

/** Construit les KPIs de la page à partir de la réponse /guichets/stats. */
export const mapStats = (raw) => {
  const statut = raw.parStatut || {};
  const type = raw.parType || {};
  const totaux = raw.totaux || {};
  return [
    { id: 'total', label: 'Total guichets', value: raw.total || 0, icon: 'bi-shop-window', color: 'primary', trend: 0, trendUp: true },
    { id: 'ouvert', label: 'Guichets ouverts', value: statut.ouvert || 0, icon: 'bi-shop', color: 'success', trend: 0, trendUp: true },
    { id: 'ferme', label: 'Guichets fermés', value: statut.ferme || 0, icon: 'bi-lock', color: 'danger', trend: 0, trendUp: false },
    { id: 'maintenance', label: 'En maintenance', value: statut.maintenance || 0, icon: 'bi-wrench', color: 'warning', trend: 0, trendUp: false },
    { id: 'agents', label: 'Agents (total)', value: totaux.agents || 0, icon: 'bi-people', color: 'info', trend: 0, trendUp: true },
    { id: 'todayBookings', label: 'Réservations (auj.)', value: totaux.todayBookings || 0, icon: 'bi-ticket-perforated', color: 'accent', trend: 0, trendUp: true },
    { id: 'weekBookings', label: 'Réservations (sem.)', value: totaux.weekBookings || 0, icon: 'bi-calendar-week', color: 'purple', trend: 0, trendUp: true },
    { id: 'todayRevenue', label: 'CA du jour', value: totaux.todayRevenue || 0, icon: 'bi-cash-stack', color: 'success', trend: 0, trendUp: true },
    { id: 'weekRevenue', label: 'CA de la semaine', value: totaux.weekRevenue || 0, icon: 'bi-graph-up-arrow', color: 'warning', trend: 0, trendUp: true },
    { id: 'vente', label: 'Vente de billets', value: type.vente_billets || 0, icon: 'bi-ticket-perforated', color: 'primary', trend: 0, trendUp: true },
  ];
};

/* ── Méthodes API ───────────────────────────────────────────────── */
const counterService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/guichets', { params });
    return data;
  },

  /** Tous les guichets (pages cumulées) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await counterService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await counterService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.map(mapGuichet);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/guichets/${id}`);
    return mapGuichet(data);
  },

  create: async (guichet) => {
    const data = await apiClient.post('/guichets', guichet);
    return mapGuichet(data);
  },

  update: async (id, guichet) => {
    const data = await apiClient.patch(`/guichets/${id}`, guichet);
    return mapGuichet(data);
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/guichets/${id}`);
    return data;
  },

  /** Changement de statut (statut API : ouvert/ferme/maintenance). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch(`/guichets/${id}/status`, { statut, raison: raison || null });
    return data;
  },

  /** Affecte des agents à un guichet (payload : { agentIds: [] }). */
  assignAgents: async (id, agentIds) => {
    const data = await apiClient.patch(`/guichets/${id}/agents`, { agentIds });
    return mapGuichet(data);
  },

  /** Retire des agents d'un guichet (payload : { agentIds: [] }). */
  removeAgents: async (id, agentIds) => {
    const data = await apiClient.delete(`/guichets/${id}/agents`, { data: { agentIds } });
    return mapGuichet(data);
  },

  /** Transfère des agents vers un autre guichet. */
  transferAgents: async (id, agentIds, toGuichetId) => {
    const data = await apiClient.post(`/guichets/${id}/agents/transfer`, { agentIds, toGuichetId });
    return data;
  },

  /** Guichet de l'agent courant (dashboard agent de guichet). */
  getMine: async () => {
    const data = await apiClient.get('/guichets/mine');
    return {
      ...data,
      guichet: data.guichet ? mapGuichet(data.guichet) : null,
    };
  },

  getStats: async () => {
    const data = await apiClient.get('/guichets/stats');
    return data;
  },
};

export default counterService;
