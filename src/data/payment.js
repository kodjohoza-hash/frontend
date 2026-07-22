export const PAYMENT_METHODS = [
  { id: 'mtn_momo', name: 'MTN Mobile Money', description: 'Payez avec votre compte MTN MoMo', brand: 'MTN', brandColor: '#FFCC00', brandBg: '#1a1a00', category: 'mobile_money', available: true },
  { id: 'orange_money', name: 'Orange Money', description: 'Paiement sécurisé Orange Money', brand: 'OM', brandColor: '#FF6600', brandBg: '#1a0f00', category: 'mobile_money', available: true },
  { id: 'express_union', name: 'Express Union', description: 'Mobile Banking Express Union', brand: 'EU', brandColor: '#E31837', brandBg: '#1a0508', category: 'mobile_money', available: true },
  { id: 'visa', name: 'Visa', description: 'Carte de débit ou crédit', brand: 'VISA', brandColor: '#1A1F71', brandBg: '#0d0f38', category: 'card', available: true },
  { id: 'mastercard', name: 'Mastercard', description: 'Carte de débit ou crédit', brand: 'MC', brandColor: '#EB001B', brandBg: '#1a0003', category: 'card', available: true },
  { id: 'agency', name: 'En agence', description: 'Payez en espèces au comptoir', brand: 'AG', brandColor: '#60A5FA', brandBg: '#0a1628', category: 'agency', available: true },
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
  baggageIncluded: '2 bagages (23 kg + 7 kg)',
  servicesIncluded: ['Wi-Fi', 'USB', 'Climatisation', 'TV', 'Toilettes'],
  cancellationPolicy: 'Annulation gratuite jusqu\'à 24h avant le départ',
  refundPolicy: 'Remboursement intégral sous 7 jours',
};

export const STEPS = [
  { id: 1, label: 'Recherche', icon: 'bi-search' },
  { id: 2, label: 'Voyage', icon: 'bi-bus-front-fill' },
  { id: 3, label: 'Sièges', icon: 'bi-grid-3x3-gap-fill' },
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
  description: 'Protection complète : annulation, bagages, accidents. Couvre jusqu\'à 500 000 FCFA.',
  price: 1500,
  currency: 'XAF',
};
