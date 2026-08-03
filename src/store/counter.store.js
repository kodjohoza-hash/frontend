import { create } from 'zustand';
import counterService, { mapStats } from '../services/counter.service';

/**
 * BUS TIX CONNECT — Counters Store (Zustand)
 * Données de la page « Guichets » branchées sur l'API réelle.
 * - counters : liste complète mappée pour l'UI (filtres, tri et
 *               pagination restant côté composant).
 * - stats    : KPIs construits depuis GET /guichets/stats.
 * Les mutations (créer / modifier / supprimer / changer de statut /
 * affecter / retirer des agents) appellent l'API puis rafraîchissent.
 */
const useCounterStore = create((set, get) => ({
  counters: [],
  stats: [],
  loading: false,
  error: null,

  fetchCounters: async () => {
    set({ loading: true, error: null });
    try {
      const counters = await counterService.getAll();
      set({ counters, loading: false });
      return get().counters;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les guichets.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const raw = await counterService.getStats();
      set({ stats: mapStats(raw) });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchCounters, fetchStats } = get();
    await Promise.all([fetchCounters(), fetchStats()]);
  },

  createCounter: async (counter) => {
    await counterService.create(counter);
    await get().refresh();
  },

  updateCounter: async (id, counter) => {
    await counterService.update(id, counter);
    await get().refresh();
  },

  updateStatus: async (counter, statut, raison) => {
    await counterService.updateStatus(counter.id, statut, raison || null);
    await get().refresh();
  },

  open: async (counter) => {
    await get().updateStatus(counter, 'ouvert', 'Ouvert par un administrateur');
  },

  close: async (counter) => {
    await get().updateStatus(counter, 'ferme', 'Fermé par un administrateur');
  },

  maintain: async (counter) => {
    await get().updateStatus(counter, 'maintenance', 'Mis en maintenance par un administrateur');
  },

  removeCounter: async (counter) => {
    await counterService.remove(counter.id);
    await get().refresh();
  },

  assignAgents: async (counter, agentIds) => {
    await counterService.assignAgents(counter.id, agentIds);
    await get().refresh();
  },

  unassignAgents: async (counter, agentIds) => {
    await counterService.removeAgents(counter.id, agentIds);
    await get().refresh();
  },
}));

export default useCounterStore;
