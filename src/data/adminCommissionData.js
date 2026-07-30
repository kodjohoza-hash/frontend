/* ══════════════════════════════════════════════════════════════
   COMMISSION MANAGEMENT — Bus Tix Connect Super Admin
   Fully mock data, dynamic calculation engine, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

export const commissionTypes = [
  { id: 'percentage', label: 'Pourcentage', icon: 'fa-percent' },
  { id: 'fixed', label: 'Montant fixe', icon: 'fa-coins' },
  { id: 'mixed', label: 'Mixte', icon: 'fa-cubes' },
  { id: 'per_ticket', label: 'Par billet', icon: 'fa-ticket' },
  { id: 'per_booking', label: 'Par réservation', icon: 'fa-cart-shopping' },
  { id: 'per_trip', label: 'Par voyage', icon: 'fa-bus' },
  { id: 'per_company', label: 'Par compagnie', icon: 'fa-building' },
  { id: 'subscription', label: "Sur abonnement", icon: 'fa-box' },
];

export const commissionStatusConfig = {
  pending: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  paid: { label: 'Payée', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  overdue: { label: 'En retard', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  cancelled: { label: 'Annulée', color: '#6B7280', bg: 'rgba(107,114,128,0.06)' },
  pending_review: { label: 'À vérifier', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  refunded: { label: 'Remboursée', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};

export const ruleStatusConfig = {
  active: { label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  inactive: { label: 'Inactif', color: '#6B7280', bg: 'rgba(107,114,128,0.06)' },
  expired: { label: 'Expiré', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

/* ══════════════════════════════════════════════════════════════
   COMMISSION RULES (dynamic calculation engine)
   ══════════════════════════════════════════════════════════════ */
export const commissionRules = [
  { id: 'rule_001', name: 'Commission standard', description: 'Commission par défaut sur toutes les ventes', type: 'percentage', value: 5, currency: 'XOF', minFee: 100, maxFee: 5000, startDate: '2024-01-01', endDate: null, priority: 0, status: 'active', appliesTo: 'all', companyId: null, city: null, country: null, minTickets: null, tripType: null, promotion: null },
  { id: 'rule_002', name: 'Premium réduit', description: 'Commission réduite pour compagnies Premium', type: 'percentage', value: 3, currency: 'XOF', minFee: 50, maxFee: 3000, startDate: '2024-06-01', endDate: null, priority: 1, status: 'active', appliesTo: 'subscription', companyId: null, city: null, country: null, minTickets: null, tripType: null, promotion: 'plan_business', subscriptionPlanId: 'plan_business' },
  { id: 'rule_003', name: 'Forfait international', description: 'Commission fixe pour trajets internationaux', type: 'fixed', value: 1500, currency: 'XOF', minFee: null, maxFee: null, startDate: '2024-03-01', endDate: null, priority: 2, status: 'active', appliesTo: 'trip_type', companyId: null, city: null, country: null, minTickets: null, tripType: 'international', promotion: null },
  { id: 'rule_004', name: 'Promo Nouvel An', description: 'Commission réduite pour les fêtes', type: 'percentage', value: 2, currency: 'XOF', minFee: 0, maxFee: 2000, startDate: '2024-12-20', endDate: '2025-01-15', priority: 3, status: 'expired', appliesTo: 'promotion', companyId: null, city: null, country: null, minTickets: null, tripType: null, promotion: 'new_year_2025' },
  { id: 'rule_005', name: 'Commission Express Bus', description: 'Commission spéciale Express Bus', type: 'percentage', value: 4, currency: 'XOF', minFee: 0, maxFee: 4000, startDate: '2024-05-01', endDate: null, priority: 4, status: 'active', appliesTo: 'company', companyId: 'comp_1', city: null, country: null, minTickets: null, tripType: null, promotion: null },
  { id: 'rule_006', name: 'Volume élevé', description: 'Commission réduite pour volumes élevés de billets', type: 'percentage', value: 3.5, currency: 'XOF', minFee: 0, maxFee: 3500, startDate: '2024-07-01', endDate: null, priority: 5, status: 'active', appliesTo: 'volume', companyId: null, city: null, country: null, minTickets: 1000, tripType: null, promotion: null },
  { id: 'rule_007', name: 'Forfait Douala-Yaoundé', description: 'Commission fixe sur axe principal', type: 'fixed', value: 500, currency: 'XOF', minFee: null, maxFee: null, startDate: '2024-04-01', endDate: null, priority: 6, status: 'active', appliesTo: 'city', companyId: null, city: 'Douala', country: 'Cameroun', minTickets: null, tripType: null, promotion: null },
  { id: 'rule_008', name: 'Mixte voyage long', description: 'Fix + % pour longs trajets', type: 'mixed', value: 3, fixedPart: 200, currency: 'XOF', minFee: null, maxFee: 5000, startDate: '2024-02-01', endDate: null, priority: 7, status: 'active', appliesTo: 'trip_type', companyId: null, city: null, country: null, minTickets: null, tripType: 'long_distance', promotion: null },
  { id: 'rule_009', name: 'Par billet standard', description: 'Commission fixe par billet vendu', type: 'per_ticket', value: 200, currency: 'XOF', minFee: null, maxFee: null, startDate: '2024-01-15', endDate: null, priority: 8, status: 'inactive', appliesTo: 'all', companyId: null, city: null, country: null, minTickets: null, tripType: null, promotion: null },
  { id: 'rule_010', name: 'Nouveau partenaire', description: 'Commission réduite première année', type: 'percentage', value: 2.5, currency: 'XOF', minFee: 0, maxFee: 2000, startDate: '2025-01-01', endDate: '2025-12-31', priority: 9, status: 'active', appliesTo: 'promotion', companyId: null, city: null, country: null, minTickets: null, tripType: null, promotion: 'new_partner_2025' },
];

/* ══════════════════════════════════════════════════════════════
   COMMISSION TRANSACTIONS
   ══════════════════════════════════════════════════════════════ */
export const commissions = [
  { id: 'com_001', ref: 'COM-2025-0001', companyName: 'Express Bus Cameroun', companyId: 'comp_1', tripName: 'Douala → Yaoundé', tripId: 'trip_001', busNumber: 'LT-001-ABC', ticketRef: 'TIX-BTC-20250615-001', clientName: 'Paul Biya', grossAmount: 5000, commission: 250, tax: 37.5, netAmount: 4712.5, rate: '5%', type: 'percentage', status: 'paid', date: '2025-06-15', dueDate: '2025-06-20', paidDate: '2025-06-18', city: 'Douala', country: 'Cameroun', ruleId: 'rule_001', notes: '' },
  { id: 'com_002', ref: 'COM-2025-0002', companyName: 'Touristique Express', companyId: 'comp_2', tripName: 'Yaoundé → Bafoussam', tripId: 'trip_002', busNumber: 'LT-002-XYZ', ticketRef: 'TIX-BTC-20250614-002', clientName: 'Alice Kamga', grossAmount: 3500, commission: 175, tax: 26.25, netAmount: 3298.75, rate: '5%', type: 'percentage', status: 'paid', date: '2025-06-14', dueDate: '2025-06-19', paidDate: '2025-06-17', city: 'Yaoundé', country: 'Cameroun', ruleId: 'rule_001', notes: '' },
  { id: 'com_003', ref: 'COM-2025-0003', companyName: 'Finex Voyages', companyId: 'comp_3', tripName: 'Douala → Bafoussam', tripId: 'trip_003', busNumber: 'LT-003-DEF', ticketRef: 'TIX-BTC-20250613-003', clientName: 'Jean Nkwi', grossAmount: 4000, commission: 120, tax: 18, netAmount: 3862, rate: '3%', type: 'percentage', status: 'paid', date: '2025-06-13', dueDate: '2025-06-18', paidDate: '2025-06-16', city: 'Douala', country: 'Cameroun', ruleId: 'rule_002', notes: 'Plan Business' },
  { id: 'com_004', ref: 'COM-2025-0004', companyName: 'Buca Voyages', companyId: 'comp_4', tripName: 'Douala → Kribi', tripId: 'trip_004', busNumber: 'LT-004-GHI', ticketRef: 'TIX-BTC-20250612-004', clientName: 'Marie Essomba', grossAmount: 3000, commission: 150, tax: 22.5, netAmount: 2827.5, rate: '5%', type: 'percentage', status: 'pending', date: '2025-06-12', dueDate: '2025-06-17', paidDate: null, city: 'Douala', country: 'Cameroun', ruleId: 'rule_001', notes: '' },
  { id: 'com_005', ref: 'COM-2025-0005', companyName: 'Express Bus Cameroun', companyId: 'comp_1', tripName: 'Yaoundé → Douala', tripId: 'trip_005', busNumber: 'LT-001-ABC', ticketRef: 'TIX-BTC-20250611-005', clientName: 'Pierre Tchinda', grossAmount: 5000, commission: 200, tax: 30, netAmount: 4770, rate: '4%', type: 'percentage', status: 'paid', date: '2025-06-11', dueDate: '2025-06-16', paidDate: '2025-06-14', city: 'Yaoundé', country: 'Cameroun', ruleId: 'rule_005', notes: 'Commission spéciale' },
  { id: 'com_006', ref: 'COM-2025-0006', companyName: 'Touristique Express', companyId: 'comp_2', tripName: 'Douala → Yaoundé', tripId: 'trip_006', busNumber: 'LT-005-JKL', ticketRef: 'TIX-BTC-20250610-006', clientName: 'François Ngono', grossAmount: 15000, commission: 1500, tax: 225, netAmount: 13275, rate: 'Fixe', type: 'fixed', status: 'paid', date: '2025-06-10', dueDate: '2025-06-15', paidDate: '2025-06-13', city: 'Douala', country: 'Cameroun', ruleId: 'rule_003', notes: 'International' },
  { id: 'com_007', ref: 'COM-2025-0007', companyName: 'Finex Voyages', companyId: 'comp_3', tripName: 'Douala → Yaoundé', tripId: 'trip_001', busNumber: 'LT-003-DEF', ticketRef: 'TIX-BTC-20250609-007', clientName: 'Esther Mbah', grossAmount: 8000, commission: 440, tax: 66, netAmount: 7494, rate: '3%+200', type: 'mixed', status: 'pending', date: '2025-06-09', dueDate: '2025-06-14', paidDate: null, city: 'Douala', country: 'Cameroun', ruleId: 'rule_008', notes: 'Long trajet' },
  { id: 'com_008', ref: 'COM-2025-0008', companyName: 'Buca Voyages', companyId: 'comp_4', tripName: 'Yaoundé → Bertoua', tripId: 'trip_007', busNumber: 'LT-006-MNO', ticketRef: 'TIX-BTC-20250608-008', clientName: 'David Taku', grossAmount: 4500, commission: 225, tax: 33.75, netAmount: 4241.25, rate: '5%', type: 'percentage', status: 'overdue', date: '2025-06-08', dueDate: '2025-06-12', paidDate: null, city: 'Yaoundé', country: 'Cameroun', ruleId: 'rule_001', notes: 'Paiement en retard' },
  { id: 'com_009', ref: 'COM-2025-0009', companyName: 'Express Bus Cameroun', companyId: 'comp_1', tripName: 'Douala → Limbé', tripId: 'trip_008', busNumber: 'LT-001-ABC', ticketRef: 'TIX-BTC-20250607-009', clientName: 'Sarah Fonkou', grossAmount: 2500, commission: 125, tax: 18.75, netAmount: 2356.25, rate: '5%', type: 'percentage', status: 'paid', date: '2025-06-07', dueDate: '2025-06-12', paidDate: '2025-06-10', city: 'Douala', country: 'Cameroun', ruleId: 'rule_001', notes: '' },
  { id: 'com_010', ref: 'COM-2025-0010', companyName: 'Touristique Express', companyId: 'comp_2', tripName: 'Bafoussam → Douala', tripId: 'trip_009', busNumber: 'LT-002-XYZ', ticketRef: 'TIX-BTC-20250606-010', clientName: 'Joseph Che', grossAmount: 3200, commission: 160, tax: 24, netAmount: 3016, rate: '5%', type: 'percentage', status: 'pending_review', date: '2025-06-06', dueDate: '2025-06-11', paidDate: null, city: 'Bafoussam', country: 'Cameroun', ruleId: 'rule_001', notes: 'Montant suspect' },
  { id: 'com_011', ref: 'COM-2025-0011', companyName: 'Finex Voyages', companyId: 'comp_3', tripName: 'Yaoundé → Douala', tripId: 'trip_005', busNumber: 'LT-003-DEF', ticketRef: 'TIX-BTC-20250605-011', clientName: 'Christine Nganou', grossAmount: 5000, commission: 150, tax: 22.5, netAmount: 4827.5, rate: '3%', type: 'percentage', status: 'paid', date: '2025-06-05', dueDate: '2025-06-10', paidDate: '2025-06-08', city: 'Yaoundé', country: 'Cameroun', ruleId: 'rule_002', notes: '' },
  { id: 'com_012', ref: 'COM-2025-0012', companyName: 'Express Bus Cameroun', companyId: 'comp_1', tripName: 'Douala → Yaoundé', tripId: 'trip_001', busNumber: 'LT-007-PQR', ticketRef: 'TIX-BTC-20250604-012', clientName: 'Robert Mbarga', grossAmount: 5000, commission: 175, tax: 26.25, netAmount: 4798.75, rate: '3.5%', type: 'percentage', status: 'paid', date: '2025-06-04', dueDate: '2025-06-09', paidDate: '2025-06-07', city: 'Douala', country: 'Cameroun', ruleId: 'rule_006', notes: 'Volume élevé' },
  { id: 'com_013', ref: 'COM-2025-0013', companyName: 'Finex Voyages', companyId: 'comp_3', tripName: 'Douala → Yaoundé', tripId: 'trip_001', busNumber: 'LT-003-DEF', ticketRef: 'TIX-BTC-20250603-013', clientName: 'Monique Bayi', grossAmount: 5000, commission: 250, tax: 37.5, netAmount: 4712.5, rate: '5%', type: 'percentage', status: 'cancelled', date: '2025-06-03', dueDate: '2025-06-08', paidDate: null, city: 'Douala', country: 'Cameroun', ruleId: 'rule_001', notes: 'Annulé - remboursé' },
  { id: 'com_014', ref: 'COM-2025-0014', companyName: 'Buca Voyages', companyId: 'comp_4', tripName: 'Douala → Yaoundé', tripId: 'trip_001', busNumber: 'LT-004-GHI', ticketRef: 'TIX-BTC-20250602-014', clientName: 'Patrice Mvogo', grossAmount: 5000, commission: 500, tax: 75, netAmount: 4425, rate: '500 FCFA', type: 'fixed', status: 'paid', date: '2025-06-02', dueDate: '2025-06-07', paidDate: '2025-06-05', city: 'Douala', country: 'Cameroun', ruleId: 'rule_007', notes: 'Axe Douala' },
  { id: 'com_015', ref: 'COM-2025-0015', companyName: 'Touristique Express', companyId: 'comp_2', tripName: 'Yaoundé → Douala', tripId: 'trip_005', busNumber: 'LT-005-JKL', ticketRef: 'TIX-BTC-20250601-015', clientName: 'Hélène Nkoa', grossAmount: 6000, commission: 300, tax: 45, netAmount: 5655, rate: '5%', type: 'percentage', status: 'refunded', date: '2025-06-01', dueDate: '2025-06-06', paidDate: '2025-06-04', city: 'Yaoundé', country: 'Cameroun', ruleId: 'rule_001', notes: 'Remboursé client' },
];

/* ══════════════════════════════════════════════════════════════
   CHART DATA
   ══════════════════════════════════════════════════════════════ */
export const commissionChartData = {
  daily: [
    { date: '2025-06-01', commissions: 125000, transactions: 45 },
    { date: '2025-06-02', commissions: 98000, transactions: 38 },
    { date: '2025-06-03', commissions: 142000, transactions: 52 },
    { date: '2025-06-04', commissions: 87500, transactions: 31 },
    { date: '2025-06-05', commissions: 163000, transactions: 58 },
    { date: '2025-06-06', commissions: 111000, transactions: 42 },
    { date: '2025-06-07', commissions: 95500, transactions: 36 },
    { date: '2025-06-08', commissions: 178000, transactions: 61 },
    { date: '2025-06-09', commissions: 134000, transactions: 48 },
    { date: '2025-06-10', commissions: 156000, transactions: 55 },
    { date: '2025-06-11', commissions: 105000, transactions: 40 },
    { date: '2025-06-12', commissions: 189000, transactions: 65 },
    { date: '2025-06-13', commissions: 72000, transactions: 28 },
    { date: '2025-06-14', commissions: 147000, transactions: 50 },
    { date: '2025-06-15', commissions: 201000, transactions: 70 },
  ],
  monthly: [
    { month: 'Jan 2025', commissions: 2850000, revenue: 4200000, transactions: 980 },
    { month: 'Fév 2025', commissions: 3100000, revenue: 4800000, transactions: 1050 },
    { month: 'Mar 2025', commissions: 2950000, revenue: 4500000, transactions: 1020 },
    { month: 'Avr 2025', commissions: 3400000, revenue: 5100000, transactions: 1150 },
    { month: 'Mai 2025', commissions: 3750000, revenue: 5600000, transactions: 1280 },
    { month: 'Juin 2025', commissions: 2100000, revenue: 3200000, transactions: 720 },
  ],
  byCompany: [
    { company: 'Express Bus Cameroun', commissions: 1980000, transactions: 420, share: 35 },
    { company: 'Touristique Express', commissions: 1420000, transactions: 310, share: 25 },
    { company: 'Finex Voyages', commissions: 1180000, transactions: 260, share: 21 },
    { company: 'Buca Voyages', commissions: 890000, transactions: 195, share: 16 },
    { company: 'Autres', commissions: 170000, transactions: 45, share: 3 },
  ],
  byType: [
    { type: 'Pourcentage', value: 72, amount: 4100000 },
    { type: 'Fixe', value: 15, amount: 850000 },
    { type: 'Mixte', value: 8, amount: 460000 },
    { type: 'Par billet', value: 5, amount: 280000 },
  ],
};

/* ══════════════════════════════════════════════════════════════
   STATS / KPI
   ══════════════════════════════════════════════════════════════ */
export const commissionStats = {
  total: { label: 'Commission totale', value: 5640000, isCurrency: true, trend: 12 },
  today: { label: "Aujourd'hui", value: 201000, isCurrency: true, trend: 8 },
  month: { label: 'Ce mois', value: 2100000, isCurrency: true, trend: -15 },
  year: { label: 'Cette année', value: 18150000, isCurrency: true, trend: 22 },
  companies: { label: 'Compagnies actives', value: 8, trend: 14 },
  transactions: { label: 'Transactions', value: 5620, trend: 18 },
  paid: { label: 'Montant reversé', value: 4350000, isCurrency: true, trend: 10 },
  pending: { label: 'Montant en attente', value: 1290000, isCurrency: true, trend: -5 },
};

/* ══════════════════════════════════════════════════════════════
   TIMELINE
   ══════════════════════════════════════════════════════════════ */
export const commissionTimeline = [
  { id: 'ct_01', action: 'payment', title: 'Paiement reçu', description: 'COM-2025-0001 — Express Bus — 250 FCFA', time: '2025-06-18 10:30', user: 'Système' },
  { id: 'ct_02', action: 'payment', title: 'Paiement reçu', description: 'COM-2025-0002 — Touristique Express — 175 FCFA', time: '2025-06-17 14:15', user: 'Système' },
  { id: 'ct_03', action: 'modified', title: 'Règle modifiée', description: 'Commission Express Bus — taux passé de 5% à 4%', time: '2025-06-15 09:00', user: 'Admin Guillaume' },
  { id: 'ct_04', action: 'created', title: 'Nouvelle règle', description: 'Nouveau partenaire — 2.5% — valable jusqu\'au 31/12/2025', time: '2025-06-10 11:30', user: 'Admin Guillaume' },
  { id: 'ct_05', action: 'suspension', title: 'Règle suspendue', description: 'Par billet standard — désactivée temporairement', time: '2025-06-08 16:00', user: 'Système' },
  { id: 'ct_06', action: 'payment', title: 'Paiement reçu', description: 'COM-2025-0005 — Express Bus — 200 FCFA', time: '2025-06-14 08:45', user: 'Système' },
  { id: 'ct_07', action: 'reactivation', title: 'Règle réactivée', description: 'Volume élevé — commission à 3.5% réactivée', time: '2025-06-01 10:00', user: 'Admin Guillaume' },
  { id: 'ct_08', action: 'revision', title: 'Révision trimestrielle', description: 'Augmentation des plafonds — max 5000 FCFA', time: '2025-04-01 09:00', user: 'Système' },
];

/* ══════════════════════════════════════════════════════════════
   DYNAMIC CALCULATION ENGINE
   ══════════════════════════════════════════════════════════════ */
export function calculateCommission(grossAmount, rule, ticketCount = 1) {
  let commission = 0;
  switch (rule.type) {
    case 'percentage':
      commission = grossAmount * (rule.value / 100);
      if (rule.minFee != null) commission = Math.max(commission, rule.minFee);
      if (rule.maxFee != null) commission = Math.min(commission, rule.maxFee);
      break;
    case 'fixed':
      commission = rule.value;
      break;
    case 'mixed':
      commission = (rule.fixedPart || 0) + (grossAmount * (rule.value / 100));
      if (rule.maxFee != null) commission = Math.min(commission, rule.maxFee);
      break;
    case 'per_ticket':
      commission = rule.value * ticketCount;
      break;
    case 'per_booking':
      commission = rule.value;
      break;
    case 'per_trip':
      commission = rule.value;
      break;
    case 'per_company':
      commission = rule.value;
      break;
    default:
      commission = grossAmount * 0.05;
  }
  return Math.round(commission * 100) / 100;
}

export function findApplicableRule(companyId, city, country, tripType, ticketCount, subscriptionPlanId) {
  const sorted = [...commissionRules]
    .filter(r => r.status === 'active')
    .sort((a, b) => a.priority - b.priority);

  for (const rule of sorted) {
    if (rule.appliesTo === 'company' && rule.companyId === companyId) return rule;
    if (rule.appliesTo === 'city' && rule.city === city) return rule;
    if (rule.appliesTo === 'trip_type' && rule.tripType === tripType) return rule;
    if (rule.appliesTo === 'subscription' && rule.subscriptionPlanId === subscriptionPlanId) return rule;
    if (rule.appliesTo === 'volume' && ticketCount >= (rule.minTickets || Infinity)) return rule;
    if (rule.appliesTo === 'promotion') return rule;
    if (rule.appliesTo === 'all') return rule;
  }
  return null;
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
export const defaultFilters = {
  search: '', company: '', city: '', country: '', status: '', type: '',
  dateFrom: '', dateTo: '', sortBy: 'newest',
};

export const filterCommissions = (list, filters) => {
  return list.filter(c => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!c.ref?.toLowerCase().includes(s) && !c.companyName?.toLowerCase().includes(s) && !c.tripName?.toLowerCase().includes(s) && !c.clientName?.toLowerCase().includes(s)) return false;
    }
    if (filters.company && c.companyId !== filters.company) return false;
    if (filters.city && c.city !== filters.city) return false;
    if (filters.country && c.country !== filters.country) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.type && c.type !== filters.type) return false;
    if (filters.dateFrom && c.date < filters.dateFrom) return false;
    if (filters.dateTo && c.date > filters.dateTo) return false;
    return true;
  });
};

export const sortCommissions = (list, sortBy) => {
  const s = [...list];
  switch (sortBy) {
    case 'amount_desc': s.sort((a, b) => b.commission - a.commission); break;
    case 'amount_asc': s.sort((a, b) => a.commission - b.commission); break;
    case 'company': s.sort((a, b) => a.companyName.localeCompare(b.companyName)); break;
    default: s.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
  }
  return s;
};

export const formatCurrency = (amount, currency = 'XOF') => {
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
};

export const getCommissionById = (id) => commissions.find(c => c.id === id);
export const getCommissionsByCompany = (companyId) => commissions.filter(c => c.companyId === companyId);
export const getTimelineByCommission = (id) => commissionTimeline.filter(t => t.description?.includes(id));
