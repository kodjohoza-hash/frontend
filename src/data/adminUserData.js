export const userRoles = [
  { id: 'client', label: 'Client', icon: 'bi-person', color: 'info' },
  { id: 'company_admin', label: 'Admin Compagnie', icon: 'bi-building-gear', color: 'primary' },
  { id: 'counter_agent', label: 'Agent de Guichet', icon: 'bi-shop', color: 'warning' },
  { id: 'super_admin', label: 'Super Admin', icon: 'bi-shield-lock', color: 'accent' },
];

export const userStatuses = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actif' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'pending', label: 'En attente' },
  { value: 'blocked', label: 'Bloqué' },
  { value: 'deleted', label: 'Supprimé' },
];

export const statusConfig = {
  active: { label: 'Actif', class: 'admu-badge--success', icon: 'bi-check-circle-fill' },
  suspended: { label: 'Suspendu', class: 'admu-badge--danger', icon: 'bi-pause-circle-fill' },
  pending: { label: 'En attente', class: 'admu-badge--warning', icon: 'bi-hourglass-split' },
  blocked: { label: 'Bloqué', class: 'admu-badge--danger-light', icon: 'bi-shield-exclamation' },
  deleted: { label: 'Supprimé', class: 'admu-badge--secondary', icon: 'bi-person-slash' },
  online: { label: 'En ligne', class: 'admu-badge--success', icon: 'bi-circle-fill' },
  offline: { label: 'Hors ligne', class: 'admu-badge--secondary', icon: 'bi-circle' },
};

export const userStats = [
  { id: 'total', label: 'Total utilisateurs', value: 2840, icon: 'bi-people', color: 'primary', trend: 18, trendUp: true },
  { id: 'clients', label: 'Clients', value: 2120, icon: 'bi-person', color: 'info', trend: 15, trendUp: true },
  { id: 'company_admins', label: 'Administrateurs', value: 48, icon: 'bi-building-gear', color: 'primary', trend: 5, trendUp: true },
  { id: 'counter_agents', label: 'Agents de guichet', value: 320, icon: 'bi-shop', color: 'warning', trend: 8, trendUp: true },
  { id: 'super_admins', label: 'Super Admins', value: 4, icon: 'bi-shield-lock', color: 'accent', trend: 0, trendUp: false },
  { id: 'active', label: 'Actifs', value: 2400, icon: 'bi-check-circle', color: 'success', trend: 12, trendUp: true },
  { id: 'suspended', label: 'Suspendus', value: 86, icon: 'bi-pause-circle', color: 'danger', trend: -3, trendUp: false },
  { id: 'pending', label: 'En attente', value: 54, icon: 'bi-hourglass-split', color: 'warning', trend: 2, trendUp: true },
  { id: 'today', label: "Connexions aujourd'hui", value: 342, icon: 'bi-graph-up-arrow', color: 'success', trend: 22, trendUp: true },
  { id: 'new', label: 'Nouveaux (30j)', value: 180, icon: 'bi-person-plus', color: 'info', trend: 35, trendUp: true },
];

export const users = [
  { id: 'USR-001', firstName: 'Paul', lastName: 'Biya', email: 'paul.biya@express-bus.cm', phone: '+237 691 234 567',
    avatar: null, initials: 'PB', role: 'company_admin', company: 'Express Bus Cameroun', branch: 'Gare Mvog-Mbi',
    address: '123 Rue Principale', city: 'Yaoundé', country: 'Cameroun', dob: '1985-06-15', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2023-01-15', lastLogin: '2026-07-30 08:24',
    bookings: 156, tickets: 890, payments: 45, },
  { id: 'USR-002', firstName: 'Marie', lastName: 'Kamga', email: 'marie.kamga@express-bus.cm', phone: '+237 692 345 678',
    avatar: null, initials: 'MK', role: 'counter_agent', company: 'Express Bus Cameroun', branch: 'Gare Centrale Douala',
    address: '45 Avenue Kennedy', city: 'Douala', country: 'Cameroun', dob: '1992-03-22', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2023-02-01', lastLogin: '2026-07-30 07:15',
    bookings: 890, tickets: 2450, payments: 320, },
  { id: 'USR-003', firstName: 'Alice', lastName: 'Ngo', email: 'alice.ngo@client.cm', phone: '+237 693 456 789',
    avatar: null, initials: 'AN', role: 'client', company: '', branch: '',
    address: '12 Rue des Cocotiers', city: 'Yaoundé', country: 'Cameroun', dob: '1995-11-08', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2024-06-10', lastLogin: '2026-07-29 18:42',
    bookings: 24, tickets: 48, payments: 12, },
  { id: 'USR-004', firstName: 'Jean', lastName: 'Finex', email: 'jean.finex@finex-voyages.cm', phone: '+237 694 567 890',
    avatar: null, initials: 'JF', role: 'company_admin', company: 'Finex Voyages', branch: 'Siège Douala',
    address: '200 Boulevard de la Liberté', city: 'Douala', country: 'Cameroun', dob: '1978-09-30', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2023-03-20', lastLogin: '2026-07-30 09:00',
    bookings: 420, tickets: 1850, payments: 78, },
  { id: 'USR-005', firstName: 'Esther', lastName: 'Bella', email: 'esther.bella@buca-voyages.cm', phone: '+237 695 678 901',
    avatar: null, initials: 'EB', role: 'counter_agent', company: 'Buca Voyages', branch: 'Gare Bafoussam',
    address: '78 Rue du Marché', city: 'Bafoussam', country: 'Cameroun', dob: '1996-07-14', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2023-07-01', lastLogin: '2026-07-29 14:30',
    bookings: 520, tickets: 1650, payments: 180, },
  { id: 'USR-006', firstName: 'David', lastName: 'Capitaine', email: 'david.capitaine@capitaine-voyages.cm', phone: '+237 696 789 012',
    avatar: null, initials: 'DC', role: 'company_admin', company: 'Capitaine Voyages', branch: 'Agence Kribi',
    address: '5 Plage Road', city: 'Kribi', country: 'Cameroun', dob: '1982-04-18', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2023-09-05', lastLogin: '2026-07-28 11:20',
    bookings: 310, tickets: 1200, payments: 52, },
  { id: 'USR-007', firstName: 'Sophie', lastName: 'Tchinda', email: 'sophie.tchinda@touristique-express.cm', phone: '+237 697 890 123',
    avatar: null, initials: 'ST', role: 'counter_agent', company: 'Touristique Express', branch: 'Gare Limbe',
    address: '22 Beach Street', city: 'Limbe', country: 'Cameroun', dob: '1998-12-25', gender: 'F',
    language: 'en', timezone: 'Africa/Douala', status: 'active', createdAt: '2024-02-01', lastLogin: '2026-07-29 16:45',
    bookings: 350, tickets: 980, payments: 120, },
  { id: 'USR-008', firstName: 'Pierre', lastName: 'Nkwi', email: 'pierre.nkwi@global-express.cm', phone: '+237 698 901 234',
    avatar: null, initials: 'PN', role: 'company_admin', company: 'Global Express', branch: '',
    address: '150 Rue du Commerce', city: 'Yaoundé', country: 'Cameroun', dob: '1980-02-10', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'pending', createdAt: '2024-03-15', lastLogin: '2026-07-25 10:00',
    bookings: 45, tickets: 120, payments: 8, },
  { id: 'USR-009', firstName: 'Kodjo', lastName: 'Hoza', email: 'kodjo.hoza@admin.cm', phone: '+237 699 012 345',
    avatar: null, initials: 'KH', role: 'super_admin', company: 'BUS TIX CONNECT', branch: '',
    address: '1 Place de l\'Indépendance', city: 'Yaoundé', country: 'Cameroun', dob: '1988-05-20', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2024-01-01', lastLogin: '2026-07-30 10:30',
    bookings: 0, tickets: 0, payments: 0, },
  { id: 'USR-010', firstName: 'Admin', lastName: 'Super', email: 'admin@bus-tix-connect.cm', phone: '+237 690 123 456',
    avatar: null, initials: 'AS', role: 'super_admin', company: 'BUS TIX CONNECT', branch: '',
    address: '1 Place de l\'Indépendance', city: 'Yaoundé', country: 'Cameroun', dob: '1985-01-01', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2024-01-01', lastLogin: '2026-07-30 10:32',
    bookings: 0, tickets: 0, payments: 0, },
  { id: 'USR-011', firstName: 'Françoise', lastName: 'Mvogo', email: 'francoise.mvogo@transcam.cm', phone: '+237 691 345 678',
    avatar: null, initials: 'FM', role: 'counter_agent', company: 'Transcam SA', branch: 'Gare Douala',
    address: '88 Rue de l\'Indépendance', city: 'Douala', country: 'Cameroun', dob: '1994-08-05', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'suspended', createdAt: '2024-05-15', lastLogin: '2026-06-15 09:12',
    bookings: 80, tickets: 220, payments: 25, },
  { id: 'USR-012', firstName: 'Christophe', lastName: 'Zanga', email: 'christophe.zanga@eco-transport.cm', phone: '+237 692 456 789',
    avatar: null, initials: 'CZ', role: 'company_admin', company: 'Eco Transport', branch: '',
    address: '15 Green Street', city: 'Buea', country: 'Cameroun', dob: '1987-11-30', gender: 'M',
    language: 'en', timezone: 'Africa/Douala', status: 'pending', createdAt: '2024-07-10', lastLogin: '2026-07-20 08:00',
    bookings: 8, tickets: 15, payments: 2, },
  { id: 'USR-013', firstName: 'Béatrice', lastName: 'Nono', email: 'beatrice.nono@client.cm', phone: '+237 693 567 890',
    avatar: null, initials: 'BN', role: 'client', company: '', branch: '',
    address: '34 Avenue Centrale', city: 'Yaoundé', country: 'Cameroun', dob: '1991-03-12', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'active', createdAt: '2024-08-20', lastLogin: '2026-07-28 20:15',
    bookings: 8, tickets: 14, payments: 4, },
  { id: 'USR-014', firstName: 'Robert', lastName: 'Mbarga', email: 'robert.mbarga@client.cm', phone: '+237 694 678 901',
    avatar: null, initials: 'RM', role: 'client', company: '', branch: '',
    address: '78 Rue des Palmiers', city: 'Douala', country: 'Cameroun', dob: '1989-07-22', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'blocked', createdAt: '2024-05-10', lastLogin: '2026-07-01 06:30',
    bookings: 15, tickets: 28, payments: 6, },
  { id: 'USR-015', firstName: 'Sarah', lastName: 'Biyong', email: 'sarah.biyong@speed-express.cm', phone: '+237 695 789 012',
    avatar: null, initials: 'SB', role: 'counter_agent', company: 'Speed Express', branch: '',
    address: '22 Fast Lane', city: 'Douala', country: 'Cameroun', dob: '1997-09-14', gender: 'F',
    language: 'fr', timezone: 'Africa/Douala', status: 'pending', createdAt: '2024-08-05', lastLogin: null,
    bookings: 0, tickets: 0, payments: 0, },
  { id: 'USR-016', firstName: 'Michel', lastName: 'Tamo', email: 'michel.tamo@client.cm', phone: '+237 696 890 123',
    avatar: null, initials: 'MT', role: 'client', company: '', branch: '',
    address: '5 Rue de l\'Hôpital', city: 'Bafoussam', country: 'Cameroun', dob: '1975-12-01', gender: 'M',
    language: 'fr', timezone: 'Africa/Douala', status: 'suspended', createdAt: '2024-03-05', lastLogin: '2026-05-10 14:00',
    bookings: 32, tickets: 65, payments: 10, },
];

export const filterOptions = {
  roles: userRoles.map((r) => ({ value: r.id, label: r.label })),
  statuses: userStatuses.filter((s) => s.value !== 'all').map((s) => ({ value: s.value, label: s.label })),
  cities: ['Yaoundé', 'Douala', 'Bafoussam', 'Kribi', 'Limbe', 'Buea'],
  countries: ['Cameroun'],
  companies: [...new Set(users.filter((u) => u.company).map((u) => u.company))],
  branches: [...new Set(users.filter((u) => u.branch).map((u) => u.branch))],
};

export const defaultFilters = {
  search: '', role: 'all', status: 'all', company: 'all', branch: 'all',
  city: 'all', country: 'all', dateFrom: '', dateTo: '', lastLoginFrom: '', lastLoginTo: '',
};

export const filterUsers = (list, filters) => {
  return list.filter((u) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      if (!fullName.includes(q) && !u.email.toLowerCase().includes(q) && !u.phone.includes(q)) return false;
    }
    if (filters.role && filters.role !== 'all' && u.role !== filters.role) return false;
    if (filters.status && filters.status !== 'all' && u.status !== filters.status) return false;
    if (filters.company && filters.company !== 'all' && u.company !== filters.company) return false;
    if (filters.branch && filters.branch !== 'all' && u.branch !== filters.branch) return false;
    if (filters.city && filters.city !== 'all' && u.city !== filters.city) return false;
    if (filters.country && filters.country !== 'all' && u.country !== filters.country) return false;
    return true;
  });
};

export const sortUsers = (list, sortBy) => {
  const sorted = [...list];
  switch (sortBy) {
    case 'newest': return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name_asc': return sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    case 'name_desc': return sorted.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
    case 'lastLogin_desc': return sorted.sort((a, b) => {
      if (!a.lastLogin) return 1; if (!b.lastLogin) return -1;
      return new Date(b.lastLogin) - new Date(a.lastLogin);
    });
    default: return sorted;
  }
};

export const userPermissions = [
  { id: 1, name: 'Gestion des voyages', module: 'Voyages', granted: true, inherited: false },
  { id: 2, name: 'Gestion des réservations', module: 'Réservations', granted: true, inherited: false },
  { id: 3, name: 'Gestion des billets', module: 'Billets', granted: true, inherited: true },
  { id: 4, name: 'Gestion des paiements', module: 'Paiements', granted: true, inherited: false },
  { id: 5, name: 'Gestion des clients', module: 'Clients', granted: true, inherited: true },
  { id: 6, name: 'Gestion des bus', module: 'Bus', granted: false, inherited: false },
  { id: 7, name: 'Gestion des chauffeurs', module: 'Chauffeurs', granted: false, inherited: false },
  { id: 8, name: 'Rapports et analyses', module: 'Rapports', granted: true, inherited: true },
  { id: 9, name: 'Configuration système', module: 'Système', granted: false, inherited: false },
  { id: 10, name: 'Gestion des utilisateurs', module: 'Utilisateurs', granted: false, inherited: true },
];

export const userActivityTimeline = [
  { id: 1, type: 'created', icon: 'bi-person-plus', color: 'info', action: 'Compte créé', detail: 'Inscription sur la plateforme', time: '15 jan 2023' },
  { id: 2, type: 'login', icon: 'bi-shield-check', color: 'success', action: 'Connexion', detail: 'Adresse IP: 196.168.1.42 — Chrome/Windows', time: '15 jan 2023 08:30' },
  { id: 3, type: 'login', icon: 'bi-shield-check', color: 'success', action: 'Connexion', detail: 'Adresse IP: 196.168.1.42 — Chrome/Windows', time: '16 jan 2023 09:15' },
  { id: 4, type: 'modified', icon: 'bi-pencil', color: 'warning', action: 'Profil modifié', detail: 'Mise à jour des informations personnelles', time: '20 jan 2023' },
  { id: 5, type: 'role', icon: 'bi-arrow-left-right', color: 'accent', action: 'Changement de rôle', detail: 'Client → Administrateur de compagnie', time: '01 fév 2023' },
  { id: 6, type: 'login', icon: 'bi-shield-check', color: 'success', action: 'Connexion', detail: 'Adresse IP: 197.168.2.15 — Firefox/Android', time: '05 mar 2023 14:20' },
  { id: 7, type: 'reset', icon: 'bi-arrow-counterclockwise', color: 'warning', action: 'Réinitialisation mot de passe', detail: 'Demandée via email', time: '10 jun 2024' },
  { id: 8, type: 'suspended', icon: 'bi-pause-circle', color: 'danger', action: 'Compte suspendu', detail: 'Raison : Non-respect des conditions', time: '15 mar 2026' },
  { id: 9, type: 'reactivated', icon: 'bi-play-circle', color: 'success', action: 'Compte réactivé', detail: 'Après vérification', time: '20 mar 2026' },
  { id: 10, type: 'login', icon: 'bi-shield-check', color: 'success', action: 'Connexion', detail: 'Adresse IP: 198.50.100.25 — Safari/MacOS', time: '30 jul 2026 08:24' },
];

export const userSessions = [
  { id: 1, date: '30 jul 2026', time: '08:24:15', ip: '198.50.100.25', browser: 'Chrome 125', device: 'Windows 11', country: 'Cameroun', city: 'Yaoundé', success: true },
  { id: 2, date: '29 jul 2026', time: '18:42:30', ip: '197.168.2.15', browser: 'Firefox 124', device: 'Android 14', country: 'Cameroun', city: 'Douala', success: true },
  { id: 3, date: '28 jul 2026', time: '09:15:00', ip: '196.168.1.42', browser: 'Chrome 125', device: 'Windows 11', country: 'Cameroun', city: 'Yaoundé', success: true },
  { id: 4, date: '27 jul 2026', time: '14:30:45', ip: '192.168.1.100', browser: 'Safari 17', device: 'iPhone 15', country: 'Cameroun', city: 'Yaoundé', success: false },
  { id: 5, date: '25 jul 2026', time: '10:00:00', ip: '196.168.1.50', browser: 'Chrome 124', device: 'macOS 15', country: 'Cameroun', city: 'Yaoundé', success: true },
  { id: 6, date: '20 jul 2026', time: '16:12:30', ip: '197.168.3.20', browser: 'Edge 125', device: 'Windows 11', country: 'Cameroun', city: 'Bafoussam', success: true },
  { id: 7, date: '15 jul 2026', time: '11:05:00', ip: '198.50.200.10', browser: 'Chrome 123', device: 'Linux', country: 'Cameroun', city: 'Douala', success: true },
  { id: 8, date: '10 jul 2026', time: '07:30:15', ip: '196.168.5.80', browser: 'Safari 17', device: 'iPadOS 18', country: 'Cameroun', city: 'Yaoundé', success: false },
];

export const userActivityLog = [
  { id: 1, date: '30 jul 2026', time: '08:24', action: 'Connexion', detail: 'Authentification réussie', ip: '198.50.100.25' },
  { id: 2, date: '30 jul 2026', time: '08:20', action: 'Modification profil', detail: 'Mise à jour email secondaire', ip: '198.50.100.25' },
  { id: 3, date: '29 jul 2026', time: '18:42', action: 'Connexion', detail: 'Authentification réussie', ip: '197.168.2.15' },
  { id: 4, date: '29 jul 2026', time: '18:40', action: 'Réservation', detail: 'Réservation BR-2450 — Yaoundé → Douala', ip: '197.168.2.15' },
  { id: 5, date: '28 jul 2026', time: '09:15', action: 'Connexion', detail: 'Authentification réussie', ip: '196.168.1.42' },
  { id: 6, date: '28 jul 2026', time: '09:10', action: 'Paiement', detail: 'Paiement PM-890 — 12 500 FCFA', ip: '196.168.1.42' },
  { id: 7, date: '27 jul 2026', time: '14:30', action: 'Tentative connexion', detail: 'Échec — mot de passe incorrect', ip: '192.168.1.100' },
  { id: 8, date: '25 jul 2026', time: '10:00', action: 'Connexion', detail: 'Authentification réussie', ip: '196.168.1.50' },
];
