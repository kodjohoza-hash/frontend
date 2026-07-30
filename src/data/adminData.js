export const adminProfile = {
  id: 'SUPER-001',
  firstName: 'Kodjo',
  lastName: 'Jojo',
  email: 'kodjo.jojo@bus-tix-connect.com',
  phone: '+237 690 000 001',
  role: 'Super Administrateur',
  avatar: 'KJ',
  lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  status: 'online',
  joinDate: '2022-01-15',
};

export const adminStats = [
  { id: 'companies', label: 'Compagnies', value: 24, icon: 'bi-building', color: 'primary', trend: 12, trendUp: true },
  { id: 'active_companies', label: 'Compagnies actives', value: 18, icon: 'bi-building-check', color: 'success', trend: 8, trendUp: true },
  { id: 'users', label: 'Utilisateurs inscrits', value: '12 847', icon: 'bi-people', color: 'info', trend: 22, trendUp: true },
  { id: 'clients', label: 'Clients', value: '11 230', icon: 'bi-person-badge', color: 'primary', trend: 18, trendUp: true },
  { id: 'admins', label: 'Admin. compagnie', value: 42, icon: 'bi-person-gear', color: 'purple', trend: 4, trendUp: true },
  { id: 'agents', label: 'Agents de guichet', value: 156, icon: 'bi-person-workspace', color: 'accent', trend: 15, trendUp: true },
  { id: 'trips', label: 'Voyages publiés', value: '3 420', icon: 'bi-bus-front', color: 'info', trend: 10, trendUp: true },
  { id: 'bookings', label: 'Réservations', value: '18 745', icon: 'bi-calendar-check', color: 'success', trend: 25, trendUp: true },
  { id: 'tickets', label: 'Billets vendus', value: '52 380', icon: 'bi-ticket-perforated', color: 'accent', trend: 30, trendUp: true },
  { id: 'transactions', label: 'Transactions', value: '45 210', icon: 'bi-credit-card', color: 'purple', trend: 20, trendUp: true },
  { id: 'revenue', label: "Chiffre d'affaires", value: '285 000 000', suffix: 'FCFA', icon: 'bi-graph-up-arrow', color: 'success', trend: 35, trendUp: true },
  { id: 'commission', label: 'Commission BTC', value: '14 250 000', suffix: 'FCFA', icon: 'bi-cash-coin', color: 'primary', trend: 28, trendUp: true },
  { id: 'new_users_today', label: 'Nouveaux aujourd\'hui', value: 48, icon: 'bi-person-plus', color: 'info', trend: 0, trendUp: true },
  { id: 'new_companies', label: 'Nouvelles compagnies', value: 3, icon: 'bi-building-add', color: 'success', trend: 1, trendUp: true },
  { id: 'incidents', label: 'Incidents ouverts', value: 7, icon: 'bi-exclamation-triangle', color: 'danger', trend: -2, trendUp: false },
  { id: 'criticals', label: 'Alertes critiques', value: 2, icon: 'bi-bell-fill', color: 'danger', trend: -1, trendUp: false },
];

export const chartData = {
  signups: [
    { month: 'Jan', clients: 420, companies: 8, agents: 25 },
    { month: 'Fév', clients: 480, companies: 10, agents: 30 },
    { month: 'Mar', clients: 560, companies: 12, agents: 35 },
    { month: 'Avr', clients: 620, companies: 14, agents: 40 },
    { month: 'Mai', clients: 700, companies: 16, agents: 45 },
    { month: 'Juin', clients: 780, companies: 18, agents: 52 },
    { month: 'Juil', clients: 850, companies: 20, agents: 58 },
    { month: 'Aoû', clients: 920, companies: 22, agents: 65 },
    { month: 'Sep', clients: 1000, companies: 24, agents: 72 },
    { month: 'Oct', clients: 1080, companies: 26, agents: 80 },
    { month: 'Nov', clients: 1150, companies: 28, agents: 88 },
    { month: 'Déc', clients: 1250, companies: 30, agents: 96 },
  ],
  revenue: [
    { month: 'Jan', revenue: 18500000, commission: 925000 },
    { month: 'Fév', revenue: 20200000, commission: 1010000 },
    { month: 'Mar', revenue: 22400000, commission: 1120000 },
    { month: 'Avr', revenue: 24800000, commission: 1240000 },
    { month: 'Mai', revenue: 27500000, commission: 1375000 },
    { month: 'Juin', revenue: 31000000, commission: 1550000 },
    { month: 'Juil', revenue: 34200000, commission: 1710000 },
    { month: 'Aoû', revenue: 37800000, commission: 1890000 },
    { month: 'Sep', revenue: 41000000, commission: 2050000 },
    { month: 'Oct', revenue: 44500000, commission: 2225000 },
    { month: 'Nov', revenue: 48000000, commission: 2400000 },
    { month: 'Déc', revenue: 52000000, commission: 2600000 },
  ],
  bookingsPerDay: [
    { day: 'Lun', bookings: 145, revenue: 4350000 },
    { day: 'Mar', bookings: 132, revenue: 3960000 },
    { day: 'Mer', bookings: 158, revenue: 4740000 },
    { day: 'Jeu', bookings: 165, revenue: 4950000 },
    { day: 'Ven', bookings: 210, revenue: 6300000 },
    { day: 'Sam', bookings: 198, revenue: 5940000 },
    { day: 'Dim', bookings: 120, revenue: 3600000 },
  ],
  userDistribution: [
    { name: 'Clients', value: 11230, color: '#6366F1' },
    { name: 'Agents', value: 156, color: '#FF6B35' },
    { name: 'Admin Comp.', value: 42, color: '#10B981' },
    { name: 'Super Admin', value: 1, color: '#8B5CF6' },
  ],
  companyGrowth: [
    { month: 'Jan', count: 8 },
    { month: 'Fév', count: 8 },
    { month: 'Mar', count: 9 },
    { month: 'Avr', count: 10 },
    { month: 'Mai', count: 12 },
    { month: 'Juin', count: 14 },
    { month: 'Juil', count: 16 },
    { month: 'Aoû', count: 18 },
    { month: 'Sep', count: 20 },
    { month: 'Oct', count: 22 },
    { month: 'Nov', count: 23 },
    { month: 'Déc', count: 24 },
  ],
};

export const topCompanies = [
  { id: 1, name: 'Express Bus Cameroun', logo: 'EB', tickets: 15230, trips: 840, revenue: 82450000, satisfaction: 94, growth: 18 },
  { id: 2, name: 'Finex Voyages', logo: 'FV', tickets: 11840, trips: 620, revenue: 63200000, satisfaction: 91, growth: 15 },
  { id: 3, name: 'Buca Voyages', logo: 'BV', tickets: 9870, trips: 510, revenue: 52180000, satisfaction: 88, growth: 12 },
  { id: 4, name: 'Capitaine Voyages', logo: 'CV', tickets: 8230, trips: 430, revenue: 44500000, satisfaction: 92, growth: 20 },
  { id: 5, name: 'Touristique Express', logo: 'TE', tickets: 6840, trips: 380, revenue: 36800000, satisfaction: 86, growth: 8 },
];

export const transactions = [
  { id: 'TXN-001', company: 'Express Bus', amount: 1250000, commission: 62500, status: 'completed', date: '2026-07-30T10:30:00', method: 'Carte' },
  { id: 'TXN-002', company: 'Finex Voyages', amount: 890000, commission: 44500, status: 'completed', date: '2026-07-30T10:15:00', method: 'Mobile' },
  { id: 'TXN-003', company: 'Buca Voyages', amount: 2450000, commission: 122500, status: 'pending', date: '2026-07-30T09:45:00', method: 'Espèces' },
  { id: 'TXN-004', company: 'Capitaine', amount: 560000, commission: 28000, status: 'completed', date: '2026-07-30T09:20:00', method: 'Carte' },
  { id: 'TXN-005', company: 'Touristique Express', amount: 1780000, commission: 89000, status: 'failed', date: '2026-07-30T08:55:00', method: 'Mobile' },
  { id: 'TXN-006', company: 'Express Bus', amount: 3200000, commission: 160000, status: 'completed', date: '2026-07-29T18:00:00', method: 'Virement' },
  { id: 'TXN-007', company: 'Finex Voyages', amount: 950000, commission: 47500, status: 'completed', date: '2026-07-29T16:30:00', method: 'Carte' },
  { id: 'TXN-008', company: 'Buca Voyages', amount: 670000, commission: 33500, status: 'refunded', date: '2026-07-29T14:15:00', method: 'Mobile' },
];

export const statusConfig = {
  completed: { label: 'Complété', class: 'adm-badge--success' },
  pending: { label: 'En attente', class: 'adm-badge--warning' },
  failed: { label: 'Échoué', class: 'adm-badge--danger' },
  refunded: { label: 'Remboursé', class: 'adm-badge--info' },
};

export const activityTimeline = [
  { id: 1, type: 'company', icon: 'bi-building', color: 'primary', action: 'Nouvelle compagnie inscrite', detail: 'Express Bus Cameroun — en attente de validation', time: '12:30' },
  { id: 2, type: 'user', icon: 'bi-person-plus', color: 'success', action: 'Nouvel utilisateur inscrit', detail: 'Marie Kamga — Agent de guichet — Express Bus', time: '11:45' },
  { id: 3, type: 'validation', icon: 'bi-check-circle', color: 'success', action: 'Compagnie validée', detail: 'Finex Voyages — Compte activé par Super Admin', time: '10:20' },
  { id: 4, type: 'booking', icon: 'bi-calendar-check', color: 'info', action: 'Nouvelle réservation', detail: 'BK-2026-1950 — Yaoundé → Douala — 12 500 FCFA', time: '10:05' },
  { id: 5, type: 'payment', icon: 'bi-cash-coin', color: 'success', action: 'Paiement reçu', detail: 'TXN-001 — Express Bus — 1 250 000 FCFA', time: '09:30' },
  { id: 6, type: 'incident', icon: 'bi-exclamation-triangle', color: 'danger', action: 'Incident signalé', detail: 'Paiement échoué — Touristique Express — TXN-005', time: '08:55' },
  { id: 7, type: 'login', icon: 'bi-shield-check', color: 'primary', action: 'Connexion administrateur', detail: 'Admin Guillaume — Finex Voyages', time: '08:30' },
  { id: 8, type: 'system', icon: 'bi-arrow-repeat', color: 'purple', action: 'Mise à jour système', detail: 'Déploiement v3.2.1 — Base de données optimisée', time: '03:00' },
];

export const alerts = [
  { id: 1, type: 'warning', title: 'Compagnie en attente', message: '3 compagnies en attente de validation — Express Bus, Finex Voyages, Buca Voyages', time: '2h' },
  { id: 2, type: 'danger', title: 'Paiement échoué', message: 'TXN-005 — 1 780 000 FCFA — Touristique Express — Échec de transaction', time: '4h' },
  { id: 3, type: 'danger', title: 'Tentative suspecte', message: 'Connexion depuis une IP inconnue — Admin Guillaume — 15:30', time: '1h' },
  { id: 4, type: 'info', title: 'Demande de support', message: 'Express Bus — Problème de configuration API — Ticket #SP-042', time: '30min' },
  { id: 5, type: 'warning', title: 'Erreur système', message: 'Taux d\'erreur API > 5% — Dernières 15 minutes', time: '20min' },
  { id: 6, type: 'warning', title: 'API indisponible', message: 'API de paiement Mobile — Temps de réponse > 5s', time: '10min' },
  { id: 7, type: 'info', title: 'Stockage faible', message: 'Espace disque — 78% utilisé — Planifier une extension', time: '5min' },
];

export const quickActions = [
  { id: 1, label: 'Nouvelle compagnie', icon: 'bi-building-add', desc: 'Ajouter une compagnie', color: 'primary', link: '/super-admin/companies' },
  { id: 2, label: 'Nouvel administrateur', icon: 'bi-person-gear', desc: 'Créer un admin compagnie', color: 'purple', link: '/super-admin/users' },
  { id: 3, label: 'Nouvel agent', icon: 'bi-person-workspace', desc: 'Créer un agent de guichet', color: 'accent', link: '/super-admin/users' },
  { id: 4, label: 'Rapports', icon: 'bi-file-earmark-bar-graph', desc: 'Voir les rapports', color: 'success', link: '/super-admin/reports' },
  { id: 5, label: 'Utilisateurs', icon: 'bi-people', desc: 'Gérer les utilisateurs', color: 'info', link: '/super-admin/users' },
  { id: 6, label: 'Transactions', icon: 'bi-credit-card', desc: 'Voir les transactions', color: 'warning', link: '/super-admin/reports' },
  { id: 7, label: 'Incidents', icon: 'bi-exclamation-triangle', desc: 'Voir les incidents', color: 'danger', link: '/super-admin/settings' },
  { id: 8, label: 'Abonnements', icon: 'bi-box-seam', desc: 'Gérer les abonnements', color: 'primary', link: '/super-admin/subscriptions' },
];

export const adminSidebarMenus = [
  {
    section: 'Menu principal',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'bi-speedometer2', to: '/super-admin/dashboard' },
    ],
  },
  {
    section: 'Gestion',
    items: [
      { id: 'companies', label: 'Compagnies', icon: 'bi-building', to: '/super-admin/companies' },
      { id: 'users', label: 'Utilisateurs', icon: 'bi-people', to: '/super-admin/users' },
      { id: 'roles', label: 'Rôles', icon: 'bi-shield-lock', to: '/super-admin/roles' },
      { id: 'approval', label: 'Approbations', icon: 'bi-clipboard-check', to: '/super-admin/approval' },
      { id: 'subscriptions', label: 'Abonnements', icon: 'bi-box-seam', to: '/super-admin/subscriptions' },
      { id: 'commissions', label: 'Commissions', icon: 'bi-percent', to: '/super-admin/commissions' },
    ],
  },
  {
    section: 'Analytique',
    items: [
      { id: 'reports', label: 'Rapports', icon: 'bi-bar-chart-line', to: '/super-admin/reports' },
    ],
  },
  {
    section: 'Communications',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'bi-bell', to: '/super-admin/notifications' },
      { id: 'support', label: 'Support', icon: 'bi-headset', to: '/super-admin/support' },
      { id: 'integrations', label: 'Intégrations & API', icon: 'bi-puzzle', to: '/super-admin/integrations' },
    ],
  },
  {
    section: 'Système',
    items: [
      { id: 'audit', label: 'Audit & Surveillance', icon: 'bi-shield-check', to: '/super-admin/audit' },
      { id: 'backup', label: 'Sauvegarde & Reprise', icon: 'bi-shield-fill-check', to: '/super-admin/backup' },
      { id: 'settings', label: 'Paramètres', icon: 'bi-gear', to: '/super-admin/settings' },
    ],
  },
];

export const notifications = [
  { id: 1, title: 'Nouvelle compagnie', message: 'Express Bus Cameroun s\'est inscrite', time: '2h', unread: true, color: 'primary' },
  { id: 2, title: 'Incident critique', message: 'Paiement échoué répété sur Touristique Express', time: '4h', unread: true, color: 'danger' },
  { id: 3, title: 'Validation requise', message: '3 compagnies en attente de validation', time: '5h', unread: false, color: 'warning' },
];

export const conversations = [
  { id: 1, name: 'Admin Guillaume', avatar: 'AG', lastMessage: 'Bonjour, j\'ai un problème avec l\'API de paiement', time: '30min', unread: true, online: true },
  { id: 2, name: 'Support Technique', avatar: 'ST', lastMessage: 'La maintenance est prévue à 23h', time: '1h', unread: false, online: true },
];

const adminData = {
  adminProfile,
  adminStats,
  chartData,
  topCompanies,
  transactions,
  statusConfig,
  activityTimeline,
  alerts,
  quickActions,
  adminSidebarMenus,
  notifications,
  conversations,
};

export default adminData;
