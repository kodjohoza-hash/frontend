const formatCurrency = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const generateCustomerId = () => {
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const prefix = '01H';
  let result = prefix;
  for (let i = 0; i < 23; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const cities = [
  'Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Garoua',
  'Maroua', 'Kribi', 'Limbe', 'Buea', 'Ngaoundéré', 'Bertoua', 'Ebolowa',
];

const statuses = ['nouveau', 'actif', 'vip', 'inactif', 'suspendu'];
const loyaltyLevels = ['bronze', 'argent', 'or', 'platine'];
const seatPrefs = ['fenêtre', 'couloir'];
const classPrefs = ['standard', 'confort', 'vip'];
const paymentPrefs = ['orange_money', 'mtn_money', 'carte', 'especes'];

const customersRaw = [
  {
    firstName: 'Jean-Pierre', lastName: 'Kamga', phone: '+237 691 234 567', email: 'jp.kamga@email.com',
    address: 'Rue 1234, Quartier Bonanjo', city: 'Douala',
    status: 'vip', totalBookings: 28, totalTickets: 46, totalTrips: 32, totalSpent: 425000,
    loyaltyLevel: 'platine', idDocument: { type: 'CNI', number: 'CM-104589-AG' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'orange_money' },
    tags: ['fidéle', 'affaire', 'famille'],
  },
  {
    firstName: 'Marie-Chantal', lastName: 'Ndi', phone: '+237 692 345 678', email: 'mc.ndi@email.com',
    address: 'Rue 5678, Mvog-Mbi', city: 'Yaoundé',
    status: 'actif', totalBookings: 15, totalTickets: 22, totalTrips: 18, totalSpent: 198000,
    loyaltyLevel: 'argent', idDocument: { type: 'Passeport', number: 'CM-PA-87234' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'mtn_money' },
    tags: ['étudiant'],
  },
  {
    firstName: 'Paul', lastName: 'Biya Mballa', phone: '+237 693 456 789', email: 'paul.mballa@email.com',
    address: 'Rue 9012, Quartier du Lac', city: 'Bafoussam',
    status: 'actif', totalBookings: 8, totalTickets: 14, totalTrips: 10, totalSpent: 112500,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-208176-BA' },
    preferences: { seat: 'fenêtre', class: 'standard', payment: 'especes' },
    tags: ['famille'],
  },
  {
    firstName: 'Esther', lastName: 'Ngono', phone: '+237 694 567 890', email: 'esther.ngono@email.com',
    address: 'Rue 3456, Nkolbisson', city: 'Yaoundé',
    status: 'vip', totalBookings: 35, totalTickets: 58, totalTrips: 41, totalSpent: 587000,
    loyaltyLevel: 'platine', idDocument: { type: 'Passeport', number: 'CM-PA-91567' },
    preferences: { seat: 'fenêtre', class: 'vip', payment: 'carte' },
    tags: ['fidéle', 'affaire', 'famille'],
  },
  {
    firstName: 'David', lastName: 'Ekwalla', phone: '+237 695 678 901', email: 'david.ekwalla@email.com',
    address: 'Rue 7890, Bonamoussadi', city: 'Douala',
    status: 'actif', totalBookings: 12, totalTickets: 19, totalTrips: 14, totalSpent: 156000,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-305412-DO' },
    preferences: { seat: 'couloir', class: 'confort', payment: 'orange_money' },
    tags: ['affaire'],
  },
  {
    firstName: 'Sarah', lastName: 'Moukoko', phone: '+237 696 789 012', email: 'sarah.moukoko@email.com',
    address: 'Rue 2345, Nsimeyong', city: 'Yaoundé',
    status: 'actif', totalBookings: 6, totalTickets: 10, totalTrips: 7, totalSpent: 83500,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-419837-YA' },
    preferences: { seat: 'fenêtre', class: 'standard', payment: 'mtn_money' },
    tags: ['étudiant', 'famille'],
  },
  {
    firstName: 'Michel', lastName: 'Tagne', phone: '+237 697 890 123', email: 'michel.tagne@email.com',
    address: 'Rue 6789, Mendong', city: 'Yaoundé',
    status: 'nouveau', totalBookings: 1, totalTickets: 2, totalTrips: 1, totalSpent: 8500,
    loyaltyLevel: 'bronze', idDocument: { type: 'Permis', number: 'CM-PRM-44321' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'especes' },
    tags: [],
  },
  {
    firstName: 'Christine', lastName: 'Eyanga', phone: '+237 698 901 234', email: 'christine.eyanga@email.com',
    address: 'Rue 0123, Bépanda', city: 'Douala',
    status: 'actif', totalBookings: 20, totalTickets: 33, totalTrips: 24, totalSpent: 289000,
    loyaltyLevel: 'or', idDocument: { type: 'CNI', number: 'CM-521946-DO' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'carte' },
    tags: ['fidéle', 'famille'],
  },
  {
    firstName: 'Robert', lastName: 'Nkwi', phone: '+237 699 012 345', email: 'robert.nkwi@email.com',
    address: 'Rue 4567, Plateau', city: 'Bafoussam',
    status: 'inactif', totalBookings: 4, totalTickets: 6, totalTrips: 5, totalSpent: 54000,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-632158-BA' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'mtn_money' },
    tags: [],
  },
  {
    firstName: 'Alice', lastName: 'Mbah', phone: '+237 690 123 456', email: 'alice.mbah@email.com',
    address: 'Rue 8901, Ndokoti', city: 'Douala',
    status: 'actif', totalBookings: 18, totalTickets: 29, totalTrips: 21, totalSpent: 241500,
    loyaltyLevel: 'or', idDocument: { type: 'Passeport', number: 'CM-PA-105623' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'orange_money' },
    tags: ['affaire', 'fidéle'],
  },
  {
    firstName: 'François', lastName: 'Bikoi', phone: '+237 687 654 321', email: 'francois.bikoi@email.com',
    address: 'Rue 2345, Quartier Commercial', city: 'Garoua',
    status: 'vip', totalBookings: 30, totalTickets: 50, totalTrips: 36, totalSpent: 512000,
    loyaltyLevel: 'platine', idDocument: { type: 'CNI', number: 'CM-740129-GA' },
    preferences: { seat: 'fenêtre', class: 'vip', payment: 'carte' },
    tags: ['fidéle', 'affaire'],
  },
  {
    firstName: 'Joséphine', lastName: 'Tchinda', phone: '+237 686 543 210', email: 'josephine.tchinda@email.com',
    address: 'Rue 6789, Centre Ville', city: 'Bamenda',
    status: 'actif', totalBookings: 10, totalTickets: 16, totalTrips: 12, totalSpent: 134000,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-851234-BA' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'mtn_money' },
    tags: ['famille'],
  },
  {
    firstName: 'Marcel', lastName: 'Atangana', phone: '+237 685 432 109', email: 'marcel.atangana@email.com',
    address: 'Rue 0123, Mokolo', city: 'Yaoundé',
    status: 'nouveau', totalBookings: 0, totalTickets: 0, totalTrips: 0, totalSpent: 0,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-962147-YA' },
    preferences: { seat: 'fenêtre', class: 'standard', payment: 'especes' },
    tags: [],
  },
  {
    firstName: 'Béatrice', lastName: 'Ngo Ngo', phone: '+237 684 321 098', email: 'beatrice.ngongo@email.com',
    address: 'Rue 3456, Bonapriso', city: 'Douala',
    status: 'vip', totalBookings: 42, totalTickets: 71, totalTrips: 50, totalSpent: 718000,
    loyaltyLevel: 'platine', idDocument: { type: 'Passeport', number: 'CM-PA-210784' },
    preferences: { seat: 'fenêtre', class: 'vip', payment: 'carte' },
    tags: ['fidéle', 'affaire', 'famille'],
  },
  {
    firstName: 'Félix', lastName: 'Mbah', phone: '+237 683 210 987', email: 'felix.mbah@email.com',
    address: 'Rue 7890, Bandjoun', city: 'Bafoussam',
    status: 'inactif', totalBookings: 2, totalTickets: 3, totalTrips: 2, totalSpent: 25000,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-073159-BA' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'orange_money' },
    tags: [],
  },
  {
    firstName: 'Gisèle', lastName: 'Nkengue', phone: '+237 682 109 876', email: 'gisele.nkengue@email.com',
    address: 'Rue 5678, Mboppi', city: 'Douala',
    status: 'actif', totalBookings: 14, totalTickets: 23, totalTrips: 17, totalSpent: 198500,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-184726-DO' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'mtn_money' },
    tags: ['famille'],
  },
  {
    firstName: 'Hervé', lastName: 'Tchinda', phone: '+237 681 098 765', email: 'herve.tchinda@email.com',
    address: 'Rue 9012, Centre', city: 'Kribi',
    status: 'actif', totalBookings: 9, totalTickets: 15, totalTrips: 11, totalSpent: 127000,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-295837-KR' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'orange_money' },
    tags: ['affaire'],
  },
  {
    firstName: 'Irène', lastName: 'Meka', phone: '+237 680 987 654', email: 'irene.meka@email.com',
    address: 'Rue 2345, Bonamoussadi', city: 'Douala',
    status: 'suspendu', totalBookings: 3, totalTickets: 4, totalTrips: 3, totalSpent: 38500,
    loyaltyLevel: 'bronze', idDocument: { type: 'Permis', number: 'CM-PRM-87654' },
    preferences: { seat: 'fenêtre', class: 'standard', payment: 'especes' },
    tags: [],
  },
  {
    firstName: 'Jules', lastName: 'Eyebe', phone: '+237 679 876 543', email: 'jules.eyebe@email.com',
    address: 'Rue 6789, Makepe', city: 'Douala',
    status: 'actif', totalBookings: 25, totalTickets: 40, totalTrips: 30, totalSpent: 376000,
    loyaltyLevel: 'or', idDocument: { type: 'CNI', number: 'CM-406128-DO' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'carte' },
    tags: ['fidéle', 'affaire'],
  },
  {
    firstName: 'Karine', lastName: 'Mbarga', phone: '+237 678 765 432', email: 'karine.mbarga@email.com',
    address: 'Rue 0123, Centre Ville', city: 'Limbe',
    status: 'nouveau', totalBookings: 1, totalTickets: 1, totalTrips: 1, totalSpent: 12000,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-517239-LI' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'mtn_money' },
    tags: [],
  },
  {
    firstName: 'Lucien', lastName: 'Ndongo', phone: '+237 677 654 321', email: 'lucien.ndongo@email.com',
    address: 'Rue 3456, Molyko', city: 'Buea',
    status: 'actif', totalBookings: 11, totalTickets: 18, totalTrips: 14, totalSpent: 162000,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-628410-BU' },
    preferences: { seat: 'fenêtre', class: 'confort', payment: 'orange_money' },
    tags: ['étudiant'],
  },
  {
    firstName: 'Martine', lastName: 'Sando', phone: '+237 676 543 210', email: 'martine.sando@email.com',
    address: 'Rue 7890, Plateau', city: 'Ngaoundéré',
    status: 'vip', totalBookings: 22, totalTickets: 37, totalTrips: 27, totalSpent: 413000,
    loyaltyLevel: 'or', idDocument: { type: 'Passeport', number: 'CM-PA-327895' },
    preferences: { seat: 'fenêtre', class: 'vip', payment: 'carte' },
    tags: ['fidéle', 'affaire'],
  },
  {
    firstName: 'Noël', lastName: 'Ngassam', phone: '+237 675 432 109', email: 'noel.ngassam@email.com',
    address: 'Rue 1234, Centre', city: 'Bertoua',
    status: 'actif', totalBookings: 7, totalTickets: 11, totalTrips: 8, totalSpent: 94500,
    loyaltyLevel: 'argent', idDocument: { type: 'CNI', number: 'CM-739521-BE' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'mtn_money' },
    tags: ['famille'],
  },
  {
    firstName: 'Odile', lastName: 'Bella', phone: '+237 674 321 098', email: 'odile.bella@email.com',
    address: 'Rue 5678, Centre Ville', city: 'Ebolowa',
    status: 'actif', totalBookings: 5, totalTickets: 8, totalTrips: 6, totalSpent: 72000,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-840612-EB' },
    preferences: { seat: 'fenêtre', class: 'standard', payment: 'especes' },
    tags: [],
  },
  {
    firstName: 'Pierre', lastName: 'Zanga', phone: '+237 673 210 987', email: 'pierre.zanga@email.com',
    address: 'Rue 9012, Kongola', city: 'Maroua',
    status: 'inactif', totalBookings: 0, totalTickets: 0, totalTrips: 0, totalSpent: 0,
    loyaltyLevel: 'bronze', idDocument: { type: 'CNI', number: 'CM-951723-MA' },
    preferences: { seat: 'couloir', class: 'standard', payment: 'especes' },
    tags: [],
  },
];

const dateBetween = (start, end) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString();
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const bookingRefs = [
  'BK-2024-1001', 'BK-2024-1002', 'BK-2024-1003', 'BK-2024-1004', 'BK-2024-1005',
  'BK-2024-1006', 'BK-2024-1007', 'BK-2024-1008', 'BK-2025-2001', 'BK-2025-2002',
  'BK-2025-2003', 'BK-2025-2004', 'BK-2025-2005', 'BK-2025-2006', 'BK-2025-2007',
  'BK-2025-2008', 'BK-2025-2009', 'BK-2026-3001', 'BK-2026-3002', 'BK-2026-3003',
  'BK-2026-3004', 'BK-2026-3005', 'BK-2026-3006', 'BK-2026-3007', 'BK-2026-3008',
  'BK-2026-3009', 'BK-2026-3010', 'BK-2026-3011', 'BK-2026-3012',
];

const ticketRefs = [
  'BT-2024-0501', 'BT-2024-0502', 'BT-2024-0503', 'BT-2025-0601', 'BT-2025-0602',
  'BT-2025-0603', 'BT-2025-0604', 'BT-2026-0701', 'BT-2026-0702', 'BT-2026-0703',
  'BT-2026-0704', 'BT-2026-0705', 'BT-2026-0706', 'BT-2026-0707', 'BT-2026-0708',
];

const paymentRefs = [
  'PAY-2024-001', 'PAY-2024-002', 'PAY-2024-003', 'PAY-2025-001', 'PAY-2025-002',
  'PAY-2025-003', 'PAY-2025-004', 'PAY-2026-001', 'PAY-2026-002', 'PAY-2026-003',
  'PAY-2026-004', 'PAY-2026-005', 'PAY-2026-006', 'PAY-2026-007', 'PAY-2026-008',
];

const routes = [
  { from: 'Douala', to: 'Yaoundé' }, { from: 'Yaoundé', to: 'Douala' },
  { from: 'Douala', to: 'Bafoussam' }, { from: 'Bafoussam', to: 'Douala' },
  { from: 'Yaoundé', to: 'Bafoussam' }, { from: 'Bafoussam', to: 'Yaoundé' },
  { from: 'Douala', to: 'Bamenda' }, { from: 'Bamenda', to: 'Douala' },
  { from: 'Yaoundé', to: 'Bamenda' }, { from: 'Douala', to: 'Garoua' },
  { from: 'Yaoundé', to: 'Kribi' }, { from: 'Kribi', to: 'Yaoundé' },
  { from: 'Douala', to: 'Maroua' }, { from: 'Yaoundé', to: 'Ngaoundéré' },
  { from: 'Douala', to: 'Limbe' }, { from: 'Douala', to: 'Buea' },
  { from: 'Yaoundé', to: 'Bertoua' }, { from: 'Yaoundé', to: 'Ebolowa' },
];

const bookingStatuses = ['confirmé', 'annulé', 'terminé', 'en_attente'];
const ticketStatuses = ['valide', 'utilisé', 'expiré', 'annulé'];
const paymentMethods = ['orange_money', 'mtn_money', 'carte', 'especes'];
const paymentStatuses = ['payé', 'en_attente', 'échoué', 'remboursé'];

let bookingIdx = 0;
let ticketIdx = 0;
let paymentIdx = 0;

const buildCustomer = (raw, index) => {
  const id = generateCustomerId();
  const regDate = index < 5
    ? dateBetween('2024-01-01', '2024-06-30')
    : index < 10
      ? dateBetween('2024-07-01', '2024-12-31')
      : index < 18
        ? dateBetween('2025-01-01', '2025-12-31')
        : dateBetween('2026-01-01', '2026-06-30');

  const bookings = [];
  const tickets = [];
  const payments = [];
  const timeline = [];

  timeline.push({
    id: `${id}-tl-0`, type: 'inscription', title: 'Inscription',
    description: `${raw.firstName} ${raw.lastName} s'est inscrit sur la plateforme`,
    date: regDate,
  });

  const bookingCount = raw.totalBookings > 0 ? Math.min(raw.totalBookings, Math.max(1, Math.floor(raw.totalBookings / 2))) : 0;

  for (let i = 0; i < bookingCount && bookingIdx < bookingRefs.length; i++) {
    const route = randomFrom(routes);
    const bDate = dateBetween(regDate, '2026-06-30');
    const bStatus = randomFrom(bookingStatuses);
    const amount = randomFrom([4500, 5500, 6500, 8000, 8500, 10000, 12000, 14000, 15000, 18000, 20000, 25000]);
    const ref = bookingRefs[bookingIdx % bookingRefs.length];
    bookingIdx++;

    const booking = {
      id: `b-${id}-${i}`, reference: ref, from: route.from, to: route.to,
      date: bDate, status: bStatus, amount,
    };
    bookings.push(booking);

    timeline.push({
      id: `${id}-tl-b${i}`, type: 'reservation', title: `Réservation ${ref}`,
      description: `${route.from} → ${route.to} — ${formatCurrency(amount)}`,
      date: bDate,
    });

    if (bStatus !== 'annulé' && ticketIdx < ticketRefs.length) {
      const tRef = ticketRefs[ticketIdx % ticketRefs.length];
      ticketIdx++;
      const seatLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6));
      const seatNum = randInt(1, 5);
      const ticket = {
        id: `t-${id}-${i}`, reference: tRef, from: route.from, to: route.to,
        date: bDate, status: randomFrom(ticketStatuses), seat: `${seatLetter}${seatNum}`,
      };
      tickets.push(ticket);

      timeline.push({
        id: `${id}-tl-t${i}`, type: 'billet', title: `Billet ${tRef}`,
        description: `${route.from} → ${route.to} — Siège ${ticket.seat}`,
        date: bDate,
      });
    }

    if (paymentIdx < paymentRefs.length) {
      const pRef = paymentRefs[paymentIdx % paymentRefs.length];
      paymentIdx++;
      const payment = {
        id: `p-${id}-${i}`, reference: pRef, amount,
        method: randomFrom(paymentMethods), status: bStatus === 'annulé' ? 'remboursé' : randomFrom(paymentStatuses),
        date: bDate,
      };
      payments.push(payment);

      timeline.push({
        id: `${id}-tl-p${i}`, type: 'paiement', title: `Paiement ${pRef}`,
        description: `${formatCurrency(amount)} — ${payment.method}`,
        date: bDate,
      });
    }
  }

  timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  const notes = raw.totalBookings > 10
    ? [
        { id: `${id}-n1`, text: 'Client fidèle, toujours satisfait du service.', author: 'Marie Kamga', createdAt: dateBetween('2025-01-01', '2025-06-30') },
        { id: `${id}-n2`, text: 'Préfère les sièges côté fenêtre. Ajouter une note au dossier.', author: 'Kodjo Jojo', createdAt: dateBetween('2025-07-01', '2026-03-01') },
      ]
    : raw.totalBookings > 0
      ? [
          { id: `${id}-n1`, text: 'A voyagé avec nous pour la première fois.', author: 'Marie Kamga', createdAt: dateBetween('2025-01-01', '2025-12-31') },
        ]
      : [];

  const photo = `https://ui-avatars.com/api/?name=${raw.firstName}+${raw.lastName}&background=0B1D51&color=fff&size=80`;

  const lastTrip = bookings.length > 0
    ? bookings.reduce((latest, b) => new Date(b.date) > new Date(latest.date) ? b : latest).date
    : null;

  return {
    id,
    photo,
    firstName: raw.firstName,
    lastName: raw.lastName,
    phone: raw.phone,
    email: raw.email,
    address: raw.address,
    city: raw.city,
    country: 'Cameroun',
    status: raw.status,
    registeredAt: regDate,
    lastTrip,
    totalBookings: raw.totalBookings,
    totalTickets: raw.totalTickets,
    totalTrips: raw.totalTrips,
    totalSpent: raw.totalSpent,
    loyaltyLevel: raw.loyaltyLevel,
    idDocument: raw.idDocument,
    preferences: raw.preferences,
    notes,
    tags: raw.tags,
    timeline,
    bookings,
    tickets,
    payments,
  };
};

export const customers = customersRaw.map((raw, i) => buildCustomer(raw, i));

export const customerStats = [
  { id: 'registered-today', label: "Enregistrés aujourd'hui", value: 3, icon: 'bi-person-plus', color: '#0B1D51', subtext: '+2 par rapport à hier' },
  { id: 'active', label: 'Clients actifs', value: customers.filter((c) => c.status === 'actif' || c.status === 'vip').length, icon: 'bi-people', color: '#10B981', subtext: `${customers.filter((c) => c.status === 'actif').length} actifs + ${customers.filter((c) => c.status === 'vip').length} VIP` },
  { id: 'new', label: 'Nouveaux clients', value: customers.filter((c) => c.status === 'nouveau').length, icon: 'bi-star', color: '#F59E0B', subtext: 'Cette semaine' },
  { id: 'loyal', label: 'Clients fidèles', value: customers.filter((c) => c.loyaltyLevel === 'or' || c.loyaltyLevel === 'platine').length, icon: 'bi-gem', color: '#8B5CF6', subtext: 'Niveau Or & Platine' },
  { id: 'vip', label: 'Clients VIP', value: customers.filter((c) => c.status === 'vip').length, icon: 'bi-crown', color: '#FF6B35', subtext: 'Programme de fidélité' },
  { id: 'pending', label: 'En attente', value: customers.filter((c) => c.status === 'suspendu').length, icon: 'bi-hourglass-split', color: '#EF4444', subtext: 'Comptes suspendus' },
];

export const customerFilterOptions = {
  statuses: [
    { value: '', label: 'Tous les statuts' },
    { value: 'nouveau', label: 'Nouveau' },
    { value: 'actif', label: 'Actif' },
    { value: 'vip', label: 'VIP' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'suspendu', label: 'Suspendu' },
  ],
  cities: [
    { value: '', label: 'Toutes les villes' },
    ...cities.map((c) => ({ value: c, label: c })),
  ],
  loyaltyLevels: [
    { value: '', label: 'Tous les niveaux' },
    { value: 'bronze', label: 'Bronze' },
    { value: 'argent', label: 'Argent' },
    { value: 'or', label: 'Or' },
    { value: 'platine', label: 'Platine' },
  ],
  sortOptions: [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'name_asc', label: 'Nom (A-Z)' },
    { value: 'name_desc', label: 'Nom (Z-A)' },
    { value: 'trips_desc', label: 'Voyages ↑' },
    { value: 'trips_asc', label: 'Voyages ↓' },
    { value: 'spent_desc', label: 'Dépenses ↑' },
  ],
};

export const filterCustomers = (customers, filters) => {
  if (!filters) return customers;
  return customers.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.status && c.status !== filters.status) return false;
    if (filters.city && c.city !== filters.city) return false;
    if (filters.loyaltyLevel && c.loyaltyLevel !== filters.loyaltyLevel) return false;
    if (filters.registeredAtStart && new Date(c.registeredAt) < new Date(filters.registeredAtStart)) return false;
    if (filters.registeredAtEnd && new Date(c.registeredAt) > new Date(filters.registeredAtEnd)) return false;
    if (filters.minTrips !== undefined && c.totalTrips < filters.minTrips) return false;
    if (filters.maxTrips !== undefined && c.totalTrips > filters.maxTrips) return false;
    return true;
  });
};

export const sortCustomers = (customers, sortBy) => {
  const sorted = [...customers];
  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt));
    case 'name_asc':
      return sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    case 'name_desc':
      return sorted.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
    case 'trips_desc':
      return sorted.sort((a, b) => b.totalTrips - a.totalTrips);
    case 'trips_asc':
      return sorted.sort((a, b) => a.totalTrips - b.totalTrips);
    case 'spent_desc':
      return sorted.sort((a, b) => b.totalSpent - a.totalSpent);
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
  }
};

export const findCustomerByPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return customers.find((c) => c.phone.replace(/\D/g, '').includes(cleaned)) || null;
};

export const findCustomerByEmail = (email) => {
  if (!email) return null;
  return customers.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null;
};

export { generateCustomerId, formatCurrency, formatDate, formatTime };

export default {
  customers,
  customerStats,
  customerFilterOptions,
  filterCustomers,
  sortCustomers,
  findCustomerByPhone,
  findCustomerByEmail,
  generateCustomerId,
  formatCurrency,
  formatDate,
  formatTime,
};
