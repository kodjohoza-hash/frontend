import { config } from './app';

export const env = {
  API_BASE_URL: config.apiBaseUrl,
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  APP_ENV: import.meta.env.VITE_APP_ENV,
};
