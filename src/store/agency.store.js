import { create } from 'zustand';
import agencyService, { mapStats } from '../services/agency.service';

/**
 * BUS TIX CONNECT — Agencies Store (Zustand)
 * Données de la page « Points de vente » branchées sur l'API réelle.
 * - branches : liste complète mappée pour les composants AgencyBranch*
 *               (filtres, tri et pagination restant côté composant).
 * - stats    : KPIs construits depuis GET /agencies/stats.
 * Les mutations (créer / modifier / supprimer / suspendre / réactiver)
 * appellent l'API puis rafraîchissent la liste + les KPIs.
 */
const useAgencyStore = create((set, get) => ({
  branches: [],
  stats: [],
  villes: [],
  loading: false,
  error: null,

  fetchBranches: async () => {
    set({ loading: true, error: null });
    try {
      const branches = await agencyService.getAll();
      set({ branches, loading: false });
      return get().branches;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les points de vente.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const raw = await agencyService.getStats();
      set({ stats: mapStats(raw) });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  fetchVilles: async () => {
    try {
      const villes = await agencyService.getVilles();
      set({ villes });
      return get().villes;
    } catch {
      /* Les villes ne sont pas bloquantes pour l'affichage. */
    }
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchBranches, fetchStats } = get();
    await Promise.all([fetchBranches(), fetchStats()]);
  },

  createBranch: async (branch) => {
    await agencyService.create(branch);
    await get().refresh();
  },

  updateBranch: async (id, branch) => {
    await agencyService.update(id, branch);
    await get().refresh();
  },

  updateStatus: async (branch, statut, raison) => {
    await agencyService.updateStatus(branch.id, statut, raison || null);
    await get().refresh();
  },

  suspend: async (branch) => {
    await get().updateStatus(branch, 'suspendu', 'Suspendu par un administrateur');
  },

  reactivate: async (branch) => {
    await get().updateStatus(branch, 'actif', 'Réactivé par un administrateur');
  },

  deactivate: async (branch) => {
    await get().updateStatus(branch, 'inactif', 'Désactivé par un administrateur');
  },

  removeBranch: async (branch) => {
    await agencyService.remove(branch.id);
    await get().refresh();
  },
}));

export default useAgencyStore;
