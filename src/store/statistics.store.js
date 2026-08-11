import { create } from 'zustand';
import statisticsService from '../services/statistics.service';

/**
 * BUS TIX CONNECT — Statistics Store (Zustand)
 * - `period` / `dateDebut` / `dateFin` : filtre de période partagé par les pages.
 * - `data[key]` : dernier payload reçu pour chaque endpoint
 *   `{ periode, devise, role, data }` — métriques dans `data.data`.
 * - `loading` / `error` : états d'interface (spinners / messages).
 * Tous les montants sont en XAF ; l'isolation par rôle est garantie côté API.
 */

const INITIAL_DATA = {
  dashboard: null,
  revenue: null,
  bookings: null,
  tickets: null,
  trips: null,
  performances: null,
  subscriptions: null,
};

const useStatisticsStore = create((set, get) => ({
  period: '30d',
  dateDebut: '',
  dateFin: '',
  data: INITIAL_DATA,
  loading: {},
  error: null,

  clearError: () => set({ error: null }),

  /** Change la période prédéfinie (today/yesterday/7d/30d/.../all). */
  setPeriod: (period) => set({ period }),

  /** Définit une période libre (backend → periode=custom). */
  setDateRange: (dateDebut, dateFin) => set({ period: 'custom', dateDebut, dateFin }),

  /** Paramètres d'appel de l'API pour la période courante. */
  buildParams: () => {
    const { period, dateDebut, dateFin } = get();
    if (period === 'custom') {
      const p = { dateDebut: dateDebut || undefined, dateFin: dateFin || undefined };
      if (!p.dateDebut && !p.dateFin) return { periode: 'all' };
      return p;
    }
    return { periode: period };
  },

  /**
   * Charge un endpoint et le range dans `data[key]`.
   * @param {'dashboard'|'revenue'|'bookings'|'tickets'|'trips'|'performances'|'subscriptions'} key
   * @param {object} [params] paramètres custom (ex. compagnieId pour performances).
   */
  fetch: async (key, params = get().buildParams()) => {
    set({ loading: { ...get().loading, [key]: true }, error: null });
    try {
      const payload = await statisticsService[key](params);
      set({ data: { ...get().data, [key]: payload }, loading: { ...get().loading, [key]: false } });
      return payload;
    } catch (err) {
      set({ loading: { ...get().loading, [key]: false }, error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge les KPIs courants (dashboard + revenue + bookings + tickets) en parallèle. */
  fetchOverview: async (params) => {
    const p = params || get().buildParams();
    const [dashboard, revenue, bookings, tickets] = await Promise.all([
      get().fetch('dashboard', p),
      get().fetch('revenue', p),
      get().fetch('bookings', p),
      get().fetch('tickets', p),
    ]);
    return { dashboard, revenue, bookings, tickets };
  },

  /** Accesseurs rapides (métriques d'un endpoint). */
  metrics: (key) => get().data[key]?.data || null,
  isLoading: (key) => Boolean(get().loading[key]),
}));

export default useStatisticsStore;
