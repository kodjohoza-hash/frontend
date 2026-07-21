import { ROUTES } from '@routes/routeConstants';

/**
 * Client sidebar menu
 */
export const clientMenu = [
  {
    id: 'client-dashboard',
    icon: 'bi-grid-1x2',
    label: 'Tableau de bord',
    path: ROUTES.CLIENT_DASHBOARD,
  },
  {
    id: 'client-bookings',
    icon: 'bi-ticket-perforated',
    label: 'Réservations',
    path: ROUTES.CLIENT_BOOKINGS,
  },
  {
    id: 'client-tickets',
    icon: 'bi-postcard',
    label: 'Mes billets',
    path: ROUTES.CLIENT_TICKETS,
  },
  {
    id: 'client-profile',
    icon: 'bi-person',
    label: 'Profil',
    path: ROUTES.CLIENT_PROFILE,
  },
  {
    id: 'client-settings',
    icon: 'bi-gear',
    label: 'Paramètres',
    path: ROUTES.CLIENT_SETTINGS,
  },
];

/**
 * Company sidebar menu
 */
export const companyMenu = [
  {
    id: 'company-dashboard',
    icon: 'bi-grid-1x2',
    label: 'Tableau de bord',
    path: ROUTES.COMPANY_DASHBOARD,
  },
  {
    id: 'company-transport',
    icon: 'bi-bus-front',
    label: 'Transport',
    children: [
      { id: 'company-routes', icon: 'bi-signpost-2', label: 'Trajets', path: ROUTES.COMPANY_ROUTES },
      { id: 'company-buses', icon: 'bi-bus-front-fill', label: 'Bus', path: ROUTES.COMPANY_BUSES },
      { id: 'company-drivers', icon: 'bi-person-badge', label: 'Chauffeurs', path: ROUTES.COMPANY_DRIVERS },
    ],
  },
  {
    id: 'company-bookings',
    icon: 'bi-ticket-perforated',
    label: 'Réservations',
    path: ROUTES.COMPANY_BOOKINGS,
  },
  {
    id: 'company-counters',
    icon: 'bi-shop',
    label: 'Guichets',
    path: ROUTES.COMPANY_COUNTERS,
  },
  {
    id: 'company-reports',
    icon: 'bi-bar-chart-line',
    label: 'Rapports',
    path: ROUTES.COMPANY_REPORTS,
  },
  {
    id: 'company-settings',
    icon: 'bi-gear',
    label: 'Paramètres',
    path: ROUTES.COMPANY_SETTINGS,
  },
];

/**
 * Counter sidebar menu
 */
export const counterMenu = [
  {
    id: 'counter-dashboard',
    icon: 'bi-grid-1x2',
    label: 'Tableau de bord',
    path: ROUTES.COUNTER_DASHBOARD,
  },
  {
    id: 'counter-sale',
    icon: 'bi-cart-plus',
    label: 'Vente',
    path: ROUTES.COUNTER_SALE,
  },
  {
    id: 'counter-bookings',
    icon: 'bi-ticket-perforated',
    label: 'Réservations',
    path: ROUTES.COUNTER_BOOKINGS,
  },
  {
    id: 'counter-tickets',
    icon: 'bi-postcard',
    label: 'Billets',
    path: ROUTES.COUNTER_TICKETS,
  },
  {
    id: 'counter-profile',
    icon: 'bi-person',
    label: 'Profil',
    path: ROUTES.COUNTER_PROFILE,
  },
];

/**
 * Super Admin sidebar menu
 */
export const superAdminMenu = [
  {
    id: 'admin-dashboard',
    icon: 'bi-grid-1x2',
    label: 'Tableau de bord',
    path: ROUTES.SUPER_ADMIN_DASHBOARD,
  },
  {
    id: 'admin-management',
    icon: 'bi-gear-wide-connected',
    label: 'Gestion',
    children: [
      { id: 'admin-companies', icon: 'bi-building', label: 'Compagnies', path: ROUTES.SUPER_ADMIN_COMPANIES },
      { id: 'admin-users', icon: 'bi-people', label: 'Utilisateurs', path: ROUTES.SUPER_ADMIN_USERS },
      { id: 'admin-roles', icon: 'bi-shield-lock', label: 'Rôles', path: ROUTES.SUPER_ADMIN_ROLES },
    ],
  },
  {
    id: 'admin-reports',
    icon: 'bi-bar-chart-line',
    label: 'Rapports',
    path: ROUTES.SUPER_ADMIN_REPORTS,
  },
  {
    id: 'admin-settings',
    icon: 'bi-gear',
    label: 'Paramètres',
    path: ROUTES.SUPER_ADMIN_SETTINGS,
  },
];
