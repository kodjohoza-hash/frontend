/**
 * BUS TIX CONNECT — Settings Mock Data
 * All settings defaults, session data, seat options
 */

export const defaultSettings = {
  general: {
    language: 'fr',
    currency: 'XAF',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Africa/Douala',
  },
  notifications: {
    booking: true,
    payments: true,
    promotions: false,
    newRoutes: true,
    sms: true,
    email: true,
    push: true,
  },
  privacy: {
    profileVisible: true,
    dataSharing: false,
    browsingHistory: true,
    cookies: true,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2026-04-15T10:00:00',
  },
  appearance: {
    theme: 'light',
  },
  travel: {
    seatPreference: 'window',
    airConditioning: true,
    luggage: 'medium',
    favoriteCompanies: [],
  },
};

export const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export const currencyOptions = [
  { value: 'XAF', label: 'FCFA (XAF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

export const timezoneOptions = [
  { value: 'Africa/Douala', label: 'Douala (GMT+1)' },
  { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)' },
];

export const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
  { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
  { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' },
];

export const seatOptions = [
  { value: 'any', label: 'Pas de préférence' },
  { value: 'window', label: 'Côté fenêtre' },
  { value: 'aisle', label: 'Couloir' },
  { value: 'front', label: 'Avant' },
  { value: 'back', label: 'Arrière' },
];

export const luggageOptions = [
  { value: 'none', label: 'Aucun bagage' },
  { value: 'small', label: 'Petit (sac à dos)' },
  { value: 'medium', label: 'Moyen (valise cabine)' },
  { value: 'large', label: 'Grand (valise grande)' },
];

export const activeSessions = [
  {
    id: 'sess_001',
    device: 'PC Windows 11',
    browser: 'Chrome 126',
    ip: '196.216.XXX.XXX',
    location: 'Douala, Cameroun',
    lastActive: '2026-07-23T08:15:00',
    current: true,
  },
  {
    id: 'sess_002',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    ip: '196.216.XXX.XXX',
    location: 'Douala, Cameroun',
    lastActive: '2026-07-22T18:30:00',
    current: false,
  },
  {
    id: 'sess_003',
    device: 'MacBook Air',
    browser: 'Firefox 128',
    ip: '41.89.XXX.XXX',
    location: 'Yaoundé, Cameroun',
    lastActive: '2026-07-20T14:45:00',
    current: false,
  },
];

export const tabs = [
  { id: 'general', label: 'Général', icon: 'bi-gear' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
  { id: 'privacy', label: 'Confidentialité', icon: 'bi-shield-lock' },
  { id: 'security', label: 'Sécurité', icon: 'bi-key' },
  { id: 'appearance', label: 'Apparence', icon: 'bi-palette' },
  { id: 'language', label: 'Langue & Région', icon: 'bi-translate' },
  { id: 'travel', label: 'Préférences de voyage', icon: 'bi-bus-front' },
  { id: 'sessions', label: 'Sessions actives', icon: 'bi-laptop' },
];
