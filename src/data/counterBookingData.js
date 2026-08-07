const companies = [
  { id: 'C1', name: 'Finex Voyages', color: '#0B1D51', phone: '677000001' },
  { id: 'C2', name: 'Buca Voyages', color: '#FF6B35', phone: '677000002' },
  { id: 'C3', name: 'Touristique Express', color: '#2E7D32', phone: '677000003' },
  { id: 'C4', name: 'Garantie Voyages', color: '#1565C0', phone: '677000004' },
  { id: 'C5', name: 'Va-et-Vient', color: '#6A1B9A', phone: '677000005' },
];

const trips = [
  { id: 'T1', from: 'Douala', to: 'Yaoundé', duration: '4h', distance: '260 km' },
  { id: 'T2', from: 'Douala', to: 'Bafoussam', duration: '5h', distance: '300 km' },
  { id: 'T3', from: 'Yaoundé', to: 'Douala', duration: '4h', distance: '260 km' },
  { id: 'T4', from: 'Yaoundé', to: 'Bafoussam', duration: '6h', distance: '350 km' },
  { id: 'T5', from: 'Douala', to: 'Bamenda', duration: '8h', distance: '450 km' },
  { id: 'T6', from: 'Yaoundé', to: 'Bamenda', duration: '7h', distance: '400 km' },
  { id: 'T7', from: 'Douala', to: 'Garoua', duration: '14h', distance: '750 km' },
  { id: 'T8', from: 'Douala', to: 'Maroua', duration: '16h', distance: '850 km' },
];

const buses = [
  { id: 'B1', plate: 'LT 123 AB', model: 'Mercedes Sprinter', capacity: 32 },
  { id: 'B2', plate: 'LT 456 CD', model: 'Toyota Hiace', capacity: 18 },
  { id: 'B3', plate: 'NW 789 EF', model: 'King Long', capacity: 44 },
  { id: 'B4', plate: 'CE 012 GH', model: 'Yutong', capacity: 50 },
  { id: 'B5', plate: 'SW 345 IJ', model: 'Mercedes Sprinter', capacity: 32 },
  { id: 'B6', plate: 'NW 678 KL', model: 'Isuzu', capacity: 26 },
  { id: 'B7', plate: 'LT 901 MN', model: 'King Long', capacity: 44 },
  { id: 'B8', plate: 'CE 234 OP', model: 'Toyota Hiace', capacity: 18 },
];

const clients = [
  { id: 'CL1', name: 'Jean-Pierre Kamga', phone: '691234567', email: 'jp.kamga@email.com' },
  { id: 'CL2', name: 'Marie-Chantal Ndi', phone: '692345678', email: 'mc.ndi@email.com' },
  { id: 'CL3', name: 'Paul Biya Mballa', phone: '693456789', email: 'paul.mballa@email.com' },
  { id: 'CL4', name: 'Esther Ngono', phone: '694567890', email: 'esther.ngono@email.com' },
  { id: 'CL5', name: 'David Ekwalla', phone: '695678901', email: 'david.ekwalla@email.com' },
  { id: 'CL6', name: 'Sarah Moukoko', phone: '696789012', email: 'sarah.moukoko@email.com' },
  { id: 'CL7', name: 'Michel Tagne', phone: '697890123', email: 'michel.tagne@email.com' },
  { id: 'CL8', name: 'Christine Eyanga', phone: '698901234', email: 'christine.eyanga@email.com' },
  { id: 'CL9', name: 'Robert Nkwi', phone: '699012345', email: 'robert.nkwi@email.com' },
  { id: 'CL10', name: 'Alice Mbah', phone: '690123456', email: 'alice.mbah@email.com' },
  { id: 'CL11', name: 'François Bikoi', phone: '687654321', email: 'francois.bikoi@email.com' },
  { id: 'CL12', name: 'Joséphine Tchinda', phone: '686543210', email: 'josephine.tchinda@email.com' },
];

const salePoints = ['Bois des Amoureux', 'Mboppi', 'Bonanjo', 'Akwa', 'Bépanda', 'Makepe'];

const statuses = ['pending', 'confirmed', 'cancelled', 'expired', 'converted'];

const paymentMethods = ['Omis_Money', 'Orange_Money', 'Cash', 'Mobile_Money', 'Carte_Bancaire'];

const generateSeats = (count) => {
  const rows = Math.ceil(count / 5);
  const seats = [];
  for (let r = 1; r <= rows; r++) {
    seats.push(`${String.fromCharCode(64 + r)}1`, `${String.fromCharCode(64 + r)}2`);
    seats.push(`${String.fromCharCode(64 + r)}3`, `${String.fromCharCode(64 + r)}4`, `${String.fromCharCode(64 + r)}5`);
  }
  return seats.slice(0, count);
};

const formatDate = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatDateTime = (d) => {
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(d)} ${hh}:${min}`;
};

const toISO = (d) => d.toISOString();

const generateBookingHistory = (booking, status, dates) => {
  const history = [
    { action: 'Réservation créée', timestamp: dates.created, user: booking.createdBy, icon: 'bi-plus-circle' },
  ];
  if (status === 'confirmed' || status === 'converted') {
    history.push({ action: 'Réservation confirmée', timestamp: dates.confirmed, user: booking.createdBy, icon: 'bi-check-circle' });
  }
  if (status === 'cancelled') {
    history.push({ action: 'Réservation annulée', timestamp: dates.cancelled, user: booking.createdBy, icon: 'bi-x-circle' });
  }
  if (status === 'expired') {
    history.push({ action: 'Réservation expirée', timestamp: dates.expired, user: 'Système', icon: 'bi-clock' });
  }
  if (status === 'converted') {
    history.push({ action: 'Billet généré', timestamp: dates.converted, user: booking.createdBy, icon: 'bi-ticket-perforated' });
    history.push({ action: 'Paiement confirmé', timestamp: dates.paid, user: booking.createdBy, icon: 'bi-credit-card' });
  }
  return history;
};

const generateBookings = () => {
  const bookings = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const bkData = [
    { id: 'RES-2026-0001', client: clients[0], trip: trips[0], company: companies[0], bus: buses[0], seats: ['A3', 'A4'], amount: 12000, status: 'confirmed', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 2 * 86400000), confirmedAt: new Date(today.getTime() - 1 * 86400000) },
    { id: 'RES-2026-0002', client: clients[1], trip: trips[1], company: companies[1], bus: buses[1], seats: ['B1'], amount: 8000, status: 'pending', salePoint: salePoints[1], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 1 * 86400000 + 3600000) },
    { id: 'RES-2026-0003', client: clients[2], trip: trips[2], company: companies[0], bus: buses[2], seats: ['C2', 'C3', 'C4'], amount: 16500, status: 'cancelled', salePoint: salePoints[2], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 5 * 86400000), cancelledAt: new Date(today.getTime() - 3 * 86400000) },
    { id: 'RES-2026-0004', client: clients[3], trip: trips[3], company: companies[2], bus: buses[3], seats: ['A1', 'A2'], amount: 14000, status: 'expired', salePoint: salePoints[3], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 10 * 86400000), expiredAt: new Date(today.getTime() - 3 * 86400000) },
    { id: 'RES-2026-0005', client: clients[4], trip: trips[4], company: companies[1], bus: buses[4], seats: ['D1', 'D2', 'D3'], amount: 24000, status: 'converted', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 3 * 86400000), confirmedAt: new Date(today.getTime() - 2 * 86400000), paidAt: new Date(today.getTime() - 1 * 86400000), convertedAt: new Date(today.getTime() - 1 * 86400000) },
    { id: 'RES-2026-0006', client: clients[5], trip: trips[0], company: companies[3], bus: buses[5], seats: ['E1'], amount: 5000, status: 'confirmed', salePoint: salePoints[4], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 1 * 86400000), confirmedAt: today },
    { id: 'RES-2026-0007', client: clients[6], trip: trips[5], company: companies[4], bus: buses[6], seats: ['B2', 'B3'], amount: 18000, status: 'pending', salePoint: salePoints[1], createdBy: 'Kodjo Jojo', createdAt: today },
    { id: 'RES-2026-0008', client: clients[7], trip: trips[1], company: companies[0], bus: buses[0], seats: ['C1'], amount: 6500, status: 'cancelled', salePoint: salePoints[5], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 7 * 86400000), cancelledAt: new Date(today.getTime() - 4 * 86400000) },
    { id: 'RES-2026-0009', client: clients[8], trip: trips[6], company: companies[2], bus: buses[3], seats: ['A1', 'A2', 'A3', 'A4'], amount: 44000, status: 'converted', salePoint: salePoints[2], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 4 * 86400000), confirmedAt: new Date(today.getTime() - 3 * 86400000), paidAt: new Date(today.getTime() - 2 * 86400000), convertedAt: new Date(today.getTime() - 2 * 86400000) },
    { id: 'RES-2026-0010', client: clients[9], trip: trips[2], company: companies[1], bus: buses[1], seats: ['B4'], amount: 5500, status: 'confirmed', salePoint: salePoints[3], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 6 * 86400000), confirmedAt: new Date(today.getTime() - 5 * 86400000) },
    { id: 'RES-2026-0011', client: clients[10], trip: trips[7], company: companies[3], bus: buses[7], seats: ['A1', 'A2'], amount: 22000, status: 'pending', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 12 * 3600000) },
    { id: 'RES-2026-0012', client: clients[11], trip: trips[3], company: companies[4], bus: buses[2], seats: ['C3'], amount: 7500, status: 'expired', salePoint: salePoints[4], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 15 * 86400000), expiredAt: new Date(today.getTime() - 8 * 86400000) },
    { id: 'RES-2026-0013', client: clients[0], trip: trips[4], company: companies[0], bus: buses[4], seats: ['A5', 'B1', 'B2'], amount: 27000, status: 'confirmed', salePoint: salePoints[1], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 2 * 86400000), confirmedAt: new Date(today.getTime() - 1 * 86400000) },
    { id: 'RES-2026-0014', client: clients[2], trip: trips[0], company: companies[2], bus: buses[2], seats: ['D1', 'D2'], amount: 10000, status: 'converted', salePoint: salePoints[5], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 8 * 86400000), confirmedAt: new Date(today.getTime() - 7 * 86400000), paidAt: new Date(today.getTime() - 6 * 86400000), convertedAt: new Date(today.getTime() - 6 * 86400000) },
    { id: 'RES-2026-0015', client: clients[5], trip: trips[5], company: companies[1], bus: buses[5], seats: ['C1', 'C2'], amount: 16000, status: 'pending', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: today },
    { id: 'RES-2026-0016', client: clients[7], trip: trips[1], company: companies[3], bus: buses[6], seats: ['A3'], amount: 6000, status: 'confirmed', salePoint: salePoints[2], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 3 * 86400000), confirmedAt: new Date(today.getTime() - 2 * 86400000) },
    { id: 'RES-2026-0017', client: clients[3], trip: trips[2], company: companies[0], bus: buses[0], seats: ['B3', 'B4'], amount: 11000, status: 'cancelled', salePoint: salePoints[4], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 9 * 86400000), cancelledAt: new Date(today.getTime() - 6 * 86400000) },
    { id: 'RES-2026-0018', client: clients[9], trip: trips[0], company: companies[4], bus: buses[1], seats: ['E1', 'E2', 'E3'], amount: 15000, status: 'confirmed', salePoint: salePoints[1], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 1 * 86400000), confirmedAt: today },
    { id: 'RES-2026-0019', client: clients[1], trip: trips[3], company: companies[1], bus: buses[3], seats: ['A4'], amount: 7000, status: 'expired', salePoint: salePoints[3], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 20 * 86400000), expiredAt: new Date(today.getTime() - 12 * 86400000) },
    { id: 'RES-2026-0020', client: clients[11], trip: trips[6], company: companies[0], bus: buses[4], seats: ['B1', 'B2', 'C1'], amount: 33000, status: 'converted', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 5 * 86400000), confirmedAt: new Date(today.getTime() - 4 * 86400000), paidAt: new Date(today.getTime() - 3 * 86400000), convertedAt: new Date(today.getTime() - 3 * 86400000) },
    { id: 'RES-2026-0021', client: clients[4], trip: trips[7], company: companies[2], bus: buses[7], seats: ['D1'], amount: 9000, status: 'pending', salePoint: salePoints[5], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 6 * 3600000) },
    { id: 'RES-2026-0022', client: clients[6], trip: trips[4], company: companies[3], bus: buses[2], seats: ['C2', 'C3', 'C4'], amount: 25500, status: 'confirmed', salePoint: salePoints[2], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 4 * 86400000), confirmedAt: new Date(today.getTime() - 3 * 86400000) },
    { id: 'RES-2026-0023', client: clients[8], trip: trips[1], company: companies[4], bus: buses[5], seats: ['A1', 'A2'], amount: 13000, status: 'converted', salePoint: salePoints[3], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 6 * 86400000), confirmedAt: new Date(today.getTime() - 5 * 86400000), paidAt: new Date(today.getTime() - 4 * 86400000), convertedAt: new Date(today.getTime() - 4 * 86400000) },
    { id: 'RES-2026-0024', client: clients[10], trip: trips[0], company: companies[1], bus: buses[6], seats: ['B3'], amount: 5000, status: 'cancelled', salePoint: salePoints[0], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 11 * 86400000), cancelledAt: new Date(today.getTime() - 8 * 86400000) },
    { id: 'RES-2026-0025', client: clients[0], trip: trips[5], company: companies[2], bus: buses[0], seats: ['A1', 'A2', 'A3'], amount: 21000, status: 'pending', salePoint: salePoints[4], createdBy: 'Kodjo Jojo', createdAt: new Date(today.getTime() - 3 * 3600000) },
  ];

  bkData.forEach((b) => {
    const history = [];
    history.push({ action: 'Réservation créée', timestamp: toISO(b.createdAt), user: b.createdBy, icon: 'bi-plus-circle' });
    if (b.confirmedAt) history.push({ action: 'Réservation confirmée', timestamp: toISO(b.confirmedAt), user: b.createdBy, icon: 'bi-check-circle' });
    if (b.cancelledAt) history.push({ action: 'Réservation annulée', timestamp: toISO(b.cancelledAt), user: b.createdBy, icon: 'bi-x-circle' });
    if (b.expiredAt) history.push({ action: 'Réservation expirée', timestamp: toISO(b.expiredAt), user: 'Système', icon: 'bi-clock' });
    if (b.paidAt) history.push({ action: 'Paiement confirmé', timestamp: toISO(b.paidAt), user: b.createdBy, icon: 'bi-credit-card' });
    if (b.convertedAt) history.push({ action: 'Billet généré', timestamp: toISO(b.convertedAt), user: b.createdBy, icon: 'bi-ticket-perforated' });

    const payment = b.status === 'converted'
      ? { method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)], amount: b.amount, status: 'paid', paidAt: toISO(b.paidAt) }
      : b.status === 'confirmed'
        ? { method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)], amount: b.amount, status: 'pending', paidAt: null }
        : null;

    bookings.push({
      ...b,
      companyId: b.company.id,
      tripId: b.trip.id,
      busId: b.bus.id,
      busPlate: b.bus.plate,
      busModel: b.bus.model,
      from: b.trip.from,
      to: b.trip.to,
      duration: b.trip.duration,
      distance: b.trip.distance,
      seatCount: b.seats.length,
      payment,
      history,
      notes: b.status === 'cancelled' ? 'Annulation par le client.' : b.status === 'expired' ? 'Délai de réservation dépassé.' : '',
      phone: b.client.phone,
      email: b.client.email,
      clientName: b.client.name,
    });
  });

  return bookings;
};

export const bookings = generateBookings();

export const bookingStats = {
  today: bookings.filter((b) => {
    const bd = new Date(b.createdAt);
    const todayDate = new Date();
    return bd.toDateString() === todayDate.toDateString();
  }).length,
  pending: bookings.filter((b) => b.status === 'pending').length,
  confirmed: bookings.filter((b) => b.status === 'confirmed').length,
  cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  expired: bookings.filter((b) => b.status === 'expired').length,
  converted: bookings.filter((b) => b.status === 'converted').length,
};

export const bookingStatusLabels = {
  pending: { label: 'En attente', icon: 'bi-clock', color: '#F59E0B' },
  confirmed: { label: 'Confirmée', icon: 'bi-check-circle', color: '#10B981' },
  cancelled: { label: 'Annulée', icon: 'bi-x-circle', color: '#EF4444' },
  expired: { label: 'Expirée', icon: 'bi-hourglass-split', color: '#6B7280' },
  converted: { label: 'Convertie', icon: 'bi-ticket-perforated', color: '#8B5CF6' },
};

export const bookingRoutes = [
  { value: '', label: 'Tous les trajets' },
  ...trips.map((t) => ({ value: `${t.from} → ${t.to}`, label: `${t.from} → ${t.to}` })),
];

export const bookingCompanyOptions = [
  { value: '', label: 'Toutes les compagnies' },
  ...companies.map((c) => ({ value: c.name, label: c.name })),
];

export const bookingBusOptions = [
  { value: '', label: 'Tous les bus' },
  ...buses.map((b) => ({ value: b.plate, label: `${b.plate} - ${b.model}` })),
];

export const bookingStatusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'cancelled', label: 'Annulée' },
  { value: 'expired', label: 'Expirée' },
  { value: 'converted', label: 'Convertie' },
];

export const bookingSalePointOptions = [
  { value: '', label: 'Tous les points de vente' },
  ...salePoints.map((s) => ({ value: s, label: s })),
];

export const bookingTimeOptions = [
  { value: '', label: 'Toutes les heures' },
  { value: '06:00-09:00', label: '06:00 - 09:00' },
  { value: '09:00-12:00', label: '09:00 - 12:00' },
  { value: '12:00-15:00', label: '12:00 - 15:00' },
  { value: '15:00-18:00', label: '15:00 - 18:00' },
  { value: '18:00-21:00', label: '18:00 - 21:00' },
];

export const bookingSortOptions = [
  { value: 'newest', label: 'Plus récentes' },
  { value: 'oldest', label: 'Plus anciennes' },
  { value: 'amount_asc', label: 'Montant ↑' },
  { value: 'amount_desc', label: 'Montant ↓' },
  { value: 'status', label: 'Statut' },
];

export const quickFind = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return bookings;
  return bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(q) ||
      b.clientName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.email.toLowerCase().includes(q)
  );
};

export const filterBookings = (bookings, filters) => {
  return bookings.filter((b) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        b.id.toLowerCase().includes(q) ||
        b.clientName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.route && !b.from.includes(filters.route.split('→')[0].trim())) return false;
    if (filters.company && b.companyId !== filters.company) return false;
    if (filters.bus && b.busPlate !== filters.bus) return false;
    if (filters.status && b.status !== filters.status) return false;
    if (filters.salePoint && b.salePoint !== filters.salePoint) return false;
    if (filters.date) {
      const bd = new Date(b.createdAt).toDateString();
      const fd = new Date(filters.date).toDateString();
      if (bd !== fd) return false;
    }
    if (filters.timeRange) {
      const [start, end] = filters.timeRange.split('-');
      const bHour = new Date(b.createdAt).getHours();
      const sHour = parseInt(start.split(':')[0]);
      const eHour = parseInt(end.split(':')[0]);
      if (bHour < sHour || bHour >= eHour) return false;
    }
    return true;
  });
};

export const sortBookings = (bookings, sortBy) => {
  const sorted = [...bookings];
  switch (sortBy) {
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'amount_asc': return sorted.sort((a, b) => a.amount - b.amount);
    case 'amount_desc': return sorted.sort((a, b) => b.amount - a.amount);
    case 'status': return sorted.sort((a, b) => a.status.localeCompare(b.status));
    default: return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const formatCurrency = (amount) =>
  `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)} XAF`;

export const formatDateShort = (dateStr) => {
  const d = new Date(dateStr);
  return formatDate(d);
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const getPaymentMethodIcon = (method) => {
  const icons = {
    Omis_Money: 'bi-phone',
    Orange_Money: 'bi-phone',
    Cash: 'bi-cash',
    Mobile_Money: 'bi-phone',
    Carte_Bancaire: 'bi-credit-card',
  };
  return icons[method] || 'bi-wallet';
};

export const companiesList = companies;
export const tripsList = trips;
export const busesList = buses;
export const clientsList = clients;
export const salePointsList = salePoints;
export const paymentMethodsList = paymentMethods;

export const getBookingById = (id) => bookings.find((b) => b.id === id);

export default bookings;
