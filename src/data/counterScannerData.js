const companies = [
  { id: 'C1', name: 'Finex Voyages', color: '#0B1D51', logo: 'FV' },
  { id: 'C2', name: 'Buca Voyages', color: '#FF6B35', logo: 'BV' },
  { id: 'C3', name: 'Touristique Express', color: '#2E7D32', logo: 'TE' },
  { id: 'C4', name: 'Garantie Voyages', color: '#1565C0', logo: 'GV' },
  { id: 'C5', name: 'Va-et-Vient', color: '#6A1B9A', logo: 'VV' },
];

const statusLabels = {
  valid: { label: 'Valide', icon: 'bi-check-circle-fill', color: '#10B981' },
  used: { label: 'Déjà utilisé', icon: 'bi-clock-history', color: '#F59E0B' },
  expired: { label: 'Expiré', icon: 'bi-hourglass-split', color: '#6B7280' },
  cancelled: { label: 'Annulé', icon: 'bi-x-circle-fill', color: '#EF4444' },
  refunded: { label: 'Remboursé', icon: 'bi-arrow-return-left', color: '#8B5CF6' },
  unpaid: { label: 'Non payé', icon: 'bi-credit-card', color: '#F97316' },
  unknown: { label: 'Inconnu', icon: 'bi-question-circle', color: '#6B7280' },
};

const passengers = [
  { name: 'Jean-Pierre Kamga', phone: '691234567', email: 'jp.kamga@email.com', initials: 'JK' },
  { name: 'Marie-Chantal Ndi', phone: '692345678', email: 'mc.ndi@email.com', initials: 'MN' },
  { name: 'Paul Biya Mballa', phone: '693456789', email: 'paul.mballa@email.com', initials: 'PM' },
  { name: 'Esther Ngono', phone: '694567890', email: 'esther.ngono@email.com', initials: 'EN' },
  { name: 'David Ekwalla', phone: '695678901', email: 'david.ekwalla@email.com', initials: 'DE' },
  { name: 'Sarah Moukoko', phone: '696789012', email: 'sarah.moukoko@email.com', initials: 'SM' },
  { name: 'Michel Tagne', phone: '697890123', email: 'michel.tagne@email.com', initials: 'MT' },
  { name: 'Christine Eyanga', phone: '698901234', email: 'christine.eyanga@email.com', initials: 'CE' },
  { name: 'Robert Nkwi', phone: '699012345', email: 'robert.nkwi@email.com', initials: 'RN' },
  { name: 'Alice Mbah', phone: '690123456', email: 'alice.mbah@email.com', initials: 'AM' },
  { name: 'François Bikoi', phone: '687654321', email: 'francois.bikoi@email.com', initials: 'FB' },
  { name: 'Joséphine Tchinda', phone: '686543210', email: 'josephine.tchinda@email.com', initials: 'JT' },
];

const trips = [
  { from: 'Douala', to: 'Yaoundé', date: '2026-07-30', time: '06:00', duration: '4h' },
  { from: 'Douala', to: 'Bafoussam', date: '2026-07-30', time: '07:30', duration: '5h' },
  { from: 'Yaoundé', to: 'Douala', date: '2026-07-30', time: '08:00', duration: '4h' },
  { from: 'Yaoundé', to: 'Bafoussam', date: '2026-07-30', time: '09:00', duration: '6h' },
  { from: 'Douala', to: 'Bamenda', date: '2026-07-30', time: '06:30', duration: '8h' },
  { from: 'Douala', to: 'Garoua', date: '2026-07-29', time: '05:00', duration: '14h' },
  { from: 'Douala', to: 'Yaoundé', date: '2026-07-28', time: '06:00', duration: '4h' },
  { from: 'Yaoundé', to: 'Douala', date: '2026-07-27', time: '10:00', duration: '4h' },
  { from: 'Douala', to: 'Maroua', date: '2026-07-25', time: '04:00', duration: '16h' },
  { from: 'Douala', to: 'Yaoundé', date: '2026-07-29', time: '14:00', duration: '4h' },
  { from: 'Douala', to: 'Bafoussam', date: '2026-07-26', time: '07:30', duration: '5h' },
  { from: 'Bafoussam', to: 'Douala', date: '2026-07-28', time: '08:00', duration: '5h' },
  { from: 'Yaoundé', to: 'Bamenda', date: '2026-07-29', time: '09:00', duration: '7h' },
  { from: 'Douala', to: 'Yaoundé', date: '2026-07-31', time: '06:00', duration: '4h' },
  { from: 'Douala', to: 'Bafoussam', date: '2026-07-31', time: '09:00', duration: '5h' },
  { from: 'Yaoundé', to: 'Douala', date: '2026-07-31', time: '12:00', duration: '4h' },
  { from: 'Douala', to: 'Bamenda', date: '2026-07-29', time: '06:30', duration: '8h' },
  { from: 'Douala', to: 'Yaoundé', date: '2026-08-01', time: '06:00', duration: '4h' },
  { from: 'Douala', to: 'Yaoundé', date: '2026-07-30', time: '18:00', duration: '4h' },
  { from: 'Douala', to: 'Bafoussam', date: '2026-07-28', time: '07:30', duration: '5h' },
];

const buses = [
  { plate: 'LT 123 AB', model: 'Mercedes Sprinter', seat: 'A3' },
  { plate: 'LT 456 CD', model: 'Toyota Hiace', seat: 'B1' },
  { plate: 'NW 789 EF', model: 'King Long', seat: 'C2' },
  { plate: 'CE 012 GH', model: 'Yutong', seat: 'A1' },
  { plate: 'SW 345 IJ', model: 'Mercedes Sprinter', seat: 'D4' },
  { plate: 'NW 678 KL', model: 'Isuzu', seat: 'B3' },
  { plate: 'LT 901 MN', model: 'King Long', seat: 'E2' },
  { plate: 'CE 234 OP', model: 'Toyota Hiace', seat: 'C1' },
  { plate: 'LT 123 AB', model: 'Mercedes Sprinter', seat: 'A5' },
  { plate: 'SW 345 IJ', model: 'Mercedes Sprinter', seat: 'B2' },
  { plate: 'NW 678 KL', model: 'Isuzu', seat: 'D1' },
  { plate: 'CE 234 OP', model: 'Toyota Hiace', seat: 'A2' },
  { plate: 'NW 789 EF', model: 'King Long', seat: 'B4' },
  { plate: 'LT 456 CD', model: 'Toyota Hiace', seat: 'C3' },
  { plate: 'CE 012 GH', model: 'Yutong', seat: 'D2' },
  { plate: 'LT 901 MN', model: 'King Long', seat: 'A4' },
  { plate: 'NW 678 KL', model: 'Isuzu', seat: 'E1' },
  { plate: 'LT 123 AB', model: 'Mercedes Sprinter', seat: 'B5' },
  { plate: 'SW 345 IJ', model: 'Mercedes Sprinter', seat: 'C4' },
  { plate: 'CE 234 OP', model: 'Toyota Hiace', seat: 'D3' },
];

const paymentMethods = ['Omis_Money', 'Orange_Money', 'Cash', 'Mobile_Money', 'Carte_Bancaire'];
const statuses = ['valid', 'used', 'expired', 'cancelled', 'refunded', 'unpaid', 'unknown'];
const now = new Date();

const formatDate = (d) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const generateTickets = () => {
  const tickets = [];
  const agentName = 'Kodjo Jojo';

  for (let i = 0; i < 25; i++) {
    const pax = passengers[i % passengers.length];
    const trip = trips[i % trips.length];
    const bus = buses[i % buses.length];
    const company = companies[i % companies.length];
    const status = statuses[i < 8 ? i : Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const ref = `BTC-${trip.from.slice(0, 3).toUpperCase()}-${trip.to.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`;
    const qrCode = `${ref}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const barcode = String(5900000000000 + i);

    const history = [
      { action: 'Billet émis', timestamp: new Date(now.getTime() - (25 - i) * 3600000).toISOString(), user: agentName, icon: 'bi-ticket-perforated' },
    ];

    if (status === 'used') {
      history.push({ action: 'Embarquement validé', timestamp: new Date(now.getTime() - (10 - i) * 60000).toISOString(), user: agentName, icon: 'bi-check-circle' });
    }
    if (status === 'cancelled') {
      history.push({ action: 'Billet annulé', timestamp: new Date(now.getTime() - (15 - i) * 3600000).toISOString(), user: agentName, icon: 'bi-x-circle' });
    }
    if (status === 'refunded') {
      history.push({ action: 'Remboursement effectué', timestamp: new Date(now.getTime() - (12 - i) * 3600000).toISOString(), user: agentName, icon: 'bi-arrow-return-left' });
    }

    const verifiedAt = status === 'used' ? new Date(now.getTime() - Math.random() * 3600000).toISOString() : null;

    tickets.push({
      id: `TKT-2026-${String(i + 1).padStart(4, '0')}`,
      reference: ref,
      qrCode,
      barcode,
      passenger: pax,
      company,
      trip,
      bus,
      amount: Math.floor(Math.random() * 15000 + 5000),
      payment: { method: paymentMethod, status: status === 'unpaid' ? 'pending' : 'paid', amount: Math.floor(Math.random() * 15000 + 5000) },
      status,
      createdAt: new Date(now.getTime() - (30 - i) * 86400000).toISOString(),
      verifiedAt,
      verifiedBy: verifiedAt ? agentName : null,
      history,
      notes: status === 'cancelled' ? 'Annulation client.' : status === 'refunded' ? 'Remboursement traité.' : '',
    });
  }

  return tickets;
};

export const tickets = generateTickets();

export const scannerStats = {
  verifiedToday: tickets.filter((t) => {
    if (!t.verifiedAt) return false;
    const vd = new Date(t.verifiedAt);
    return vd.toDateString() === now.toDateString();
  }).length,
  valid: tickets.filter((t) => t.status === 'valid').length,
  invalid: tickets.filter((t) => ['cancelled', 'refunded', 'unpaid', 'unknown'].includes(t.status)).length,
  used: tickets.filter((t) => t.status === 'used').length,
  boarded: tickets.filter((t) => t.status === 'used').length,
  refused: tickets.filter((t) => t.status === 'cancelled').length,
};

export const ticketStatusLabels = statusLabels;

export const findTicket = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return tickets.find(
    (t) =>
      t.id.toLowerCase() === q ||
      t.reference.toLowerCase() === q ||
      t.qrCode.toLowerCase() === q ||
      t.barcode === q ||
      t.passenger.name.toLowerCase().includes(q) ||
      t.passenger.phone.includes(q) ||
      t.bus.seat.toLowerCase() === q
  ) || null;
};

export const searchTickets = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(q) ||
      t.reference.toLowerCase().includes(q) ||
      t.qrCode.toLowerCase().includes(q) ||
      t.barcode.includes(q) ||
      t.passenger.name.toLowerCase().includes(q) ||
      t.passenger.phone.includes(q) ||
      t.bus.seat.toLowerCase().includes(q)
  );
};

export const randomScanResult = () => {
  const idx = Math.floor(Math.random() * tickets.length);
  return tickets[idx];
};

export const formatCurrency = (amount) =>
  `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)} XAF`;

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;
    if (type === 'success') {
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.frequency.value = 280;
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.frequency.value = 660;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {}
};

export const vibrateDevice = (pattern = 50) => {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
};

export default tickets;
