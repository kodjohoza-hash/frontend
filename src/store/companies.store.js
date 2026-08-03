import { create } from 'zustand';
import companiesService, { mapStats } from '../services/companies.service';
import usersService from '../services/users.service';

/**
 * BUS TIX CONNECT — Companies Store (Zustand)
 * Données de la page « Gestion des compagnies » branchées sur l'API réelle.
 * - companies : liste complète mappée pour les composants Admin* (filtres,
 *               tri et pagination restant côté composant). Le responsable
 *               affiché est dérivé du premier admin de compagnie réel.
 * - stats     : KPIs construits depuis GET /companies/stats.
 * Les mutations (valider / suspendre / réactiver / refuser / supprimer)
 * appellent l'API puis rafraîchissent la liste + les KPIs.
 */
const useCompaniesStore = create((set, get) => ({
  companies: [],
  stats: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const companies = await companiesService.getAll();
      let managers = {};
      try {
        const users = await usersService.getAll();
        managers = users.reduce((acc, u) => {
          if (u.role === 'company_admin' && u.compagnieId && !acc[u.compagnieId]) {
            acc[u.compagnieId] = `${u.firstName} ${u.lastName}`.trim();
          }
          return acc;
        }, {});
      } catch {
        /* Le responsable n'est pas bloquant : liste affichée sans lui. */
      }
      set({
        companies: companies.map((c) => ({ ...c, manager: managers[c.id] || c.manager || '' })),
        loading: false,
      });
      return get().companies;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les compagnies.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const raw = await companiesService.getStats();
      set({ stats: mapStats(raw) });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchCompanies, fetchStats } = get();
    await Promise.all([fetchCompanies(), fetchStats()]);
  },

  updateStatus: async (company, statut, raison) => {
    await companiesService.updateStatus(company.id, statut, raison || null);
    await get().refresh();
  },

  validate: async (company) => {
    await get().updateStatus(company, 'actif', 'Compagnie validée par un administrateur');
  },

  suspend: async (company) => {
    await get().updateStatus(company, 'suspendu', 'Suspendue par un administrateur');
  },

  reactivate: async (company) => {
    await get().updateStatus(company, 'actif', 'Réactivée par un administrateur');
  },

  refuse: async (company) => {
    await get().updateStatus(company, 'banni', 'Demande refusée par un administrateur');
  },

  removeCompany: async (company) => {
    await companiesService.remove(company.id);
    await get().refresh();
  },
}));

export default useCompaniesStore;
