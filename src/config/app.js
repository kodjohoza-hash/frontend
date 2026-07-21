export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 15000,
  appName: import.meta.env.VITE_APP_NAME || 'Bus Tix Connect',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isDevelopment: import.meta.env.VITE_APP_ENV !== 'production',
};
