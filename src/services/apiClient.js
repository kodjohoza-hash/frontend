import axios from 'axios';
import useAuthStore from '../store/auth.store';

/**
 * BUS TIX CONNECT — API Client (axios)
 * Base URL par défaut : http://localhost:5000/api/v1 (backend Express).
 * - Le token JWT est injecté depuis le store auth à chaque requête.
 * - Les réponses { success, data, message } sont dépaquetées : on résout `data`.
 * - En cas de 401, un refresh automatique est tenté (rotation du refresh token),
 *   puis la requête d'origine est rejouée une seule fois.
 * - Les erreurs sont rejetées avec la forme { message, status, response } pour
 *   rester compatible avec les interfaces existantes.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Normalise une erreur axios en Error avec les métadonnées attendues par l'UI. */
const normalizeError = (error) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    'Erreur réseau';
  const err = new Error(message);
  err.status = status;
  err.response = { data: { message }, status };
  return err;
};

apiClient.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || '';

    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/refresh-token');

    /* 401 → tentative de refresh automatique (une seule fois par requête) */
    if (status === 401 && original && !original._retry && !isAuthCall) {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        original._retry = true;
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken }, {
            headers: { 'Content-Type': 'application/json' },
          });
          const data = res.data?.data ?? res.data;
          useAuthStore.getState().refreshSession({
            token: data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
          });
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.token}`;
          return apiClient(original);
        } catch (refreshError) {
          useAuthStore.getState().clearSession();
          return Promise.reject(normalizeError(refreshError));
        }
      }
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(normalizeError(error));
  }
);

export default apiClient;
