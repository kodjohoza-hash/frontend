import { ROLES } from '@utils/roles';
import { ROLE_PERMISSIONS } from '@utils/permissions';
import useAuthStore from '../store/auth.store';
import apiClient from './apiClient';
import { mockRegister, mockRegisterCompany } from '@mock/authService';

/**
 * BUS TIX CONNECT — Auth Service (API réelle)
 * Bascule du service mocké vers le backend Express (sous /api/v1).
 *
 * Contrat conservé : chaque méthode retourne `{ data }` (même forme que le mock),
 * donc le hook `useAuth` et les pages n'ont pas besoin d'être modifiés.
 *
 * Endpoints :
 *   POST /auth/login · POST /auth/logout · POST /auth/refresh-token
 *   POST /auth/forgot-password · POST /auth/reset-password
 *   POST /auth/verify-email · GET /auth/me · PATCH /auth/profile
 *   PATCH /auth/change-password
 *
 * L'inscription (client / compagnie) reste sur le mock en attendant
 * l'endpoint backend dédié (migration progressive).
 */

/* Correspondance espace d'authentification → rôle backend */
const ROLE_HINT_TO_ROLE = {
  client: ROLES.CLIENT,
  company: ROLES.COMPANY_ADMIN,
  counter: ROLES.COUNTER_AGENT,
  'super-admin': ROLES.SUPER_ADMIN,
};

/** Ajoute les permissions du rôle (le backend ne les stocke pas). */
const buildUser = (user) => ({ ...user, permissions: ROLE_PERMISSIONS[user.role] || [] });

const authService = {
  /**
   * Connexion : email + motDePasse (le champ `password` du frontend est
   * traduit en `motDePasse` pour l'API). Le `roleHint` isole les espaces.
   */
  login: async ({ email, password, roleHint }) => {
    const data = await apiClient.post('/auth/login', { email, motDePasse: password });

    const expectedRole = ROLE_HINT_TO_ROLE[roleHint];
    if (expectedRole && data.user?.role !== expectedRole) {
      const message =
        'Aucun compte trouvé pour cet espace. Vérifiez votre rôle et vos identifiants.';
      const err = new Error(message);
      err.status = 404;
      err.response = { data: { message }, status: 404 };
      throw err;
    }

    return { data: { ...data, user: buildUser(data.user) } };
  },

  /* Inscription client / compagnie — encore mockée (migration progressive). */
  register: (data) => mockRegister(data),
  registerCompany: (data) => mockRegisterCompany(data),

  /** Déconnexion sécurisée : révoque le refresh token côté serveur. */
  logout: async (variable) => {
    const refreshToken =
      variable?.refreshToken ?? useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      return { data: { message: 'Déconnexion réussie.' } };
    }
    const data = await apiClient.post('/auth/logout', { refreshToken });
    return { data };
  },

  /** Rafraîchit la session (rotation du refresh token). */
  refresh: async (refreshToken) => {
    const data = await apiClient.post('/auth/refresh-token', { refreshToken });
    return { data };
  },

  forgotPassword: async (email) => {
    const data = await apiClient.post('/auth/forgot-password', { email });
    return { data };
  },

  resetPassword: async ({ token, password }) => {
    const data = await apiClient.post('/auth/reset-password', { token, motDePasse: password });
    return { data };
  },

  verifyEmail: async ({ code, token }) => {
    const data = await apiClient.post('/auth/verify-email', { token: code || token });
    return { data };
  },

  resendVerification: async (email) => {
    const data = await apiClient.post('/auth/verify-email/resend', { email });
    return { data };
  },

  getProfile: async () => {
    const data = await apiClient.get('/auth/me');
    return { data: buildUser(data) };
  },

  updateProfile: async (profile) => {
    const data = await apiClient.patch('/auth/profile', {
      prenom: profile.firstName,
      nom: profile.lastName,
      telephone: profile.phone,
      langue: profile.langue,
    });
    return { data: buildUser(data) };
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const data = await apiClient.patch('/auth/change-password', {
      motDePasseActuel: currentPassword,
      nouveauMotDePasse: newPassword,
    });
    return { data };
  },
};

export default authService;
