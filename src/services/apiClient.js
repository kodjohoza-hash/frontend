import axios from 'axios';
import useAuthStore from '../store/auth.store';

/**
 * BUS TIX CONNECT — API Client (axios)
 * Base URL par défaut : http://localhost:5000/api/v1 (backend Express).
 * Le token JWT est injecté depuis le store auth à chaque requête.
 * Les réponses { success, data, message } sont dépaquetées : on résout `data`.
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

apiClient.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    const message = error.response?.data?.error
      || error.response?.data?.message
      || error.message
      || 'Erreur réseau';
    const status = error.response?.status;
    if (status === 401) useAuthStore.getState().clearSession();
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
