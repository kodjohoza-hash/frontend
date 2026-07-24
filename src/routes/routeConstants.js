/**
 * BUS TIX CONNECT — Route Constants
 * Centralized route paths and names
 */

export const ROUTES = {
  /* ================================================
     PUBLIC / GUEST
     ================================================ */
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  SESSION_EXPIRED: '/session-expired',

  /* ================================================
     CLIENT
     ================================================ */
  CLIENT_DASHBOARD: '/client/dashboard',
  CLIENT_BOOKINGS: '/client/bookings',
  CLIENT_BOOKING_CREATE: '/client/bookings/create',
  CLIENT_TICKETS: '/client/tickets',
  CLIENT_PROFILE: '/client/profile',
  CLIENT_SETTINGS: '/client/settings',
  CLIENT_SUPPORT: '/client/support',
  CLIENT_MESSAGES: '/client/messages',

  /* ================================================
     COMPANY
     ================================================ */
  COMPANY_DASHBOARD: '/company/dashboard',
  COMPANY_ROUTES: '/company/routes',
  COMPANY_TRIPS: '/company/trips',
  COMPANY_TRIP_DETAIL: '/company/trips/:id',
  COMPANY_BUSES: '/company/buses',
  COMPANY_DRIVERS: '/company/drivers',
  COMPANY_BOOKINGS: '/company/bookings',
  COMPANY_COUNTERS: '/company/counters',
  COMPANY_REPORTS: '/company/reports',
  COMPANY_SETTINGS: '/company/settings',
  COMPANY_PROFILE: '/company/profile',

  /* ================================================
     COUNTER
     ================================================ */
  COUNTER_DASHBOARD: '/counter/dashboard',
  COUNTER_SALE: '/counter/sale',
  COUNTER_BOOKINGS: '/counter/bookings',
  COUNTER_TICKETS: '/counter/tickets',
  COUNTER_PROFILE: '/counter/profile',

  /* ================================================
     SUPER ADMIN
     ================================================ */
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  SUPER_ADMIN_COMPANIES: '/super-admin/companies',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_ROLES: '/super-admin/roles',
  SUPER_ADMIN_REPORTS: '/super-admin/reports',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',

  /* ================================================
     SHARED / BOOKING FLOW
     ================================================ */
  BOOKING: '/booking',
  BOOKING_SEARCH: '/booking/search',
  BOOKING_TRIPS: '/booking/trips',
  BOOKING_SEATS: '/booking/seats',
  BOOKING_PASSENGER: '/booking/passenger',
  BOOKING_PAYMENT: '/booking/payment',
  BOOKING_CONFIRMATION: '/booking/confirmation',

  TICKET_VIEW: '/ticket/:id',
  TICKET_PRINT: '/ticket/:id/print',

  /* ================================================
     SHARED
     ================================================ */
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',

  /* ================================================
     ERRORS
     ================================================ */
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
};

export const ROUTE_NAMES = {
  [ROUTES.HOME]: 'Accueil',
  [ROUTES.LOGIN]: 'Connexion',
  [ROUTES.REGISTER]: 'Inscription',
  [ROUTES.FORGOT_PASSWORD]: 'Mot de passe oublié',
  [ROUTES.RESET_PASSWORD]: 'Réinitialiser le mot de passe',
  [ROUTES.VERIFY_EMAIL]: 'Vérification de l\'email',
  [ROUTES.SESSION_EXPIRED]: 'Session expirée',
  [ROUTES.CLIENT_DASHBOARD]: 'Mon espace',
  [ROUTES.CLIENT_BOOKINGS]: 'Mes réservations',
  [ROUTES.CLIENT_TICKETS]: 'Mes billets',
  [ROUTES.CLIENT_PROFILE]: 'Mon profil',
  [ROUTES.CLIENT_SETTINGS]: 'Paramètres',
  [ROUTES.CLIENT_SUPPORT]: 'Centre d\'aide',
  [ROUTES.COMPANY_DASHBOARD]: 'Tableau de bord',
  [ROUTES.COMPANY_ROUTES]: 'Trajets',
  [ROUTES.COMPANY_BUSES]: 'Bus',
  [ROUTES.COMPANY_DRIVERS]: 'Chauffeurs',
  [ROUTES.COMPANY_BOOKINGS]: 'Réservations',
  [ROUTES.COMPANY_COUNTERS]: 'Guichets',
  [ROUTES.COMPANY_REPORTS]: 'Rapports',
  [ROUTES.COMPANY_SETTINGS]: 'Paramètres',
  [ROUTES.COMPANY_PROFILE]: 'Profil',
  [ROUTES.COUNTER_DASHBOARD]: 'Tableau de bord',
  [ROUTES.COUNTER_SALE]: 'Vente',
  [ROUTES.COUNTER_BOOKINGS]: 'Réservations',
  [ROUTES.COUNTER_TICKETS]: 'Billets',
  [ROUTES.COUNTER_PROFILE]: 'Profil',
  [ROUTES.SUPER_ADMIN_DASHBOARD]: 'Tableau de bord',
  [ROUTES.SUPER_ADMIN_COMPANIES]: 'Compagnies',
  [ROUTES.SUPER_ADMIN_USERS]: 'Utilisateurs',
  [ROUTES.SUPER_ADMIN_ROLES]: 'Rôles',
  [ROUTES.SUPER_ADMIN_REPORTS]: 'Rapports',
  [ROUTES.SUPER_ADMIN_SETTINGS]: 'Paramètres',
  [ROUTES.BOOKING]: 'Réservation',
  [ROUTES.BOOKING_SEARCH]: 'Recherche',
  [ROUTES.BOOKING_TRIPS]: 'Trajets',
  [ROUTES.BOOKING_SEATS]: 'Sièges',
  [ROUTES.BOOKING_PASSENGER]: 'Passager',
  [ROUTES.BOOKING_PAYMENT]: 'Paiement',
  [ROUTES.BOOKING_CONFIRMATION]: 'Confirmation',
  [ROUTES.PROFILE]: 'Profil',
  [ROUTES.SETTINGS]: 'Paramètres',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.NOT_FOUND]: 'Page non trouvée',
  [ROUTES.UNAUTHORIZED]: 'Accès non autorisé',
  [ROUTES.SERVER_ERROR]: 'Erreur serveur',
};

export default ROUTES;
