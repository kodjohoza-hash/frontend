export const companyStats = [
  { id: 'total', label: 'Total compagnies', value: 24, icon: 'bi-building', color: 'primary', trend: 12, trendUp: true },
  { id: 'active', label: 'Compagnies actives', value: 18, icon: 'bi-building-check', color: 'success', trend: 8, trendUp: true },
  { id: 'pending', label: 'En attente', value: 3, icon: 'bi-hourglass-split', color: 'warning', trend: 2, trendUp: true },
  { id: 'suspended', label: 'Suspendues', value: 2, icon: 'bi-pause-circle', color: 'danger', trend: -1, trendUp: false },
  { id: 'refused', label: 'Refusées', value: 1, icon: 'bi-x-circle', color: 'danger', trend: 0, trendUp: false },
  { id: 'new', label: 'Nouvelles (30j)', value: 4, icon: 'bi-building-add', color: 'info', trend: 50, trendUp: true },
  { id: 'premium', label: 'Compagnies Premium', value: 6, icon: 'bi-star-fill', color: 'accent', trend: 20, trendUp: true },
  { id: 'standard', label: 'Compagnies Standard', value: 18, icon: 'bi-building', color: 'purple', trend: 5, trendUp: true },
];

export const companies = [
  {
    id: 'CMP-001', name: 'Express Bus Cameroun', logo: 'EB', description: 'Leader du transport interurbain au Cameroun',
    manager: 'Paul Biya', email: 'contact@express-bus.cm', phone: '+237 691 234 567',
    address: '123 Rue Principale', city: 'Yaoundé', country: 'Cameroun',
    rccm: 'RC/YAO/2023/001', taxpayerId: 'P12345678901',
    createdAt: '2023-01-15', subscription: 'premium', status: 'active',
    stats: { buses: 24, drivers: 48, agents: 32, branches: 8, trips: 840, bookings: 4520, tickets: 15230, revenue: 82450000, commission: 4122500 },
  },
  {
    id: 'CMP-002', name: 'Finex Voyages', logo: 'FV', description: 'Voyages confortables vers toutes les régions',
    manager: 'Jean Finex', email: 'info@finex-voyages.cm', phone: '+237 692 345 678',
    address: '45 Avenue Kennedy', city: 'Douala', country: 'Cameroun',
    rccm: 'RC/DLA/2023/002', taxpayerId: 'P23456789012',
    createdAt: '2023-03-20', subscription: 'premium', status: 'active',
    stats: { buses: 18, drivers: 36, agents: 24, branches: 6, trips: 620, bookings: 3410, tickets: 11840, revenue: 63200000, commission: 3160000 },
  },
  {
    id: 'CMP-003', name: 'Buca Voyages', logo: 'BV', description: 'Transport de qualité à prix abordable',
    manager: 'Marie Buca', email: 'contact@buca-voyages.cm', phone: '+237 693 456 789',
    address: '78 Boulevard de la Liberté', city: 'Bafoussam', country: 'Cameroun',
    rccm: 'RC/BFS/2023/003', taxpayerId: 'P34567890123',
    createdAt: '2023-06-10', subscription: 'standard', status: 'active',
    stats: { buses: 15, drivers: 30, agents: 18, branches: 5, trips: 510, bookings: 2860, tickets: 9870, revenue: 52180000, commission: 2609000 },
  },
  {
    id: 'CMP-004', name: 'Capitaine Voyages', logo: 'CV', description: 'Voyages sûrs et ponctuels',
    manager: 'Capitaine David', email: 'info@capitaine-voyages.cm', phone: '+237 694 567 890',
    address: '12 Rue des Cocotiers', city: 'Kribi', country: 'Cameroun',
    rccm: 'RC/KRI/2023/004', taxpayerId: 'P45678901234',
    createdAt: '2023-09-05', subscription: 'standard', status: 'active',
    stats: { buses: 12, drivers: 24, agents: 16, branches: 4, trips: 430, bookings: 2340, tickets: 8230, revenue: 44500000, commission: 2225000 },
  },
  {
    id: 'CMP-005', name: 'Touristique Express', logo: 'TE', description: 'Spécialiste du tourisme et voyage',
    manager: 'Alice Touristique', email: 'contact@touristique-express.cm', phone: '+237 695 678 901',
    address: '56 Plage Road', city: 'Limbe', country: 'Cameroun',
    rccm: 'RC/LIM/2024/005', taxpayerId: 'P56789012345',
    createdAt: '2024-01-20', subscription: 'standard', status: 'active',
    stats: { buses: 10, drivers: 20, agents: 14, branches: 3, trips: 380, bookings: 1980, tickets: 6840, revenue: 36800000, commission: 1840000 },
  },
  {
    id: 'CMP-006', name: 'Global Express', logo: 'GE', description: 'Réseau de transport national',
    manager: 'Global Manager', email: 'info@global-express.cm', phone: '+237 696 789 012',
    address: '200 Rue du Commerce', city: 'Yaoundé', country: 'Cameroun',
    rccm: 'RC/YAO/2024/006', taxpayerId: 'P67890123456',
    createdAt: '2024-03-15', subscription: 'premium', status: 'pending',
    stats: { buses: 8, drivers: 16, agents: 10, branches: 2, trips: 120, bookings: 450, tickets: 1200, revenue: 5200000, commission: 260000 },
  },
  {
    id: 'CMP-007', name: 'Transcam SA', logo: 'TS', description: 'Transport interurbain et international',
    manager: 'Camille Transcam', email: 'contact@transcam.cm', phone: '+237 697 890 123',
    address: '88 Rue de l\'Indépendance', city: 'Douala', country: 'Cameroun',
    rccm: 'RC/DLA/2024/007', taxpayerId: 'P78901234567',
    createdAt: '2024-05-01', subscription: 'standard', status: 'suspended',
    stats: { buses: 6, drivers: 12, agents: 8, branches: 2, trips: 80, bookings: 320, tickets: 900, revenue: 3800000, commission: 190000 },
  },
  {
    id: 'CMP-008', name: 'Voyages du Centre', logo: 'VC', description: 'Desserte du centre du Cameroun',
    manager: 'Centre Manager', email: 'info@voyages-centre.cm', phone: '+237 698 901 234',
    address: '34 Avenue Centrale', city: 'Yaoundé', country: 'Cameroun',
    rccm: 'RC/YAO/2024/008', taxpayerId: 'P89012345678',
    createdAt: '2024-06-01', subscription: 'standard', status: 'refused',
    stats: { buses: 4, drivers: 8, agents: 5, branches: 1, trips: 0, bookings: 0, tickets: 0, revenue: 0, commission: 0 },
  },
  {
    id: 'CMP-009', name: 'Eco Transport', logo: 'ET', description: 'Transport écologique et économique',
    manager: 'Eco Manager', email: 'contact@eco-transport.cm', phone: '+237 699 012 345',
    address: '15 Green Street', city: 'Buea', country: 'Cameroun',
    rccm: 'RC/BUE/2024/009', taxpayerId: 'P90123456789',
    createdAt: '2024-07-10', subscription: 'standard', status: 'pending',
    stats: { buses: 3, drivers: 6, agents: 4, branches: 1, trips: 30, bookings: 80, tickets: 150, revenue: 650000, commission: 32500 },
  },
  {
    id: 'CMP-010', name: 'Speed Express', logo: 'SE', description: 'Livraison express de voyageurs',
    manager: 'Speed Manager', email: 'info@speed-express.cm', phone: '+237 690 123 456',
    address: '22 Fast Lane', city: 'Douala', country: 'Cameroun',
    rccm: 'RC/DLA/2024/010', taxpayerId: 'P01234567890',
    createdAt: '2024-08-05', subscription: 'standard', status: 'pending',
    stats: { buses: 5, drivers: 10, agents: 6, branches: 2, trips: 45, bookings: 150, tickets: 300, revenue: 1200000, commission: 60000 },
  },
];

export const subscriptionTypes = [
  { value: 'all', label: 'Tous' },
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
];

export const statusTypes = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actif' },
  { value: 'pending', label: 'En attente' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'refused', label: 'Refusé' },
];

export const statusConfig = {
  active: { label: 'Actif', class: 'admc-badge--success' },
  pending: { label: 'En attente', class: 'admc-badge--warning' },
  suspended: { label: 'Suspendu', class: 'admc-badge--danger' },
  refused: { label: 'Refusé', class: 'admc-badge--danger-light' },
};

export const companyActivityTimeline = [
  { id: 1, type: 'created', icon: 'bi-building', color: 'primary', action: 'Compagnie créée', detail: 'Express Bus Cameroun inscrite sur la plateforme', time: '15 jan 2023' },
  { id: 2, type: 'validated', icon: 'bi-check-circle', color: 'success', action: 'Compagnie validée', detail: 'Express Bus Cameroun — documents vérifiés et approuvés', time: '18 jan 2023' },
  { id: 3, type: 'subscription', icon: 'bi-star', color: 'accent', action: 'Abonnement Premium activé', detail: 'Express Bus Cameroun — Forfait Premium annuel', time: '20 jan 2023' },
  { id: 4, type: 'bus_added', icon: 'bi-bus-front', color: 'info', action: 'Bus ajouté', detail: 'Bus Confort-01 — 50 places — Immat: LT 123 AB', time: '25 jan 2023' },
  { id: 5, type: 'agent_added', icon: 'bi-person-plus', color: 'success', action: 'Agent ajouté', detail: 'Marie Kamga — Agent de guichet — Gare Mvog-Mbi', time: '01 fév 2023' },
  { id: 6, type: 'trip_published', icon: 'bi-bus-front', color: 'primary', action: 'Voyage publié', detail: 'TR-001 Yaoundé → Douala — Départ 06:00', time: '05 fév 2023' },
  { id: 7, type: 'payment', icon: 'bi-cash-coin', color: 'success', action: 'Paiement reçu', detail: 'Commission BTC — 450 000 FCFA — Paiement mensuel', time: '01 mar 2023' },
  { id: 8, type: 'login', icon: 'bi-shield-check', color: 'purple', action: 'Connexion administrateur', detail: 'Admin Paul — Dernière connexion', time: '30 jul 2026' },
];

export const companyDocuments = [
  { id: 1, name: 'Registre du Commerce (RCCM)', ref: 'RC/YAO/2023/001', type: 'pdf', status: 'verified', date: '15 jan 2023', size: '1.2 MB' },
  { id: 2, name: 'Carte de Contribuable', ref: 'P12345678901', type: 'pdf', status: 'verified', date: '15 jan 2023', size: '0.8 MB' },
  { id: 3, name: 'Licence de Transport', ref: 'LT-2023-001', type: 'pdf', status: 'verified', date: '18 jan 2023', size: '1.5 MB' },
  { id: 4, name: 'Attestation d\'Assurance', ref: 'ASS-2023-001', type: 'pdf', status: 'verified', date: '18 jan 2023', size: '0.5 MB' },
  { id: 5, name: 'Logo de la Compagnie', ref: 'express-bus-logo.png', type: 'image', status: 'verified', date: '15 jan 2023', size: '0.2 MB' },
  { id: 6, name: 'Pièce d\'Identité du Gérant', ref: 'CNI-PB-001', type: 'pdf', status: 'verified', date: '15 jan 2023', size: '0.6 MB' },
];

export const companyChartData = {
  monthlyBookings: [
    { month: 'Jan', bookings: 320, tickets: 980, revenue: 5200000 },
    { month: 'Fév', bookings: 350, tickets: 1050, revenue: 5600000 },
    { month: 'Mar', bookings: 380, tickets: 1120, revenue: 6100000 },
    { month: 'Avr', bookings: 400, tickets: 1250, revenue: 6800000 },
    { month: 'Mai', bookings: 380, tickets: 1180, revenue: 6400000 },
    { month: 'Juin', bookings: 420, tickets: 1300, revenue: 7200000 },
    { month: 'Juil', bookings: 450, tickets: 1380, revenue: 7500000 },
    { month: 'Aoû', bookings: 480, tickets: 1450, revenue: 8000000 },
    { month: 'Sep', bookings: 440, tickets: 1320, revenue: 7100000 },
    { month: 'Oct', bookings: 460, tickets: 1400, revenue: 7600000 },
    { month: 'Nov', bookings: 430, tickets: 1280, revenue: 6900000 },
    { month: 'Déc', bookings: 500, tickets: 1520, revenue: 8500000 },
  ],
  userGrowth: [
    { month: 'Jan', admins: 1, agents: 5 },
    { month: 'Fév', admins: 1, agents: 8 },
    { month: 'Mar', admins: 2, agents: 12 },
    { month: 'Avr', admins: 2, agents: 15 },
    { month: 'Mai', admins: 2, agents: 18 },
    { month: 'Juin', admins: 3, agents: 22 },
    { month: 'Juil', admins: 3, agents: 25 },
    { month: 'Aoû', admins: 3, agents: 28 },
    { month: 'Sep', admins: 3, agents: 30 },
    { month: 'Oct', admins: 3, agents: 32 },
    { month: 'Nov', admins: 3, agents: 32 },
    { month: 'Déc', admins: 3, agents: 32 },
  ],
};

export const filterOptions = {
  cities: ['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Limbe', 'Buea'],
  countries: ['Cameroun'],
};

export const filterCompanies = (list, filters) => {
  return list.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.manager.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
    }
    if (filters.city && filters.city !== 'all' && c.city !== filters.city) return false;
    if (filters.country && filters.country !== 'all' && c.country !== filters.country) return false;
    if (filters.subscription && filters.subscription !== 'all' && c.subscription !== filters.subscription) return false;
    if (filters.status && filters.status !== 'all' && c.status !== filters.status) return false;
    if (filters.busesMin && c.stats.buses < parseInt(filters.busesMin)) return false;
    if (filters.busesMax && c.stats.buses > parseInt(filters.busesMax)) return false;
    if (filters.agentsMin && c.stats.agents < parseInt(filters.agentsMin)) return false;
    if (filters.agentsMax && c.stats.agents > parseInt(filters.agentsMax)) return false;
    return true;
  });
};

export const sortCompanies = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'revenue_desc': return sorted.sort((a, b) => b.stats.revenue - a.stats.revenue);
    case 'revenue_asc': return sorted.sort((a, b) => a.stats.revenue - b.stats.revenue);
    case 'tickets_desc': return sorted.sort((a, b) => b.stats.tickets - a.stats.tickets);
    default: return sorted;
  }
};
