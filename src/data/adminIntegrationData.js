/* ══════════════════════════════════════════════════════════════
   INTEGRATIONS & API MANAGEMENT — Bus Tix Connect Super Admin
   Ready for Express.js, REST, WebSocket, OAuth, OpenAPI, Swagger
   ══════════════════════════════════════════════════════════════ */

/* ─── Categories ─── */
export const integrationCategories = [
  { id: 'payment', label: 'Paiements', icon: 'fa-credit-card', color: '#10B981' },
  { id: 'sms', label: 'SMS', icon: 'fa-message', color: '#3B82F6' },
  { id: 'email', label: 'Emails', icon: 'fa-envelope', color: '#8B5CF6' },
  { id: 'mapping', label: 'Cartographie', icon: 'fa-map', color: '#F59E0B' },
  { id: 'auth', label: 'Authentification', icon: 'fa-shield', color: '#EC4899' },
  { id: 'storage', label: 'Cloud Storage', icon: 'fa-cloud', color: '#14B8A6' },
  { id: 'notifications', label: 'Notifications', icon: 'fa-bell', color: '#F97316' },
  { id: 'webhook', label: 'Webhooks', icon: 'fa-plug', color: '#6366F1' },
  { id: 'partner', label: 'API Partenaires', icon: 'fa-handshake', color: '#FBBF24' },
  { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar', color: '#EF4444' },
];

/* ─── Integration Statuses ─── */
export const integrationStatuses = [
  { id: 'active', label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { id: 'inactive', label: 'Inactif', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  { id: 'error', label: 'Erreur', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  { id: 'pending', label: 'En attente', color: '#F59E0B', bg: 'rgba(251,191,36,0.12)' },
];

/* ─── Integrations ─── */
export const integrations = [
  { id: 'int_001', name: 'MTN Mobile Money', category: 'payment', version: '2.1.0', status: 'active', lastSync: '2026-07-30 08:15', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-15', description: 'Intégration du paiement mobile MTN pour les réservations.', endpoint: 'https://api.mtn.cm/collection/v2', apiKey: 'mtn_live_8xK3mR...', secret: 'sk_mtn_••••••••', sandbox: true, timeout: 30000, retries: 3, docs: 'https://developers.mtn.com/docs', logo: null },
  { id: 'int_002', name: 'Orange Money', category: 'payment', version: '1.8.0', status: 'active', lastSync: '2026-07-30 07:45', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-20', description: 'Paiement via Orange Money pour les clients mobile.', endpoint: 'https://api.orange.cm/om/v1', apiKey: 'om_live_4pL9qW...', secret: 'sk_om_••••••••', sandbox: true, timeout: 30000, retries: 3, docs: 'https://developer.orange.com/apis', logo: null },
  { id: 'int_003', name: 'Visa', category: 'payment', version: '3.2.0', status: 'inactive', lastSync: '2026-06-30 12:00', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-02-01', description: 'Paiement par carte Visa via API Cybersource.', endpoint: 'https://api.cybersource.com/v3/payments', apiKey: 'visa_live_6Hj2nK...', secret: 'sk_visa_••••••••', sandbox: false, timeout: 45000, retries: 2, docs: 'https://developer.visa.com/', logo: null },
  { id: 'int_004', name: 'MasterCard', category: 'payment', version: '2.5.0', status: 'inactive', lastSync: '2026-06-28 10:00', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-02-05', description: 'Paiement par carte MasterCard via API Gateway.', endpoint: 'https://api.mastercard.com/v2/payments', apiKey: 'mc_live_9Bv4xP...', secret: 'sk_mc_••••••••', sandbox: false, timeout: 45000, retries: 2, docs: 'https://developer.mastercard.com/', logo: null },
  { id: 'int_005', name: 'PayPal', category: 'payment', version: '1.12.0', status: 'inactive', lastSync: '2026-06-25 14:00', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-03-01', description: 'Paiement international via PayPal Checkout.', endpoint: 'https://api-m.paypal.com/v2/checkout/orders', apiKey: 'paypal_live_3Rf8sW...', secret: 'sk_paypal_••••••••', sandbox: false, timeout: 30000, retries: 3, docs: 'https://developer.paypal.com/docs', logo: null },
  { id: 'int_006', name: 'Stripe', category: 'payment', version: '2024-11', status: 'inactive', lastSync: '2026-06-20 09:00', lastError: null, creator: 'Admin Yaoundé', createdAt: '2026-03-15', description: 'Paiement par carte via Stripe Connect.', endpoint: 'https://api.stripe.com/v1', apiKey: 'sk_live_7Hk2mN...', secret: 'sk_stripe_••••••••', sandbox: true, timeout: 30000, retries: 2, docs: 'https://stripe.com/docs/api', logo: null },
  { id: 'int_007', name: 'Google Maps', category: 'mapping', version: '3.58', status: 'active', lastSync: '2026-07-30 08:30', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-10', description: 'Cartographie et géolocalisation des itinéraires.', endpoint: 'https://maps.googleapis.com/maps/api', apiKey: 'AIzaSyB3x8K...', secret: null, sandbox: true, timeout: 10000, retries: 2, docs: 'https://developers.google.com/maps', logo: null },
  { id: 'int_008', name: 'OpenStreetMap', category: 'mapping', version: '1.0.0', status: 'active', lastSync: '2026-07-30 08:00', lastError: null, creator: 'Admin Yaoundé', createdAt: '2026-02-10', description: 'Cartographie open-source pour les itinéraires.', endpoint: 'https://nominatim.openstreetmap.org', apiKey: null, secret: null, sandbox: true, timeout: 15000, retries: 3, docs: 'https://wiki.openstreetmap.org/wiki/API', logo: null },
  { id: 'int_009', name: 'Mapbox', category: 'mapping', version: '2.15.0', status: 'inactive', lastSync: '2026-06-15 11:00', lastError: null, creator: 'Admin Yaoundé', createdAt: '2026-03-01', description: 'Cartographie premium avec visualisations 3D.', endpoint: 'https://api.mapbox.com', apiKey: 'pk.eyJ1Ijoi...', secret: 'sk_mapbox_••••••••', sandbox: true, timeout: 15000, retries: 2, docs: 'https://docs.mapbox.com/api/', logo: null },
  { id: 'int_010', name: 'Firebase', category: 'notifications', version: '11.0.0', status: 'active', lastSync: '2026-07-30 08:10', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-15', description: 'Notifications push et authentification Firebase.', endpoint: 'https://fcm.googleapis.com/fcm/send', apiKey: 'AIzaSyD9x4K...', secret: 'firebase_••••••••', sandbox: true, timeout: 20000, retries: 3, docs: 'https://firebase.google.com/docs', logo: null },
  { id: 'int_011', name: 'Twilio', category: 'sms', version: '2020-01', status: 'active', lastSync: '2026-07-30 07:30', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-20', description: 'Envoi de SMS transactionnels et OTP.', endpoint: 'https://api.twilio.com/2010-04-01', apiKey: 'SK2x8L9mN...', secret: 'twilio_••••••••', sandbox: true, timeout: 15000, retries: 3, docs: 'https://www.twilio.com/docs', logo: null },
  { id: 'int_012', name: 'Brevo (Sendinblue)', category: 'email', version: '3.0.0', status: 'active', lastSync: '2026-07-30 08:00', lastError: null, creator: 'Admin Douala', createdAt: '2026-02-01', description: 'Envoi d\'emails transactionnels et marketing.', endpoint: 'https://api.brevo.com/v3/smtp/email', apiKey: 'xkeysib-4f8a...', secret: 'brevo_••••••••', sandbox: true, timeout: 20000, retries: 3, docs: 'https://developers.brevo.com/', logo: null },
  { id: 'int_013', name: 'Mailgun', category: 'email', version: '4.0.0', status: 'inactive', lastSync: '2026-05-30 10:00', lastError: null, creator: 'Admin Douala', createdAt: '2026-03-01', description: 'Service d\'emails alternatif pour les notifications.', endpoint: 'https://api.mailgun.net/v4', apiKey: 'key-7x2k9L...', secret: 'mailgun_••••••••', sandbox: false, timeout: 20000, retries: 2, docs: 'https://documentation.mailgun.com/', logo: null },
  { id: 'int_014', name: 'AWS S3', category: 'storage', version: '3.1.0', status: 'active', lastSync: '2026-07-30 08:20', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-25', description: 'Stockage cloud des pièces jointes et fichiers.', endpoint: 'https://s3.af-south-1.amazonaws.com', apiKey: 'AKIA2x8L9...', secret: 'aws_••••••••', sandbox: true, timeout: 30000, retries: 3, docs: 'https://docs.aws.amazon.com/s3/', logo: null },
  { id: 'int_015', name: 'Cloudinary', category: 'storage', version: '1.40.0', status: 'active', lastSync: '2026-07-30 07:50', lastError: null, creator: 'Admin Yaoundé', createdAt: '2026-02-15', description: 'Optimisation et stockage d\'images.', endpoint: 'https://api.cloudinary.com/v1_1', apiKey: '837492613...', secret: 'cloudinary_••••••••', sandbox: true, timeout: 20000, retries: 2, docs: 'https://cloudinary.com/documentation', logo: null },
  { id: 'int_016', name: 'OAuth Google', category: 'auth', version: '3.0.0', status: 'active', lastSync: '2026-07-30 08:00', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-01-15', description: 'Authentification via comptes Google.', endpoint: 'https://oauth2.googleapis.com/token', apiKey: '837492613...', secret: 'google_••••••••', sandbox: true, timeout: 10000, retries: 2, docs: 'https://developers.google.com/identity', logo: null },
  { id: 'int_017', name: 'OAuth Facebook', category: 'auth', version: '18.0', status: 'inactive', lastSync: '2026-06-01 09:00', lastError: null, creator: 'Admin Guillaume', createdAt: '2026-02-01', description: 'Authentification via comptes Facebook.', endpoint: 'https://graph.facebook.com/v18.0', apiKey: '837492613...', secret: 'facebook_••••••••', sandbox: false, timeout: 10000, retries: 2, docs: 'https://developers.facebook.com/docs', logo: null },
  { id: 'int_018', name: 'OAuth Microsoft', category: 'auth', version: '2.0', status: 'inactive', lastSync: '2026-05-15 14:00', lastError: null, creator: 'Admin Douala', createdAt: '2026-03-01', description: 'Authentification via comptes Microsoft.', endpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token', apiKey: '837492613...', secret: 'microsoft_••••••••', sandbox: false, timeout: 10000, retries: 2, docs: 'https://learn.microsoft.com/en-us/azure/active-directory/develop/', logo: null },
];

/* ─── API Keys ─── */
export const apiKeys = [
  { id: 'key_001', name: 'Production API Key', description: 'Clé API principale pour l\'environnement de production.', key: 'btc_prod_8xK3mR7pL9qW2nB4vX6cF8', createdAt: '2026-01-15', expiresAt: '2027-01-15', lastUsed: '2026-07-30 08:30', permissions: ['read', 'write', 'delete'], status: 'active', creator: 'Admin Guillaume' },
  { id: 'key_002', name: 'Sandbox API Key', description: 'Clé API pour l\'environnement de test et développement.', key: 'btc_sandbox_4pL9qW2nB6vX8cF0zS3k', createdAt: '2026-01-15', expiresAt: '2027-01-15', lastUsed: '2026-07-29 16:45', permissions: ['read', 'write'], status: 'active', creator: 'Admin Guillaume' },
  { id: 'key_003', name: 'Mobile App Key', description: 'Clé dédiée à l\'application mobile BUS TIX CONNECT.', key: 'btc_mobile_6Hj2nK8mB4vX2cF9zS1kL', createdAt: '2026-03-01', expiresAt: '2027-03-01', lastUsed: '2026-07-30 07:00', permissions: ['read', 'write'], status: 'active', creator: 'Admin Yaoundé' },
  { id: 'key_004', name: 'Partner API Key - Express Bus', description: 'Clé API partenaire pour Express Bus Cameroun.', key: 'btc_part_express_9Bv4xP3mR7pL', createdAt: '2026-04-10', expiresAt: '2026-10-10', lastUsed: '2026-07-28 14:20', permissions: ['read', 'write'], status: 'active', creator: 'Admin Douala' },
  { id: 'key_005', name: 'Partner API Key - Finex', description: 'Clé API partenaire pour Finex Voyages.', key: 'btc_part_finex_3Rf8sW6nB4vX', createdAt: '2026-04-15', expiresAt: '2026-10-15', lastUsed: '2026-07-27 10:00', permissions: ['read'], status: 'active', creator: 'Admin Douala' },
  { id: 'key_006', name: 'Webhook Secret Key', description: 'Clé secrète pour la signature des webhooks.', key: 'whsec_7Hk2mN9pL4qW2nB6vX8cF0z', createdAt: '2026-01-20', expiresAt: '2027-01-20', lastUsed: '2026-07-30 08:15', permissions: ['webhook'], status: 'active', creator: 'Admin Guillaume' },
  { id: 'key_007', name: 'Old Production Key (Revoked)', description: 'Ancienne clé de production remplacée en juillet.', key: 'btc_prod_old_2x8L9mN4pL6qW', createdAt: '2025-06-01', expiresAt: '2026-06-01', lastUsed: '2026-06-15', permissions: ['read', 'write', 'delete'], status: 'revoked', creator: 'Admin Guillaume' },
  { id: 'key_008', name: 'Test Key (Expired)', description: 'Clé de test ayant expiré.', key: 'btc_test_exp_5kF7sA2nB6vX', createdAt: '2025-01-01', expiresAt: '2026-01-01', lastUsed: '2025-12-20', permissions: ['read'], status: 'expired', creator: 'Admin Yaoundé' },
];

/* ─── Webhooks ─── */
export const webhooks = [
  { id: 'wh_001', name: 'Payment Webhook', url: 'https://api.bustixconnect.com/webhooks/payment', events: ['payment.completed', 'payment.failed', 'payment.refunded'], status: 'active', secret: 'whsec_pay_8xK3mR...', createdAt: '2026-01-15', lastTriggered: '2026-07-30 08:25', lastError: null, successRate: 99.8, totalCalls: 45820 },
  { id: 'wh_002', name: 'Booking Webhook', url: 'https://api.bustixconnect.com/webhooks/booking', events: ['booking.created', 'booking.cancelled', 'booking.modified'], status: 'active', secret: 'whsec_book_4pL9qW...', createdAt: '2026-01-15', lastTriggered: '2026-07-30 08:20', lastError: null, successRate: 99.5, totalCalls: 32150 },
  { id: 'wh_003', name: 'User Webhook', url: 'https://api.bustixconnect.com/webhooks/user', events: ['user.created', 'user.verified', 'user.deleted'], status: 'active', secret: 'whsec_user_6Hj2nK...', createdAt: '2026-02-01', lastTriggered: '2026-07-30 07:45', lastError: null, successRate: 99.9, totalCalls: 12480 },
  { id: 'wh_004', name: 'Company Validation Webhook', url: 'https://api.bustixconnect.com/webhooks/company', events: ['company.registered', 'company.validated', 'company.rejected'], status: 'active', secret: 'whsec_comp_9Bv4xP...', createdAt: '2026-02-15', lastTriggered: '2026-07-29 16:30', lastError: null, successRate: 100, totalCalls: 2850 },
  { id: 'wh_005', name: 'Notification Webhook', url: 'https://api.bustixconnect.com/webhooks/notification', events: ['notification.sent', 'notification.opened', 'notification.clicked'], status: 'inactive', secret: 'whsec_notif_3Rf8sW...', createdAt: '2026-03-01', lastTriggered: '2026-06-20 10:00', lastError: 'Timeout', successRate: 95.2, totalCalls: 18500 },
  { id: 'wh_006', name: 'External Analytics Webhook', url: 'https://analytics.partner.com/hooks/btc', events: ['analytics.daily', 'analytics.weekly', 'analytics.monthly'], status: 'error', secret: 'whsec_analytics_7Hk2mN...', createdAt: '2026-04-01', lastTriggered: '2026-07-28 06:00', lastError: 'Connection refused', successRate: 78.5, totalCalls: 920 },
];

/* ─── Webhook Events ─── */
export const webhookEventTypes = [
  { id: 'payment.completed', label: 'Paiement complété', category: 'payment' },
  { id: 'payment.failed', label: 'Paiement échoué', category: 'payment' },
  { id: 'payment.refunded', label: 'Paiement remboursé', category: 'payment' },
  { id: 'booking.created', label: 'Réservation créée', category: 'booking' },
  { id: 'booking.cancelled', label: 'Réservation annulée', category: 'booking' },
  { id: 'booking.modified', label: 'Réservation modifiée', category: 'booking' },
  { id: 'user.created', label: 'Utilisateur créé', category: 'user' },
  { id: 'user.verified', label: 'Utilisateur vérifié', category: 'user' },
  { id: 'user.deleted', label: 'Utilisateur supprimé', category: 'user' },
  { id: 'company.registered', label: 'Compagnie enregistrée', category: 'company' },
  { id: 'company.validated', label: 'Compagnie validée', category: 'company' },
  { id: 'company.rejected', label: 'Compagnie rejetée', category: 'company' },
  { id: 'notification.sent', label: 'Notification envoyée', category: 'notification' },
  { id: 'notification.opened', label: 'Notification ouverte', category: 'notification' },
  { id: 'notification.clicked', label: 'Notification cliquée', category: 'notification' },
  { id: 'connection.login', label: 'Connexion utilisateur', category: 'connection' },
  { id: 'connection.logout', label: 'Déconnexion utilisateur', category: 'connection' },
  { id: 'analytics.daily', label: 'Rapport quotidien', category: 'analytics' },
  { id: 'analytics.weekly', label: 'Rapport hebdomadaire', category: 'analytics' },
  { id: 'analytics.monthly', label: 'Rapport mensuel', category: 'analytics' },
];

/* ─── API Logs ─── */
export const apiLogs = [
  { id: 'log_001', date: '2026-07-30', time: '08:30:15', method: 'GET', endpoint: '/api/v1/bookings', status: 200, duration: 145, user: 'Admin Guillaume', response: '{"data": [...], "total": 42}', ip: '192.168.1.100' },
  { id: 'log_002', date: '2026-07-30', time: '08:28:42', method: 'POST', endpoint: '/api/v1/payments', status: 201, duration: 320, user: 'System', response: '{"id": "pay_2026-4582", "status": "completed"}', ip: '10.0.0.5' },
  { id: 'log_003', date: '2026-07-30', time: '08:25:10', method: 'GET', endpoint: '/api/v1/users/me', status: 200, duration: 85, user: 'Marie Kamga', response: '{"id": "usr_001", "name": "Marie Kamga"}', ip: '197.155.1.200' },
  { id: 'log_004', date: '2026-07-30', time: '08:20:33', method: 'PUT', endpoint: '/api/v1/bookings/BK-2026-1950', status: 200, duration: 210, user: 'Admin Douala', response: '{"status": "confirmed", "updated": true}', ip: '192.168.1.101' },
  { id: 'log_005', date: '2026-07-30', time: '08:15:00', method: 'DELETE', endpoint: '/api/v1/tickets/TKT-2026-0001/attachments', status: 204, duration: 95, user: 'Admin Guillaume', response: '', ip: '192.168.1.100' },
  { id: 'log_006', date: '2026-07-30', time: '08:10:45', method: 'POST', endpoint: '/api/v1/webhooks/payment', status: 200, duration: 180, user: 'System (MTN)', response: '{"received": true}', ip: '196.168.0.50' },
  { id: 'log_007', date: '2026-07-30', time: '08:05:22', method: 'GET', endpoint: '/api/v1/companies', status: 200, duration: 450, user: 'Admin Guillaume', response: '{"data": [...], "total": 24}', ip: '192.168.1.100' },
  { id: 'log_008', date: '2026-07-30', time: '07:55:18', method: 'POST', endpoint: '/api/v1/auth/login', status: 401, duration: 65, user: 'Unknown', response: '{"error": "Invalid credentials"}', ip: '85.45.22.130' },
  { id: 'log_009', date: '2026-07-30', time: '07:50:00', method: 'GET', endpoint: '/api/v1/routes/douala-yaounde', status: 200, duration: 280, user: 'Esther Nkoulou', response: '{"departures": [...], "prices": {...}}', ip: '197.155.1.150' },
  { id: 'log_010', date: '2026-07-30', time: '07:45:30', method: 'POST', endpoint: '/api/v1/notifications/send', status: 500, duration: 15000, user: 'System', response: '{"error": "FCM timeout"}', ip: '10.0.0.5' },
  { id: 'log_011', date: '2026-07-29', time: '23:59:00', method: 'GET', endpoint: '/api/v1/analytics/daily', status: 200, duration: 3200, user: 'System (Cron)', response: '{"report": "...", "generated": true}', ip: '10.0.0.1' },
  { id: 'log_012', date: '2026-07-29', time: '18:30:15', method: 'POST', endpoint: '/api/v1/payments/refund', status: 200, duration: 540, user: 'Admin Guillaume', response: '{"refund_id": "ref_2026-125", "amount": 12500}', ip: '192.168.1.100' },
];

/* ─── KPI ─── */
export const integrationKPI = {
  activeIntegrations: { label: 'Intégrations actives', value: 12, trend: 3, icon: 'fa-plug', color: '#10B981' },
  inactiveIntegrations: { label: 'Intégrations inactives', value: 6, trend: -2, icon: 'fa-circle-pause', color: '#6B7280' },
  registeredApis: { label: 'API enregistrées', value: 18, trend: 0, icon: 'fa-code', color: '#8B5CF6' },
  webhooksActive: { label: 'Webhooks actifs', value: 4, trend: 1, icon: 'fa-bolt', color: '#3B82F6' },
  apiKeysTotal: { label: 'Clés API', value: 8, trend: 0, icon: 'fa-key', color: '#F59E0B' },
  todayRequests: { label: 'Requêtes aujourd\'hui', value: 12450, trend: 18, icon: 'fa-arrow-trend-up', color: '#EC4899' },
  apiErrors: { label: 'Erreurs API', value: 23, trend: -12, icon: 'fa-circle-exclamation', color: '#EF4444' },
  avgResponse: { label: 'Temps moyen de réponse', value: 185, suffix: 'ms', trend: -8, icon: 'fa-gauge-high', color: '#14B8A6' },
};

/* ─── Monitoring Data ─── */
export const monitoringData = {
  availability: [
    { month: 'Jan', uptime: 99.9 },
    { month: 'Fév', uptime: 99.8 },
    { month: 'Mar', uptime: 99.9 },
    { month: 'Avr', uptime: 99.7 },
    { month: 'Mai', uptime: 99.9 },
    { month: 'Juin', uptime: 99.6 },
    { month: 'Juil', uptime: 99.8 },
  ],
  responseTime: [
    { month: 'Jan', avg: 210 },
    { month: 'Fév', avg: 195 },
    { month: 'Mar', avg: 180 },
    { month: 'Avr', avg: 200 },
    { month: 'Mai', avg: 175 },
    { month: 'Juin', avg: 190 },
    { month: 'Juil', avg: 185 },
  ],
  apiCalls: [
    { month: 'Jan', calls: 185000 },
    { month: 'Fév', calls: 210000 },
    { month: 'Mar', calls: 245000 },
    { month: 'Avr', calls: 280000 },
    { month: 'Mai', calls: 310000 },
    { month: 'Juin', calls: 345000 },
    { month: 'Juil', calls: 380000 },
  ],
  errors: [
    { month: 'Jan', errors: 185 },
    { month: 'Fév', errors: 162 },
    { month: 'Mar', errors: 148 },
    { month: 'Avr', errors: 195 },
    { month: 'Mai', errors: 132 },
    { month: 'Juin', errors: 155 },
    { month: 'Juil', errors: 120 },
  ],
  byEndpoint: [
    { endpoint: '/api/v1/bookings', calls: 125000, avgMs: 145, errors: 45 },
    { endpoint: '/api/v1/payments', calls: 85000, avgMs: 320, errors: 120 },
    { endpoint: '/api/v1/users', calls: 62000, avgMs: 85, errors: 18 },
    { endpoint: '/api/v1/companies', calls: 28000, avgMs: 450, errors: 35 },
    { endpoint: '/api/v1/auth', calls: 45000, avgMs: 65, errors: 180 },
    { endpoint: '/api/v1/notifications', calls: 35000, avgMs: 280, errors: 95 },
  ],
};

/* ─── Documentation ─── */
export const apiDocumentation = [
  {
    tag: 'Bookings', endpoints: [
      { method: 'GET', path: '/api/v1/bookings', description: 'Liste des réservations', params: [{ name: 'page', type: 'number', required: false }, { name: 'limit', type: 'number', required: false }, { name: 'status', type: 'string', required: false }], headers: [{ name: 'Authorization', value: 'Bearer {token}' }], responses: [{ code: 200, description: 'Liste des réservations' }, { code: 401, description: 'Non authentifié' }] },
      { method: 'POST', path: '/api/v1/bookings', description: 'Créer une réservation', body: { type: 'object', properties: { routeId: 'string', date: 'string', seats: 'array' } }, responses: [{ code: 201, description: 'Réservation créée' }, { code: 400, description: 'Données invalides' }] },
      { method: 'GET', path: '/api/v1/bookings/:id', description: 'Détail d\'une réservation', responses: [{ code: 200, description: 'Réservation trouvée' }, { code: 404, description: 'Réservation non trouvée' }] },
      { method: 'PUT', path: '/api/v1/bookings/:id', description: 'Modifier une réservation', responses: [{ code: 200, description: 'Réservation modifiée' }] },
      { method: 'DELETE', path: '/api/v1/bookings/:id', description: 'Annuler une réservation', responses: [{ code: 200, description: 'Réservation annulée' }] },
    ],
  },
  {
    tag: 'Paiements', endpoints: [
      { method: 'POST', path: '/api/v1/payments', description: 'Effectuer un paiement', body: { type: 'object', properties: { bookingId: 'string', method: 'string', amount: 'number' } }, responses: [{ code: 201, description: 'Paiement effectué' }, { code: 402, description: 'Paiement refusé' }] },
      { method: 'POST', path: '/api/v1/payments/refund', description: 'Rembourser un paiement', responses: [{ code: 200, description: 'Remboursement effectué' }] },
      { method: 'GET', path: '/api/v1/payments/:id', description: 'Statut d\'un paiement', responses: [{ code: 200, description: 'Détail du paiement' }] },
    ],
  },
  {
    tag: 'Utilisateurs', endpoints: [
      { method: 'GET', path: '/api/v1/users', description: 'Liste des utilisateurs', responses: [{ code: 200, description: 'Succès' }] },
      { method: 'POST', path: '/api/v1/users', description: 'Créer un utilisateur', responses: [{ code: 201, description: 'Utilisateur créé' }] },
      { method: 'GET', path: '/api/v1/users/:id', description: 'Profil utilisateur', responses: [{ code: 200, description: 'Succès' }] },
      { method: 'PUT', path: '/api/v1/users/:id', description: 'Mettre à jour un utilisateur', responses: [{ code: 200, description: 'Mis à jour' }] },
    ],
  },
  {
    tag: 'Authentification', endpoints: [
      { method: 'POST', path: '/api/v1/auth/login', description: 'Connecter un utilisateur', body: { type: 'object', properties: { email: 'string', password: 'string' } }, responses: [{ code: 200, description: 'Token JWT retourné' }, { code: 401, description: 'Identifiants invalides' }] },
      { method: 'POST', path: '/api/v1/auth/register', description: 'Inscrire un utilisateur', responses: [{ code: 201, description: 'Compte créé' }] },
      { method: 'POST', path: '/api/v1/auth/refresh', description: 'Rafraîchir le token', responses: [{ code: 200, description: 'Nouveau token' }] },
      { method: 'POST', path: '/api/v1/auth/logout', description: 'Déconnecter', responses: [{ code: 200, description: 'Déconnecté' }] },
    ],
  },
  {
    tag: 'Notifications', endpoints: [
      { method: 'GET', path: '/api/v1/notifications', description: 'Liste des notifications', responses: [{ code: 200, description: 'Succès' }] },
      { method: 'POST', path: '/api/v1/notifications/send', description: 'Envoyer une notification', responses: [{ code: 201, description: 'Notification envoyée' }] },
      { method: 'PUT', path: '/api/v1/notifications/:id/read', description: 'Marquer comme lue', responses: [{ code: 200, description: 'Marquée lue' }] },
    ],
  },
  {
    tag: 'Webhooks', endpoints: [
      { method: 'GET', path: '/api/v1/webhooks', description: 'Liste des webhooks', responses: [{ code: 200, description: 'Succès' }] },
      { method: 'POST', path: '/api/v1/webhooks', description: 'Créer un webhook', responses: [{ code: 201, description: 'Webhook créé' }] },
      { method: 'PUT', path: '/api/v1/webhooks/:id', description: 'Modifier un webhook', responses: [{ code: 200, description: 'Modifié' }] },
      { method: 'DELETE', path: '/api/v1/webhooks/:id', description: 'Supprimer un webhook', responses: [{ code: 204, description: 'Supprimé' }] },
    ],
  },
];

/* ─── Default Filters ─── */
export const defaultIntegrationFilters = { search: '', category: '', status: '', version: '' };

/* ─── Filter Helpers ─── */
export const filterIntegrations = (items, filters) => {
  return items.filter(i => {
    if (filters.search) { const s = filters.search.toLowerCase(); if (!i.name?.toLowerCase().includes(s) && !i.description?.toLowerCase().includes(s)) return false; }
    if (filters.category && i.category !== filters.category) return false;
    if (filters.status && i.status !== filters.status) return false;
    return true;
  });
};
