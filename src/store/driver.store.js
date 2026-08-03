import { create } from 'zustand';
import driverService, { mapStats } from '../services/driver.service';

/**
 * BUS TIX CONNECT — Driver Store (Zustand)
 * Données des pages « Chauffeurs » branchées sur l'API réelle.
 * - drivers : liste complète mappée pour les composants AgencyDriver*
 *             (filtres, tri et pagination restant côté composant).
 * - driver  : chauffeur courant du détail (avec performance + documents).
 * - stats   : KPIs dérivés des chauffeurs chargés (les chauffeurs supprimés/
 *             inactifs sont exclus de la liste, donc des KPIs affichés).
 * Les mutations (créer / modifier / supprimer / changer de statut /
 * incidents / documents / photo) appellent l'API puis rafraîchissent les données.
 */
const useDriverStore = create((set, get) => ({
  drivers: [],
  stats: { total: 0, disponible: 0, en_mission: 0, repos: 0, conge: 0, suspendu: 0, indisponible: 0, avgExperience: 0 },
  driver: null,
  loading: false,
  loadingDetail: false,
  error: null,

  fetchDrivers: async () => {
    set({ loading: true, error: null });
    try {
      const drivers = await driverService.getAll();
      set({ drivers, stats: mapStats(drivers), loading: false });
      return get().drivers;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les chauffeurs.' });
      throw err;
    }
  },

  /** Recalcule les KPIs depuis les chauffeurs déjà chargés. */
  fetchStats: () => {
    set({ stats: mapStats(get().drivers) });
    return get().stats;
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchDrivers, fetchStats } = get();
    await Promise.all([fetchDrivers(), fetchStats()]);
  },

  fetchDriver: async (id) => {
    set({ loadingDetail: true, error: null });
    try {
      const driver = await driverService.getById(id);
      set({ driver, loadingDetail: false });
      return get().driver;
    } catch (err) {
      set({ loadingDetail: false, error: err.message || 'Impossible de charger le chauffeur.' });
      throw err;
    }
  },

  createDriver: async (form) => {
    await driverService.create(form);
    await get().refresh();
  },

  updateDriver: async (id, form) => {
    const updated = await driverService.update(id, form);
    await get().refresh();
    set({ driver: updated });
  },

  updateStatus: async (id, statut, raison) => {
    await driverService.updateStatus(id, statut, raison || null);
    await get().refresh();
  },

  removeDriver: async (driver) => {
    await driverService.remove(driver.id);
    await get().refresh();
  },

  setTrip: async (id, departId) => {
    const result = await driverService.setTrip(id, departId);
    await get().fetchDriver(id);
    return result;
  },

  createIncident: async (id, data) => {
    const result = await driverService.createIncident(id, data);
    await get().fetchDriver(id);
    return result;
  },

  updateIncident: async (incidentId, data) => {
    const result = await driverService.updateIncident(incidentId, data);
    const { driver } = get();
    if (driver) await get().fetchDriver(driver.id);
    return result;
  },

  deleteIncident: async (incidentId) => {
    const result = await driverService.deleteIncident(incidentId);
    const { driver } = get();
    if (driver) await get().fetchDriver(driver.id);
    return result;
  },

  uploadDocument: async (id, file, type, notes) => {
    const result = await driverService.uploadDocument(id, file, type, notes);
    await get().fetchDriver(id);
    return result;
  },

  deleteDocument: async (documentId) => {
    const result = await driverService.deleteDocument(documentId);
    const { driver } = get();
    if (driver) await get().fetchDriver(driver.id);
    return result;
  },

  uploadPhoto: async (id, file) => {
    const result = await driverService.uploadPhoto(id, file);
    await get().fetchDriver(id);
    return result;
  },

  deletePhoto: async (id) => {
    const result = await driverService.deletePhoto(id);
    await get().fetchDriver(id);
    return result;
  },
}));

export default useDriverStore;
