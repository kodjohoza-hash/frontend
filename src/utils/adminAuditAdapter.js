/* ══════════════════════════════════════════════════════════════
   ADMIN — Adaptateur journal d'audit (API → composants Admin*)
   Transforme les entrées `journal_audit` du backend (GET /admin/audit-logs)
   en événements exploitables par les composants AdminAudit* existants,
   et les KPIs (GET /admin/audit-logs/stats) en cartes AdminAuditStats.
   ══════════════════════════════════════════════════════════════ */

/* Libellés d'action alignés sur les constantes UI (actionTypes). */
export const ACTION_LABELS = {
  login: 'Connexion réussie',
  logout: 'Déconnexion',
  login_failed: 'Échec de connexion',
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  validate: 'Validation',
  reject: 'Refus',
  suspend: 'Suspension',
  reactivate: 'Réactivation',
  renew: 'Renouvellement',
  expire: 'Expiration',
  payment: 'Paiement',
  status: 'Changement de statut',
  change_role: 'Changement de rôle',
  permission_change: 'Modification des permissions',
  export: 'Export de données',
  booking: 'Réservation',
};

/* Gravité déduite de l'action (alignée sur la grille de sévérité UI). */
export const ACTION_SEVERITY = {
  delete: 'critical',
  suspend: 'critical',
  reject: 'critical',
  change_role: 'critical',
  permission_change: 'critical',
  create: 'high',
  validate: 'high',
  status: 'high',
  update: 'medium',
  expire: 'medium',
  renew: 'medium',
  login_failed: 'medium',
  login: 'info',
  logout: 'info',
  payment: 'info',
  booking: 'info',
  export: 'low',
  reactivate: 'low',
};

/* Libellé de module (entité) aligné sur les options de filtre UI. */
export const ENTITE_MODULE = {
  auth: 'Authentification',
  utilisateur: 'Utilisateurs',
  compagnie: 'Compagnies',
  abonnement: 'Abonnements',
  plan: 'Abonnements',
  paiement: 'Paiements',
  voyage: 'Voyages',
  billet: 'Réservations',
  parametre: 'Paramètres',
};

/* Module (libellé UI) → entité API, pour la requête serveur. */
export const MODULE_TO_ENTITE = Object.fromEntries(
  Object.entries(ENTITE_MODULE).map(([k, v]) => [v, k])
);

/* Statut UI déduit : seul l'échec de connexion est marqué Échec. */
const uiStatus = (action) => (action === 'login_failed' ? 'Échec' : 'Succès');

/** Met en forme une entrée du journal d'audit → événement AdminAudit*. */
export const mapAuditLog = (row) => {
  const action = row.action || 'update';
  const module = ENTITE_MODULE[row.entite] || row.entite || 'Système';
  const utilisateur = row.utilisateur || 'Système';
  const details = row.details && typeof row.details === 'object' ? row.details : {};
  const datetime = row.date ? new Date(row.date) : null;
  const dateStr = datetime ? datetime.toISOString().slice(0, 10) : '';
  const actionLabel = ACTION_LABELS[action] || `Action ${action}`;
  return {
    id: String(row.id),
    date: dateStr,
    time: datetime ? datetime.toISOString().slice(11, 19) : '',
    datetime: row.date || null,
    user: { id: row.entiteId, name: utilisateur, role: row.role || 'système', company: '-' },
    action,
    actionLabel,
    module,
    severity: ACTION_SEVERITY[action] || 'low',
    status: uiStatus(action),
    description: `${actionLabel} (${module})${row.entiteId ? ` — #${row.entiteId}` : ''}`,
    ip: row.ip || '-',
    browser: '-',
    os: '-',
    device: '-',
    details: {
      ...details,
      ref: `AUD-${String(row.id).padStart(6, '0')}`,
      result: action === 'login_failed' ? 'Opération échouée' : 'Opération réussie',
      entiteId: row.entiteId ?? null,
    },
  };
};

/** Construit les 10 cartes KPI AdminAuditStats à partir des stats API. */
export const mapAuditStats = (s) => {
  const byAction = s.byAction || {};
  const total = s.total || 0;
  return {
    totalEvents: { label: 'Total événements', value: total, trend: 0, icon: 'fa-list' },
    loginsToday: { label: 'Connexions', value: s.logins || 0, trend: 0, icon: 'fa-right-to-bracket' },
    failedLogins: { label: 'Échecs de connexion', value: s.failedLogins || 0, trend: 0, icon: 'fa-lock' },
    criticalActions: { label: 'Actions critiques', value: s.criticals || 0, trend: 0, icon: 'fa-bolt' },
    creations: { label: 'Créations', value: s.creations || 0, trend: 0, icon: 'fa-plus-circle' },
    modifications: { label: 'Modifications', value: s.modifications || 0, trend: 0, icon: 'fa-pen' },
    deletions: { label: 'Suppressions', value: s.deletions || 0, trend: 0, icon: 'fa-trash' },
    validations: { label: 'Validations', value: s.validations || 0, trend: 0, icon: 'fa-check-circle' },
    refusals: { label: 'Refus', value: byAction.reject || 0, trend: 0, icon: 'fa-ban' },
    securityAlerts: { label: 'Alertes sécurité', value: (byAction.permission_change || 0) + (byAction.suspend || 0), trend: 0, icon: 'fa-shield' },
  };
};

/** Traduit les filtres UI (formulaire AdminAuditFilters) → paramètres API. */
export const toAuditQuery = (filters = {}) => {
  const q = { limit: 100 };
  if (filters.search) q.search = filters.search;
  if (filters.action) q.action = filters.action;
  if (filters.module) q.entite = MODULE_TO_ENTITE[filters.module];
  if (filters.dateFrom) q.dateDebut = filters.dateFrom;
  if (filters.dateTo) q.dateFin = filters.dateTo;
  return q;
};

/* Filtres restés côté client (champs non exposés par l'API : utilisateur,
   compagnie, IP, gravité, statut). Compatibles avec la logique UI existante. */
export const filterEvents = (events, filters = {}) =>
  events.filter((e) => {
    if (filters.user && e.user?.name !== filters.user) return false;
    if (filters.role && e.user?.role !== filters.role) return false;
    if (filters.company && e.user?.company !== filters.company) return false;
    if (filters.ip && e.ip !== filters.ip) return false;
    if (filters.severity && e.severity !== filters.severity) return false;
    if (filters.status && e.status !== filters.status) return false;
    return true;
  });

export const paginateEvents = (events, page = 1, perPage = 25) => {
  const start = (page - 1) * perPage;
  return {
    items: events.slice(start, start + perPage),
    total: events.length,
    page,
    perPage,
    totalPages: Math.ceil(events.length / perPage),
  };
};

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
