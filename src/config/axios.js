import axios from 'axios';
import { config } from '@config/app';

/**
 * BUS TIX CONNECT — Axios Instance
 * Configured with auth interceptors and error handling
 */
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor — attach Bearer token
 */
api.interceptors.request.use(
  (requestConfig) => {
    try {
      const raw = localStorage.getItem('btc-auth');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      /* ignore parse errors */
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — handle 401/403
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('btc-auth');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/session-expired') {
        window.location.href = '/session-expired';
      }
    }

    if (status === 403) {
      if (window.location.pathname !== '/403') {
        window.location.href = '/403';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
