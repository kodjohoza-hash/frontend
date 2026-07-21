/**
 * BUS TIX CONNECT — Payment Mock Data
 */

export const PAYMENT_METHODS = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    description: 'Payez directement depuis votre compte MTN MoMo',
    icon: 'bi-phone-fill',
    color: '#FFCC00',
    category: 'mobile_money',
    available: true,
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    description: 'Payez avec Orange Money en toute securite',
    icon: 'bi-phone-fill',
    color: '#FF6600',
    category: 'mobile_money',
    available: true,
  },
  {
    id: 'express_union',
    name: 'Express Union Mobile',
    description: 'Mobile banking Express Union',
    icon: 'bi-phone-fill',
    color: '#E31837',
    category: 'mobile_money',
    available: true,
  },
  {
    id: 'visa',
    name: 'Visa',
    description: 'Carte de debit ou credit Visa',
    icon: 'bi-credit-card-fill',
    color: '#1A1F71',
    category: 'card',
    available: true,
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    description: 'Carte de debit ou credit Mastercard',
    icon: 'bi-credit-card-fill',
    color: '#EB001B',
    category: 'card',
    available: true,
  },
  {
    id: 'agency',
    name: "Paiement a l'agence",
    description: "Payez en especes a l'agence avant le depart",
    icon: 'bi-building',
    color: 'var(--color-primary)',
    category: 'agency',
    available: true,
  },
];

export const mockReservation = {
  tripId: 'trp_001',
  companyName: 'GRAND LITTORAL',
  companyLogo: null,
  tripNumber: 'GL-2026-0824-001',
  departureCity: 'Douala',
  arrivalCity: 'Yaounde',
  departureDate: '2026-08-24',
  departureTime: '06:00',
  arrivalTime: '09:15',
  duration: '3h 15min',
  busType: 'VIP',
  seats: [
    { number: 1, position: 'window', price: 4500 },
    { number: 2, position: 'aisle', price: 4500 },
  ],
  pricePerSeat: 4500,
  currency: 'XAF',
  baggageIncluded: '1 bagage en soute (23 kg) + 1 bagage a main (7 kg)',
  servicesIncluded: ['Wi-Fi', 'Ports USB', 'Climatisation', 'TV individuelle', 'Toilettes'],
  cancellationPolicy: 'Annulation gratuite jusqu\'a 24h avant le depart',
  refundPolicy: 'Remboursement integral sous 7 jours ouvrables',
};

export const INITIAL_PASSENGER = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  idType: 'cni',
  idNumber: '',
};

export const STEPS = [
  { id: 1, label: 'Recherche', icon: 'bi-search' },
  { id: 2, label: 'Choix du voyage', icon: 'bi-bus-front-fill' },
  { id: 3, label: 'Choix des sieges', icon: 'bi-grid-3x3-gap-fill' },
  { id: 4, label: 'Paiement', icon: 'bi-credit-card-fill' },
  { id: 5, label: 'Confirmation', icon: 'bi-check-circle-fill' },
];

export const PROMO_CODES = {
  BIENVENUE10: { discount: 10, type: 'percent', label: '10% de reduction' },
  BTC500: { discount: 500, type: 'fixed', label: '500 FCFA de reduction' },
  ETUDIANT: { discount: 15, type: 'percent', label: '15% tarif etudiant' },
};

export const INSURANCE_OPTION = {
  id: 'travel_insurance',
  name: 'Assurance Voyage',
  description: 'Protection complete : annulation, bagages, accidents. Couvre jusqu\'a 500 000 FCFA.',
  price: 1500,
  currency: 'XAF',
};
