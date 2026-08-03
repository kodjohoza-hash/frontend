/**
 * BUS TIX CONNECT — Constantes UI « Compagnies ».
 * Les compagnies et les KPIs proviennent désormais de l'API réelle
 * (services/companies.service.js + store/companies.store.js).
 * Ce fichier ne garde que :
 *  - les constantes de badges / filtres utilisées par les composants Admin* ;
 *  - les panneaux secondaires sans source backend (graphiques mensuels,
 *    timeline d'activité, documents d'exemple), comme sur la page Utilisateurs.
 */

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
  { id: 1, type: 'created', icon: 'bi-building', color: 'primary', action: 'Compagnie créée', detail: 'Compagnie inscrite sur la plateforme', time: '—' },
  { id: 2, type: 'validated', icon: 'bi-check-circle', color: 'success', action: 'Compagnie validée', detail: 'Documents vérifiés et approuvés', time: '—' },
  { id: 3, type: 'subscription', icon: 'bi-star', color: 'accent', action: 'Abonnement activé', detail: 'Forfait sélectionné par la compagnie', time: '—' },
  { id: 4, type: 'bus_added', icon: 'bi-bus-front', color: 'info', action: 'Bus ajouté', detail: 'Un bus rejoint la flotte de la compagnie', time: '—' },
  { id: 5, type: 'agent_added', icon: 'bi-person-plus', color: 'success', action: 'Agent ajouté', detail: 'Agent de guichet rattaché à la compagnie', time: '—' },
  { id: 6, type: 'trip_published', icon: 'bi-bus-front', color: 'primary', action: 'Voyage publié', detail: 'Un trajet interurbain est publié', time: '—' },
  { id: 7, type: 'payment', icon: 'bi-cash-coin', color: 'success', action: 'Paiement reçu', detail: 'Commission BTC encaissée', time: '—' },
  { id: 8, type: 'login', icon: 'bi-shield-check', color: 'purple', action: 'Connexion administrateur', detail: 'Connexion admin enregistrée', time: '—' },
];

export const companyDocuments = [
  { id: 1, name: 'Registre du Commerce (RCCM)', ref: 'RC — à renseigner', type: 'pdf', status: 'pending', date: '—', size: '—' },
  { id: 2, name: 'Carte de Contribuable', ref: 'N° contribuable — à renseigner', type: 'pdf', status: 'pending', date: '—', size: '—' },
  { id: 3, name: 'Licence de Transport', ref: 'LT — à renseigner', type: 'pdf', status: 'pending', date: '—', size: '—' },
  { id: 4, name: 'Attestation d\'Assurance', ref: 'ASS — à renseigner', type: 'pdf', status: 'pending', date: '—', size: '—' },
  { id: 5, name: 'Logo de la Compagnie', ref: 'logo compagnie', type: 'image', status: 'pending', date: '—', size: '—' },
  { id: 6, name: 'Pièce d\'Identité du Gérant', ref: 'CNI — à renseigner', type: 'pdf', status: 'pending', date: '—', size: '—' },
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
  cities: [],
  countries: [],
};
