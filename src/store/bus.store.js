import { create } from 'zustand';
import busService, { mapStats } from '../services/bus.service';

/**
 * BUS TIX CONNECT — Bus Store (Zustand)
 * Données des pages « Flotte de bus » branchées sur l'API réelle.
 * - buses   : liste complète mappée pour les composants AgencyBus*
 *             (filtres, tri et pagination restant côté composant).
 * - bus     : bus courant du détail.
 * - maintenances : historique du bus courant.
 * - stats   : KPIs dérivés des bus chargés (les bus supprimés/inactifs
 *             sont exclus de la liste, donc des KPIs affichés).
 * Les mutations (créer / modifier / supprimer / changer de statut /
 * maintenances / photos) appellent l'API puis rafraîchissent les données.
 */
const useBusStore = create((set, get) => ({
  buses: [],
  stats: { total: 0, disponible: 0, en_voyage: 0, maintenance: 0, hors_service: 0, reserve: 0, avgOccupancy: 0 },
  bus: null,
  maintenances: [],
  loading: false,
  loadingDetail: false,
  error: null,

  fetchBuses: async () => {
    set({ loading: true, error: null });
    try {
      const buses = await busService.getAll();
      set({ buses, stats: mapStats(buses), loading: false });
      return get().buses;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger la flotte de bus.' });
      throw err;
    }
  },

  /** Recalcule les KPIs depuis les bus déjà chargés. */
  fetchStats: () => {
    set({ stats: mapStats(get().buses) });
    return get().stats;
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchBuses, fetchStats } = get();
    await Promise.all([fetchBuses(), fetchStats()]);
  },

  fetchBus: async (id) => {
    set({ loadingDetail: true, error: null });
    try {
      const bus = await busService.getById(id);
      set({ bus, loadingDetail: false });
      return get().bus;
    } catch (err) {
      set({ loadingDetail: false, error: err.message || 'Impossible de charger le bus.' });
      throw err;
    }
  },

  createBus: async (form) => {
    await busService.create(form);
    await get().refresh();
  },

  updateBus: async (id, form) => {
    const updated = await busService.update(id, form);
    await get().refresh();
    set({ bus: updated });
  },

  updateStatus: async (id, statut, raison) => {
    await busService.updateStatus(id, statut, raison || null);
    await get().refresh();
  },

  deleteBus: async (bus) => {
    await busService.remove(bus.id);
    await get().refresh();
  },

  fetchMaintenances: async (id) => {
    try {
      const maintenances = await busService.listMaintenances(id);
      set({ maintenances });
      return get().maintenances;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger l\'historique de maintenance.' });
      throw err;
    }
  },

  createMaintenance: async (id, data) => {
    await busService.createMaintenance(id, data);
    await get().fetchMaintenances(id);
    await get().refresh();
  },

  updateMaintenance: async (maintenanceId, data) => {
    await busService.updateMaintenance(maintenanceId, data);
    const { bus } = get();
    if (bus) await get().fetchMaintenances(bus.id);
    await get().refresh();
  },

  deleteMaintenance: async (maintenanceId) => {
    await busService.deleteMaintenance(maintenanceId);
    const { bus } = get();
    if (bus) await get().fetchMaintenances(bus.id);
    await get().refresh();
  },

  uploadPhoto: async (id, file) => {
    await busService.uploadPhoto(id, file);
    await get().refresh();
  },

  deletePhoto: async (id, imageId) => {
    await busService.deletePhoto(id, imageId);
    await get().refresh();
  },
}));

export default useBusStore;
