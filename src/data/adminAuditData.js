/* ══════════════════════════════════════════════════════════════
   AUDIT LOG & MONITORING — Bus Tix Connect Super Admin
   Fully mock data, ready for Express.js + WebSocket
   ══════════════════════════════════════════════════════════════ */

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatTime = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (d) => `${formatDate(d)} ${formatTime(d)}`;

/* ══════════════════════════════════════════════════════════════
   GRAVITY / SEVERITY CONFIG
   ══════════════════════════════════════════════════════════════ */
export const severityConfig = {
  info: { label: 'Information', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', icon: 'fa-circle-info' },
  low: { label: 'Faible', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: 'fa-circle-chevron-down' },
  medium: { label: 'Moyenne', color: '#F59E0B', bg: 'rgba(251,191,36,0.12)', icon: 'fa-circle-exclamation' },
  high: { label: 'Élevée', color: '#F97316', bg: 'rgba(249,115,22,0.12)', icon: 'fa-triangle-exclamation' },
  critical: { label: 'Critique', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: 'fa-bolt' },
};

export const actionTypes = [
  { id: 'login', label: 'Connexion', icon: 'fa-right-to-bracket' },
  { id: 'logout', label: 'Déconnexion', icon: 'fa-right-from-bracket' },
  { id: 'login_failed', label: 'Échec de connexion', icon: 'fa-lock' },
  { id: 'create', label: 'Création', icon: 'fa-plus-circle' },
  { id: 'update', label: 'Modification', icon: 'fa-pen' },
  { id: 'delete', label: 'Suppression logique', icon: 'fa-trash' },
  { id: 'validate', label: 'Validation', icon: 'fa-check-circle' },
  { id: 'reject', label: 'Refus', icon: 'fa-ban' },
  { id: 'payment', label: 'Paiement', icon: 'fa-credit-card' },
  { id: 'booking', label: 'Réservation', icon: 'fa-ticket' },
  { id: 'trip_create', label: 'Création voyage', icon: 'fa-bus' },
  { id: 'bus_update', label: 'Modification bus', icon: 'fa-truck' },
  { id: 'driver_add', label: 'Ajout chauffeur', icon: 'fa-user' },
  { id: 'user_create', label: 'Création utilisateur', icon: 'fa-user-plus' },
  { id: 'permission_change', label: 'Modification permissions', icon: 'fa-shield' },
  { id: 'role_change', label: 'Changement de rôle', icon: 'fa-user-tag' },
  { id: 'export', label: 'Export', icon: 'fa-download' },
  { id: 'upload', label: 'Téléchargement', icon: 'fa-upload' },
  { id: 'settings_change', label: 'Paramètres', icon: 'fa-gear' },
];

export const moduleOptions = [
  'Authentification', 'Utilisateurs', 'Compagnies', 'Rôles', 'Permissions',
  'Réservations', 'Paiements', 'Voyages', 'Bus', 'Chauffeurs',
  'Abonnements', 'Commissions', 'Rapports', 'Paramètres', 'Sécurité',
];

export const statusOptions = ['Succès', 'Échec', 'En attente'];

/* ══════════════════════════════════════════════════════════════
   STATS / KPI
   ══════════════════════════════════════════════════════════════ */
export const auditKPI = {
  totalEvents: { label: 'Total événements', value: 28450, trend: 8, icon: 'fa-list' },
  loginsToday: { label: 'Connexions aujourd\'hui', value: 142, trend: 12, icon: 'fa-right-to-bracket' },
  failedLogins: { label: 'Échecs de connexion', value: 23, trend: -5, icon: 'fa-lock' },
  criticalActions: { label: 'Actions critiques', value: 12, trend: -18, icon: 'fa-bolt' },
  creations: { label: 'Créations', value: 1890, trend: 15, icon: 'fa-plus-circle' },
  modifications: { label: 'Modifications', value: 5620, trend: 7, icon: 'fa-pen' },
  deletions: { label: 'Suppressions', value: 340, trend: -3, icon: 'fa-trash' },
  validations: { label: 'Validations', value: 1280, trend: 22, icon: 'fa-check-circle' },
  refusals: { label: 'Refus', value: 185, trend: -12, icon: 'fa-ban' },
  securityAlerts: { label: 'Alertes sécurité', value: 8, trend: -25, icon: 'fa-shield' },
};

/* ══════════════════════════════════════════════════════════════
   USERS (for audit)
   ══════════════════════════════════════════════════════════════ */
const auditUsers = [
  { id: 'usr_1', name: 'Admin Guillaume', role: 'Super Admin', company: 'Bus Tix Connect', avatar: null },
  { id: 'usr_2', name: 'Paul Biya', role: 'Client', company: '-', avatar: null },
  { id: 'usr_3', name: 'Jean Nkwi', role: 'Client', company: '-', avatar: null },
  { id: 'usr_4', name: 'Marie Essomba', role: 'Client', company: '-', avatar: null },
  { id: 'usr_5', name: 'Admin Douala', role: 'Admin Compagnie', company: 'Express Bus Cameroun', avatar: null },
  { id: 'usr_6', name: 'Admin Yaoundé', role: 'Admin Compagnie', company: 'Touristique Express', avatar: null },
  { id: 'usr_7', name: 'Agent Douala Centre', role: 'Agent Guichet', company: 'Express Bus Cameroun', avatar: null },
  { id: 'usr_8', name: 'Agent Yaoundé Gare', role: 'Agent Guichet', company: 'Touristique Express', avatar: null },
  { id: 'usr_9', name: 'Agent Bafoussam', role: 'Agent Guichet', company: 'Finex Voyages', avatar: null },
  { id: 'usr_10', name: 'Alice Kamga', role: 'Client', company: '-', avatar: null },
];

/* ══════════════════════════════════════════════════════════════
   EVENT GENERATOR — 200 mock audit events
   ══════════════════════════════════════════════════════════════ */
const actions = [
  { action: 'login', actionLabel: 'Connexion réussie', module: 'Authentification', severity: 'info', status: 'Succès' },
  { action: 'login_failed', actionLabel: 'Tentative de connexion échouée', module: 'Authentification', severity: 'medium', status: 'Échec' },
  { action: 'logout', actionLabel: 'Déconnexion', module: 'Authentification', severity: 'info', status: 'Succès' },
  { action: 'create', actionLabel: 'Création de compagnie', module: 'Compagnies', severity: 'high', status: 'Succès' },
  { action: 'update', actionLabel: 'Modification de profil', module: 'Utilisateurs', severity: 'low', status: 'Succès' },
  { action: 'delete', actionLabel: 'Suppression de compte', module: 'Utilisateurs', severity: 'critical', status: 'Succès' },
  { action: 'validate', actionLabel: 'Validation de compagnie', module: 'Compagnies', severity: 'high', status: 'Succès' },
  { action: 'reject', actionLabel: 'Refus de validation', module: 'Compagnies', severity: 'medium', status: 'Succès' },
  { action: 'payment', actionLabel: 'Paiement réservation', module: 'Paiements', severity: 'info', status: 'Succès' },
  { action: 'booking', actionLabel: 'Nouvelle réservation', module: 'Réservations', severity: 'info', status: 'Succès' },
  { action: 'trip_create', actionLabel: 'Création de voyage', module: 'Voyages', severity: 'medium', status: 'Succès' },
  { action: 'bus_update', actionLabel: 'Mise à jour bus', module: 'Bus', severity: 'low', status: 'Succès' },
  { action: 'driver_add', actionLabel: 'Ajout chauffeur', module: 'Chauffeurs', severity: 'low', status: 'Succès' },
  { action: 'user_create', actionLabel: 'Création utilisateur', module: 'Utilisateurs', severity: 'medium', status: 'Succès' },
  { action: 'permission_change', actionLabel: 'Modification permissions', module: 'Permissions', severity: 'critical', status: 'Succès' },
  { action: 'role_change', actionLabel: 'Changement de rôle', module: 'Rôles', severity: 'high', status: 'Succès' },
  { action: 'export', actionLabel: 'Export de données', module: 'Rapports', severity: 'low', status: 'Succès' },
  { action: 'upload', actionLabel: 'Téléchargement document', module: 'Compagnies', severity: 'low', status: 'Succès' },
  { action: 'settings_change', actionLabel: 'Modification paramètres', module: 'Paramètres', severity: 'high', status: 'Succès' },
  { action: 'login_failed', actionLabel: 'Tentative depuis nouvelle IP', module: 'Sécurité', severity: 'critical', status: 'Échec' },
  { action: 'permission_change', actionLabel: 'Attribution admin', module: 'Rôles', severity: 'critical', status: 'Succès' },
  { action: 'delete', actionLabel: 'Suppression de voyage', module: 'Voyages', severity: 'high', status: 'Succès' },
  { action: 'validate', actionLabel: 'Validation abonnement', module: 'Abonnements', severity: 'medium', status: 'Succès' },
  { action: 'reject', actionLabel: 'Refus abonnement', module: 'Abonnements', severity: 'medium', status: 'Succès' },
];

const ipPool = ['196.168.1.42', '192.168.1.105', '10.0.0.85', '172.16.0.34', '196.168.2.18', '192.168.1.201', '10.0.1.12', '172.16.1.77'];
const devicePool = [
  { browser: 'Chrome 125', os: 'Windows 11', device: 'PC Bureau' },
  { browser: 'Firefox 128', os: 'Windows 10', device: 'PC Portable' },
  { browser: 'Safari 17', os: 'macOS Sonoma', device: 'MacBook Pro' },
  { browser: 'Chrome Mobile 125', os: 'Android 14', device: 'Samsung Galaxy S24' },
  { browser: 'Safari Mobile 17', os: 'iOS 18', device: 'iPhone 16 Pro' },
  { browser: 'Edge 125', os: 'Windows 11', device: 'PC Bureau' },
];

const generateEvents = (count) => {
  const events = [];
  const startDate = new Date('2025-06-01');
  for (let i = 0; i < count; i++) {
    const template = actions[i % actions.length];
    const user = auditUsers[i % auditUsers.length];
    const ip = ipPool[i % ipPool.length];
    const device = devicePool[i % devicePool.length];
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 8));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
    events.push({
      id: `evt_${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().split(' ')[0],
      datetime: date.toISOString(),
      user: { id: user.id, name: user.name, role: user.role, company: user.company },
      action: template.action,
      actionLabel: template.actionLabel,
      module: template.module,
      severity: template.severity,
      status: template.status,
      description: `${template.actionLabel} effectuée par ${user.name}`,
      ip,
      ...device,
      details: {
        ref: `AUD-${String(i + 1).padStart(6, '0')}`,
        city: ['Douala', 'Yaoundé', 'Bafoussam', 'Kribi', 'Bertoua'][i % 5],
        country: 'Cameroun',
        result: template.status === 'Succès' ? 'Opération réussie' : 'Opération échouée',
        comment: '',
      },
    });
  }
  return events;
};

export const auditEvents = generateEvents(200);

/* ══════════════════════════════════════════════════════════════
   ALERTS
   ══════════════════════════════════════════════════════════════ */
export const auditAlerts = [
  { id: 'alert_1', type: 'multi_login', label: 'Tentatives multiples', severity: 'critical', user: 'Agent Bafoussam', count: 12, time: '2025-06-15 14:30', status: 'active', description: '12 tentatives échouées en 5 minutes' },
  { id: 'alert_2', type: 'access_denied', label: 'Accès refusé', severity: 'high', user: 'Paul Biya', count: 5, time: '2025-06-15 13:15', status: 'active', description: 'Tentative d\'accès à une page admin' },
  { id: 'alert_3', type: 'mass_delete', label: 'Suppression massive', severity: 'critical', user: 'Admin Douala', count: 23, time: '2025-06-14 09:00', status: 'resolved', description: '23 réservations supprimées en 1 minute' },
  { id: 'alert_4', type: 'role_change', label: 'Modification rôle', severity: 'high', user: 'Admin Guillaume', count: 1, time: '2025-06-14 08:45', status: 'active', description: 'Attribution rôle Super Admin' },
  { id: 'alert_5', type: 'unusual_validation', label: 'Validation inhabituelle', severity: 'medium', user: 'Admin Yaoundé', count: 8, time: '2025-06-13 22:00', status: 'active', description: '8 validations hors horaires' },
  { id: 'alert_6', type: 'new_country', label: 'Nouveau pays', severity: 'high', user: 'Alice Kamga', count: 1, time: '2025-06-12 03:20', status: 'active', description: 'Connexion depuis le Nigéria' },
  { id: 'alert_7', type: 'off_hours', label: 'Connexion hors horaires', severity: 'medium', user: 'Agent Yaoundé Gare', count: 6, time: '2025-06-11 02:00', status: 'resolved', description: 'Connexions entre 2h et 4h' },
  { id: 'alert_8', type: 'multi_login', label: 'Tentatives multiples', severity: 'critical', user: 'Inconnu', count: 34, time: '2025-06-10 18:00', status: 'active', description: '34 tentatives échouées depuis IP inconnue' },
];

/* ══════════════════════════════════════════════════════════════
   SESSIONS
   ══════════════════════════════════════════════════════════════ */
export const activeSessions = [
  { id: 'sess_1', user: 'Admin Guillaume', role: 'Super Admin', ip: '196.168.1.42', device: 'PC Bureau', browser: 'Chrome 125', login: '2025-06-15 08:00', lastActive: '2025-06-15 14:45', status: 'active' },
  { id: 'sess_2', user: 'Admin Douala', role: 'Admin Compagnie', ip: '192.168.1.105', device: 'MacBook Pro', browser: 'Safari 17', login: '2025-06-15 07:30', lastActive: '2025-06-15 14:40', status: 'active' },
  { id: 'sess_3', user: 'Agent Yaoundé Gare', role: 'Agent Guichet', ip: '10.0.0.85', device: 'PC Bureau', browser: 'Firefox 128', login: '2025-06-15 08:15', lastActive: '2025-06-15 14:30', status: 'active' },
  { id: 'sess_4', user: 'Admin Yaoundé', role: 'Admin Compagnie', ip: '172.16.0.34', device: 'Samsung Galaxy S24', browser: 'Chrome Mobile 125', login: '2025-06-15 09:00', lastActive: '2025-06-15 14:00', status: 'active' },
  { id: 'sess_5', user: 'Agent Bafoussam', role: 'Agent Guichet', ip: '196.168.2.18', device: 'iPhone 16 Pro', browser: 'Safari Mobile 17', login: '2025-06-15 10:00', lastActive: '2025-06-15 13:00', status: 'idle' },
  { id: 'sess_6', user: 'Paul Biya', role: 'Client', ip: '192.168.1.201', device: 'PC Bureau', browser: 'Edge 125', login: '2025-06-15 11:00', lastActive: '2025-06-15 12:30', status: 'idle' },
  { id: 'sess_7', user: 'Marie Essomba', role: 'Client', ip: '10.0.1.12', device: 'iPhone 16 Pro', browser: 'Safari Mobile 17', login: '2025-06-15 12:00', lastActive: '2025-06-15 14:00', status: 'active' },
  { id: 'sess_8', user: 'Agent Douala Centre', role: 'Agent Guichet', ip: '196.168.1.42', device: 'PC Bureau', browser: 'Chrome 125', login: '2025-06-15 08:30', lastActive: '2025-06-15 14:45', status: 'active' },
];

/* ══════════════════════════════════════════════════════════════
   FILTER HELPERS
   ══════════════════════════════════════════════════════════════ */
export const defaultFilters = {
  search: '',
  user: '',
  role: '',
  company: '',
  ip: '',
  action: '',
  severity: '',
  module: '',
  status: '',
  dateFrom: '',
  dateTo: '',
};

export const filterEvents = (events, filters) => {
  return events.filter(e => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!e.user?.name?.toLowerCase().includes(s) &&
          !e.actionLabel?.toLowerCase().includes(s) &&
          !e.module?.toLowerCase().includes(s) &&
          !e.description?.toLowerCase().includes(s) &&
          !e.ip?.includes(s)) return false;
    }
    if (filters.user && e.user?.name !== filters.user) return false;
    if (filters.role && e.user?.role !== filters.role) return false;
    if (filters.company && e.user?.company !== filters.company) return false;
    if (filters.ip && e.ip !== filters.ip) return false;
    if (filters.action && e.action !== filters.action) return false;
    if (filters.severity && e.severity !== filters.severity) return false;
    if (filters.module && e.module !== filters.module) return false;
    if (filters.status && e.status !== filters.status) return false;
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    return true;
  });
};

export const paginateEvents = (events, page = 1, perPage = 25) => {
  const start = (page - 1) * perPage;
  return { items: events.slice(start, start + perPage), total: events.length, page, perPage, totalPages: Math.ceil(events.length / perPage) };
};

export const loginsToday = auditEvents.filter(e => e.action === 'login' && e.date === '2025-06-15').length;

export const getSeverityBadge = (sev) => severityConfig[sev] || severityConfig.info;
