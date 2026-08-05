const path = require('path');
const dotenv = require('dotenv');

/**
 * Chargement des variables d'environnement :
 *  - `.env`        → base commune (défauts, valeurs non sensibles)
 *  - `.env.local`  → surcharge locale (chargée en premier : elle gagne)
 *                     utilisée pour le dev local (crédentials DB, etc.)
 */
dotenv.config({
  path: [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
  ],
});

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'bus_tix_connect',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    sync: process.env.DB_SYNC === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'changez_moi_en_dev',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'changez_moi_en_dev',
    accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  auth: {
    maxLoginAttempts: Number(process.env.AUTH_MAX_ATTEMPTS) || 5,
    lockoutMinutes: Number(process.env.AUTH_LOCKOUT_MINUTES) || 15,
    resetTokenExpiresIn: process.env.RESET_TOKEN_EXPIRES_IN || '1h',
    verifyTokenExpiresIn: process.env.VERIFY_TOKEN_EXPIRES_IN || '24h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  app: {
    url: process.env.APP_URL || 'http://localhost:5000',
    uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
    uploadMaxSizeMb: Number(process.env.UPLOAD_MAX_SIZE_MB) || 10,
    allowedOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'no-reply@bustixconnect.com',
  },

  cron: {
    enabled: process.env.CRON_ENABLED === 'true',
    subscriptionSchedule: process.env.CRON_SUBSCRIPTION_SCHEDULE || '0 2 * * *', // chaque jour à 02:00
    bookingsSchedule: process.env.CRON_BOOKINGS_SCHEDULE || '*/5 * * * *', // toutes les 5 minutes
  },

  seed: {
    superAdminEmail: process.env.SEED_SUPER_ADMIN_EMAIL || 'admin@bustixconnect.com',
    superAdminPassword: process.env.SEED_SUPER_ADMIN_PASSWORD || 'Admin@2026',
  },

  ticket: {
    /* Expiration configurable des QR codes :
       - null            → expiration basée sur `validite_jusqua` (départ du voyage).
       - nombre d'heures → un QR devient invalide N heures après l'émission. */
    qrExpiryHours: process.env.TICKET_QR_EXPIRY_HOURS ? Number(process.env.TICKET_QR_EXPIRY_HOURS) : null,
    /* Taille de l'image QR (pixels) générée par GET /tickets/:id/qrcode. */
    qrWidth: Number(process.env.TICKET_QR_WIDTH) || 480,
  },
};

module.exports = env;
