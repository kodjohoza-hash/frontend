export const agentInfo = {
  id: 'AGT-001',
  firstName: 'Marie',
  lastName: 'Kamga',
  email: 'marie.kamga@express-bus.cm',
  phone: '+237 691 234 567',
  role: 'Agent de guichet',
  branch: 'Gare Routière de Mvog-Mbi',
  branchId: 'BR-001',
  company: 'Express Bus Cameroun',
  joinDate: '2023-06-15',
  employeeId: 'EMP-042',
};

export const dashboardStats = [
  { id: 'tickets', label: 'Billets vendus', value: 47, icon: 'bi-ticket-perforated', trend: 12, trendUp: true, color: 'primary' },
  { id: 'bookings', label: 'Réservations', value: 23, icon: 'bi-calendar-check', trend: 5, trendUp: true, color: 'accent' },
  { id: 'payments', label: 'Paiements encaissés', value: '485k', suffix: 'FCFA', icon: 'bi-cash-coin', trend: 8, trendUp: true, color: 'success' },
  { id: 'clients', label: 'Clients servis', value: 89, icon: 'bi-people', trend: 15, trendUp: true, color: 'info' },
  { id: 'cancellations', label: 'Annulations', value: 3, icon: 'bi-x-circle', trend: -2, trendUp: false, color: 'danger' },
  { id: 'revenue', label: 'Chiffre d\'affaires', value: '1 285', suffix: 'k FCFA', icon: 'bi-graph-up-arrow', trend: 18, trendUp: true, color: 'purple' },
];

export const activityTimeline = [
  { id: 1, type: 'vente', icon: 'bi-ticket-perforated', color: 'success', action: 'Vente de billet', detail: 'Douala → Yaoundé — 2 places — 8 500 FCFA', time: '08:32' },
  { id: 2, type: 'reservation', icon: 'bi-calendar-check', color: 'primary', action: 'Nouvelle réservation', detail: 'BK-2026-1890 — Yaoundé → Bafoussam — 1 place', time: '09:15' },
  { id: 3, type: 'paiement', icon: 'bi-cash-coin', color: 'success', action: 'Paiement reçu', detail: '12 500 FCFA — Réservation BK-2026-1885', time: '09:47' },
  { id: 4, type: 'annulation', icon: 'bi-x-circle', color: 'danger', action: 'Réservation annulée', detail: 'BK-2026-1878 — Douala → Bamenda — Remboursement', time: '10:05' },
  { id: 5, type: 'impression', icon: 'bi-printer', color: 'info', action: 'Impression de billet', detail: 'Billet BT-2026-0912 — 2 passagers', time: '10:30' },
  { id: 6, type: 'vente', icon: 'bi-ticket-perforated', color: 'success', action: 'Vente de billet', detail: 'Douala → Garoua — 1 place — 25 000 FCFA', time: '10:55' },
  { id: 7, type: 'reservation', icon: 'bi-calendar-check', color: 'primary', action: 'Nouvelle réservation', detail: 'BK-2026-1892 — Yaoundé → Kribi — 3 places', time: '11:20' },
  { id: 8, type: 'paiement', icon: 'bi-cash-coin', color: 'success', action: 'Paiement reçu', detail: '18 000 FCFA — Réservation BK-2026-1888', time: '11:45' },
];

export const upcomingTrips = [
  { id: 'TR-010', from: 'Yaoundé', to: 'Douala', departure: '12:00', arrival: '14:15', bus: 'Bus Confort-02', seats: { total: 50, sold: 48 }, status: 'bientot_complet' },
  { id: 'TR-011', from: 'Yaoundé', to: 'Bafoussam', departure: '13:00', arrival: '17:15', bus: 'Bus Standard-04', seats: { total: 50, sold: 35 }, status: 'disponible' },
  { id: 'TR-012', from: 'Yaoundé', to: 'Kribi', departure: '14:00', arrival: '17:30', bus: 'Bus Confort-03', seats: { total: 40, sold: 40 }, status: 'complet' },
  { id: 'TR-013', from: 'Yaoundé', to: 'Garoua', departure: '15:00', arrival: '01:00', bus: 'Bus VIP-04', seats: { total: 45, sold: 28 }, status: 'disponible' },
  { id: 'TR-014', from: 'Yaoundé', to: 'Ebolowa', departure: '16:00', arrival: '19:00', bus: 'Bus Standard-02', seats: { total: 50, sold: 18 }, status: 'disponible' },
];

export const alerts = [
  { id: 1, type: 'warning', title: 'Voyage bientôt complet', text: 'TR-010 — Yaoundé → Douala — <strong>Plus que 2 places</strong> disponibles' },
  { id: 2, type: 'info', title: 'Paiement en attente', text: 'BK-2026-1889 — 8 500 FCFA — En attente de confirmation' },
  { id: 3, type: 'success', title: 'Billet à imprimer', text: 'BT-2026-0915 — 3 passagers — En attente d\'impression' },
  { id: 4, type: 'primary', title: 'Nouveau message', text: 'M. Jean Ndongo — Question sur le départ de 14h' },
  { id: 5, type: 'accent', title: 'Nouvelle notification', text: 'Rappel : Maintenance du système à 23h' },
];

export const quickActions = [
  { id: 1, label: 'Nouvelle vente', icon: 'bi-cart-plus', desc: 'Vendre un billet', color: 'accent', link: '/counter/sale' },
  { id: 2, label: 'Nouvelle réservation', icon: 'bi-calendar-plus', desc: 'Réserver un voyage', color: 'primary', link: '/counter/bookings' },
  { id: 3, label: 'Rechercher un client', icon: 'bi-search', desc: 'Trouver un client', color: 'info', link: '/counter/bookings' },
  { id: 4, label: 'Vérifier un billet', icon: 'bi-upc-scan', desc: 'Scanner un billet', color: 'purple', link: '/counter/tickets' },
  { id: 5, label: 'Imprimer un billet', icon: 'bi-printer', desc: 'Imprimer un billet', color: 'success', link: '/counter/tickets' },
  { id: 6, label: 'Encaisser un paiement', icon: 'bi-cash-stack', desc: 'Recevoir un paiement', color: 'warning', link: '/counter/sale' },
];

export const recentNotifications = [
  { id: 1, title: 'Voyage complet', message: 'TR-012 Yaoundé → Kribi — Complet', time: '10min', unread: true, color: 'danger' },
  { id: 2, title: 'Paiement reçu', message: '12 500 FCFA — BK-2026-1885', time: '25min', unread: true, color: 'success' },
  { id: 3, title: 'Rappel départ', message: 'TR-010 Yaoundé → Douala dans 30min', time: '1h', unread: false, color: 'info' },
  { id: 4, title: 'Mise à jour', message: 'Nouveau tarif disponible pour Kribi', time: '2h', unread: false, color: 'primary' },
];

export const recentConversations = [
  { id: 1, name: 'Jean Ndongo', avatar: 'JN', lastMessage: 'Bonjour, le bus pour Douala part à quelle heure ?', time: '10min', unread: true, online: true },
  { id: 2, name: 'Fatima Souleymane', avatar: 'FS', lastMessage: 'Merci pour votre aide !', time: '1h', unread: false, online: false },
  { id: 3, name: 'Paul Biya', avatar: 'PB', lastMessage: 'Je voudrais annuler ma réservation BK-2026-1878', time: '2h', unread: false, online: false },
  { id: 4, name: 'Super Admin', avatar: 'SA', lastMessage: 'N\'oubliez pas la maintenance de ce soir', time: '3h', unread: true, online: true },
];

export const sidebarMenus = [
  {
    section: 'Menu principal',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'bi-speedometer2', to: '/counter/dashboard' },
      { id: 'sale', label: 'Nouvelle vente', icon: 'bi-cart-plus', to: '/counter/sale' },
      { id: 'bookings', label: 'Réservations', icon: 'bi-ticket-perforated', to: '/counter/bookings' },
      { id: 'tickets', label: 'Billets', icon: 'bi-postcard', to: '/counter/tickets' },
    ],
  },
  {
    section: 'Compte',
    items: [
      { id: 'profile', label: 'Mon profil', icon: 'bi-person', to: '/counter/profile' },
    ],
  },
];

export default {
  agentInfo,
  dashboardStats,
  activityTimeline,
  upcomingTrips,
  alerts,
  quickActions,
  recentNotifications,
  recentConversations,
  sidebarMenus,
};
