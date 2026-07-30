/* ══════════════════════════════════════════════════════════════
   NOTIFICATION CENTER — Bus Tix Connect Super Admin
   Fully mock data, ready for Express.js + FCM + SMTP
   ══════════════════════════════════════════════════════════════ */

/* ─── Channels ─── */
export const channels = [
  { id: 'inapp', label: 'In-App', icon: 'fa-bell', color: '#8B5CF6', enabled: true },
  { id: 'email', label: 'Email', icon: 'fa-envelope', color: '#3B82F6', enabled: true },
  { id: 'sms', label: 'SMS', icon: 'fa-message', color: '#10B981', enabled: true },
  { id: 'push', label: 'Push Mobile', icon: 'fa-mobile-screen-button', color: '#F59E0B', enabled: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-whatsapp', color: '#25D366', enabled: false },
  { id: 'telegram', label: 'Telegram', icon: 'fa-telegram', color: '#26A5E4', enabled: false },
  { id: 'webhook', label: 'Webhook', icon: 'fa-plug', color: '#EF4444', enabled: false },
];

/* ─── Categories ─── */
export const categories = [
  { id: 'info', label: 'Information', icon: 'fa-circle-info', color: '#3B82F6' },
  { id: 'promo', label: 'Promotion', icon: 'fa-tags', color: '#F59E0B' },
  { id: 'maintenance', label: 'Maintenance', icon: 'fa-wrench', color: '#F97316' },
  { id: 'payment', label: 'Paiement', icon: 'fa-credit-card', color: '#10B981' },
  { id: 'booking', label: 'Réservation', icon: 'fa-ticket', color: '#8B5CF6' },
  { id: 'trip', label: 'Voyage', icon: 'fa-bus', color: '#3B82F6' },
  { id: 'urgent', label: 'Urgence', icon: 'fa-bolt', color: '#EF4444' },
  { id: 'security', label: 'Sécurité', icon: 'fa-shield', color: '#EF4444' },
  { id: 'marketing', label: 'Marketing', icon: 'fa-megaphone', color: '#EC4899' },
  { id: 'system', label: 'Système', icon: 'fa-gear', color: '#94A3B8' },
];

/* ─── Recipient Segments ─── */
export const recipientSegments = [
  { id: 'all', label: 'Tous les utilisateurs', count: 28450 },
  { id: 'clients', label: 'Tous les clients', count: 28100 },
  { id: 'companies', label: 'Toutes les compagnies', count: 9 },
  { id: 'admins', label: 'Tous les administrateurs', count: 8 },
  { id: 'agents', label: 'Tous les agents', count: 340 },
  { id: 'specific_company', label: 'Compagnie spécifique', count: null },
  { id: 'specific_user', label: 'Utilisateur spécifique', count: null },
  { id: 'custom', label: 'Groupe personnalisé', count: null },
];

/* ─── Variables ─── */
export const templateVariables = [
  { id: '{{nom}}', label: 'Nom' },
  { id: '{{prenom}}', label: 'Prénom' },
  { id: '{{compagnie}}', label: 'Compagnie' },
  { id: '{{voyage}}', label: 'Voyage' },
  { id: '{{date}}', label: 'Date' },
  { id: '{{heure}}', label: 'Heure' },
  { id: '{{montant}}', label: 'Montant' },
  { id: '{{email}}', label: 'Email' },
  { id: '{{telephone}}', label: 'Téléphone' },
  { id: '{{ville_depart}}', label: 'Ville départ' },
  { id: '{{ville_arrivee}}', label: "Ville d'arrivée" },
  { id: '{{reservation_id}}', label: 'ID Réservation' },
];

/* ─── KPI ─── */
export const notifKPI = {
  sent: { label: 'Notifications envoyées', value: 28450, trend: 12, icon: 'fa-paper-plane' },
  scheduled: { label: 'Programmées', value: 320, trend: 5, icon: 'fa-clock' },
  pending: { label: 'En attente', value: 145, trend: -8, icon: 'fa-hourglass' },
  failed: { label: 'Échouées', value: 380, trend: -15, icon: 'fa-circle-exclamation' },
  emailsSent: { label: 'Emails envoyés', value: 18200, trend: 10, icon: 'fa-envelope' },
  smsSent: { label: 'SMS envoyés', value: 12500, trend: 8, icon: 'fa-message' },
  inappSent: { label: 'Notifications In-App', value: 28450, trend: 12, icon: 'fa-bell' },
  openRate: { label: "Taux d'ouverture", value: 68, suffix: '%', trend: 3, icon: 'fa-eye' },
  clickRate: { label: 'Taux de clic', value: 24, suffix: '%', trend: 2, icon: 'fa-mouse-pointer' },
};

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONS DATA
   ══════════════════════════════════════════════════════════════ */
const notifUsers = ['Admin Guillaume', 'Admin Douala', 'Admin Yaoundé', 'Système'];

export const notifications = [
  { id: 'notif_001', title: 'Bienvenue sur BUS TIX CONNECT', channel: 'inapp', category: 'info', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'sent', creator: 'Admin Guillaume', createdAt: '2025-06-01 08:00', scheduledAt: null, sentAt: '2025-06-01 08:01', content: 'Merci de choisir BUS TIX CONNECT pour vos voyages. Nous sommes ravis de vous accueillir !', readCount: 22100, clickCount: 5400, failCount: 120, priority: 'normal', color: '#3B82F6', image: null, link: null, button: null },
  { id: 'notif_002', title: 'Paiement confirmé #RSV-2025-0612', channel: 'email', category: 'payment', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'sent', creator: 'Système', createdAt: '2025-06-12 10:30', scheduledAt: null, sentAt: '2025-06-12 10:31', content: 'Votre paiement de {{montant}} pour le voyage {{voyage}} du {{date}} a été confirmé.', readCount: 3200, clickCount: 1800, failCount: 25, priority: 'high', color: '#10B981', image: null, link: null, button: null },
  { id: 'notif_003', title: 'Maintenance programmée', channel: 'inapp', category: 'maintenance', recipients: 'all', segmentLabel: 'Tous les utilisateurs', status: 'scheduled', creator: 'Admin Guillaume', createdAt: '2025-06-14 09:00', scheduledAt: '2025-06-20 22:00', sentAt: null, content: 'Une maintenance est prévue le 20 juin de 22h à 04h. La plateforme sera temporairement indisponible.', readCount: 0, clickCount: 0, failCount: 0, priority: 'urgent', color: '#F97316', image: null, link: null, button: null },
  { id: 'notif_004', title: 'Nouveau voyage disponible', channel: 'push', category: 'trip', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'sent', creator: 'Système', createdAt: '2025-06-10 07:00', scheduledAt: null, sentAt: '2025-06-10 07:01', content: 'De nouveaux voyages Douala ↔ Yaoundé sont disponibles ! Réservez dès maintenant.', readCount: 8900, clickCount: 3100, failCount: 45, priority: 'normal', color: '#3B82F6', image: null, link: null, button: null },
  { id: 'notif_005', title: 'Offre spéciale : -20%', channel: 'email', category: 'promo', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'sent', creator: 'Admin Guillaume', createdAt: '2025-06-08 12:00', scheduledAt: null, sentAt: '2025-06-08 12:02', content: 'Profitez de 20% de réduction sur vos réservations ce week-end avec le code PROMO20.', readCount: 12500, clickCount: 6200, failCount: 35, priority: 'normal', color: '#F59E0B', image: null, link: 'https://bustixconnect.com/promo', button: 'Voir offre' },
  { id: 'notif_006', title: 'Alerte sécurité : connexion inhabituelle', channel: 'sms', category: 'security', recipients: 'all', segmentLabel: 'Tous les utilisateurs', status: 'sent', creator: 'Système', createdAt: '2025-06-07 03:00', scheduledAt: null, sentAt: '2025-06-07 03:01', content: 'Une connexion à votre compte a été détectée depuis une nouvelle IP. Si ce n\'est pas vous, contactez le support.', readCount: 0, clickCount: 0, failCount: 8, priority: 'critical', color: '#EF4444', image: null, link: null, button: null },
  { id: 'notif_007', title: 'Rappel : voyage dans 2 heures', channel: 'push', category: 'booking', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'sent', creator: 'Système', createdAt: '2025-06-15 12:00', scheduledAt: null, sentAt: '2025-06-15 12:01', content: 'Votre voyage Douala → Yaoundé démarre dans 2 heures. Présentez-vous à la gare 30 min avant.', readCount: 4500, clickCount: 2800, failCount: 15, priority: 'high', color: '#8B5CF6', image: null, link: null, button: 'Voir billet' },
  { id: 'notif_008', title: 'Mise à jour des conditions', channel: 'email', category: 'system', recipients: 'admins', segmentLabel: 'Tous les administrateurs', status: 'draft', creator: 'Admin Guillaume', createdAt: '2025-06-15 14:00', scheduledAt: null, sentAt: null, content: 'Les conditions générales d\'utilisation ont été mises à jour. Veuillez les consulter.', readCount: 0, clickCount: 0, failCount: 0, priority: 'normal', color: '#94A3B8', image: null, link: null, button: null },
  { id: 'notif_009', title: 'Urgence : indisponibilité API', channel: 'inapp', category: 'urgent', recipients: 'all', segmentLabel: 'Tous les utilisateurs', status: 'sent', creator: 'Admin Guillaume', createdAt: '2025-06-13 15:30', scheduledAt: null, sentAt: '2025-06-13 15:31', content: 'L\'API de paiement est temporairement indisponible. Nous travaillons à résoudre le problème.', readCount: 18400, clickCount: 4200, failCount: 50, priority: 'critical', color: '#EF4444', image: null, link: null, button: 'En savoir plus' },
  { id: 'notif_010', title: 'Rapport mensuel disponible', channel: 'email', category: 'info', recipients: 'admins', segmentLabel: 'Tous les administrateurs', status: 'sent', creator: 'Système', createdAt: '2025-06-01 06:00', scheduledAt: null, sentAt: '2025-06-01 06:01', content: 'Votre rapport mensuel de juin est maintenant disponible dans votre espace.', readCount: 8, clickCount: 7, failCount: 0, priority: 'normal', color: '#3B82F6', image: null, link: null, button: 'Voir rapport' },
  { id: 'notif_011', title: 'Campagne : Nouveaux horaires', channel: 'inapp', category: 'marketing', recipients: 'clients', segmentLabel: 'Tous les clients', status: 'draft', creator: 'Admin Guillaume', createdAt: '2025-06-15 16:00', scheduledAt: '2025-06-25 08:00', sentAt: null, content: 'Découvrez nos nouveaux horaires de bus ! Plus de départs pour mieux vous servir.', readCount: 0, clickCount: 0, failCount: 0, priority: 'normal', color: '#EC4899', image: null, link: null, button: null },
  { id: 'notif_012', title: 'Test SMS technique', channel: 'sms', category: 'system', recipients: 'admins', segmentLabel: 'Tous les administrateurs', status: 'failed', creator: 'Admin Guillaume', createdAt: '2025-06-12 11:00', scheduledAt: null, sentAt: null, content: 'Test de la passerelle SMS', readCount: 0, clickCount: 0, failCount: 8, priority: 'low', color: '#94A3B8', image: null, link: null, button: null },
];

/* ══════════════════════════════════════════════════════════════
   TEMPLATES
   ══════════════════════════════════════════════════════════════ */
export const notificationTemplates = [
  { id: 'tpl_01', name: 'Bienvenue', category: 'info', channel: 'email', subject: 'Bienvenue sur BUS TIX CONNECT', content: 'Bonjour {{prenom}},\n\nMerci de vous être inscrit sur BUS TIX CONNECT. Nous sommes ravis de vous accueillir !\n\nL\'équipe BUS TIX CONNECT', favorite: true },
  { id: 'tpl_02', name: 'Confirmation de paiement', category: 'payment', channel: 'email', subject: 'Paiement confirmé', content: 'Bonjour {{prenom}},\n\nVotre paiement de {{montant}} pour le voyage {{voyage}} du {{date}} a été confirmé.\n\nRéf : {{reservation_id}}', favorite: true },
  { id: 'tpl_03', name: 'Rappel de voyage', category: 'booking', channel: 'push', subject: 'Rappel voyage', content: 'Votre voyage {{ville_depart}} → {{ville_arrivee}} démarre dans 2 heures.', favorite: false },
  { id: 'tpl_04', name: 'Promotion hebdomadaire', category: 'promo', channel: 'email', subject: 'Offre spéciale cette semaine', content: 'Bonjour {{prenom}},\n\nProfitez de nos offres exceptionnelles cette semaine !', favorite: true },
  { id: 'tpl_05', name: 'Alerte sécurité', category: 'security', channel: 'sms', subject: '', content: 'Alerte : connexion détectée depuis un nouvel appareil.', favorite: false },
  { id: 'tpl_06', name: 'Maintenance programmée', category: 'maintenance', channel: 'inapp', subject: '', content: 'Une maintenance est prévue le {{date}} à {{heure}}.', favorite: true },
];

/* ══════════════════════════════════════════════════════════════
   STATS / CHARTS
   ══════════════════════════════════════════════════════════════ */
export const notifChartData = {
  daily: [
    { date: '2025-06-09', sent: 1250, opens: 850, clicks: 300 },
    { date: '2025-06-10', sent: 2340, opens: 1590, clicks: 560 },
    { date: '2025-06-11', sent: 980, opens: 670, clicks: 230 },
    { date: '2025-06-12', sent: 3400, opens: 2310, clicks: 820 },
    { date: '2025-06-13', sent: 1890, opens: 1280, clicks: 450 },
    { date: '2025-06-14', sent: 520, opens: 350, clicks: 120 },
    { date: '2025-06-15', sent: 780, opens: 530, clicks: 190 },
  ],
  byChannel: [
    { channel: 'In-App', count: 28450, color: '#8B5CF6' },
    { channel: 'Email', count: 18200, color: '#3B82F6' },
    { channel: 'SMS', count: 12500, color: '#10B981' },
    { channel: 'Push', count: 8900, color: '#F59E0B' },
  ],
  byCategory: [
    { category: 'Information', count: 8500, color: '#3B82F6' },
    { category: 'Paiement', count: 6200, color: '#10B981' },
    { category: 'Réservation', count: 5400, color: '#8B5CF6' },
    { category: 'Promotion', count: 3800, color: '#F59E0B' },
    { category: 'Sécurité', count: 2100, color: '#EF4444' },
    { category: 'Autres', count: 2450, color: '#94A3B8' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   TIMELINE
   ══════════════════════════════════════════════════════════════ */
export const notifTimeline = [
  { id: 'tl_01', action: 'Envoi', title: 'Campagne promotionnelle envoyée', user: 'Admin Guillaume', date: '2025-06-15 12:00', icon: 'fa-paper-plane', color: '#10B981' },
  { id: 'tl_02', action: 'Programmation', title: 'Maintenance programmée au 20 juin', user: 'Admin Guillaume', date: '2025-06-14 09:00', icon: 'fa-clock', color: '#3B82F6' },
  { id: 'tl_03', action: 'Création', title: 'Template "Alerte sécurité" créé', user: 'Admin Guillaume', date: '2025-06-13 14:00', icon: 'fa-plus-circle', color: '#8B5CF6' },
  { id: 'tl_04', action: 'Modification', title: 'Template "Bienvenue" modifié', user: 'Admin Guillaume', date: '2025-06-12 11:30', icon: 'fa-pen', color: '#F59E0B' },
  { id: 'tl_05', action: 'Annulation', title: 'Campagne SMS annulée', user: 'Admin Guillaume', date: '2025-06-11 16:00', icon: 'fa-ban', color: '#EF4444' },
  { id: 'tl_06', action: 'Envoi', title: 'Notification urgence API envoyée', user: 'Admin Guillaume', date: '2025-06-13 15:31', icon: 'fa-paper-plane', color: '#10B981' },
  { id: 'tl_07', action: 'Suppression', title: 'Template obsolète supprimé', user: 'Admin Guillaume', date: '2025-06-10 10:00', icon: 'fa-trash', color: '#EF4444' },
  { id: 'tl_08', action: 'Programmation', title: 'Campagne marketing programmée au 25 juin', user: 'Admin Guillaume', date: '2025-06-15 16:00', icon: 'fa-clock', color: '#3B82F6' },
];

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION SENDERS
   ══════════════════════════════════════════════════════════════ */
export const notifSenders = [
  { id: 'admin_guillaume', name: 'Admin Guillaume', email: 'guillaume@bustixconnect.com', role: 'Super Admin' },
  { id: 'admin_douala', name: 'Admin Douala', email: 'douala@bustixconnect.com', role: 'Super Admin' },
  { id: 'admin_yaounde', name: 'Admin Yaoundé', email: 'yaounde@bustixconnect.com', role: 'Super Admin' },
  { id: 'system', name: 'Système', email: 'system@bustixconnect.com', role: 'Automatisé' },
];

/* ─── Re-exports with notif- prefix for page consistency ─── */
export const notifChannels = channels;
export const notifCategories = categories.map(c => c.label);
export const notifNotifications = notifications;
export const notifTemplates = notificationTemplates;
export const notifDailyData = notifChartData.daily.map(d => ({ day: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }), value: d.sent }));
export const notifByChannel = notifChartData.byChannel.map(d => ({ name: d.channel, value: d.count }));
export const notifByCategory = notifChartData.byCategory.map(d => ({ name: d.category, value: d.count }));

/* ══════════════════════════════════════════════════════════════
   FILTER HELPERS
   ══════════════════════════════════════════════════════════════ */
export const defaultNotifFilters = { search: '', channel: '', category: '', status: '', dateFrom: '', dateTo: '' };

export const filterNotifications = (items, filters) => {
  return items.filter(n => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!n.title?.toLowerCase().includes(s) && !n.content?.toLowerCase().includes(s)) return false;
    }
    if (filters.channel && n.channel !== filters.channel) return false;
    if (filters.category && n.category !== filters.category) return false;
    if (filters.status && n.status !== filters.status) return false;
    if (filters.dateFrom && n.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && n.createdAt > filters.dateTo) return false;
    return true;
  });
};
