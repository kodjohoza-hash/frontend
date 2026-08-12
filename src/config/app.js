/**
 * Résout la base URL de l'API (aucune IP en dur).
 *  - Si VITE_API_BASE_URL est explicitement défini, il gagne (déploiement/override).
 *  - Sinon on déduit le backend de l'hôte qui sert l'app :
 *      * accès local (localhost/127.0.0.1)  → http://localhost:5000/api/v1
 *      * accès réseau (IP LAN du PC)         → http://<IP>:5000/api/v1
 *  Ainsi le téléphone du réseau local atteint l'API sans recompiler.
 */
const resolveApiBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit;
  if (
    typeof window !== 'undefined' &&
    window.location?.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000/api/v1`;
  }
  return 'http://localhost:5000/api/v1';
};

export const config = {
  apiBaseUrl: resolveApiBaseUrl(),
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 15000,
  appName: import.meta.env.VITE_APP_NAME || 'Bus Tix Connect',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isDevelopment: import.meta.env.VITE_APP_ENV !== 'production',
};
