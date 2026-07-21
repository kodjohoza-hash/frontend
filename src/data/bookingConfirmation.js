/**
 * BUS TIX CONNECT — Booking Confirmation Mock Data
 * Centralized, replaceable when API is ready
 */

export const mockBooking = {
  id: 'BK-2026-0824-00147',
  reference: 'BTC-GL-00147',
  createdAt: '2026-08-20T14:32:00Z',
  status: 'confirmed',
  currency: 'XAF',
};

export const mockTrip = {
  companyName: 'GRAND LITTORAL',
  companyLogo: null,
  tripNumber: 'GL-2026-0824-001',
  busNumber: 'GL-BUS-042',
  busType: 'VIP',
  departureCity: 'Douala',
  arrivalCity: 'Yaounde',
  departureDate: '2026-08-24',
  departureTime: '06:00',
  arrivalTime: '09:15',
  duration: '3h 15min',
  distance: '243 km',
  departurePoint: 'Gare routiere de Douala (Bonaberi)',
  arrivalPoint: 'Gare routiere de Yaounde (Mvog-Ada)',
};

export const mockPassengers = [
  {
    id: 'pax_001',
    firstName: 'Jean',
    lastName: 'Kamga',
    phone: '+237 699 123 456',
    email: 'jean.kamga@email.com',
  },
  {
    id: 'pax_002',
    firstName: 'Marie',
    lastName: 'Kamga',
    phone: '+237 699 123 457',
    email: 'marie.kamga@email.com',
  },
];

export const mockSeats = [
  { number: 1, position: 'window', type: 'VIP' },
  { number: 2, position: 'aisle', type: 'VIP' },
];

export const mockPayment = {
  method: 'MTN Mobile Money',
  methodIcon: 'bi-phone-fill',
  amount: 10500,
  fees: 500,
  insurance: 1500,
  subtotal: 9000,
  paidAt: '2026-08-20T14:33:15Z',
  status: 'paid',
  transactionId: 'TXN-1724164395-X7K2M9',
};

export const STEPS = [
  { id: 1, label: 'Recherche', icon: 'bi-search' },
  { id: 2, label: 'Choix du voyage', icon: 'bi-bus-front-fill' },
  { id: 3, label: 'Choix des sieges', icon: 'bi-grid-3x3-gap-fill' },
  { id: 4, label: 'Paiement', icon: 'bi-credit-card-fill' },
  { id: 5, label: 'Confirmation', icon: 'bi-check-circle-fill' },
];

export const TRAVEL_TIPS = [
  { icon: 'bi-clock-fill', title: 'Arrivez en avance', description: 'Presentez-vous 30 minutes avant l\'heure de depart.' },
  { icon: 'bi-ticket-perforated-fill', title: 'Votre billet', description: 'Presentez votre billet numerique ou imprime au conducteur.' },
  { icon: 'bi-person-badge-fill', title: 'Piece d\'identite', description: 'Une piece d\'identite valide est obligatoire.' },
  { icon: 'bi-box', title: 'Bagages', description: 'Respectez les bagages autorises : 23 kg en soute + 7 kg a main.' },
];
