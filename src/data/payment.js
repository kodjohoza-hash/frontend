export const PAYMENT_METHODS = [
  { id: 'mtn_momo', name: 'MTN Mobile Money', description: 'Payez directement avec votre compte MTN MoMo', icon: 'bi-phone-fill', color: '#FFCC00', bgColor: '#FFF9E0', category: 'mobile_money', available: true, logo: 'MTN' },
  { id: 'orange_money', name: 'Orange Money', description: 'Payez en toute sécurité avec Orange Money', icon: 'bi-phone-fill', color: '#FF6600', bgColor: '#FFF3E8', category: 'mobile_money', available: true, logo: 'OM' },
  { id: 'express_union', name: 'Express Union Mobile', description: 'Mobile Banking Express Union', icon: 'bi-phone-fill', color: '#E31837', bgColor: '#FFF0F3', category: 'mobile_money', available: true, logo: 'EU' },
  { id: 'visa', name: 'Visa', description: 'Carte de débit ou crédit Visa', icon: 'bi-credit-card-fill', color: '#1A1F71', bgColor: '#EEF1FF', category: 'card', available: true, logo: 'VISA' },
  { id: 'mastercard', name: 'Mastercard', description: 'Carte de débit ou crédit Mastercard', icon: 'bi-credit-card-fill', color: '#EB001B', bgColor: '#FFF0F0', category: 'card', available: true, logo: 'MC' },
  { id: 'agency', name: "Paiement à l'agence", description: "Payez en espèces au comptoir avant le départ", icon: 'bi-building', color: '#0B1D51', bgColor: '#EEF2FF', category: 'agency', available: true, logo: 'AG' },
];

export const mockReservation = {
  tripId: 'trp_001',
  companyName: 'GRAND LITTORAL',
  companyInitial: 'GL',
  companyColor: '#0B1D51',
  tripNumber: 'GL-2026-0824-001',
  busNumber: 'GL-BUS-042',
  busType: 'VIP',
  busPhoto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
  departureCity: 'Douala',
  arrivalCity: 'Yaoundé',
  departureDate: '2026-08-24',
  departureTime: '06:00',
  arrivalTime: '09:15',
  duration: '3h 15min',
  distance: '243 km',
  seats: [
    { number: 1, position: 'Fenêtre', price: 4500 },
    { number: 2, position: 'Couloir', price: 4500 },
  ],
  pricePerSeat: 4500,
  currency: 'XAF',
  baggageIncluded: '2 bagages inclus (23 kg + 7 kg)',
  servicesIncluded: ['Wi-Fi', 'Ports USB', 'Climatisation', 'TV individuelle', 'Toilettes'],
  cancellationPolicy: "Annulation gratuite jusqu'à 24h avant le départ",
  refundPolicy: 'Remboursement intégral sous 7 jours ouvrables',
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
  { id: 3, label: 'Choix des sièges', icon: 'bi-grid-3x3-gap-fill' },
  { id: 4, label: 'Paiement', icon: 'bi-credit-card-fill' },
  { id: 5, label: 'Confirmation', icon: 'bi-check-circle-fill' },
];

export const PROMO_CODES = {
  BIENVENUE10: { discount: 10, type: 'percent', label: '10% de réduction' },
  BTC500: { discount: 500, type: 'fixed', label: '500 FCFA de réduction' },
  ETUDIANT: { discount: 15, type: 'percent', label: '15% tarif étudiant' },
};

export const INSURANCE_OPTION = {
  id: 'travel_insurance',
  name: 'Assurance Voyage',
  description: "Protection complète : annulation, bagages, accidents. Couvre jusqu'à 500 000 FCFA.",
  price: 1500,
  currency: 'XAF',
};
