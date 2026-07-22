export const BOOKING_STEPS = [
  { key: 'search', label: 'Recherche', icon: 'bi-search', done: true },
  { key: 'results', label: 'Voyage', icon: 'bi-bus-front-fill', done: true },
  { key: 'seats', label: 'Sièges', icon: 'bi-grid-3x3-gap-fill', done: true },
  { key: 'payment', label: 'Paiement', icon: 'bi-shield-lock-fill', active: true },
  { key: 'confirm', label: 'Confirmation', icon: 'bi-check-circle', upcoming: true },
];

export const PAYMENT_METHODS = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    tagline: 'Paiement instantané via MTN MoMo',
    icon: 'bi-phone',
    category: 'mobile_money',
    color: '#FFCC00',
    bg: 'rgba(255,204,0,0.08)',
    accentBg: 'rgba(255,204,0,0.12)',
    available: true,
    badge: 'Populaire',
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    tagline: 'Orange Money, simple et sécurisé',
    icon: 'bi-phone-fill',
    category: 'mobile_money',
    color: '#FF6600',
    bg: 'rgba(255,102,0,0.08)',
    accentBg: 'rgba(255,102,0,0.12)',
    available: true,
    badge: null,
  },
  {
    id: 'express_union',
    name: 'Express Union',
    tagline: 'Mobile Banking Express Union',
    icon: 'bi-wallet2',
    category: 'mobile_money',
    color: '#E31837',
    bg: 'rgba(227,24,55,0.06)',
    accentBg: 'rgba(227,24,55,0.10)',
    available: true,
    badge: null,
  },
  {
    id: 'visa',
    name: 'Visa',
    tagline: 'Carte de débit ou crédit Visa',
    icon: 'bi-credit-card-2-front',
    category: 'card',
    color: '#1A1F71',
    bg: 'rgba(26,31,113,0.06)',
    accentBg: 'rgba(26,31,113,0.10)',
    available: true,
    badge: null,
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    tagline: 'Carte de débit ou crédit Mastercard',
    icon: 'bi-credit-card-2-front-fill',
    category: 'card',
    color: '#EB001B',
    bg: 'rgba(235,0,27,0.06)',
    accentBg: 'rgba(235,0,27,0.10)',
    available: true,
    badge: null,
  },
  {
    id: 'agency',
    name: 'Paiement à l\'agence',
    tagline: 'Réservez maintenant, payez sur place',
    icon: 'bi-shop',
    category: 'agency',
    color: '#0B1D51',
    bg: 'rgba(11,29,81,0.05)',
    accentBg: 'rgba(11,29,81,0.08)',
    available: true,
    badge: null,
  },
];

export const MOCK_RESERVATION = {
  tripId: 'BTC-2026-0824-001',
  company: {
    name: 'GRAND LITTORAL',
    initial: 'GL',
    color: '#0B1D51',
    rating: 4.7,
    verified: true,
  },
  bus: {
    type: 'VIP',
    number: 'GL-BUS-042',
    photo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
  },
  route: {
    from: 'Douala',
    fromCode: 'DLA',
    to: 'Yaoundé',
    toCode: 'YDE',
  },
  schedule: {
    date: '2026-08-24',
    dateFormatted: 'Lundi 24 Août 2026',
    departure: '06:00',
    arrival: '09:15',
    duration: '3h 15min',
    distance: '243 km',
  },
  seats: [
    { id: 'A1', number: 'A1', type: 'Fenêtre', price: 4500 },
    { id: 'A2', number: 'A2', type: 'Couloir', price: 4500 },
  ],
  services: ['Wi-Fi', 'USB', 'Climatisation', 'TV', 'Toilettes'],
  baggage: '2 bagages (23 kg + 7 kg)',
  policies: {
    cancellation: 'Annulation gratuite jusqu\'à 24h avant le départ',
    refund: 'Remboursement intégral sous 7 jours',
  },
  currency: 'XAF',
  fees: 500,
};

export const PROMO_CODES = {
  BIENVENUE10: { discount: 10, type: 'percent', label: '10% de réduction', description: 'Offre de bienvenue' },
  BTC500: { discount: 500, type: 'fixed', label: '500 FCFA de réduction', description: 'Réduction fidélité' },
  ETUDIANT: { discount: 15, type: 'percent', label: '15% tarif étudiant', description: 'Tarif étudiant' },
};

export const INSURANCE = {
  id: 'travel_insurance',
  name: 'Assurance Voyage Premium',
  description: 'Protection complète : annulation, bagages perdus, accidents. Couvre jusqu\'à 500 000 FCFA.',
  features: [
    'Annulation/remboursement intégral',
    'Protection des bagages',
    'Assistance accident 24/7',
  ],
  price: 1500,
  currency: 'XAF',
};

export const TRUST_BADGES = [
  { icon: 'bi-shield-lock-fill', label: 'Paiement sécurisé', color: '#10b981' },
  { icon: 'bi-lock-fill', label: 'SSL 256-bit', color: '#3b82f6' },
  { icon: 'bi-key-fill', label: 'Données chiffrées', color: '#8b5cf6' },
  { icon: 'bi-patch-check-fill', label: 'Transactions protégées', color: '#06b6d4' },
];
