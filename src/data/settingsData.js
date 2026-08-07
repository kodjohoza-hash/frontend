export const companySettings = {
  general: {
    name: 'Bus Tix Connect',
    slogan: 'Voyagez en toute simplicité',
    description: 'Bus Tix Connect est une plateforme de réservation de billets de bus en ligne, offrant des voyages confortables et sécurisés à travers le Cameroun.',
    email: 'contact@bustixconnect.com',
    phone: '+237 123 456 789',
    website: 'https://bustixconnect.com',
    address: '123 Rue de la Paix',
    city: 'Douala',
    country: 'Cameroun',
    gpsLat: '4.0511',
    gpsLng: '9.7679',
    hours: {
      weekdays: { open: '07:00', close: '21:00' },
      weekends: { open: '08:00', close: '20:00' },
    },
  },
  manager: {
    firstName: 'Jean',
    lastName: 'Mbarga',
    phone: '+237 698 765 432',
    email: 'jean.mbarga@bustixconnect.com',
    photo: null,
    role: 'Directeur Général',
    signature: null,
  },
  appearance: {
    primaryColor: '#0B1D51',
    secondaryColor: '#FF6B35',
    logoLight: null,
    logoDark: null,
    favicon: null,
    coverImage: null,
  },
  payments: {
    methods: [
      { id: 'om', name: 'Orange Money', enabled: true, commission: 2.5 },
      { id: 'momo', name: 'MTN Mobile Money', enabled: true, commission: 2.5 },
      { id: 'card', name: 'Carte bancaire', enabled: false, commission: 3.5 },
      { id: 'cash', name: 'Espèces', enabled: true, commission: 0 },
      { id: 'transfer', name: 'Virement bancaire', enabled: true, commission: 0 },
    ],
    currency: 'XAF',
    taxRate: 19.25,
  },
  reservations: {
    maxSeatsPerBooking: 10,
    autoExpiryMinutes: 30,
    allowCancellation: true,
    refundPolicy: 'flexible',
    instantBooking: true,
    manualValidation: false,
    autoNumbering: true,
    numberPrefix: 'BTC',
    cancellationDeadlineHours: 24,
    refundPercentage: 75,
  },
  notifications: {
    email: { enabled: true, events: ['booking_confirmed', 'booking_cancelled', 'payment_received', 'departure_reminder', 'new_client'] },
    sms: { enabled: true, events: ['booking_confirmed', 'departure_reminder'] },
    push: { enabled: false, events: [] },
    whatsapp: { enabled: false, events: [], planned: true },
    internal: { enabled: true, events: ['booking_confirmed', 'booking_cancelled', 'payment_received', 'new_client'] },
  },
  notificationEvents: [
    { id: 'booking_confirmed', label: 'Confirmation de réservation' },
    { id: 'booking_cancelled', label: 'Annulation de réservation' },
    { id: 'payment_received', label: 'Paiement reçu' },
    { id: 'payment_failed', label: 'Échec de paiement' },
    { id: 'departure_reminder', label: 'Rappel de départ' },
    { id: 'new_client', label: 'Nouveau client' },
    { id: 'bus_delay', label: 'Retard de bus' },
    { id: 'promotion', label: 'Promotion / Offre spéciale' },
  ],
  security: {
    twoFactorEnabled: false,
    sessions: [
      { id: 1, device: 'Chrome / Windows', ip: '192.168.1.100', lastActive: '2026-07-28T14:30:00', current: true },
      { id: 2, device: 'Safari / iPhone', ip: '192.168.1.101', lastActive: '2026-07-27T09:15:00', current: false },
      { id: 3, device: 'Firefox / macOS', ip: '192.168.1.102', lastActive: '2026-07-25T18:45:00', current: false },
    ],
    loginHistory: [
      { id: 1, date: '2026-07-28T14:30:00', ip: '192.168.1.100', device: 'Chrome / Windows', success: true },
      { id: 2, date: '2026-07-28T08:00:00', ip: '192.168.1.100', device: 'Chrome / Windows', success: true },
      { id: 3, date: '2026-07-27T22:15:00', ip: '192.168.1.101', device: 'Safari / iPhone', success: true },
      { id: 4, date: '2026-07-27T09:15:00', ip: '192.168.1.101', device: 'Safari / iPhone', success: true },
      { id: 5, date: '2026-07-26T12:00:00', ip: '185.45.67.89', device: 'Chrome / Linux', success: false },
      { id: 6, date: '2026-07-25T18:45:00', ip: '192.168.1.102', device: 'Firefox / macOS', success: true },
    ],
    devices: [
      { id: 1, name: 'PC Bureau', type: 'desktop', os: 'Windows 11', lastAccess: '2026-07-28T14:30:00', trusted: true },
      { id: 2, name: 'iPhone 15', type: 'mobile', os: 'iOS 18', lastAccess: '2026-07-27T09:15:00', trusted: true },
      { id: 3, name: 'MacBook Pro', type: 'laptop', os: 'macOS 15', lastAccess: '2026-07-25T18:45:00', trusted: false },
    ],
  },
  regional: {
    language: { id: 'fr', label: 'Français' },
    timezone: 'Africa/Douala',
    dateFormat: 'DD/MM/YYYY',
    moneyFormat: 'XAF #.###',
    currency: 'XAF',
    availableLanguages: [
      { id: 'fr', label: 'Français' },
      { id: 'en', label: 'English' },
    ],
    availableTimezones: [
      'Africa/Douala', 'Africa/Dakar', 'Africa/Abidjan', 'Africa/Lagos',
      'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/Paris', 'America/New_York',
    ],
    availableDateFormats: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'],
    availableMoneyFormats: ['XAF #.###', 'XAF #,###', '#.### XAF', '#,### XAF'],
  },
  documents: [
    { id: 'logo', name: 'Logo officiel', file: null, status: 'missing', required: true },
    { id: 'rccm', name: 'RCCM', file: null, status: 'missing', required: true },
    { id: 'taxpayer', name: 'Numéro contribuable', file: null, status: 'missing', required: true },
    { id: 'license', name: 'Licence d\'exploitation', file: null, status: 'missing', required: true },
    { id: 'insurance', name: 'Assurance', file: null, status: 'missing', required: true },
  ],
  integrations: [
    { id: 'orange_money', name: 'Orange Money API', description: 'Paiements via Orange Money', icon: 'bi-phone', connected: false, category: 'payment' },
    { id: 'mtn_momo', name: 'MTN MoMo API', description: 'Paiements via MTN Mobile Money', icon: 'bi-phone', connected: false, category: 'payment' },
    { id: 'google_maps', name: 'Google Maps', description: 'Géolocalisation et itinéraires', icon: 'bi-geo-alt', connected: false, category: 'maps' },
    { id: 'google_analytics', name: 'Google Analytics', description: 'Analytics et statistiques', icon: 'bi-bar-chart', connected: false, category: 'analytics' },
    { id: 'sms_gateway', name: 'SMS Gateway', description: 'Notifications par SMS', icon: 'bi-chat-dots', connected: false, category: 'communication' },
    { id: 'email_service', name: 'Email Service', description: 'Notifications par email', icon: 'bi-envelope', connected: false, category: 'communication' },
    { id: 'whatsapp_api', name: 'WhatsApp API', description: 'Notifications WhatsApp (Bientôt)', icon: 'bi-whatsapp', connected: false, category: 'communication', comingSoon: true },
    { id: 'webhooks', name: 'Webhooks', description: 'Intégrations personnalisées', icon: 'bi-link-45deg', connected: false, category: 'custom' },
  ],
};

export const settingsSidebarItems = [
  { id: 'general', label: 'Informations générales', icon: 'bi-building' },
  { id: 'manager', label: 'Responsable', icon: 'bi-person-badge' },
  { id: 'appearance', label: 'Apparence', icon: 'bi-palette' },
  { id: 'payments', label: 'Paiements', icon: 'bi-credit-card' },
  { id: 'reservations', label: 'Réservations', icon: 'bi-calendar-check' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
  { id: 'security', label: 'Sécurité', icon: 'bi-shield-check' },
  { id: 'regional', label: 'Régionalisation', icon: 'bi-globe' },
  { id: 'documents', label: 'Documents', icon: 'bi-file-earmark-text' },
  { id: 'integrations', label: 'API & Intégrations', icon: 'bi-plug' },
];

/* ─── Client Settings (legacy exports) ─── */

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
  { value: 'XAF', label: 'XAF (FCFA BEAC)' },
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
