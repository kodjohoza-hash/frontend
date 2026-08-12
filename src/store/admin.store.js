import { create } from 'zustand';
import adminService from '../services/admin.service';
import { mapAuditLog, mapAuditStats } from '../utils/adminAuditAdapter';

/**
 * BUS TIX CONNECT — Admin Store (Zustand) — Module 19 Super Admin
 * - logs : événements du journal d'audit mappés pour les composants Admin*.
 * - stats : KPIs du journal construits depuis GET /admin/audit-logs/stats.
 * Le formulaire de filtres de la page Audit est traduit en requête serveur
 * (search / action / entite / dates) ; les filtres non exposés par l'API
 * (gravité, statut, utilisateur…) restent côté composant.
 */
const useAdminStore = create((set, get) => ({
  logs: [],
  total: 0,
  stats: null,
  loading: false,
  error: null,

  fetchLogs: async (query = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await adminService.getAuditLogs(query);
      set({
        logs: (data.items || []).map(mapAuditLog),
        total: data.pagination?.total || 0,
        loading: false,
      });
      return get().logs;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger le journal d\u2019audit.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const raw = await adminService.getAuditStats();
      set({ stats: mapAuditStats(raw) });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques du journal.' });
      throw err;
    }
  },

  /** Charge le journal + les KPIs. */
  refresh: async (query = {}) => {
    const { fetchLogs, fetchStats } = get();
    await Promise.all([fetchLogs(query), fetchStats()]);
  },

  /** Paiements opérationnels globaux (page Payments du Super Admin). */
  payments: [],
  paymentsStats: null,
  paymentsLoading: false,

  fetchPayments: async (params = {}) => {
    set({ paymentsLoading: true, error: null });
    try {
      const data = await adminService.getPayments(params);
      set({ payments: data.items || [], paymentsTotal: data.pagination?.total || 0, paymentsLoading: false });
      return data;
    } catch (err) {
      set({ paymentsLoading: false, error: err.message || 'Impossible de charger les paiements.' });
      throw err;
    }
  },

  fetchPaymentsStats: async () => {
    try {
      const raw = await adminService.getPaymentsStats();
      set({ paymentsStats: raw });
      return raw;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques des paiements.' });
      throw err;
    }
  },
}));

export default useAdminStore;
