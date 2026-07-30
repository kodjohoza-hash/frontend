export const settingsSections = [
  { id: 'account', label: 'Mon compte', icon: 'bi-person-circle' },
  { id: 'security', label: 'Sécurité', icon: 'bi-shield-check' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
  { id: 'appearance', label: 'Apparence', icon: 'bi-palette' },
  { id: 'language', label: 'Langue et Région', icon: 'bi-globe2' },
  { id: 'work', label: 'Préférences de travail', icon: 'bi-briefcase' },
  { id: 'privacy', label: 'Confidentialité', icon: 'bi-shield-lock' },
  { id: 'sessions', label: 'Sessions', icon: 'bi-laptop' },
  { id: 'about', label: 'À propos', icon: 'bi-info-circle' },
];

export const accountSettings = {
  photo: null,
  initials: 'MN',
  firstName: 'Marie',
  lastName: 'Ngo',
  phone: '+237 691 234 567',
  email: 'marie.ngo@bustixconnect.cm',
  address: '123 Rue de l\'Indépendance, Bonanjo',
  city: 'Douala',
  country: 'Cameroun',
  language: 'Français',
  timezone: 'Africa/Douala',
};

export const securitySettings = {
  twoFactorEnabled: false,
  securityQuestion: null,
  passwordLastChanged: '2026-06-15',
  changeHistory: [
    { date: '2026-06-15T10:30:00', action: 'Mot de passe modifié', ip: '192.168.1.42' },
    { date: '2026-04-02T08:15:00', action: 'Mot de passe modifié', ip: '192.168.1.42' },
    { date: '2026-01-20T14:45:00', action: 'Mot de passe modifié', ip: '192.168.1.48' },
    { date: '2025-11-05T09:00:00', action: 'Mot de passe réinitialisé', ip: '192.168.1.42' },
    { date: '2025-08-18T11:30:00', action: 'Mot de passe modifié', ip: '192.168.1.50' },
  ],
  passwordRequirements: {
    minLength: 8,
    requireSpecial: true,
    requireNumber: true,
    requireUpper: true,
  },
};

export const notificationSettings = {
  bookings: true,
  payments: true,
  messages: true,
  alerts: true,
  departures: true,
  maintenance: false,
  support: true,
  pushEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
};

export const appearanceSettings = {
  theme: 'light',
  accentColor: '#FF6B35',
  fontSize: 'medium',
  density: 'comfortable',
  animations: true,
};

export const languageSettings = {
  language: 'Français',
  currency: 'XAF (FCFA)',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  timezone: 'Africa/Douala',
  country: 'Cameroun',
};

export const workPreferences = {
  favoriteBranch: 'Douala Central',
  defaultPrinter: null,
  resultsPerPage: 12,
  autoOpenScanner: true,
  autoPrintReceipt: false,
  confirmBeforeDelete: true,
};

export const privacySettings = {
  profileVisibility: 'internal',
  shareInfo: true,
  consentGiven: true,
  dataDownloadRequested: null,
  accountDeletionRequested: null,
};

export const sessions = [
  {
    id: 'sess_cs_001',
    device: 'HP ProBook 450 G10',
    browser: 'Chrome 130',
    ip: '192.168.1.42',
    location: 'Douala Central, Cameroun',
    lastActive: '2026-07-30T08:15:00',
    isCurrent: true,
  },
  {
    id: 'sess_cs_002',
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile 18',
    ip: '196.216.45.123',
    location: 'Douala, Cameroun',
    lastActive: '2026-07-29T22:30:00',
    isCurrent: false,
  },
  {
    id: 'sess_cs_003',
    device: 'MacBook Air M3',
    browser: 'Firefox 129',
    ip: '41.89.22.78',
    location: 'Yaoundé, Cameroun',
    lastActive: '2026-07-28T19:45:00',
    isCurrent: false,
  },
  {
    id: 'sess_cs_004',
    device: 'Samsung Galaxy Tab S9',
    browser: 'Chrome Mobile 130',
    ip: '196.216.78.34',
    location: 'Douala, Cameroun',
    lastActive: '2026-07-27T14:20:00',
    isCurrent: false,
  },
  {
    id: 'sess_cs_005',
    device: 'Dell Latitude 5540',
    browser: 'Edge 130',
    ip: '192.168.1.50',
    location: 'Douala Central, Cameroun',
    lastActive: '2026-07-26T17:10:00',
    isCurrent: false,
  },
];

export const aboutInfo = {
  appName: 'BUS TIX CONNECT',
  version: '2.4.1',
  frontendVersion: '1.0.0',
  apiVersion: 'v2.4.1',
  license: 'Commercial',
  supportEmail: 'support@bustixconnect.cm',
  supportPhone: '+237 233 456 789',
};

export function saveSettings(settings, section, values) {
  return {
    ...settings,
    [section]: {
      ...settings[section],
      ...values,
    },
  };
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
