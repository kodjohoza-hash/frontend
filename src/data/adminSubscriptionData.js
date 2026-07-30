/* ══════════════════════════════════════════════════════════════
   SUBSCRIPTION PLANS — Bus Tix Connect Super Admin
   Fully mock data, ready for Express.js
   ══════════════════════════════════════════════════════════════ */

export const currencySymbols = {
  XOF: { symbol: 'FCFA', code: 'XOF', locale: 'fr-FR' },
  EUR: { symbol: '€', code: 'EUR', locale: 'fr-FR' },
  USD: { symbol: '$', code: 'USD', locale: 'en-US' },
};

export const durationLabels = {
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  biannual: 'Semestriel',
  yearly: 'Annuel',
  custom: 'Personnalisé',
};

export const subscriptionStatusConfig = {
  active: { label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  inactive: { label: 'Inactif', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  trial: { label: 'Essai', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  expired: { label: 'Expiré', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  suspended: { label: 'Suspendu', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  cancelled: { label: 'Résilié', color: '#6B7280', bg: 'rgba(107,114,128,0.06)' },
};

export const planStatusConfig = {
  active: { label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  archived: { label: 'Archivé', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  draft: { label: 'Brouillon', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
};

export const featureCategories = [
  {
    id: 'operations',
    label: 'Opérations',
    features: [
      { id: 'bus_management', label: 'Gestion des bus' },
      { id: 'trip_management', label: 'Gestion des voyages' },
      { id: 'driver_management', label: 'Gestion des chauffeurs' },
      { id: 'route_planning', label: 'Planification des routes' },
      { id: 'seat_mapping', label: 'Plan des sièges' },
    ],
  },
  {
    id: 'sales',
    label: 'Ventes & Réservations',
    features: [
      { id: 'online_booking', label: 'Réservation en ligne' },
      { id: 'counter_sales', label: 'Ventes guichet' },
      { id: 'payment_gateway', label: 'Passerelle de paiement' },
      { id: 'multi_currency', label: 'Multi-devises' },
      { id: 'discount_coupons', label: 'Coupons de réduction' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    features: [
      { id: 'messaging', label: 'Messagerie' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'email_alerts', label: 'Alertes email' },
      { id: 'sms_gateway', label: 'Passerelle SMS' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytique & Rapports',
    features: [
      { id: 'reports', label: 'Rapports' },
      { id: 'analytics_dashboard', label: 'Tableau de bord analytique' },
      { id: 'export_data', label: 'Export de données' },
      { id: 'audit_logs', label: 'Journaux d\'audit' },
    ],
  },
  {
    id: 'admin',
    label: 'Administration',
    features: [
      { id: 'multi_agency', label: 'Multi-agences' },
      { id: 'multi_user', label: 'Multi-utilisateurs' },
      { id: 'advanced_rbac', label: 'RBAC avancé' },
      { id: 'api_access', label: 'Accès API' },
      { id: 'webhooks', label: 'Webhooks' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    features: [
      { id: 'priority_support', label: 'Support prioritaire' },
      { id: 'dedicated_manager', label: 'Gestionnaire dédié' },
      { id: 'training', label: 'Formation' },
      { id: 'onboarding', label: 'Onboarding' },
    ],
  },
];

export const allFeatureIds = featureCategories.flatMap(cat => cat.features.map(f => f.id));

/* ══════════════════════════════════════════════════════════════
   PLANS
   ══════════════════════════════════════════════════════════════ */
export const plans = [
  {
    id: 'plan_start',
    name: 'Starter',
    description: 'Pour les petites compagnies qui débutent.',
    price: 49000, currency: 'XOF', duration: 'monthly',
    trialDays: 14, sortOrder: 0,
    maxBuses: 3, maxAgents: 2, maxBranches: 1, maxTrips: 30,
    storage: '5 Go', supportIncluded: 'Email',
    apiIncluded: false, features: ['bus_management', 'trip_management', 'counter_sales', 'online_booking', 'notifications', 'seat_mapping'],
    limits: { buses: 3, agents: 2, branches: 1, trips: 30, storage: 5 },
    color: '#3B82F6', status: 'active', createdAt: '2024-09-01',
    companiesCount: 8, revenue: 392000,
    popular: false,
  },
  {
    id: 'plan_growth',
    name: 'Growth',
    description: 'Pour les compagnies en pleine expansion.',
    price: 99000, currency: 'XOF', duration: 'monthly',
    trialDays: 7, sortOrder: 1,
    maxBuses: 10, maxAgents: 5, maxBranches: 3, maxTrips: 100,
    storage: '20 Go', supportIncluded: 'Email + Chat',
    apiIncluded: true, features: [...Array.from({ length: 17 }, (_, i) => allFeatureIds[i])].filter(Boolean),
    limits: { buses: 10, agents: 5, branches: 3, trips: 100, storage: 20 },
    color: '#8B5CF6', status: 'active', createdAt: '2024-09-01',
    companiesCount: 5, revenue: 495000,
    popular: true,
  },
  {
    id: 'plan_business',
    name: 'Business',
    description: 'Solution complète pour les grandes entreprises.',
    price: 199000, currency: 'XOF', duration: 'monthly',
    trialDays: 7, sortOrder: 2,
    maxBuses: -1, maxAgents: -1, maxBranches: -1, maxTrips: -1,
    storage: '100 Go', supportIncluded: 'Email + Chat + Téléphone',
    apiIncluded: true, features: [...allFeatureIds],
    limits: { buses: -1, agents: -1, branches: -1, trips: -1, storage: 100 },
    color: '#F59E0B', status: 'active', createdAt: '2024-09-15',
    companiesCount: 3, revenue: 597000,
    popular: false,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'Solution sur mesure avec support dédié.',
    price: 499000, currency: 'XOF', duration: 'monthly',
    trialDays: 0, sortOrder: 3,
    maxBuses: -1, maxAgents: -1, maxBranches: -1, maxTrips: -1,
    storage: '500 Go', supportIncluded: 'Support dédié 24/7',
    apiIncluded: true, features: [...allFeatureIds],
    limits: { buses: -1, agents: -1, branches: -1, trips: -1, storage: 500 },
    color: '#EF4444', status: 'active', createdAt: '2024-10-01',
    companiesCount: 2, revenue: 998000,
    popular: false,
  },
  {
    id: 'plan_startup',
    name: 'Startup',
    description: 'Offre spéciale pour startups innovantes.',
    price: 29000, currency: 'XOF', duration: 'yearly',
    trialDays: 30, sortOrder: 4,
    maxBuses: 2, maxAgents: 1, maxBranches: 1, maxTrips: 15,
    storage: '3 Go', supportIncluded: 'Email',
    apiIncluded: false,
    features: ['bus_management', 'trip_management', 'counter_sales', 'online_booking', 'notifications'],
    limits: { buses: 2, agents: 1, branches: 1, trips: 15, storage: 3 },
    color: '#10B981', status: 'archived', createdAt: '2024-08-01',
    companiesCount: 0, revenue: 0,
    popular: false,
  },
  {
    id: 'plan_premium',
    name: 'Premium Annual',
    description: 'Tout inclus avec un tarif annuel préférentiel.',
    price: 1790000, currency: 'XOF', duration: 'yearly',
    trialDays: 14, sortOrder: 5,
    maxBuses: -1, maxAgents: -1, maxBranches: -1, maxTrips: -1,
    storage: '200 Go', supportIncluded: 'Support prioritaire 24/7',
    apiIncluded: true, features: [...allFeatureIds],
    limits: { buses: -1, agents: -1, branches: -1, trips: -1, storage: 200 },
    color: '#1E1B4B', status: 'active', createdAt: '2024-11-01',
    companiesCount: 1, revenue: 1790000,
    popular: false,
  },
  {
    id: 'plan_freemium',
    name: 'Freemium',
    description: 'Pour découvrir la plateforme gratuitement.',
    price: 0, currency: 'XOF', duration: 'monthly',
    trialDays: 0, sortOrder: 6,
    maxBuses: 1, maxAgents: 1, maxBranches: 0, maxTrips: 5,
    storage: '1 Go', supportIncluded: 'Base de connaissances',
    apiIncluded: false,
    features: ['bus_management', 'counter_sales', 'notifications'],
    limits: { buses: 1, agents: 1, branches: 0, trips: 5, storage: 1 },
    color: '#6B7280', status: 'active', createdAt: '2024-07-01',
    companiesCount: 4, revenue: 0,
    popular: false,
  },
];

/* ══════════════════════════════════════════════════════════════
   SUBSCRIPTIONS (companies assigned to plans)
   ══════════════════════════════════════════════════════════════ */
export const subscriptions = [
  { id: 'sub_001', companyId: 'comp_1', companyName: 'Express Bus Cameroun', planId: 'plan_business', status: 'active', startDate: '2024-09-15', endDate: '2025-09-15', trialEnd: null, autoRenew: true, paymentMethod: 'Carte bancaire', lastPayment: '2025-06-15', nextBilling: '2025-07-15', billingCycle: 'monthly', amount: 199000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2024-09-15' },
  { id: 'sub_002', companyId: 'comp_2', companyName: 'Touristique Express', planId: 'plan_growth', status: 'active', startDate: '2024-10-01', endDate: '2025-10-01', trialEnd: null, autoRenew: true, paymentMethod: 'Mobile Money', lastPayment: '2025-06-01', nextBilling: '2025-07-01', billingCycle: 'monthly', amount: 99000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2024-10-01' },
  { id: 'sub_003', companyId: 'comp_3', companyName: 'Finex Voyages', planId: 'plan_growth', status: 'trial', startDate: '2025-06-10', endDate: '2025-06-24', trialEnd: '2025-06-24', autoRenew: false, paymentMethod: null, lastPayment: null, nextBilling: '2025-06-24', billingCycle: 'monthly', amount: 0, currency: 'XOF', assignedBy: 'Système', assignedAt: '2025-06-10' },
  { id: 'sub_004', companyId: 'comp_4', companyName: 'Buca Voyages', planId: 'plan_starter', status: 'active', startDate: '2025-01-10', endDate: '2026-01-10', trialEnd: null, autoRenew: true, paymentMethod: 'Orange Money', lastPayment: '2025-06-10', nextBilling: '2025-07-10', billingCycle: 'monthly', amount: 49000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2025-01-10' },
  { id: 'sub_005', companyId: 'comp_5', companyName: 'Finex Voyages', planId: 'plan_enterprise', status: 'suspended', startDate: '2025-03-01', endDate: '2026-03-01', trialEnd: null, autoRenew: false, paymentMethod: 'Carte bancaire', lastPayment: '2025-05-01', nextBilling: null, billingCycle: 'monthly', amount: 499000, currency: 'XOF', assignedBy: 'Système', assignedAt: '2025-03-01' },
  { id: 'sub_006', companyId: 'comp_6', companyName: 'Buca Voyages', planId: 'plan_freemium', status: 'expired', startDate: '2024-06-01', endDate: '2025-06-01', trialEnd: null, autoRenew: false, paymentMethod: null, lastPayment: null, nextBilling: null, billingCycle: 'monthly', amount: 0, currency: 'XOF', assignedBy: 'Système', assignedAt: '2024-06-01' },
  { id: 'sub_007', companyId: 'comp_7', companyName: 'Express Bus Cameroun', planId: 'plan_premium', status: 'active', startDate: '2024-11-01', endDate: '2025-11-01', trialEnd: null, autoRenew: true, paymentMethod: 'Virement bancaire', lastPayment: '2025-06-01', nextBilling: '2025-11-01', billingCycle: 'yearly', amount: 1790000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2024-11-01' },
  { id: 'sub_008', companyId: 'comp_8', companyName: 'Touristique Express', planId: 'plan_business', status: 'cancelled', startDate: '2024-08-15', endDate: '2025-04-15', trialEnd: null, autoRenew: false, paymentMethod: 'Mobile Money', lastPayment: '2025-04-15', nextBilling: null, billingCycle: 'monthly', amount: 199000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2024-08-15' },
  { id: 'sub_009', companyId: 'comp_9', companyName: 'Finex Voyages', planId: 'plan_growth', status: 'active', startDate: '2025-05-01', endDate: '2026-05-01', trialEnd: null, autoRenew: true, paymentMethod: 'Orange Money', lastPayment: '2025-06-01', nextBilling: '2025-07-01', billingCycle: 'monthly', amount: 99000, currency: 'XOF', assignedBy: 'Admin Guillaume', assignedAt: '2025-05-01' },
];

/* ══════════════════════════════════════════════════════════════
   BILLING RECORDS
   ══════════════════════════════════════════════════════════════ */
export const billingRecords = [
  { id: 'inv_001', subscriptionId: 'sub_001', companyName: 'Express Bus Cameroun', planName: 'Business', amount: 199000, tax: 29850, discount: 0, commission: 0, total: 228850, status: 'paid', paymentDate: '2025-06-15', paymentMethod: 'Carte bancaire', dueDate: '2025-06-15', period: 'Juin 2025', receiptUrl: '#', notes: '' },
  { id: 'inv_002', subscriptionId: 'sub_002', companyName: 'Touristique Express', planName: 'Growth', amount: 99000, tax: 14850, discount: 5000, commission: 0, total: 108850, status: 'paid', paymentDate: '2025-06-01', paymentMethod: 'Mobile Money', dueDate: '2025-06-01', period: 'Juin 2025', receiptUrl: '#', notes: 'Remise fidélité' },
  { id: 'inv_003', subscriptionId: 'sub_004', companyName: 'Buca Voyages', planName: 'Starter', amount: 49000, tax: 7350, discount: 0, commission: 0, total: 56350, status: 'paid', paymentDate: '2025-06-10', paymentMethod: 'Orange Money', dueDate: '2025-06-10', period: 'Juin 2025', receiptUrl: '#', notes: '' },
  { id: 'inv_004', subscriptionId: 'sub_007', companyName: 'Express Bus Cameroun', planName: 'Premium Annual', amount: 1790000, tax: 268500, discount: 100000, commission: 0, total: 1958500, status: 'paid', paymentDate: '2025-06-01', paymentMethod: 'Virement bancaire', dueDate: '2025-06-01', period: 'Annuel 2025-2026', receiptUrl: '#', notes: 'Remise annuelle' },
  { id: 'inv_005', subscriptionId: 'sub_005', companyName: 'Finex Voyages', planName: 'Enterprise', amount: 499000, tax: 74850, discount: 0, commission: 0, total: 573850, status: 'overdue', paymentDate: null, paymentMethod: 'Carte bancaire', dueDate: '2025-06-01', period: 'Juin 2025', receiptUrl: '#', notes: 'Paiement en retard' },
  { id: 'inv_006', subscriptionId: 'sub_009', companyName: 'Finex Voyages', planName: 'Growth', amount: 99000, tax: 14850, discount: 0, commission: 0, total: 113850, status: 'paid', paymentDate: '2025-06-01', paymentMethod: 'Orange Money', dueDate: '2025-06-01', period: 'Juin 2025', receiptUrl: '#', notes: '' },
  { id: 'inv_007', subscriptionId: 'sub_003', companyName: 'Finex Voyages', planName: 'Growth', amount: 0, tax: 0, discount: 0, commission: 0, total: 0, status: 'pending', paymentDate: null, paymentMethod: null, dueDate: '2025-06-24', period: 'Essai gratuit', receiptUrl: '#', notes: 'Période d\'essai — conversion attendue' },
  { id: 'inv_008', subscriptionId: 'sub_001', companyName: 'Express Bus Cameroun', planName: 'Business', amount: 199000, tax: 29850, discount: 0, commission: 0, total: 228850, status: 'paid', paymentDate: '2025-05-15', paymentMethod: 'Carte bancaire', dueDate: '2025-05-15', period: 'Mai 2025', receiptUrl: '#', notes: '' },
  { id: 'inv_009', subscriptionId: 'sub_002', companyName: 'Touristique Express', planName: 'Growth', amount: 99000, tax: 14850, discount: 0, commission: 0, total: 113850, status: 'paid', paymentDate: '2025-05-01', paymentMethod: 'Mobile Money', dueDate: '2025-05-01', period: 'Mai 2025', receiptUrl: '#', notes: '' },
  { id: 'inv_010', subscriptionId: 'sub_005', companyName: 'Finex Voyages', planName: 'Enterprise', amount: 499000, tax: 74850, discount: 0, commission: 0, total: 573850, status: 'paid', paymentDate: '2025-05-01', paymentMethod: 'Carte bancaire', dueDate: '2025-05-01', period: 'Mai 2025', receiptUrl: '#', notes: '' },
];

export const billingStatusConfig = {
  paid: { label: 'Payée', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  pending: { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  overdue: { label: 'En retard', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  cancelled: { label: 'Annulée', color: '#6B7280', bg: 'rgba(107,114,128,0.06)' },
  refunded: { label: 'Remboursée', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

/* ══════════════════════════════════════════════════════════════
   SUBSCRIPTION TIMELINE EVENTS
   ══════════════════════════════════════════════════════════════ */
export const subscriptionTimeline = [
  { id: 'evt_01', subscriptionId: 'sub_001', action: 'created', title: 'Abonnement souscrit', description: 'Plan Business — Express Bus Cameroun', time: '2024-09-15 10:30', user: 'Admin Guillaume' },
  { id: 'evt_02', subscriptionId: 'sub_001', action: 'payment', title: 'Paiement mensuel', description: '228 850 FCFA — Carte bancaire', time: '2025-06-15 09:15', user: 'Système' },
  { id: 'evt_03', subscriptionId: 'sub_001', action: 'payment', title: 'Paiement mensuel', description: '228 850 FCFA — Carte bancaire', time: '2025-05-15 09:10', user: 'Système' },
  { id: 'evt_04', subscriptionId: 'sub_002', action: 'created', title: 'Abonnement souscrit', description: 'Plan Growth — Touristique Express', time: '2024-10-01 11:00', user: 'Admin Guillaume' },
  { id: 'evt_05', subscriptionId: 'sub_002', action: 'payment', title: 'Paiement mensuel', description: '108 850 FCFA — Mobile Money', time: '2025-06-01 08:30', user: 'Système' },
  { id: 'evt_06', subscriptionId: 'sub_005', action: 'suspended', title: 'Abonnement suspendu', description: 'Plan Enterprise — Finex Voyages — Impayé', time: '2025-05-15 14:00', user: 'Système' },
  { id: 'evt_07', subscriptionId: 'sub_008', action: 'cancelled', title: 'Abonnement résilié', description: 'Plan Business — Touristique Express — Résiliation demandée', time: '2025-04-15 16:45', user: 'Admin Guillaume' },
  { id: 'evt_08', subscriptionId: 'sub_003', action: 'trial', title: 'Essai gratuit démarré', description: 'Plan Growth — Finex Voyages — 14 jours d\'essai', time: '2025-06-10 09:00', user: 'Système' },
  { id: 'evt_09', subscriptionId: 'sub_004', action: 'payment', title: 'Paiement mensuel', description: '56 350 FCFA — Orange Money', time: '2025-06-10 07:45', user: 'Système' },
  { id: 'evt_10', subscriptionId: 'sub_007', action: 'renewed', title: 'Renouvellement annuel', description: 'Plan Premium Annual — 1 958 500 FCFA — Virement bancaire', time: '2025-06-01 10:00', user: 'Système' },
  { id: 'evt_11', subscriptionId: 'sub_009', action: 'created', title: 'Abonnement souscrit', description: 'Plan Growth — Finex Voyages', time: '2025-05-01 13:20', user: 'Admin Guillaume' },
  { id: 'evt_12', subscriptionId: 'sub_006', action: 'expired', title: 'Abonnement expiré', description: 'Plan Freemium — Buca Voyages — Fin de validité', time: '2025-06-01 00:00', user: 'Système' },
];

/* ══════════════════════════════════════════════════════════════
   STATS / KPI
   ══════════════════════════════════════════════════════════════ */
export const subscriptionStats = {
  total: { label: 'Total plans', value: 7, trend: 0 },
  active: { label: 'Plans actifs', value: 5, trend: 25 },
  inactive: { label: 'Plans archivés', value: 1, trend: 0 },
  subscribed: { label: 'Compagnies abonnées', value: 6, trend: 20 },
  trials: { label: 'Essais gratuits', value: 1, trend: 100 },
  expired: { label: 'Expirés', value: 1, trend: 50 },
  renewals: { label: 'Renouvellements / mois', value: 4, trend: 33 },
  revenue: { label: 'Revenus mensuels', value: 2895000, trend: 15, isCurrency: true },
};

/* ══════════════════════════════════════════════════════════════
   HELPERS — fully ready for Express.js swap
   ══════════════════════════════════════════════════════════════ */
export const defaultFilters = {
  search: '',
  status: '',
  duration: '',
  currency: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'newest',
};

export const filterPlans = (list, filters) => {
  return list.filter(p => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!p.name?.toLowerCase().includes(s) && !p.description?.toLowerCase().includes(s)) return false;
    }
    if (filters.status && p.status !== filters.status) return false;
    if (filters.duration && p.duration !== filters.duration) return false;
    if (filters.currency && p.currency !== filters.currency) return false;
    if (filters.minPrice && (p.price < Number(filters.minPrice))) return false;
    if (filters.maxPrice && (p.price > Number(filters.maxPrice))) return false;
    return true;
  });
};

export const sortPlans = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
    case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
    case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'companies': sorted.sort((a, b) => b.companiesCount - a.companiesCount); break;
    case 'popular': sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break;
    default: sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
  }
  return sorted;
};

export const filterSubscriptions = (list, filters) => {
  return list.filter(s => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.companyName?.toLowerCase().includes(q) && !s.planId?.toLowerCase().includes(q)) return false;
    }
    if (filters.status && s.status !== filters.status) return false;
    if (filters.planId && s.planId !== filters.planId) return false;
    if (filters.currency && s.currency !== filters.currency) return false;
    return true;
  });
};

export const getPlanById = (planId) => plans.find(p => p.id === planId);

export const getSubscriptionsByPlan = (planId) => subscriptions.filter(s => s.planId === planId);

export const getBillingBySubscription = (subId) => billingRecords.filter(b => b.subscriptionId === subId);

export const getTimelineBySubscription = (subId) => subscriptionTimeline.filter(e => e.subscriptionId === subId);

export const calculateAnnualEquivalent = (price, duration) => {
  const multipliers = { monthly: 12, quarterly: 4, biannual: 2, yearly: 1 };
  return price * (multipliers[duration] || 12);
};

export const formatCurrency = (amount, currency = 'XOF') => {
  const cfg = currencySymbols[currency] || currencySymbols.XOF;
  if (cfg.code === 'XOF') return `${amount.toLocaleString()} ${cfg.symbol}`;
  return `${cfg.symbol}${amount.toLocaleString()}`;
};
