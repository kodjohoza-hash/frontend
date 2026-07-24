export const companyInfo = {
  name: 'Guillaume Express',
  slogan: 'Votre partenaire de confiance pour tous vos déplacements',
  logo: null,
  plan: 'Premium',
  since: '2024',
  rating: 4.7,
  totalReviews: 1284,
};

export const sidebarMenus = [
  { section: 'Principal', items: [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'bi-speedometer2', to: '/company/dashboard' },
    { id: 'trips', label: 'Voyages', icon: 'bi-signpost-2', to: '/company/trips', badge: 12 },
    { id: 'bookings', label: 'Réservations', icon: 'bi-ticket-perforated', to: '/company/bookings', badge: 48 },
  ]},
  { section: 'Flotte', items: [
    { id: 'buses', label: 'Bus', icon: 'bi-bus-front-fill', to: '/company/buses' },
    { id: 'drivers', label: 'Chauffeurs', icon: 'bi-person-badge', to: '/company/drivers' },
    { id: 'schedules', label: 'Horaires', icon: 'bi-calendar-week', to: '/company/schedules' },
    { id: 'pricing', label: 'Tarifs', icon: 'bi-cash-stack', to: '/company/pricing' },
  ]},
  { section: 'Points de vente', items: [
    { id: 'counters', label: 'Agents de guichet', icon: 'bi-shop', to: '/company/counters' },
    { id: 'outlets', label: 'Points de vente', icon: 'bi-geo-alt', to: '/company/outlets' },
  ]},
  { section: 'Finance', items: [
    { id: 'clients', label: 'Clients', icon: 'bi-people', to: '/company/clients' },
    { id: 'payments', label: 'Paiements', icon: 'bi-credit-card', to: '/company/payments' },
    { id: 'reports', label: 'Rapports', icon: 'bi-bar-chart-line', to: '/company/reports' },
  ]},
  { section: 'Communication', items: [
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell', to: '/company/notifications', badge: 5 },
    { id: 'messages', label: 'Messagerie', icon: 'bi-chat-dots', to: '/company/messages', badge: 2 },
  ]},
  { section: 'Système', items: [
    { id: 'settings', label: 'Paramètres', icon: 'bi-gear', to: '/company/settings' },
    { id: 'support', label: 'Centre d\'aide', icon: 'bi-question-circle', to: '/company/support' },
  ]},
];

export const statCards = [
  { id: 'voyages', label: 'Voyages aujourd\'hui', value: 12, icon: 'bi-signpost-2', trend: '+2', trendUp: true, color: 'primary' },
  { id: 'reservations', label: 'Réservations', value: 48, icon: 'bi-ticket-perforated', trend: '+8', trendUp: true, color: 'accent' },
  { id: 'revenue', label: 'Chiffre d\'affaires', value: '2.4M', suffix: 'FCFA', icon: 'bi-cash-stack', trend: '+12%', trendUp: true, color: 'success' },
  { id: 'occupancy', label: 'Taux de remplissage', value: 78, suffix: '%', icon: 'bi-people-fill', trend: '+5%', trendUp: true, color: 'info' },
  { id: 'buses', label: 'Bus actifs', value: 8, suffix: '/10', icon: 'bi-bus-front-fill', trend: '2 en maintenance', trendUp: false, color: 'warning' },
  { id: 'drivers', label: 'Chauffeurs disponibles', value: 14, suffix: '/16', icon: 'bi-person-badge', trend: '2 repos', trendUp: false, color: 'muted' },
];

export const todayTrips = [
  { id: 'TR-001', from: 'Douala', to: 'Yaoundé', departure: '06:00', arrival: '09:15', bus: 'Bus VIP-01', driver: 'Jean Mbarga', seats: { total: 45, sold: 42 }, status: 'en_cours', company: 'Guillaume Express' },
  { id: 'TR-002', from: 'Yaoundé', to: 'Bafoussam', departure: '07:30', arrival: '11:45', bus: 'Bus Standard-03', driver: 'Paul Ndjock', seats: { total: 50, sold: 38 }, status: 'programme', company: 'Guillaume Express' },
  { id: 'TR-003', from: 'Douala', to: 'Bamenda', departure: '08:00', arrival: '14:30', bus: 'Bus VIP-02', driver: 'Marie Tchidjou', seats: { total: 45, sold: 44 }, status: 'programme', company: 'Guillaume Express' },
  { id: 'TR-004', from: 'Yaoundé', to: 'Kribi', departure: '09:00', arrival: '12:30', bus: 'Bus Confort-01', driver: 'Pierre Kamga', seats: { total: 40, sold: 22 }, status: 'programme', company: 'Guillaume Express' },
  { id: 'TR-005', from: 'Douala', to: 'Garoua', departure: '10:00', arrival: '20:00', bus: 'Bus VIP-03', driver: 'Ahmadou Bello', seats: { total: 45, sold: 31 }, status: 'programme', company: 'Guillaume Express' },
  { id: 'TR-006', from: 'Yaoundé', to: 'Ebolowa', departure: '11:00', arrival: '14:00', bus: 'Bus Standard-01', driver: 'Lucie Ngono', seats: { total: 50, sold: 15 }, status: 'programme', company: 'Guillaume Express' },
];

export const recentActivity = [
  { id: 1, type: 'booking', icon: 'bi-ticket-perforated', color: 'accent', message: 'Nouvelle réservation BK-2026-1847 pour le trajet Douala → Yaoundé', time: 'Il y a 5min', read: false },
  { id: 2, type: 'payment', icon: 'bi-credit-card', color: 'success', message: 'Paiement reçu : 8 500 FCFA — Réservation BK-2026-1845', time: 'Il y a 12min', read: false },
  { id: 3, type: 'trip', icon: 'bi-signpost-2', color: 'info', message: 'Le bus VIP-01 a quitté Douala pour Yaoundé (TR-001)', time: 'Il y a 1h', read: true },
  { id: 4, type: 'driver', icon: 'bi-person-badge', color: 'warning', message: 'Chauffeur Jean Mbarga a confirmé sa disponibilité pour demain', time: 'Il y a 2h', read: true },
  { id: 5, type: 'alert', icon: 'bi-exclamation-triangle', color: 'danger', message: 'Bus Standard-02 en maintenance prévue — 3 jours d\'indisponibilité', time: 'Il y a 3h', read: true },
  { id: 6, type: 'booking', icon: 'bi-ticket-perforated', color: 'accent', message: 'Annulation réservation BK-2026-1842 — remboursement en cours', time: 'Il y a 4h', read: true },
  { id: 7, type: 'client', icon: 'bi-person-plus', color: 'primary', message: 'Nouveau client inscrit : Fatima Souleymane', time: 'Il y a 5h', read: true },
];

export const alerts = [
  { id: 1, level: 'danger', icon: 'bi-exclamation-octagon', title: 'Bus en panne', message: 'Bus Standard-02 immobilisé — révision moteur en cours', action: 'Voir détails' },
  { id: 2, level: 'warning', icon: 'bi-exclamation-triangle', title: 'Sous-effectif', message: '2 chauffeurs indisponibles demain — réassignation nécessaire', action: 'Planifier' },
  { id: 3, level: 'info', icon: 'bi-info-circle', title: 'Mise à jour système', message: 'Maintenance serveur prévue ce weekend (23h-02h)', action: 'En savoir plus' },
];

export const quickStats = {
  todayRevenue: '2 450 000',
  weeklyRevenue: '14 800 000',
  monthlyRevenue: '58 200 000',
  averageOccupancy: 78,
  cancelRate: 3.2,
  customerSatisfaction: 4.7,
};
