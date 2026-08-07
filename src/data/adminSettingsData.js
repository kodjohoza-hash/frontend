/* ══════════════════════════════════════════════════════════════
   PLATFORM SETTINGS — Bus Tix Connect Super Admin
   Fully dynamic, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

let nextId = 1;
const uid = () => `stg_${String(nextId++).padStart(4, '0')}`;

/* ─── Category icons ─── */
const catIcons = {
  identity: 'fa-building-columns',
  auth: 'fa-lock',
  users: 'fa-users',
  companies: 'fa-building',
  trips: 'fa-bus',
  payments: 'fa-credit-card',
  notifications: 'fa-bell',
  emails: 'fa-envelope',
  sms: 'fa-message',
  mobile_money: 'fa-mobile-screen-button',
  storage: 'fa-database',
  api: 'fa-plug',
  security: 'fa-shield-halved',
  backup: 'fa-floppy-disk',
  maintenance: 'fa-wrench',
  appearance: 'fa-palette',
};

/* ─── Settings field types ─── */
const T = { TEXT: 'text', SELECT: 'select', BOOL: 'bool', NUMBER: 'number', COLOR: 'color', TEXTAREA: 'textarea', EMAIL: 'email', TEL: 'tel', URL: 'url', PASSWORD: 'password', TIME: 'time' };

/* =============================================================
   CATEGORIES
   ============================================================= */
export const settingsCategories = [
  {
    id: 'identity', label: 'Identité de la plateforme', icon: catIcons.identity,
    description: 'Configurez l\'identité et la marque de Bus Tix Connect',
    fields: [
      { id: 'site_name', label: 'Nom de la plateforme', type: T.TEXT, value: 'BUS TIX CONNECT' },
      { id: 'tagline', label: 'Slogan', type: T.TEXT, value: 'Voyagez en toute simplicité' },
      { id: 'logo', label: 'Logo', type: T.TEXT, value: '/assets/bus-tix-connect-logo.png' },
      { id: 'favicon', label: 'Favicon', type: T.TEXT, value: '/assets/favicon.ico' },
      { id: 'primary_color', label: 'Couleur principale', type: T.COLOR, value: '#1E1B4B' },
      { id: 'secondary_color', label: 'Couleur secondaire', type: T.COLOR, value: '#8B5CF6' },
      { id: 'address', label: 'Adresse', type: T.TEXT, value: 'Douala, Cameroun' },
      { id: 'phone', label: 'Téléphone', type: T.TEL, value: '+237 612 345 678' },
      { id: 'email', label: 'Email', type: T.EMAIL, value: 'contact@bustixconnect.com' },
      { id: 'website', label: 'Site web', type: T.URL, value: 'https://bustixconnect.com' },
      { id: 'social_facebook', label: 'Facebook', type: T.URL, value: 'https://facebook.com/bustixconnect' },
      { id: 'social_twitter', label: 'Twitter', type: T.URL, value: 'https://twitter.com/bustixconnect' },
      { id: 'social_instagram', label: 'Instagram', type: T.URL, value: 'https://instagram.com/bustixconnect' },
      { id: 'timezone', label: 'Fuseau horaire', type: T.SELECT, value: 'Africa/Douala', options: ['Africa/Douala', 'Africa/Yaounde', 'UTC', 'Europe/Paris'] },
      { id: 'default_lang', label: 'Langue par défaut', type: T.SELECT, value: 'fr', options: ['fr' , 'en'] },
      { id: 'default_currency', label: 'Devise par défaut', type: T.SELECT, value: 'XAF', options: ['XAF', 'EUR', 'USD'] },
      { id: 'date_format', label: 'Format date', type: T.SELECT, value: 'DD/MM/YYYY', options: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { id: 'time_format', label: 'Format heure', type: T.SELECT, value: '24h', options: ['24h', '12h'] },
    ],
  },
  {
    id: 'auth', label: 'Authentification', icon: catIcons.auth,
    description: 'Configurez les règles d\'authentification et de sécurité des comptes',
    fields: [
      { id: 'login_enabled', label: 'Connexion activée', type: T.BOOL, value: true },
      { id: 'registration_enabled', label: 'Inscription activée', type: T.BOOL, value: true },
      { id: 'email_verification', label: 'Activation par email', type: T.BOOL, value: true },
      { id: 'sms_verification', label: 'Activation par SMS', type: T.BOOL, value: false },
      { id: 'two_factor', label: 'Double authentification', type: T.BOOL, value: false },
      { id: 'session_duration', label: 'Durée de session (minutes)', type: T.NUMBER, value: 60 },
      { id: 'session_expiry', label: 'Expiration de session (jours)', type: T.NUMBER, value: 30 },
      { id: 'min_password_length', label: 'Longueur minimum du mot de passe', type: T.NUMBER, value: 8 },
      { id: 'password_complexity', label: 'Complexité du mot de passe', type: T.SELECT, value: 'medium', options: ['low', 'medium', 'high'] },
      { id: 'max_login_attempts', label: 'Tentatives max de connexion', type: T.NUMBER, value: 5 },
      { id: 'auto_block_minutes', label: 'Blocage automatique (minutes)', type: T.NUMBER, value: 30 },
    ],
  },
  {
    id: 'users', label: 'Utilisateurs', icon: catIcons.users,
    description: 'Paramètres de gestion des comptes utilisateurs',
    fields: [
      { id: 'auto_account_creation', label: 'Création automatique', type: T.BOOL, value: false },
      { id: 'manual_validation', label: 'Validation manuelle', type: T.BOOL, value: true },
      { id: 'soft_delete', label: 'Suppression logique', type: T.BOOL, value: true },
      { id: 'photo_required', label: 'Photo obligatoire', type: T.BOOL, value: false },
      { id: 'phone_required', label: 'Téléphone obligatoire', type: T.BOOL, value: true },
      { id: 'address_required', label: 'Adresse obligatoire', type: T.BOOL, value: false },
      { id: 'profile_editable', label: 'Modification profil autorisée', type: T.BOOL, value: true },
    ],
  },
  {
    id: 'companies', label: 'Compagnies', icon: catIcons.companies,
    description: 'Paramètres de gestion des compagnies de transport',
    fields: [
      { id: 'validation_required', label: 'Validation obligatoire', type: T.BOOL, value: true },
      { id: 'documents_required', label: 'Documents requis', type: T.BOOL, value: true },
      { id: 'max_companies', label: 'Nombre maximal de compagnies', type: T.NUMBER, value: 50 },
      { id: 'license_expiry_days', label: 'Expiration licence (jours)', type: T.NUMBER, value: 365 },
      { id: 'auto_renewal', label: 'Renouvellement automatique', type: T.BOOL, value: true },
      { id: 'auto_suspend_days', label: 'Suspension automatique (jours inactif)', type: T.NUMBER, value: 90 },
    ],
  },
  {
    id: 'trips', label: 'Voyages', icon: catIcons.trips,
    description: 'Paramètres des voyages et réservations',
    fields: [
      { id: 'max_trips', label: 'Nombre maximal de voyages par jour', type: T.NUMBER, value: 200 },
      { id: 'cancellation_allowed', label: 'Annulation autorisée', type: T.BOOL, value: true },
      { id: 'cancellation_deadline', label: 'Délai d\'annulation (heures)', type: T.NUMBER, value: 2 },
      { id: 'modification_allowed', label: 'Modification autorisée', type: T.BOOL, value: true },
      { id: 'late_booking', label: 'Réservation tardive (minutes)', type: T.NUMBER, value: 30 },
      { id: 'early_booking_days', label: 'Réservation anticipée (jours)', type: T.NUMBER, value: 30 },
      { id: 'max_passengers', label: 'Nombre maximal de passagers', type: T.NUMBER, value: 65 },
    ],
  },
  {
    id: 'payments', label: 'Paiements', icon: catIcons.payments,
    description: 'Configuration des moyens et règles de paiement',
    fields: [
      { id: 'mtn_enabled', label: 'MTN Mobile Money', type: T.BOOL, value: true },
      { id: 'orange_enabled', label: 'Orange Money', type: T.BOOL, value: true },
      { id: 'visa_enabled', label: 'Visa', type: T.BOOL, value: true },
      { id: 'mastercard_enabled', label: 'MasterCard', type: T.BOOL, value: false },
      { id: 'cash_enabled', label: 'Cash', type: T.BOOL, value: true },
      { id: 'deferred_payment', label: 'Paiement différé', type: T.BOOL, value: false },
      { id: 'default_tax_rate', label: 'Taxe par défaut (%)', type: T.NUMBER, value: 19.25 },
      { id: 'platform_commission_pct', label: 'Commission plateforme (%)', type: T.NUMBER, value: 5 },
      { id: 'refund_allowed', label: 'Remboursement autorisé', type: T.BOOL, value: true },
      { id: 'refund_deadline_days', label: 'Délai de remboursement (jours)', type: T.NUMBER, value: 7 },
    ],
  },
  {
    id: 'notifications', label: 'Notifications', icon: catIcons.notifications,
    description: 'Canaux de notification pour les utilisateurs',
    fields: [
      { id: 'email_notif', label: 'Email', type: T.BOOL, value: true },
      { id: 'sms_notif', label: 'SMS', type: T.BOOL, value: true },
      { id: 'push_notif', label: 'Push', type: T.BOOL, value: true },
      { id: 'inapp_notif', label: 'In-App', type: T.BOOL, value: true },
      { id: 'whatsapp_notif', label: 'WhatsApp (préparation)', type: T.BOOL, value: false },
      { id: 'telegram_notif', label: 'Telegram (préparation)', type: T.BOOL, value: false },
    ],
  },
  {
    id: 'emails', label: 'Emails', icon: catIcons.emails,
    description: 'Configuration SMTP et des templates d\'emails',
    fields: [
      { id: 'smtp_host', label: 'Serveur SMTP', type: T.TEXT, value: 'smtp.sendgrid.net' },
      { id: 'smtp_port', label: 'Port SMTP', type: T.NUMBER, value: 587 },
      { id: 'smtp_secure', label: 'SMTP sécurisé (SSL/TLS)', type: T.BOOL, value: true },
      { id: 'smtp_user', label: 'Utilisateur SMTP', type: T.TEXT, value: 'apikey' },
      { id: 'smtp_pass', label: 'Mot de passe SMTP', type: T.PASSWORD, value: '••••••••' },
      { id: 'sender_name', label: 'Nom expéditeur', type: T.TEXT, value: 'BUS TIX CONNECT' },
      { id: 'sender_email', label: 'Adresse expéditeur', type: T.EMAIL, value: 'noreply@bustixconnect.com' },
      { id: 'email_logo', label: 'Logo dans les emails', type: T.TEXT, value: '/assets/email-logo.png' },
      { id: 'email_signature', label: 'Signature email', type: T.TEXTAREA, value: 'L\'équipe BUS TIX CONNECT\nVoyagez en toute simplicité' },
    ],
  },
  {
    id: 'sms', label: 'SMS', icon: catIcons.sms,
    description: 'Configuration des SMS transactionnels',
    fields: [
      { id: 'sms_provider', label: 'Fournisseur', type: T.SELECT, value: 'twilio', options: ['twilio', 'africastalking', 'vonage', 'mnotify'] },
      { id: 'sms_sender', label: 'Expéditeur', type: T.TEXT, value: 'BUS TIX' },
      { id: 'sms_api_key', label: 'Clé API SMS', type: T.PASSWORD, value: '••••••••' },
      { id: 'sms_quota_monthly', label: 'Quota mensuel', type: T.NUMBER, value: 10000 },
      { id: 'sms_logs_retention', label: 'Conservation historique (jours)', type: T.NUMBER, value: 90 },
    ],
  },
  {
    id: 'mobile_money', label: 'Mobile Money', icon: catIcons.mobile_money,
    description: 'Configuration des API Mobile Money (MTN & Orange)',
    fields: [
      { id: 'mtn_api_key', label: 'Clé API MTN', type: T.PASSWORD, value: '••••••••' },
      { id: 'mtn_api_secret', label: 'Secret API MTN', type: T.PASSWORD, value: '••••••••' },
      { id: 'mtn_sandbox', label: 'Mode Sandbox MTN', type: T.BOOL, value: true },
      { id: 'mtn_production', label: 'Mode Production MTN', type: T.BOOL, value: false },
      { id: 'orange_api_key', label: 'Clé API Orange', type: T.PASSWORD, value: '••••••••' },
      { id: 'orange_api_secret', label: 'Secret API Orange', type: T.PASSWORD, value: '••••••••' },
      { id: 'orange_sandbox', label: 'Mode Sandbox Orange', type: T.BOOL, value: true },
      { id: 'orange_production', label: 'Mode Production Orange', type: T.BOOL, value: false },
    ],
  },
  {
    id: 'storage', label: 'Stockage', icon: catIcons.storage,
    description: 'Limites et qualité du stockage de fichiers',
    fields: [
      { id: 'max_file_size', label: 'Taille max fichier (MB)', type: T.NUMBER, value: 10 },
      { id: 'max_image_size', label: 'Taille max image (MB)', type: T.NUMBER, value: 5 },
      { id: 'max_document_size', label: 'Taille max document (MB)', type: T.NUMBER, value: 20 },
      { id: 'image_compression', label: 'Compression images', type: T.BOOL, value: true },
      { id: 'image_quality', label: 'Qualité images (%)', type: T.NUMBER, value: 80 },
      { id: 'allowed_formats', label: 'Formats autorisés', type: T.TEXT, value: 'jpg, png, pdf, docx' },
    ],
  },
  {
    id: 'api', label: 'API', icon: catIcons.api,
    description: 'Configuration des API REST et Webhooks',
    fields: [
      { id: 'api_enabled', label: 'API activée', type: T.BOOL, value: true },
      { id: 'api_key_generation', label: 'Génération de clés API', type: T.BOOL, value: true },
      { id: 'rate_limit', label: 'Rate limiting (req/min)', type: T.NUMBER, value: 60 },
      { id: 'api_logs_enabled', label: 'Logs API', type: T.BOOL, value: true },
      { id: 'api_version', label: 'Version API', type: T.SELECT, value: 'v1', options: ['v1', 'v2'] },
      { id: 'webhooks_enabled', label: 'Webhooks activés', type: T.BOOL, value: true },
    ],
  },
  {
    id: 'security', label: 'Sécurité', icon: catIcons.security,
    description: 'Paramètres de sécurité avancés de la plateforme',
    fields: [
      { id: 'https_required', label: 'HTTPS obligatoire', type: T.BOOL, value: true },
      { id: 'cors_enabled', label: 'CORS activé', type: T.BOOL, value: true },
      { id: 'jwt_secret', label: 'Clé secrète JWT', type: T.PASSWORD, value: '••••••••' },
      { id: 'jwt_expiry', label: 'Expiration JWT (heures)', type: T.NUMBER, value: 24 },
      { id: 'refresh_token_enabled', label: 'Refresh Token', type: T.BOOL, value: true },
      { id: 'ip_blacklist', label: 'Liste noire IP', type: T.TEXTAREA, value: '' },
      { id: 'ip_whitelist', label: 'Liste blanche IP', type: T.TEXTAREA, value: '' },
      { id: 'captcha_enabled', label: 'Captcha', type: T.BOOL, value: true },
      { id: 'csrf_protection', label: 'Protection CSRF', type: T.BOOL, value: true },
      { id: 'xss_protection', label: 'Protection XSS', type: T.BOOL, value: true },
      { id: 'sql_injection_protection', label: 'Protection SQL Injection', type: T.BOOL, value: true },
    ],
  },
  {
    id: 'backup', label: 'Sauvegarde', icon: catIcons.backup,
    description: 'Configuration des sauvegardes automatiques',
    fields: [
      { id: 'auto_backup', label: 'Sauvegarde automatique', type: T.BOOL, value: true },
      { id: 'backup_frequency', label: 'Fréquence', type: T.SELECT, value: 'daily', options: ['hourly', 'daily', 'weekly', 'monthly'] },
      { id: 'backup_retention', label: 'Rétention (jours)', type: T.NUMBER, value: 30 },
      { id: 'backup_time', label: 'Heure de sauvegarde', type: T.TIME, value: '02:00' },
    ],
  },
  {
    id: 'maintenance', label: 'Maintenance', icon: catIcons.maintenance,
    description: 'Mode maintenance de la plateforme',
    fields: [
      { id: 'maintenance_mode', label: 'Mode maintenance', type: T.BOOL, value: false },
      { id: 'maintenance_message', label: 'Message personnalisé', type: T.TEXTAREA, value: 'Nous sommes en maintenance. Revenez bientôt !' },
      { id: 'maintenance_start', label: 'Date de début', type: T.TEXT, value: '2025-07-01 22:00' },
      { id: 'maintenance_end', label: 'Date de fin', type: T.TEXT, value: '2025-07-02 04:00' },
      { id: 'maintenance_admin_access', label: 'Accès administrateurs uniquement', type: T.BOOL, value: true },
    ],
  },
  {
    id: 'appearance', label: 'Apparence', icon: catIcons.appearance,
    description: 'Thème et personnalisation visuelle',
    fields: [
      { id: 'theme', label: 'Thème', type: T.SELECT, value: 'dark', options: ['dark', 'light', 'auto'] },
      { id: 'sidebar_collapsed', label: 'Barre latérale réduite', type: T.BOOL, value: false },
      { id: 'animations_enabled', label: 'Animations', type: T.BOOL, value: true },
      { id: 'compact_mode', label: 'Mode compact', type: T.BOOL, value: false },
    ],
  },
];

/* ─── Flatten all fields for search ─── */
export const allSettings = settingsCategories.flatMap(cat =>
  cat.fields.map(f => ({ ...f, categoryId: cat.id, categoryLabel: cat.label }))
);

/* ══════════════════════════════════════════════════════════════
   FAVORITES
   ══════════════════════════════════════════════════════════════ */
export const defaultFavorites = ['site_name', 'default_currency', 'two_factor', 'platform_commission_pct', 'sms_provider', 'maintenance_mode'];

/* ══════════════════════════════════════════════════════════════
   HISTORY (mock)
   ══════════════════════════════════════════════════════════════ */
export const settingsHistory = [
  { id: 'h_1', field: 'site_name', label: 'Nom de la plateforme', user: 'Admin Guillaume', date: '2025-06-10 09:30', oldValue: 'Bus Tix Connect', newValue: 'BUS TIX CONNECT' },
  { id: 'h_2', field: 'primary_color', label: 'Couleur principale', user: 'Admin Guillaume', date: '2025-06-10 09:30', oldValue: '#2D2A6E', newValue: '#1E1B4B' },
  { id: 'h_3', field: 'two_factor', label: 'Double authentification', user: 'Admin Guillaume', date: '2025-06-08 14:00', oldValue: 'true', newValue: 'false' },
  { id: 'h_4', field: 'platform_commission_pct', label: 'Commission plateforme', user: 'Admin Guillaume', date: '2025-06-05 11:00', oldValue: '8%', newValue: '5%' },
  { id: 'h_5', field: 'max_login_attempts', label: 'Tentatives max de connexion', user: 'Admin Guillaume', date: '2025-06-01 16:00', oldValue: '3', newValue: '5' },
  { id: 'h_6', field: 'maintenance_mode', label: 'Mode maintenance', user: 'Admin Guillaume', date: '2025-05-28 22:00', oldValue: 'true', newValue: 'false' },
  { id: 'h_7', field: 'smtp_host', label: 'Serveur SMTP', user: 'Admin Guillaume', date: '2025-05-20 10:00', oldValue: 'smtp.mailgun.org', newValue: 'smtp.sendgrid.net' },
  { id: 'h_8', field: 'sms_provider', label: 'Fournisseur SMS', user: 'Admin Guillaume', date: '2025-05-15 08:00', oldValue: 'africastalking', newValue: 'twilio' },
];

/* ══════════════════════════════════════════════════════════════
   SEARCH HELPER
   ══════════════════════════════════════════════════════════════ */
export const searchSettings = (query, items = allSettings) => {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter(f =>
    f.label?.toLowerCase().includes(q) ||
    f.categoryLabel?.toLowerCase().includes(q) ||
    f.id?.toLowerCase().includes(q)
  );
};

/* ══════════════════════════════════════════════════════════════
   FIELD VALUE HELPERS
   ══════════════════════════════════════════════════════════════ */
export const getField = (categoryId, fieldId) => {
  const cat = settingsCategories.find(c => c.id === categoryId);
  return cat?.fields.find(f => f.id === fieldId);
};

export const updateField = (cats, categoryId, fieldId, newValue) => {
  return cats.map(cat => {
    if (cat.id !== categoryId) return cat;
    return { ...cat, fields: cat.fields.map(f => f.id === fieldId ? { ...f, value: newValue } : f) };
  });
};

export const getFieldTypeLabel = (type) => {
  const labels = { text: 'Texte', select: 'Liste', bool: 'Booléen', number: 'Nombre', color: 'Couleur', textarea: 'Texte long', email: 'Email', tel: 'Téléphone', url: 'URL', password: 'Mot de passe', time: 'Heure' };
  return labels[type] || type;
};

export const formatValue = (val) => {
  if (val === true || val === false) return val ? 'Oui' : 'Non';
  return String(val);
};
