export const tripStatuses = [
  { value: 'programmee', label: 'Programmée', color: 'primary', icon: 'bi-clock-fill' },
  { value: 'embarquement', label: 'En embarquement', color: 'info', icon: 'bi-people-fill' },
  { value: 'en_cours', label: 'En cours', color: 'accent', icon: 'bi-play-circle-fill' },
  { value: 'terminee', label: 'Terminée', color: 'success', icon: 'bi-check-circle-fill' },
  { value: 'annulee', label: 'Annulée', color: 'danger', icon: 'bi-x-circle-fill' },
  { value: 'complete', label: 'Complète', color: 'muted', icon: 'bi-shield-check' },
];

export const busTypes = [
  { value: 'vip', label: 'VIP' },
  { value: 'confort', label: 'Confort' },
  { value: 'standard', label: 'Standard' },
  { value: 'economique', label: 'Économique' },
];

export const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua', 'Maroua',
  'Kribi', 'Ebolowa', 'Bertoua', 'Ngaoundéré', 'Kousseri', 'Limbe',
  'Buea', 'Kumba', 'Nkongsamba', 'Dschang', 'Foumban', 'Bafang',
];

export const pickupPoints = {
  'Douala': ['Gare Routière Douala', 'Place de la Liberté', 'Akwa Nord', 'Bonapriso', 'Marché Central'],
  'Yaoundé': ['Gare Centrale Yaoundé', 'Mvog-Mbi', 'Bastos', 'Marché Mokolo', 'Nlongkak'],
  'Bafoussam': ['Gare Bafoussam', 'Marché Central', 'Route de Dschang'],
  'Bamenda': ['Gare Bamenda', 'Commercial Avenue', 'Up Station'],
  'Garoua': ['Gare Garoua', 'Centre-ville'],
  'Kribi': ['Gare Kribi', 'Marché'],
  'Ebolowa': ['Gare Ebolowa', 'Centre-ville'],
};

export const drivers = [
  { id: 'DRV-001', name: 'Jean Mbarga', phone: '+237691234567', license: 'CM-A-2024-1847', available: true },
  { id: 'DRV-002', name: 'Paul Ndjock', phone: '+237692345678', license: 'CM-A-2024-2103', available: true },
  { id: 'DRV-003', name: 'Marie Tchidjou', phone: '+237693456789', license: 'CM-A-2024-0982', available: true },
  { id: 'DRV-004', name: 'Pierre Kamga', phone: '+237694567890', license: 'CM-A-2024-1567', available: false },
  { id: 'DRV-005', name: 'Ahmadou Bello', phone: '+237695678901', license: 'CM-A-2024-3201', available: true },
  { id: 'DRV-006', name: 'Lucie Ngono', phone: '+237696789012', license: 'CM-A-2024-2876', available: true },
  { id: 'DRV-007', name: 'Emmanuel Fouda', phone: '+237697890123', license: 'CM-A-2024-1432', available: true },
  { id: 'DRV-008', name: 'Catherine Atangana', phone: '+237698901234', license: 'CM-A-2024-0654', available: false },
];

export const buses = [
  { id: 'BUS-001', name: 'VIP-01', plate: 'CE-123-AZ', type: 'vip', seats: 45, company: 'Guillaume Express' },
  { id: 'BUS-002', name: 'VIP-02', plate: 'CE-456-BY', type: 'vip', seats: 45, company: 'Guillaume Express' },
  { id: 'BUS-003', name: 'VIP-03', plate: 'CE-789-CZ', type: 'vip', seats: 45, company: 'Guillaume Express' },
  { id: 'BUS-004', name: 'Confort-01', plate: 'CE-101-DX', type: 'confort', seats: 40, company: 'Guillaume Express' },
  { id: 'BUS-005', name: 'Confort-02', plate: 'CE-202-EW', type: 'confort', seats: 40, company: 'Guillaume Express' },
  { id: 'BUS-006', name: 'Standard-01', plate: 'CE-303-FV', type: 'standard', seats: 50, company: 'Guillaume Express' },
  { id: 'BUS-007', name: 'Standard-02', plate: 'CE-404-GU', type: 'standard', seats: 50, company: 'Guillaume Express' },
  { id: 'BUS-008', name: 'Standard-03', plate: 'CE-505-HT', type: 'standard', seats: 50, company: 'Guillaume Express' },
  { id: 'BUS-009', name: 'Éco-01', plate: 'CE-606-JS', type: 'economique', seats: 55, company: 'Guillaume Express' },
  { id: 'BUS-010', name: 'Éco-02', plate: 'CE-707-KR', type: 'economique', seats: 55, company: 'Guillaume Express' },
];

export const mockTrips = [
  { id: 'VYG-2026-001', company: 'Guillaume Express', bus: buses[0], driver: drivers[0], from: 'Douala', to: 'Yaoundé', fromPoint: 'Gare Routière Douala', toPoint: 'Gare Centrale Yaoundé', date: '2026-07-25', departure: '06:00', arrival: '09:15', price: 8500, totalSeats: 45, soldSeats: 42, status: 'en_cours', type: 'vip', luggage: 2, notes: '', createdAt: '2026-07-20T10:00:00Z' },
  { id: 'VYG-2026-002', company: 'Guillaume Express', bus: buses[7], driver: drivers[1], from: 'Yaoundé', to: 'Bafoussam', fromPoint: 'Gare Centrale Yaoundé', toPoint: 'Gare Bafoussam', date: '2026-07-25', departure: '07:30', arrival: '11:45', price: 6500, totalSeats: 50, soldSeats: 38, status: 'programmee', type: 'standard', luggage: 2, notes: '', createdAt: '2026-07-20T11:00:00Z' },
  { id: 'VYG-2026-003', company: 'Guillaume Express', bus: buses[1], driver: drivers[2], from: 'Douala', to: 'Bamenda', fromPoint: 'Gare Routière Douala', toPoint: 'Gare Bamenda', date: '2026-07-25', departure: '08:00', arrival: '14:30', price: 9000, totalSeats: 45, soldSeats: 44, status: 'programmee', type: 'vip', luggage: 2, notes: '', createdAt: '2026-07-20T12:00:00Z' },
  { id: 'VYG-2026-004', company: 'Guillaume Express', bus: buses[3], driver: drivers[4], from: 'Yaoundé', to: 'Kribi', fromPoint: 'Gare Centrale Yaoundé', toPoint: 'Gare Kribi', date: '2026-07-25', departure: '09:00', arrival: '12:30', price: 7000, totalSeats: 40, soldSeats: 22, status: 'programmee', type: 'confort', luggage: 1, notes: '', createdAt: '2026-07-20T13:00:00Z' },
  { id: 'VYG-2026-005', company: 'Guillaume Express', bus: buses[2], driver: drivers[5], from: 'Douala', to: 'Garoua', fromPoint: 'Gare Routière Douala', toPoint: 'Gare Garoua', date: '2026-07-25', departure: '10:00', arrival: '20:00', price: 12000, totalSeats: 45, soldSeats: 31, status: 'programmee', type: 'vip', luggage: 3, notes: 'Voyage longue distance', createdAt: '2026-07-20T14:00:00Z' },
  { id: 'VYG-2026-006', company: 'Guillaume Express', bus: buses[5], driver: drivers[6], from: 'Yaoundé', to: 'Ebolowa', fromPoint: 'Gare Centrale Yaoundé', toPoint: 'Gare Ebolowa', date: '2026-07-25', departure: '11:00', arrival: '14:00', price: 5500, totalSeats: 50, soldSeats: 15, status: 'programmee', type: 'standard', luggage: 2, notes: '', createdAt: '2026-07-20T15:00:00Z' },
  { id: 'VYG-2026-007', company: 'Guillaume Express', bus: buses[4], driver: drivers[0], from: 'Douala', to: 'Buea', fromPoint: 'Place de la Liberté', toPoint: 'Commercial Avenue', date: '2026-07-24', departure: '06:30', arrival: '08:00', price: 3500, totalSeats: 40, soldSeats: 38, status: 'terminee', type: 'confort', luggage: 1, notes: '', createdAt: '2026-07-19T10:00:00Z' },
  { id: 'VYG-2026-008', company: 'Guillaume Express', bus: buses[6], driver: drivers[1], from: 'Yaoundé', to: 'Bamenda', fromPoint: 'Mvog-Mbi', toPoint: 'Up Station', date: '2026-07-24', departure: '07:00', arrival: '13:00', price: 8500, totalSeats: 50, soldSeats: 47, status: 'terminee', type: 'standard', luggage: 2, notes: '', createdAt: '2026-07-19T11:00:00Z' },
  { id: 'VYG-2026-009', company: 'Guillaume Express', bus: buses[8], driver: drivers[5], from: 'Douala', to: 'Kumba', fromPoint: 'Gare Routière Douala', toPoint: 'Marché', date: '2026-07-24', departure: '08:30', arrival: '11:30', price: 4000, totalSeats: 55, soldSeats: 55, status: 'complete', type: 'economique', luggage: 2, notes: '', createdAt: '2026-07-19T12:00:00Z' },
  { id: 'VYG-2026-010', company: 'Guillaume Express', bus: buses[9], driver: drivers[3], from: 'Yaoundé', to: 'Douala', fromPoint: 'Nlongkak', toPoint: 'Akwa Nord', date: '2026-07-23', departure: '14:00', arrival: '17:15', price: 8500, totalSeats: 55, soldSeats: 42, status: 'annulee', type: 'economique', luggage: 2, notes: 'Annulé pour raison technique', createdAt: '2026-07-18T10:00:00Z' },
  { id: 'VYG-2026-011', company: 'Guillaume Express', bus: buses[0], driver: drivers[6], from: 'Douala', to: 'Yaoundé', fromPoint: 'Gare Routière Douala', toPoint: 'Marché Mokolo', date: '2026-07-25', departure: '14:00', arrival: '17:15', price: 8500, totalSeats: 45, soldSeats: 28, status: 'programmee', type: 'vip', luggage: 2, notes: '', createdAt: '2026-07-21T08:00:00Z' },
  { id: 'VYG-2026-012', company: 'Guillaume Express', bus: buses[3], driver: drivers[2], from: 'Yaoundé', to: 'Bertoua', fromPoint: 'Gare Centrale Yaoundé', toPoint: 'Gare Bertoua', date: '2026-07-25', departure: '15:00', arrival: '19:00', price: 7500, totalSeats: 40, soldSeats: 12, status: 'embarquement', type: 'confort', luggage: 2, notes: '', createdAt: '2026-07-21T09:00:00Z' },
  { id: 'VYG-2026-013', company: 'Guillaume Express', bus: buses[5], driver: drivers[4], from: 'Douala', to: 'Limbe', fromPoint: 'Bonapriso', toPoint: 'Centre-ville Limbe', date: '2026-07-23', departure: '09:00', arrival: '10:30', price: 2500, totalSeats: 50, soldSeats: 48, status: 'terminee', type: 'standard', luggage: 1, notes: '', createdAt: '2026-07-18T11:00:00Z' },
  { id: 'VYG-2026-014', company: 'Guillaume Express', bus: buses[2], driver: drivers[0], from: 'Yaoundé', to: 'Maroua', fromPoint: 'Gare Centrale Yaoundé', toPoint: 'Gare Maroua', date: '2026-07-22', departure: '06:00', arrival: '18:00', price: 14000, totalSeats: 45, soldSeats: 39, status: 'terminee', type: 'vip', luggage: 3, notes: 'Voyage longue distance', createdAt: '2026-07-17T10:00:00Z' },
  { id: 'VYG-2026-015', company: 'Guillaume Express', bus: buses[8], driver: drivers[6], from: 'Douala', to: 'Dschang', fromPoint: 'Gare Routière Douala', toPoint: 'Route de Dschang', date: '2026-07-22', departure: '10:00', arrival: '13:30', price: 5000, totalSeats: 55, soldSeats: 50, status: 'complete', type: 'economique', luggage: 2, notes: '', createdAt: '2026-07-17T11:00:00Z' },
];

export const tripStats = {
  total: mockTrips.length,
  today: mockTrips.filter((t) => t.date === '2026-07-25').length,
  active: mockTrips.filter((t) => t.status === 'en_cours').length,
  completed: mockTrips.filter((t) => t.status === 'terminee').length,
  cancelled: mockTrips.filter((t) => t.status === 'annulee').length,
  occupancy: Math.round(mockTrips.reduce((acc, t) => acc + (t.soldSeats / t.totalSeats) * 100, 0) / mockTrips.length),
};

export const tripReservations = [
  { id: 'BK-2026-1847', passenger: 'Fatima Souleymane', phone: '+237699123456', seats: ['A1', 'A2'], total: 17000, status: 'confirmee', date: '2026-07-24' },
  { id: 'BK-2026-1845', passenger: 'Michel Fotso', phone: '+237698234567', seats: ['B3'], total: 8500, status: 'confirmee', date: '2026-07-24' },
  { id: 'BK-2026-1842', passenger: 'Ange Mbida', phone: '+237697345678', seats: ['C4', 'C5'], total: 17000, status: 'annulee', date: '2026-07-23' },
  { id: 'BK-2026-1840', passenger: 'Chantal Ngoumou', phone: '+237696456789', seats: ['D6'], total: 8500, status: 'confirmee', date: '2026-07-23' },
  { id: 'BK-2026-1838', passenger: 'Paul Kamdem', phone: '+237695567890', seats: ['E7', 'E8', 'E9'], total: 25500, status: 'confirmee', date: '2026-07-22' },
];
