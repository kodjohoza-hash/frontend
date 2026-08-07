export const companyProfile = {
  id: 'comp_001',
  name: 'Bus Tix Connect',
  commercialName: 'Bus Tix Connect Sarl',
  slogan: 'Voyagez en toute simplicité',
  description: 'Bus Tix Connect est une plateforme de réservation de billets de bus en ligne,...',
  email: 'contact@bustixconnect.com',
  phone: '+237 123 456 789',
  website: 'https://bustixconnect.com',
  address: '123 Rue de la Paix',
  city: 'Douala',
  country: 'Cameroun',
  gpsLat: '4.0511',
  gpsLng: '9.7679',
  hours: { weekdays: '07:00 - 21:00', weekends: '08:00 - 20:00' },
  status: 'active',
  verified: true,
  createdAt: '2024-01-15T08:00:00',
  logo: null,
  coverImage: null,
  rating: 4.7,
};

export const agencyStats = [
  { id: 'trips', label: 'Voyages', value: 128, icon: 'bi-bus-front', color: '#0B1D51', change: '+12%' },
  { id: 'buses', label: 'Bus', value: 24, icon: 'bi-truck', color: '#FF6B35', change: '+2' },
  { id: 'drivers', label: 'Chauffeurs', value: 32, icon: 'bi-person-badge', color: '#22c55e', change: '+3' },
  { id: 'agents', label: 'Agents', value: 18, icon: 'bi-people', color: '#8b5cf6', change: '+1' },
  { id: 'branches', label: 'Points de vente', value: 9, icon: 'bi-shop', color: '#06b6d4', change: '0' },
  { id: 'bookings', label: 'Réservations', value: 4580, icon: 'bi-ticket', color: '#f59e0b', change: '+18%' },
  { id: 'clients', label: 'Clients', value: 2840, icon: 'bi-people', color: '#ec4899', change: '+22%' },
  { id: 'occupancy', label: "Taux d'occupation", value: '78%', icon: 'bi-graph-up-arrow', color: '#14b8a6', change: '+5%' },
  { id: 'revenue', label: 'Revenu total', value: '185 420 000 XAF', icon: 'bi-currency-exchange', color: '#0B1D51', change: '+15%' },
  { id: 'rating', label: 'Note moyenne', value: '4.7/5', icon: 'bi-star-fill', color: '#FF6B35', change: '+0.2' },
];

export const profileManager = {
  firstName: 'Jean',
  lastName: 'Mbarga',
  photo: null,
  role: 'Directeur Général',
  phone: '+237 698 765 432',
  email: 'jean.mbarga@bustixconnect.com',
  signature: null,
};

export const profileDocuments = [
  { id: 'logo', name: 'Logo officiel', status: 'uploaded', file: 'logo.png', url: null },
  { id: 'rccm', name: 'RCCM', status: 'uploaded', file: 'rccm_2024.pdf', url: null },
  { id: 'taxpayer', name: 'Numéro contribuable', status: 'uploaded', file: 'contribuable.pdf', url: null },
  { id: 'license', name: "Licence d'exploitation", status: 'uploaded', file: 'license_2024.pdf', url: null },
  { id: 'insurance', name: 'Assurance', status: 'missing', file: null, url: null },
];

export const profilePayments = [
  { id: 'om', name: 'Orange Money', enabled: true, icon: 'bi-phone' },
  { id: 'momo', name: 'MTN Mobile Money', enabled: true, icon: 'bi-phone' },
  { id: 'card', name: 'Carte bancaire', enabled: false, icon: 'bi-credit-card' },
  { id: 'cash', name: 'Espèces', enabled: true, icon: 'bi-cash' },
  { id: 'transfer', name: 'Virement bancaire', enabled: true, icon: 'bi-bank' },
];

export const profileCoverage = [
  { id: 'dla', city: 'Douala', trips: 45, departures: 180 },
  { id: 'yde', city: 'Yaoundé', trips: 38, departures: 152 },
  { id: 'baf', city: 'Bafoussam', trips: 12, departures: 48 },
  { id: 'gar', city: 'Garoua', trips: 8, departures: 32 },
  { id: 'bda', city: 'Bamenda', trips: 10, departures: 40 },
  { id: 'nktt', city: 'Nkongsamba', trips: 6, departures: 24 },
  { id: 'lim', city: 'Limbe', trips: 5, departures: 20 },
  { id: 'kribi', city: 'Kribi', trips: 4, departures: 16 },
];

export const profileFleet = [
  { id: 'bus_001', immatriculation: 'LT 123 AB', model: 'Mercedes Sprinter', capacity: 30, status: 'active', driver: 'Paul Biya' },
  { id: 'bus_002', immatriculation: 'LT 456 CD', model: 'Toyota Coaster', capacity: 26, status: 'active', driver: 'Marie Ngono' },
  { id: 'bus_003', immatriculation: 'LT 789 EF', model: 'Isuzu NQR', capacity: 40, status: 'maintenance', driver: null },
  { id: 'bus_004', immatriculation: 'LT 012 GH', model: 'Mercedes Sprinter', capacity: 30, status: 'active', driver: 'David Essomba' },
  { id: 'bus_005', immatriculation: 'LT 345 IJ', model: 'Toyota Hiace', capacity: 18, status: 'active', driver: 'Esther Mvondo' },
  { id: 'bus_006', immatriculation: 'LT 678 KL', model: 'Isuzu NQR', capacity: 40, status: 'inactive', driver: null },
];

export const profileTeam = [
  { id: 'emp_001', firstName: 'Jean', lastName: 'Mbarga', role: 'Directeur Général', photo: null, email: 'j.mbarga@bustixconnect.com', phone: '+237 698 765 432', type: 'manager' },
  { id: 'emp_002', firstName: 'Marie', lastName: 'Ngo', role: 'Directrice Commerciale', photo: null, email: 'm.ngo@bustixconnect.com', phone: '+237 691 234 567', type: 'manager' },
  { id: 'emp_003', firstName: 'Paul', lastName: 'Biya', role: 'Chauffeur Senior', photo: null, email: 'p.biya@bustixconnect.com', phone: '+237 677 888 999', type: 'driver' },
  { id: 'emp_004', firstName: 'Jeanne', lastName: 'Mbella', role: 'Agent de Guichet', photo: null, email: 'j.mbella@bustixconnect.com', phone: '+237 699 111 222', type: 'agent' },
  { id: 'emp_005', firstName: 'David', lastName: 'Essomba', role: 'Chauffeur', photo: null, email: 'd.essomba@bustixconnect.com', phone: '+237 655 444 333', type: 'driver' },
  { id: 'emp_006', firstName: 'Esther', lastName: 'Mvondo', role: 'Agent de Guichet', photo: null, email: 'e.mvondo@bustixconnect.com', phone: '+237 670 555 666', type: 'agent' },
];

export const profileTimeline = [
  { id: 1, type: 'booking', title: 'Nouvelle réservation', description: 'Réservation BTC-2026-0789 par Jean Nkwi', date: '2026-07-29T10:30:00', icon: 'bi-ticket-perforated' },
  { id: 2, type: 'trip', title: 'Nouveau voyage ajouté', description: 'Douala → Yaoundé 14:00 ajouté au planning', date: '2026-07-29T09:15:00', icon: 'bi-bus-front' },
  { id: 3, type: 'payment', title: 'Paiement reçu', description: '25 000 XAF via Orange Money', date: '2026-07-29T08:45:00', icon: 'bi-currency-exchange' },
  { id: 4, type: 'driver', title: 'Nouveau chauffeur', description: 'David Essomba rejoint l\'équipe', date: '2026-07-28T14:00:00', icon: 'bi-person-badge' },
  { id: 5, type: 'agent', title: 'Nouvel agent', description: 'Esther Mvondo rejoint le guichet de Douala', date: '2026-07-28T11:30:00', icon: 'bi-person-plus' },
  { id: 6, type: 'notification', title: 'Alerte maintenance', description: 'Bus LT 789 EF (Isuzu NQR) nécessite une révision', date: '2026-07-27T16:00:00', icon: 'bi-exclamation-triangle' },
  { id: 7, type: 'booking', title: 'Nouvelle réservation', description: 'Réservation BTC-2026-0788 par Alice Mballa', date: '2026-07-27T14:20:00', icon: 'bi-ticket-perforated' },
  { id: 8, type: 'payment', title: 'Paiement reçu', description: '12 500 XAF via MTN Mobile Money', date: '2026-07-27T10:00:00', icon: 'bi-currency-exchange' },
];

export const profileCharts = {
  revenue: [
    { month: 'Jan', value: 12500000 },
    { month: 'Fév', value: 14800000 },
    { month: 'Mar', value: 16200000 },
    { month: 'Avr', value: 15900000 },
    { month: 'Mai', value: 18400000 },
    { month: 'Jun', value: 17800000 },
    { month: 'Jul', value: 19500000 },
    { month: 'Aoû', value: 21000000 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Déc', value: 0 },
  ],
  bookings: [
    { month: 'Jan', value: 320 },
    { month: 'Fév', value: 380 },
    { month: 'Mar', value: 410 },
    { month: 'Avr', value: 395 },
    { month: 'Mai', value: 450 },
    { month: 'Jun', value: 470 },
    { month: 'Jul', value: 520 },
    { month: 'Aoû', value: 560 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Déc', value: 0 },
  ],
  occupancy: [
    { month: 'Jan', value: 68 },
    { month: 'Fév', value: 72 },
    { month: 'Mar', value: 75 },
    { month: 'Avr', value: 73 },
    { month: 'Mai', value: 78 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 82 },
    { month: 'Aoû', value: 85 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Déc', value: 0 },
  ],
  clients: [
    { month: 'Jan', value: 120 },
    { month: 'Fév', value: 145 },
    { month: 'Mar', value: 168 },
    { month: 'Avr', value: 182 },
    { month: 'Mai', value: 210 },
    { month: 'Jun', value: 238 },
    { month: 'Jul', value: 265 },
    { month: 'Aoû', value: 290 },
    { month: 'Sep', value: 0 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Déc', value: 0 },
  ],
};

export const quickActions = [
  { id: 'edit', label: 'Modifier le profil', icon: 'bi-pencil', color: '#0B1D51' },
  { id: 'add_bus', label: 'Ajouter un bus', icon: 'bi-truck-plus', color: '#FF6B35' },
  { id: 'create_trip', label: 'Créer un voyage', icon: 'bi-bus-front', color: '#22c55e' },
  { id: 'add_branch', label: 'Point de vente', icon: 'bi-shop', color: '#8b5cf6' },
  { id: 'add_agent', label: 'Ajouter un agent', icon: 'bi-person-plus', color: '#06b6d4' },
  { id: 'stats', label: 'Voir les statistiques', icon: 'bi-graph-up', color: '#f59e0b' },
  { id: 'report', label: 'Télécharger un rapport', icon: 'bi-download', color: '#ec4899' },
];

/* ─── Client Profile (legacy exports) ─── */

export const profileStats = {
  totalTrips: 18,
  activeTickets: 2,
  totalBookings: 23,
  companiesUsed: 5,
};

export const defaultPreferences = {
  language: 'fr',
  currency: 'XAF',
  timezone: 'Africa/Douala',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    email: true,
    sms: true,
    push: true,
    promotions: false,
  },
};

export const securityInfo = {
  twoFactorEnabled: false,
  lastLogin: '2026-07-23T08:15:00',
  lastLoginDevice: 'Chrome sur Windows 11',
  lastLoginIp: '196.216.XXX.XXX',
  connectedDevices: [
    { id: 'dev_001', name: 'Chrome sur Windows 11', lastActive: '2026-07-23T08:15:00', current: true },
    { id: 'dev_002', name: 'Safari sur iPhone 15', lastActive: '2026-07-22T18:30:00', current: false },
  ],
};

export const genderOptions = [
  { value: '', label: 'Sélectionnez...' },
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'other', label: 'Autre' },
];

export const languageOptions = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

export const currencyOptions = [
  { value: 'XAF', label: 'XAF (FCFA BEAC)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
];

export const timezoneOptions = [
  { value: 'Africa/Douala', label: 'Douala (GMT+1)' },
  { value: 'Africa/Lagos', label: 'Lagos (GMT+1)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)' },
];

export const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
  { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
  { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' },
];
