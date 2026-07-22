export const CONFIRMATION_STEPS = [
  { key: 'search', label: 'Recherche', icon: 'bi-search', done: true },
  { key: 'results', label: 'Voyage', icon: 'bi-bus-front-fill', done: true },
  { key: 'seats', label: 'Sièges', icon: 'bi-grid-3x3-gap-fill', done: true },
  { key: 'payment', label: 'Paiement', icon: 'bi-shield-lock-fill', done: true },
  { key: 'confirm', label: 'Confirmation', icon: 'bi-check-circle-fill', active: true },
];

export const BOOKING = {
  id: 'BK-2026-0824-00147',
  reference: 'BTC-GL-00147',
  createdAt: '2026-08-20T14:32:00Z',
  status: 'confirmed',
  currency: 'XAF',
};

export const TRIP = {
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
  tripNumber: 'GL-2026-0824-001',
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
  boarding: 'Gare routière de Douala (Bonaberi)',
  arrivalPoint: 'Gare routière de Yaoundé (Mvog-Ada)',
};

export const PASSENGERS = [
  {
    id: 'pax_001',
    firstName: 'Jean',
    lastName: 'Kamga',
    phone: '+237 699 123 456',
    email: 'jean.kamga@email.com',
    seat: { number: 'A1', type: 'Fenêtre', price: 4500 },
  },
  {
    id: 'pax_002',
    firstName: 'Marie',
    lastName: 'Kamga',
    phone: '+237 699 123 457',
    email: 'marie.kamga@email.com',
    seat: { number: 'A2', type: 'Couloir', price: 4500 },
  },
];

export const PAYMENT = {
  method: 'MTN Mobile Money',
  methodIcon: 'bi-phone-fill',
  amount: 10500,
  fees: 500,
  insurance: 1500,
  subtotal: 9000,
  discount: 0,
  paidAt: '2026-08-20T14:33:15Z',
  status: 'paid',
  transactionId: 'TXN-1724164395-X7K2M9',
};

export const TRAVEL_ADVICE = [
  { icon: 'bi-clock-history', title: 'Arrivez en avance', desc: 'Présentez-vous 30 minutes avant l\'heure de départ au guichet d\'embarquement.' },
  { icon: 'bi-person-badge', title: 'Pièce d\'identité', desc: 'Une pièce d\'identité valide est obligatoire pour embarquer.' },
  { icon: 'bi-ticket-perforated', title: 'Votre billet', desc: 'Présentez ce billet numérique ou imprimé au conducteur ou au guichet.' },
  { icon: 'bi-box2', title: 'Bagages', desc: 'Bagages autorisés : 23 kg en soute + 7 kg en cabine. Excédent payant.' },
];

export const SUPPORT_CONTACTS = [
  { icon: 'bi-telephone-fill', label: 'Téléphone', value: '+237 699 000 000', detail: 'Lun–Sam : 6h – 22h', color: '#10b981' },
  { icon: 'bi-envelope-fill', label: 'Email', value: 'support@bustixconnect.com', detail: 'Réponse sous 24h', color: '#3b82f6' },
  { icon: 'bi-whatsapp', label: 'WhatsApp', value: '+237 699 000 000', detail: 'Réponse rapide', color: '#25d366' },
  { icon: 'bi-question-circle-fill', label: 'FAQ', value: 'Aide en ligne', detail: 'Questions fréquentes', color: '#8b5cf6' },
];
