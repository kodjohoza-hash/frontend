export const KPI_DATA = [
  { id: 'revenue', label: "Chiffre d'affaires", value: '32.5M', suffix: ' FCFA', icon: 'bi-cash-stack', color: 'accent', trend: '+18.2%', trendUp: true, data: [18,22,20,25,23,28,26,30,29,32,31,33] },
  { id: 'bookings', label: 'Réservations', value: '2,847', suffix: '', icon: 'bi-ticket-perforated', color: 'primary', trend: '+12.5%', trendUp: true, data: [180,210,195,240,220,260,250,280,270,290,285,285] },
  { id: 'tickets', label: 'Billets vendus', value: '3,412', suffix: '', icon: 'bi-postcard', color: 'info', trend: '+10.3%', trendUp: true, data: [210,250,230,280,260,310,290,340,320,350,340,341] },
  { id: 'trips', label: 'Voyages effectués', value: '1,256', suffix: '', icon: 'bi-signpost-2', color: 'success', trend: '+8.7%', trendUp: true, data: [85,92,88,100,95,108,102,115,110,120,118,126] },
  { id: 'buses', label: 'Bus actifs', value: '24', suffix: '', icon: 'bi-bus-front-fill', color: 'primary', trend: '+2', trendUp: true, data: [18,19,19,20,20,21,21,22,22,23,23,24] },
  { id: 'drivers', label: 'Chauffeurs actifs', value: '31', suffix: '', icon: 'bi-person-badge', color: 'info', trend: '+3', trendUp: true, data: [24,25,25,26,27,27,28,29,29,30,30,31] },
  { id: 'outlets', label: 'Points de vente actifs', value: '8', suffix: '', icon: 'bi-geo-alt', color: 'accent', trend: '+1', trendUp: true, data: [5,5,6,6,6,7,7,7,7,8,8,8] },
  { id: 'agents', label: 'Agents connectés', value: '42', suffix: '', icon: 'bi-people', color: 'success', trend: '+5', trendUp: true, data: [30,32,33,34,35,36,37,38,39,40,41,42] },
  { id: 'clients', label: 'Clients actifs', value: '1,893', suffix: '', icon: 'bi-person-hearts', color: 'warning', trend: '+156', trendUp: true, data: [1400,1480,1520,1580,1620,1680,1720,1780,1820,1860,1880,1893] },
  { id: 'occupancy', label: "Taux d'occupation", value: '86', suffix: '%', icon: 'bi-pie-chart', color: 'accent', trend: '+4.2%', trendUp: true, data: [72,74,76,78,80,81,82,83,84,85,85,86] },
  { id: 'cancellations', label: 'Annulations', value: '89', suffix: '', icon: 'bi-x-circle', color: 'danger', trend: '+12', trendUp: false, data: [5,6,7,8,7,8,9,8,7,8,8,9] },
  { id: 'refunds', label: 'Remboursements', value: '1.2M', suffix: ' FCFA', icon: 'bi-arrow-counterclockwise', color: 'warning', trend: '+200K', trendUp: false, data: [60,70,80,90,85,95,100,105,110,108,115,120] },
  { id: 'growth', label: 'Croissance', value: '+18.2', suffix: '%', icon: 'bi-graph-up-arrow', color: 'success', trend: 'vs mois dernier', trendUp: true, data: [10,12,11,14,13,15,14,16,15,17,17,18] },
];

export const REVENUE_CHART_DATA = [
  { month: 'Jan', revenue: 1800000, bookings: 180 },
  { month: 'Fév', revenue: 2200000, bookings: 210 },
  { month: 'Mar', revenue: 2000000, bookings: 195 },
  { month: 'Avr', revenue: 2500000, bookings: 240 },
  { month: 'Mai', revenue: 2300000, bookings: 220 },
  { month: 'Jun', revenue: 2800000, bookings: 260 },
  { month: 'Jul', revenue: 2600000, bookings: 250 },
  { month: 'Aoû', revenue: 3000000, bookings: 280 },
  { month: 'Sep', revenue: 2900000, bookings: 270 },
  { month: 'Oct', revenue: 3200000, bookings: 290 },
  { month: 'Nov', revenue: 3100000, bookings: 285 },
  { month: 'Déc', revenue: 3300000, bookings: 285 },
];

export const BOOKING_CHART_DATA = [
  { day: 'Lun', reservations: 42, annulations: 3 },
  { day: 'Mar', reservations: 38, annulations: 5 },
  { day: 'Mer', reservations: 45, annulations: 2 },
  { day: 'Jeu', reservations: 50, annulations: 4 },
  { day: 'Ven', reservations: 58, annulations: 6 },
  { day: 'Sam', reservations: 62, annulations: 3 },
  { day: 'Dim', reservations: 48, annulations: 4 },
];

export const PAYMENT_CHART_DATA = [
  { name: 'Orange Money', value: 38, color: '#FF6600' },
  { name: 'MTN MoMo', value: 32, color: '#FFCC00' },
  { name: 'Carte bancaire', value: 15, color: '#0B1D51' },
  { name: 'Espèces', value: 10, color: '#22C55E' },
  { name: 'Virement', value: 5, color: '#3B82F6' },
];

export const OCCUPANCY_DATA = [
  { bus: 'VIP-01 (Douala-Yaoundé)', occupancy: 92, seats: 45, occupied: 41 },
  { bus: 'Confort-03 (Yaoundé-Bafoussam)', occupancy: 88, seats: 35, occupied: 31 },
  { bus: 'Express-02 (Douala-Bamenda)', occupancy: 85, seats: 40, occupied: 34 },
  { bus: 'Standard-05 (Douala-Kribi)', occupancy: 78, seats: 48, occupied: 37 },
  { bus: 'VIP-04 (Douala-Buea)', occupancy: 95, seats: 45, occupied: 43 },
  { bus: 'Confort-06 (Yaoundé-Bertoua)', occupancy: 72, seats: 35, occupied: 25 },
  { bus: 'Express-07 (Douala-Ngaoundéré)', occupancy: 82, seats: 40, occupied: 33 },
  { bus: 'Standard-08 (Yaoundé-Garoua)', occupancy: 68, seats: 48, occupied: 33 },
];

export const CITY_CHART_DATA = [
  { city: 'Douala', reservations: 1240, revenue: 14200000 },
  { city: 'Yaoundé', reservations: 980, revenue: 10800000 },
  { city: 'Bamenda', reservations: 320, revenue: 3200000 },
  { city: 'Bafoussam', reservations: 280, revenue: 2600000 },
  { city: 'Kribi', reservations: 180, revenue: 1500000 },
  { city: 'Buéa', reservations: 160, revenue: 1400000 },
  { city: 'Bertoua', reservations: 120, revenue: 900000 },
  { city: 'Garoua', reservations: 80, revenue: 600000 },
];

export const TOP_ROUTES_DATA = [
  { id: 1, name: 'Douala → Yaoundé', reservations: 845, revenue: 9200000, percentage: 30, trend: '+12%' },
  { id: 2, name: 'Yaoundé → Bafoussam', reservations: 420, revenue: 4100000, percentage: 15, trend: '+8%' },
  { id: 3, name: 'Douala → Bamenda', reservations: 380, revenue: 3800000, percentage: 13, trend: '+15%' },
  { id: 4, name: 'Douala → Kribi', reservations: 280, revenue: 2400000, percentage: 10, trend: '+5%' },
  { id: 5, name: 'Yaoundé → Bertoua', reservations: 210, revenue: 1900000, percentage: 7, trend: '+3%' },
  { id: 6, name: 'Douala → Buéa', reservations: 190, revenue: 1700000, percentage: 7, trend: '+9%' },
  { id: 7, name: 'Yaoundé → Ngaoundéré', reservations: 160, revenue: 1800000, percentage: 6, trend: '+2%' },
  { id: 8, name: 'Douala → Maroua', reservations: 140, revenue: 1600000, percentage: 5, trend: '+4%' },
];

export const TOP_BRANCHES_DATA = [
  { id: 1, name: 'Point Central Douala', reservations: 980, revenue: 10200000, percentage: 34, agents: 8 },
  { id: 2, name: 'Guichet Yaoundé Central', reservations: 760, revenue: 8100000, percentage: 27, agents: 6 },
  { id: 3, name: 'Guichet Bamenda', reservations: 320, revenue: 3200000, percentage: 11, agents: 3 },
  { id: 4, name: 'Guichet Bafoussam', reservations: 280, revenue: 2600000, percentage: 10, agents: 3 },
  { id: 5, name: 'Point Kribi', reservations: 180, revenue: 1500000, percentage: 6, agents: 2 },
  { id: 6, name: 'Guichet Buéa', reservations: 160, revenue: 1400000, percentage: 5, agents: 2 },
  { id: 7, name: 'Guichet Bertoua', reservations: 120, revenue: 900000, percentage: 4, agents: 2 },
  { id: 8, name: 'Guichet Garoua', reservations: 80, revenue: 600000, percentage: 3, agents: 1 },
];

export const TOP_AGENTS_DATA = [
  { id: 1, name: 'Jean Mbarga', branch: 'Point Central Douala', reservations: 320, revenue: 3400000, rating: 4.9 },
  { id: 2, name: 'Celestin Fotsa', branch: 'Guichet Yaoundé Central', reservations: 280, revenue: 2900000, rating: 4.8 },
  { id: 3, name: 'Paul Atangana', branch: 'Point Central Douala', reservations: 240, revenue: 2500000, rating: 4.7 },
  { id: 4, name: 'Marie Ngo', branch: 'Guichet Bamenda', reservations: 180, revenue: 1800000, rating: 4.6 },
  { id: 5, name: 'Lucien Tchoupo', branch: 'Guichet Bafoussam', reservations: 160, revenue: 1500000, rating: 4.5 },
  { id: 6, name: 'Aimée Ngono', branch: 'Point Kribi', reservations: 140, revenue: 1200000, rating: 4.4 },
];

export const TOP_DRIVERS_DATA = [
  { id: 1, name: 'Emmanuel Ngoumou', trips: 156, rating: 4.9, onTime: 98, bus: 'VIP-01' },
  { id: 2, name: 'Patrick Kamga', trips: 142, rating: 4.8, onTime: 96, bus: 'Confort-03' },
  { id: 3, name: 'Rodrigue Ndjama', trips: 138, rating: 4.7, onTime: 94, bus: 'Express-02' },
  { id: 4, name: 'Thierry Mvondo', trips: 130, rating: 4.6, onTime: 92, bus: 'Standard-05' },
  { id: 5, name: 'Hervé Njoya', trips: 125, rating: 4.5, onTime: 91, bus: 'VIP-04' },
  { id: 6, name: 'Alain Tchoupo', trips: 118, rating: 4.4, onTime: 89, bus: 'Confort-06' },
];

export const TOP_CLIENTS_DATA = [
  { id: 1, name: 'Paul Atangana', trips: 24, spent: 285000, since: '2024' },
  { id: 2, name: 'Samuel Fotso', trips: 18, spent: 210000, since: '2024' },
  { id: 3, name: 'Brenda Atiti', trips: 15, spent: 175000, since: '2025' },
  { id: 4, name: 'Christ Tchidjou', trips: 12, spent: 142000, since: '2025' },
  { id: 5, name: 'Gaelle Mbida', trips: 11, spent: 130000, since: '2024' },
  { id: 6, name: 'Nicole Tagne', trips: 10, spent: 115000, since: '2025' },
];

export const MONTHLY_REVENUE_DATA = [
  { month: 'Jan', revenue: 1800000, target: 2000000 },
  { month: 'Fév', revenue: 2200000, target: 2000000 },
  { month: 'Mar', revenue: 2000000, target: 2200000 },
  { month: 'Avr', revenue: 2500000, target: 2200000 },
  { month: 'Mai', revenue: 2300000, target: 2400000 },
  { month: 'Jun', revenue: 2800000, target: 2400000 },
  { month: 'Jul', revenue: 2600000, target: 2600000 },
  { month: 'Aoû', revenue: 3000000, target: 2600000 },
  { month: 'Sep', revenue: 2900000, target: 2800000 },
  { month: 'Oct', revenue: 3200000, target: 2800000 },
  { month: 'Nov', revenue: 3100000, target: 3000000 },
  { month: 'Déc', revenue: 3300000, target: 3000000 },
];

export const CLIENT_GROWTH_DATA = [
  { month: 'Jan', clients: 1400, newClients: 45 },
  { month: 'Fév', clients: 1480, newClients: 80 },
  { month: 'Mar', clients: 1520, newClients: 40 },
  { month: 'Avr', clients: 1580, newClients: 60 },
  { month: 'Mai', clients: 1620, newClients: 40 },
  { month: 'Jun', clients: 1680, newClients: 60 },
  { month: 'Jul', clients: 1720, newClients: 40 },
  { month: 'Aoû', clients: 1780, newClients: 60 },
  { month: 'Sep', clients: 1820, newClients: 40 },
  { month: 'Oct', clients: 1860, newClients: 40 },
  { month: 'Nov', clients: 1880, newClients: 20 },
  { month: 'Déc', clients: 1893, newClients: 13 },
];

export const INSIGHTS_DATA = [
  { id: 1, text: 'Le trajet <strong>Douala → Yaoundé</strong> représente <strong>30%</strong> des ventes totales.', icon: 'bi-signpost-2', color: 'accent', meta: 'Basé sur les 30 derniers jours' },
  { id: 2, text: 'Le <strong>Point Central Douala</strong> est le point de vente le plus performant avec <strong>34%</strong> des réservations.', icon: 'bi-geo-alt', color: 'primary', meta: 'Performance ce mois' },
  { id: 3, text: 'Le <strong>samedi</strong> est le jour le plus rentable avec <strong>62 réservations</strong> en moyenne.', icon: 'bi-calendar-week', color: 'success', meta: 'Tendance hebdomadaire' },
  { id: 4, text: "Le taux d'occupation moyen est de <strong>86%</strong>, en hausse de <strong>4.2%</strong> vs le mois dernier.", icon: 'bi-pie-chart', color: 'info', meta: 'Évolution mensuelle' },
  { id: 5, text: 'Le <strong>VIP-04 (Douala-Buea)</strong> atteint <strong>95%</strong> d\'occupation — à considérer pour ajouter des départs.', icon: 'bi-bus-front-fill', color: 'warning', meta: 'Optimisation de capacité' },
  { id: 6, text: 'Les paiements <strong>Orange Money</strong> dominent avec <strong>38%</strong> des transactions.', icon: 'bi-credit-card', color: 'accent', meta: 'Répartition des paiements' },
];

export const ALERTS_DATA = [
  { id: 1, type: 'warning', text: '<strong>Baisse des ventes</strong> — Les réservations pour Yaoundé → Bertoua ont chuté de <strong>15%</strong> cette semaine.', action: 'Voir les détails' },
  { id: 2, type: 'danger', text: '<strong>Hausse des annulations</strong> — <strong>12 annulations</strong> enregistrées aujourd\'hui, soit +50% vs hier.', action: 'Analyser' },
  { id: 3, type: 'warning', text: '<strong>Bus peu rentable</strong> — Le Standard-08 (Yaoundé → Garoua) n\'atteint que <strong>68%</strong> d\'occupation.', action: 'Optimiser' },
  { id: 4, type: 'info', text: '<strong>Point de vente inactif</strong> — Le Guichet Garoua n\'a enregistré aucune vente en <strong>3 jours</strong>.', action: 'Contacter' },
  { id: 5, type: 'info', text: '<strong>Agent inactif</strong> — <strong>2 agents</strong> n\'ont pas de transactions depuis <strong>5 jours</strong>.', action: 'Voir' },
  { id: 6, type: 'success', text: '<strong>Objectif atteint</strong> — Le chiffre d\'affaires de <strong>Novembre</strong> a dépassé l\'objectif de <strong>3.3%</strong>.', action: 'Voir le rapport' },
];

export const FILTER_OPTIONS = {
  cities: ['Douala', 'Yaoundé', 'Bamenda', 'Bafoussam', 'Kribi', 'Buéa', 'Bertoua', 'Garoua'],
  methods: ['orange_money', 'mtn_momo', 'carte_bancaire', 'especes', 'virement_bancaire'],
  statuses: ['paye', 'en_attente', 'echoue', 'annule', 'rembourse'],
  outlets: ['Point Central Douala', 'Guichet Yaoundé Central', 'Guichet Bamenda', 'Guichet Bafoussam', 'Point Kribi', 'Guichet Buéa'],
  agents: ['Jean Mbarga', 'Celestin Fotsa', 'Paul Atangana', 'Marie Ngo', 'Lucien Tchoupo', 'Aimée Ngono'],
};

export const METHOD_LABELS = {
  orange_money: 'Orange Money',
  mtn_momo: 'MTN MoMo',
  carte_bancaire: 'Carte bancaire',
  especes: 'Espèces',
  virement_bancaire: 'Virement',
};
