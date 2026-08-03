import { create } from 'zustand';
import routeService from '../services/route.service';

/**
 * BUS TIX CONNECT — Route Store (Zustand)
 * Données des pages « Itinéraires » branchées sur l'API réelle.
 * - routes  : liste complète mappée pour les composants AgencyRoute*
 * - stats   : KPIs (total, actifs, distance, villes desservies)
 * - route   : itinéraire courant du détail (avec escales + villes)
 * - stops   : escales du détail (gérées indépendamment)
 * - villes  : villes desservies (gestion des villes)
 * - calculs : résultats de calcul (durées, heure d'arrivée)
 * Les mutations (créer / modifier / archiver / escales / villes)
 * appellent l'API puis rafraîchissent les données.
 */
const useRouteStore = create((set, get) => ({
  routes: [],
  stats: { total: 0, actifs: 0, inactifs: 0, archives: 0, totalDistanceKm: 0, villesDesservies: 0 },
  route: null,
  stops: [],
  villes: [],
  calculs: null,
  loading: false,
  loadingDetail: false,
  error: null,

  fetchRoutes: async () => {
    set({ loading: true, error: null });
    try {
      const routes = await routeService.getAll();
      set({ routes, loading: false });
      return get().routes;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les itinéraires.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await routeService.getStats();
      set({ stats });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge la liste + les KPIs en parallèle. */
  refresh: async () => {
    await Promise.all([get().fetchRoutes(), get().fetchStats()]);
  },

  fetchRoute: async (id) => {
    set({ loadingDetail: true, error: null });
    try {
      const [route, calculs] = await Promise.all([
        routeService.getById(id),
        routeService.getCalculs(id),
      ]);
      set({ route, stops: route.stops || [], calculs, loadingDetail: false });
      return get().route;
    } catch (err) {
      set({ loadingDetail: false, error: err.message || 'Impossible de charger l\'itinéraire.' });
      throw err;
    }
  },

  createRoute: async (form) => {
    await routeService.create(form);
    await get().refresh();
  },

  updateRoute: async (id, form) => {
    const updated = await routeService.update(id, form);
    await get().refresh();
    set({ route: updated });
  },

  updateStatus: async (id, statut, raison) => {
    await routeService.updateStatus(id, statut, raison || null);
    await get().refresh();
  },

  removeRoute: async (route) => {
    await routeService.remove(route.id);
    await get().refresh();
  },

  /* ── Villes ──────────────────────────────────────────────────── */
  fetchVilles: async () => {
    set({ error: null });
    try {
      const villes = await routeService.listVilles();
      set({ villes });
      return get().villes;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les villes.' });
      throw err;
    }
  },

  createVille: async (form) => {
    await routeService.createVille(form);
    await get().fetchVilles();
  },

  updateVille: async (villeId, form) => {
    await routeService.updateVille(villeId, form);
    await get().fetchVilles();
  },

  removeVille: async (villeId) => {
    await routeService.removeVille(villeId);
    await get().fetchVilles();
  },

  /* ── Escales ─────────────────────────────────────────────────── */
  addStop: async (routeId, form) => {
    const stops = await routeService.addStop(routeId, form);
    set({ stops });
    await get().fetchRoute(routeId);
  },

  updateStop: async (routeId, stopId, form) => {
    await routeService.updateStop(routeId, stopId, form);
    await get().fetchRoute(routeId);
  },

  removeStop: async (routeId, stopId) => {
    await routeService.removeStop(routeId, stopId);
    await get().fetchRoute(routeId);
  },

  /* ── Calculs ─────────────────────────────────────────────────── */
  fetchCalculs: async (id, heureDepart = '') => {
    const calculs = await routeService.getCalculs(id, heureDepart);
    set({ calculs });
    return calculs;
  },
}));

export default useRouteStore;
