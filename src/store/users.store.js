import { create } from 'zustand';
import usersService, { mapStats } from '../services/users.service';

/**
 * BUS TIX CONNECT — Users Store (Zustand)
 * Données de la page « Gestion des utilisateurs » branchées sur l'API réelle.
 * - users  : liste complète mappée pour les composants Admin* (filtres,
 *            tri et pagination restant côté composant).
 * - stats  : KPIs construits depuis GET /users/stats.
 * Les mutations (suspendre / réactiver / supprimer / mot de passe) appellent
 * l'API puis rafraîchissent la liste + les KPIs.
 */
const useUsersStore = create((set, get) => ({
  users: [],
  stats: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await usersService.getAll();
      set({ users, loading: false });
      return users;
    } catch (err) {
      set({ loading: false, error: err.message || 'Impossible de charger les utilisateurs.' });
      throw err;
    }
  },

  fetchStats: async () => {
    try {
      const raw = await usersService.getStats();
      set({ stats: mapStats(raw) });
      return get().stats;
    } catch (err) {
      set({ error: err.message || 'Impossible de charger les statistiques.' });
      throw err;
    }
  },

  /** Charge la liste + les KPIs. */
  refresh: async () => {
    const { fetchUsers, fetchStats } = get();
    await Promise.all([fetchUsers(), fetchStats()]);
  },

  suspend: async (user, raison) => {
    await usersService.updateStatus(user.id, 'suspendu', raison || 'Suspendu par un administrateur');
    await get().refresh();
  },

  reactivate: async (user) => {
    await usersService.updateStatus(user.id, 'actif');
    await get().refresh();
  },

  removeUser: async (user) => {
    await usersService.remove(user.id);
    await get().refresh();
  },

  /** Réinitialise le mot de passe d'un utilisateur → retourne le mot de passe temporaire. */
  resetPassword: async (user) => {
    const temp = usersService.generateTempPassword();
    await usersService.update(user.id, { motDePasse: temp });
    return temp;
  },
}));

export default useUsersStore;
