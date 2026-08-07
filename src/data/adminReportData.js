/* ══════════════════════════════════════════════════════════════
   BUSINESS INTELLIGENCE & REPORTS — Bus Tix Connect Super Admin
   Fully mock data, ready for Express.js + WebSocket
   ══════════════════════════════════════════════════════════════ */

export const formatCurrency = (amount) => `${amount.toLocaleString('fr-FR')} XAF`;

/* ══════════════════════════════════════════════════════════════
   PERIOD PRESETS
   ══════════════════════════════════════════════════════════════ */
export const periodPresets = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'week', label: 'Cette semaine' },
  { id: 'month', label: 'Ce mois' },
  { id: 'year', label: 'Cette année' },
  { id: 'custom', label: 'Personnalisée' },
];

/* ══════════════════════════════════════════════════════════════
   GLOBAL KPI
   ══════════════════════════════════════════════════════════════ */
export const reportKPI = {
  reservations: { label: 'Réservations', value: 28450, trend: 12, icon: 'fa-ticket' },
  tickets: { label: 'Billets vendus', value: 34120, trend: 8, icon: 'fa-receipt' },
  tripsDone: { label: 'Voyages réalisés', value: 15230, trend: 5, icon: 'fa-bus' },
  tripsCancelled: { label: 'Voyages annulés', value: 420, trend: -3, icon: 'fa-ban' },
  companies: { label: 'Compagnies actives', value: 8, trend: 14, icon: 'fa-building' },
  clients: { label: 'Clients actifs', value: 12450, trend: 22, icon: 'fa-users' },
  agents: { label: 'Agents actifs', value: 340, trend: 10, icon: 'fa-user-gear' },
  revenue: { label: 'Revenus', value: 45200000, isCurrency: true, trend: 18, icon: 'fa-sack-dollar' },
  commissions: { label: 'Commissions', value: 5640000, isCurrency: true, trend: 12, icon: 'fa-percent' },
  subscriptions: { label: 'Abonnements actifs', value: 6, trend: 20, icon: 'fa-box' },
  growth: { label: 'Taux de croissance', value: 15.5, suffix: '%', trend: 3, icon: 'fa-chart-line' },
  fillRate: { label: "Taux de remplissage", value: 78, suffix: '%', trend: 2, icon: 'fa-gauge-high' },
  satisfaction: { label: 'Satisfaction client', value: 4.2, suffix: '/5', trend: 1, icon: 'fa-star' },
};

/* ══════════════════════════════════════════════════════════════
   REVENUE DATA
   ══════════════════════════════════════════════════════════════ */
export const revenueData = {
  daily: [
    { date: '2025-06-01', revenue: 1850000, transactions: 320, commissions: 92500 },
    { date: '2025-06-02', revenue: 1620000, transactions: 290, commissions: 81000 },
    { date: '2025-06-03', revenue: 2100000, transactions: 380, commissions: 105000 },
    { date: '2025-06-04', revenue: 1480000, transactions: 260, commissions: 74000 },
    { date: '2025-06-05', revenue: 2350000, transactions: 410, commissions: 117500 },
    { date: '2025-06-06', revenue: 1780000, transactions: 310, commissions: 89000 },
    { date: '2025-06-07', revenue: 1550000, transactions: 270, commissions: 77500 },
    { date: '2025-06-08', revenue: 2450000, transactions: 430, commissions: 122500 },
    { date: '2025-06-09', revenue: 1920000, transactions: 340, commissions: 96000 },
    { date: '2025-06-10', revenue: 2280000, transactions: 400, commissions: 114000 },
    { date: '2025-06-11', revenue: 1680000, transactions: 300, commissions: 84000 },
    { date: '2025-06-12', revenue: 2520000, transactions: 450, commissions: 126000 },
    { date: '2025-06-13', revenue: 1350000, transactions: 240, commissions: 67500 },
    { date: '2025-06-14', revenue: 2150000, transactions: 370, commissions: 107500 },
    { date: '2025-06-15', revenue: 2780000, transactions: 490, commissions: 139000 },
  ],
  monthly: [
    { month: 'Jan 2025', revenue: 38500000, commissions: 2850000, bookings: 8200, tickets: 9850 },
    { month: 'Fév 2025', revenue: 41200000, commissions: 3100000, bookings: 8900, tickets: 10650 },
    { month: 'Mar 2025', revenue: 39800000, commissions: 2950000, bookings: 8500, tickets: 10200 },
    { month: 'Avr 2025', revenue: 43500000, commissions: 3400000, bookings: 9300, tickets: 11200 },
    { month: 'Mai 2025', revenue: 46800000, commissions: 3750000, bookings: 10100, tickets: 12100 },
    { month: 'Juin 2025', revenue: 25200000, commissions: 2100000, bookings: 5500, tickets: 6600 },
  ],
  yearly: [
    { year: 2022, revenue: 185000000, commissions: 14200000, companies: 3 },
    { year: 2023, revenue: 285000000, commissions: 22500000, companies: 5 },
    { year: 2024, revenue: 420000000, commissions: 34000000, companies: 7 },
    { year: 2025, revenue: 252000000, commissions: 18200000, companies: 8 },
  ],
};

/* ══════════════════════════════════════════════════════════════
   BOOKINGS DATA
   ══════════════════════════════════════════════════════════════ */
export const bookingData = {
  byDay: revenueData.daily.map(d => ({ date: d.date, bookings: d.transactions })),
  byCompany: [
    { company: 'Express Bus Cameroun', bookings: 8920, share: 31 },
    { company: 'Touristique Express', bookings: 6540, share: 23 },
    { company: 'Finex Voyages', bookings: 5120, share: 18 },
    { company: 'Buca Voyages', bookings: 3980, share: 14 },
    { company: 'Autres', bookings: 3890, share: 14 },
  ],
  byCity: [
    { city: 'Douala', bookings: 12450, share: 44 },
    { city: 'Yaoundé', bookings: 9850, share: 35 },
    { city: 'Bafoussam', bookings: 2850, share: 10 },
    { city: 'Kribi', bookings: 1520, share: 5 },
    { city: 'Autres', bookings: 1780, share: 6 },
  ],
  byRoute: [
    { route: 'Douala ↔ Yaoundé', bookings: 8500, share: 30 },
    { route: 'Yaoundé ↔ Bafoussam', bookings: 4200, share: 15 },
    { route: 'Douala ↔ Bafoussam', bookings: 3800, share: 13 },
    { route: 'Douala ↔ Kribi', bookings: 3100, share: 11 },
    { route: 'Yaoundé ↔ Bertoua', bookings: 2450, share: 9 },
    { route: 'Autres', bookings: 6400, share: 22 },
  ],
};

/* ══════════════════════════════════════════════════════════════
   TICKETS DATA
   ══════════════════════════════════════════════════════════════ */
export const ticketData = {
  sold: 34120,
  cancelled: 1250,
  refunded: 380,
  byStatus: [
    { status: 'Vendus', value: 34120, color: '#10B981' },
    { status: 'Annulés', value: 1250, color: '#EF4444' },
    { status: 'Remboursés', value: 380, color: '#F59E0B' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   COMPANIES DATA
   ══════════════════════════════════════════════════════════════ */
export const companyReportData = {
  top10: [
    { name: 'Express Bus Cameroun', revenue: 12500000, bookings: 8920, growth: 18, rating: 4.5 },
    { name: 'Touristique Express', revenue: 9800000, bookings: 6540, growth: 12, rating: 4.3 },
    { name: 'Finex Voyages', revenue: 7200000, bookings: 5120, growth: 22, rating: 4.1 },
    { name: 'Buca Voyages', revenue: 5600000, bookings: 3980, growth: 8, rating: 3.9 },
    { name: 'Transcam SAS', revenue: 4200000, bookings: 2850, growth: 15, rating: 4.4 },
    { name: 'Voyages du Centre', revenue: 3800000, bookings: 2450, growth: -2, rating: 4.0 },
    { name: 'Benny Travel', revenue: 3100000, bookings: 2100, growth: 25, rating: 4.6 },
    { name: 'GT Travel', revenue: 2800000, bookings: 1890, growth: 5, rating: 3.8 },
    { name: 'Royal Express', revenue: 2200000, bookings: 1500, growth: 10, rating: 4.2 },
    { name: 'Autres', revenue: 4600000, bookings: 3120, growth: 7, rating: 4.0 },
  ],
  activity: [
    { month: 'Jan', active: 7, new: 0, churned: 0 },
    { month: 'Fév', active: 7, new: 0, churned: 0 },
    { month: 'Mar', active: 7, new: 0, churned: 0 },
    { month: 'Avr', active: 8, new: 1, churned: 0 },
    { month: 'Mai', active: 8, new: 0, churned: 0 },
    { month: 'Juin', active: 8, new: 0, churned: 0 },
  ],
};

/* ══════════════════════════════════════════════════════════════
   CLIENTS DATA
   ══════════════════════════════════════════════════════════════ */
export const clientReportData = {
  total: 28450,
  active: 12450,
  inactive: 14200,
  loyal: 1800,
  newThisMonth: 1250,
  byStatus: [
    { label: 'Actifs', value: 12450, color: '#10B981' },
    { label: 'Inactifs (>90j)', value: 14200, color: '#94A3B8' },
    { label: 'Fidèles (>10 trajets)', value: 1800, color: '#8B5CF6' },
  ],
};

/* ══════════════════════════════════════════════════════════════
   PAYMENTS DATA
   ══════════════════════════════════════════════════════════════ */
export const paymentReportData = {
  byMethod: [
    { method: 'Mobile Money', amount: 24500000, share: 54, color: '#10B981' },
    { method: 'Carte bancaire', amount: 11500000, share: 25, color: '#3B82F6' },
    { method: 'Espèces', amount: 7200000, share: 16, color: '#F59E0B' },
    { method: 'Autres', amount: 2000000, share: 5, color: '#8B5CF6' },
  ],
  total: 45200000,
};

/* ══════════════════════════════════════════════════════════════
   COMMISSION REPORT DATA
   ══════════════════════════════════════════════════════════════ */
export const commissionReportData = {
  byCompany: [
    { company: 'Express Bus Cameroun', amount: 1980000, share: 35 },
    { company: 'Touristique Express', amount: 1420000, share: 25 },
    { company: 'Finex Voyages', amount: 1180000, share: 21 },
    { company: 'Buca Voyages', amount: 890000, share: 16 },
    { company: 'Autres', amount: 170000, share: 3 },
  ],
  byMonth: revenueData.monthly.map(m => ({ month: m.month, amount: m.commissions })),
  total: 5640000,
};

/* ══════════════════════════════════════════════════════════════
   COMPARISON DATA (period vs period)
   ══════════════════════════════════════════════════════════════ */
export const comparisonData = {
  todayVsYesterday: { revenue: { current: 2780000, previous: 2150000, change: 29 }, bookings: { current: 490, previous: 370, change: 32 }, commissions: { current: 139000, previous: 107500, change: 29 } },
  weekVsLastWeek: { revenue: { current: 14500000, previous: 13200000, change: 10 }, bookings: { current: 2520, previous: 2310, change: 9 }, commissions: { current: 725000, previous: 660000, change: 10 } },
  monthVsLastMonth: { revenue: { current: 25200000, previous: 46800000, change: -46 }, bookings: { current: 5500, previous: 10100, change: -46 }, commissions: { current: 2100000, previous: 3750000, change: -44 } },
  yearVsLastYear: { revenue: { current: 252000000, previous: 420000000, change: -40 }, bookings: { current: 55000, previous: 90000, change: -39 }, commissions: { current: 18200000, previous: 34000000, change: -46 } },
};

/* ══════════════════════════════════════════════════════════════
   TOP ANALYTICS
   ══════════════════════════════════════════════════════════════ */
export const topAnalytics = {
  topCompanies: companyReportData.top10.slice(0, 5),
  topCities: bookingData.byCity,
  topRoutes: bookingData.byRoute,
  topClients: [
    { name: 'Paul Biya', trips: 48, spent: 240000 },
    { name: 'Alice Kamga', trips: 35, spent: 175000 },
    { name: 'Jean Nkwi', trips: 28, spent: 140000 },
    { name: 'Marie Essomba', trips: 22, spent: 110000 },
    { name: 'Pierre Tchinda', trips: 20, spent: 100000 },
  ],
  topAgents: [
    { name: 'Agent Douala Centre', tickets: 2450, revenue: 12250000 },
    { name: 'Agent Yaoundé Gare', tickets: 2100, revenue: 10500000 },
    { name: 'Agent Bafoussam', tickets: 1650, revenue: 8250000 },
    { name: 'Agent Kribi Plage', tickets: 1200, revenue: 6000000 },
    { name: 'Agent Bertoua', tickets: 980, revenue: 4900000 },
  ],
};

/* ══════════════════════════════════════════════════════════════
   SAVED REPORTS
   ══════════════════════════════════════════════════════════════ */
export const savedReports = [
  { id: 'rpt_01', name: 'Rapport mensuel — Juin 2025', creator: 'Admin Guillaume', category: 'Revenus', date: '2025-06-15', lastModified: '2025-06-15 14:30', format: 'PDF', favorite: true, scheduled: true, description: "Récapitulatif mensuel des revenus et commissions." },
  { id: 'rpt_02', name: 'Top compagnies Q2 2025', creator: 'Admin Guillaume', category: 'Compagnies', date: '2025-06-01', lastModified: '2025-06-01 09:00', format: 'Excel', favorite: true, scheduled: false, description: 'Classement des compagnies par performance.' },
  { id: 'rpt_03', name: 'Analyse des réservations — Semaine 24', creator: 'Admin Guillaume', category: 'Réservations', date: '2025-06-14', lastModified: '2025-06-14 11:45', format: 'CSV', favorite: false, scheduled: true, description: 'Détail des réservations de la semaine.' },
  { id: 'rpt_04', name: 'Rapport annuel 2024', creator: 'Admin Guillaume', category: 'Global', date: '2025-01-15', lastModified: '2025-01-15 16:00', format: 'PDF', favorite: true, scheduled: false, description: 'Bilan annuel complet de la plateforme.' },
  { id: 'rpt_05', name: 'Commissions par compagnie', creator: 'Admin Guillaume', category: 'Commissions', date: '2025-06-10', lastModified: '2025-06-10 10:30', format: 'Excel', favorite: false, scheduled: true, description: "Analyse détaillée des commissions." },
  { id: 'rpt_06', name: 'Satisfaction client — Juin', creator: 'Système', category: 'Clients', date: '2025-06-15', lastModified: '2025-06-15 08:00', format: 'PDF', favorite: false, scheduled: false, description: 'Sondage de satisfaction client.' },
];

export const reportCategories = ['Tous', 'Revenus', 'Compagnies', 'Réservations', 'Commissions', 'Clients', 'Global'];

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
export const filterSavedReports = (reports, filters) => {
  return reports.filter(r => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!r.name?.toLowerCase().includes(s) && !r.category?.toLowerCase().includes(s)) return false;
    }
    if (filters.category && filters.category !== 'Tous' && r.category !== filters.category) return false;
    if (filters.format && r.format !== filters.format) return false;
    if (filters.favorite && !r.favorite) return false;
    return true;
  });
};

export const defaultReportFilters = {
  search: '', category: 'Tous', format: '', favorite: false,
};

export const formatValue = (val, isCurrency = false, suffix = '') => {
  if (isCurrency) return formatCurrency(val);
  return `${val.toLocaleString('fr-FR')}${suffix}`;
};

export const getTrendIcon = (trend) => {
  if (trend > 0) return { icon: 'fa-arrow-up', color: '#10B981' };
  if (trend < 0) return { icon: 'fa-arrow-down', color: '#EF4444' };
  return { icon: 'fa-minus', color: '#94A3B8' };
};
