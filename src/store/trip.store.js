import { create } from 'zustand';
import tripService from '../services/trip.service';

/**
 * BUS TIX CONNECT — Trip Store (Zustand)
 * Données de la page « Voyages » branchées sur l'API réelle.
 * - trips : liste complète mappée pour les composants AgencyTrip*
 * - stats : KPIs (total, aujourd'hui, en cours, terminées, annulées, occupation)
 * - trip  : voyage courant du détail
 * Les mutations (créer / modifier / statut / supprimer) appellent l'API
 * puis rafraîchissent la liste et les KPIs.
 */
const useTripStore = create((set, get) => ({
  trips: [],
  stats: { total: 0, today: 0, planned: 0, active: 0, completed: 0, cancelled: 0, full: 0, occupancy: 0 },
  trip: null,
  loading: false,
  loadingDetail: false,
  saving: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchTrips: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const trips = await tripService.getAll(params);
      set({ trips, loading: false });
      return get().trips;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les voyages.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await tripService.getStats();
      set({ stats });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge la liste + les KPIs en parallèle. */
  refresh: async (params) => {
    await Promise.all([get().fetchTrips(params), get().fetchStats()]);
  },

  fetchTrip: async (id) => {
    set({ loadingDetail: true, error: null });
    try {
      const trip = await tripService.getById(id);
      set({ trip, loadingDetail: false });
      return get().trip;
    } catch (err) {
      set({ loadingDetail: false, error: err.message || 'Impossible de charger le voyage.' });
      throw err;
    }
  },

  createTrip: async (form, options) => {
    set({ saving: true, error: null });
    try {
      const trip = await tripService.create(form, options);
      await get().refresh();
      set({ saving: false });
      return trip;
    } catch (err) {
      set({ saving: false, error: err.message || 'Impossible de créer le voyage.' });
      throw err;
    }
  },

  updateTrip: async (id, form, options) => {
    set({ saving: true, error: null });
    try {
      const trip = await tripService.update(id, form, options);
      await get().refresh();
      set({ trip, saving: false });
      return trip;
    } catch (err) {
      set({ saving: false, error: err.message || 'Impossible de modifier le voyage.' });
      throw err;
    }
  },

  updateStatus: async (id, statut, raison) => {
    try {
      const data = await tripService.updateStatus(id, statut, raison || null);
      await get().refresh();
      return data;
    } catch (err) {
      set({ error: err.message || 'Impossible de changer le statut du voyage.' });
      throw err;
    }
  },

  removeTrip: async (trip) => {
    try {
      const data = await tripService.remove(trip.id);
      await get().refresh();
      return data;
    } catch (err) {
      set({ error: err.message || 'Impossible de supprimer le voyage.' });
      throw err;
    }
  },
}));

export default useTripStore;
