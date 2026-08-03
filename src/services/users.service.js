import apiClient from './apiClient';
import { userRoles, userStatuses } from '../data/adminUserData';

/**
 * BUS TIX CONNECT — Users Service (API réelle)
 * Endpoints backend :
 *   GET    /users                  (liste paginée + filtres)
 *   GET    /users/:id              (détail)
 *   POST   /users                  (création agent + compte)
 *   PATCH  /users/:id              (mise à jour)
 *   DELETE /users/:id              (suppression douce)
 *   PATCH  /users/status           (suspendre / réactiver / bannir…)
 *   GET    /users/stats            (KPIs par rôle / statut)
 *   GET/PATCH /users/profile       (profil de l'utilisateur courant)
 *   PATCH/DELETE /users/profile/photo
 *   PATCH  /users/password         (mot de passe, soi-même)
 *
 * Les statuts API (actif/inactif/suspendu/banni/supprime) sont traduits
 * vers les codes UI existants (active/pending/suspended/blocked/deleted)
 * pour conserver les composants Admin* inchangés.
 */

/* ── Traduction statuts ─────────────────────────────────────────── */
export const STATUS_TO_UI = {
  actif: 'active',
  inactif: 'pending',
  suspendu: 'suspended',
  banni: 'blocked',
  supprime: 'deleted',
};

export const UI_TO_STATUS = {
  active: 'actif',
  pending: 'inactif',
  suspended: 'suspendu',
  blocked: 'banni',
  deleted: 'supprime',
};

/* ── Helpers ────────────────────────────────────────────────────── */
const initials = (firstName, lastName) =>
  `${(firstName || '?').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();

/** Met en forme un utilisateur API → structure attendue par les composants Admin*. */
export const mapUser = (u) => ({
  id: u.id,
  matricule: u.matricule,
  firstName: u.firstName || '',
  lastName: u.lastName || '',
  email: u.email || '',
  phone: u.phone || '',
  avatar: u.photo || null,
  initials: initials(u.firstName, u.lastName),
  role: u.role,
  company: u.companyName || '',
  branch: u.agenceName || '',
  address: u.adresse || '',
  city: '',
  country: '',
  dob: u.dateNaissance || null,
  gender: u.genre || 'M',
  language: u.langue || 'fr',
  timezone: 'Africa/Douala',
  status: STATUS_TO_UI[u.statut] || u.statut,
  createdAt: u.dateCreation || null,
  lastLogin: u.derniereConnexion || null,
  bookings: 0,
  tickets: 0,
  payments: 0,
  compagnieId: u.compagnieId ?? null,
  agenceId: u.agenceId ?? null,
  guichetId: u.guichetId ?? null,
  guichetName: u.guichetName ?? null,
  emailVerified: Boolean(u.emailVerified),
});

/** Construit les KPIs de la page à partir de la réponse /users/stats. */
export const mapStats = (s) => {
  const role = s.parRole || {};
  const statut = s.parStatut || {};
  const total = s.total || 0;
  return [
    { id: 'total', label: 'Total utilisateurs', value: total, icon: 'bi-people', color: 'primary', trend: 0, trendUp: true },
    { id: 'clients', label: 'Clients', value: role.client || 0, icon: 'bi-person', color: 'info', trend: 0, trendUp: true },
    { id: 'company_admins', label: 'Administrateurs', value: role.company_admin || 0, icon: 'bi-building-gear', color: 'primary', trend: 0, trendUp: true },
    { id: 'counter_agents', label: 'Agents de guichet', value: role.counter_agent || 0, icon: 'bi-shop', color: 'warning', trend: 0, trendUp: true },
    { id: 'super_admins', label: 'Super Admins', value: role.super_admin || 0, icon: 'bi-shield-lock', color: 'accent', trend: 0, trendUp: false },
    { id: 'active', label: 'Actifs', value: statut.actif || 0, icon: 'bi-check-circle', color: 'success', trend: 0, trendUp: true },
    { id: 'suspended', label: 'Suspendus', value: statut.suspendu || 0, icon: 'bi-pause-circle', color: 'danger', trend: 0, trendUp: false },
    { id: 'pending', label: 'En attente', value: statut.inactif || 0, icon: 'bi-hourglass-split', color: 'warning', trend: 0, trendUp: true },
    { id: 'blocked', label: 'Bannis', value: statut.banni || 0, icon: 'bi-shield-exclamation', color: 'danger', trend: 0, trendUp: false },
    { id: 'deleted', label: 'Supprimés', value: statut.supprime || 0, icon: 'bi-person-slash', color: 'danger', trend: 0, trendUp: false },
  ];
};

/** Options des filtres avancés, dérivées des utilisateurs réels. */
export const buildFilterOptions = (users) => ({
  roles: userRoles.map((r) => ({ value: r.id, label: r.label })),
  statuses: userStatuses
    .filter((s) => s.value !== 'all')
    .map((s) => ({ value: s.value, label: s.label })),
  cities: [...new Set(users.map((u) => u.city).filter(Boolean))],
  countries: [...new Set(users.map((u) => u.country).filter(Boolean))],
  companies: [...new Set(users.map((u) => u.company).filter(Boolean))],
  branches: [...new Set(users.map((u) => u.branch).filter(Boolean))],
});

/** Mot de passe temporaire (≥ 8 caractères, conforme à la validation backend). */
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 8; i += 1) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return `Btx-${out}`;
};

/* ── Méthodes API ───────────────────────────────────────────────── */
const usersService = {
  /** Liste paginée brute (non mappée). */
  list: async (params = {}) => {
    const data = await apiClient.get('/users', { params });
    return data;
  },

  /** Tous les utilisateurs (pages cumulées) mappés pour l'UI. */
  getAll: async (params = {}) => {
    const first = await usersService.list({ ...params, page: 1, limit: 100 });
    let items = [...first.items];
    let page = 2;
    while (page <= first.totalPages && items.length < first.total) {
      const next = await usersService.list({ ...params, page, limit: 100 });
      items = items.concat(next.items);
      page += 1;
    }
    return items.map(mapUser);
  },

  getById: async (id) => {
    const data = await apiClient.get(`/users/${id}`);
    return mapUser(data);
  },

  create: async (user) => {
    const payload = {
      prenom: user.firstName,
      nom: user.lastName,
      email: user.email,
      telephone: user.phone,
      role: user.role,
      genre: user.gender || null,
      date_naissance: user.dob || null,
      adresse: user.address || null,
      langue: user.language || null,
      nationalite: user.nationalite || null,
      agence_id: user.agenceId,
      motDePasse: user.password,
    };
    const data = await apiClient.post('/users', payload);
    return mapUser(data);
  },

  update: async (id, user) => {
    const data = await apiClient.patch(`/users/${id}`, user);
    return mapUser(data);
  },

  remove: async (id) => {
    const data = await apiClient.delete(`/users/${id}`);
    return data;
  },

  /** Changement de statut (statut API : actif/inactif/suspendu/banni/supprime). */
  updateStatus: async (id, statut, raison) => {
    const data = await apiClient.patch('/users/status', { id, statut, raison: raison || null });
    return data;
  },

  getStats: async () => {
    const data = await apiClient.get('/users/stats');
    return data;
  },

  getProfile: async () => {
    const data = await apiClient.get('/users/profile');
    return mapUser(data);
  },

  updateProfile: async (profile) => {
    const data = await apiClient.patch('/users/profile', profile);
    return mapUser(data);
  },

  changePassword: async ({ motDePasseActuel, nouveauMotDePasse }) => {
    const data = await apiClient.patch('/users/password', { motDePasseActuel, nouveauMotDePasse });
    return data;
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const data = await apiClient.patch('/users/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  removePhoto: async () => {
    const data = await apiClient.delete('/users/profile/photo');
    return data;
  },
};

export default usersService;
