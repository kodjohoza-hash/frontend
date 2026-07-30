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
     AUTH — Multi-role entry
     ================================================ */
  AUTH: '/auth',
  AUTH_LOGIN_CLIENT: '/auth/login/client',
  AUTH_LOGIN_COMPANY: '/auth/login/company',
  AUTH_LOGIN_COUNTER: '/auth/login/counter',
  AUTH_LOGIN_SUPER_ADMIN: '/auth/login/super-admin',
  AUTH_REGISTER_CLIENT: '/auth/register/client',
  AUTH_REGISTER_COMPANY: '/auth/register/company',

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
  COMPANY_DASHBOARD: '/agency/dashboard',
  COMPANY_ROUTES: '/agency/routes',
  COMPANY_TRIPS: '/agency/trips',
  COMPANY_TRIP_DETAIL: '/agency/trips/:id',
  COMPANY_BUSES: '/agency/buses',
  COMPANY_DRIVERS: '/agency/drivers',
  COMPANY_BOOKINGS: '/agency/bookings',
  COMPANY_PAYMENTS: '/agency/payments',
  COMPANY_CLIENTS: '/agency/clients',
  COMPANY_COUNTERS: '/agency/counters',
  COMPANY_BRANCHES: '/agency/branches',
  COMPANY_BRANCH_DETAIL: '/agency/branches/:id',
  COMPANY_COUNTER_AGENTS: '/agency/counter-agents',
  COMPANY_COUNTER_AGENT_DETAIL: '/agency/counter-agents/:id',
  COMPANY_REPORTS: '/agency/reports',
  COMPANY_SETTINGS: '/agency/settings',
  COMPANY_PROFILE: '/agency/profile',
  COMPANY_NOTIFICATIONS: '/agency/notifications',
  COMPANY_MESSAGES: '/agency/messages',

  /* ================================================
     COUNTER
     ================================================ */
  COUNTER_DASHBOARD: '/counter/dashboard',
  COUNTER_SALE: '/counter/sale',
  COUNTER_BOOKINGS: '/counter/bookings',
  COUNTER_CUSTOMERS: '/counter/customers',
  COUNTER_NOTIFICATIONS: '/counter/notifications',
  COUNTER_MESSAGES: '/counter/messages',
  COUNTER_PAYMENTS: '/counter/payments',
  COUNTER_TICKETS: '/counter/tickets',
  COUNTER_PROFILE: '/counter/profile',
  COUNTER_SETTINGS: '/counter/settings',
 
  /* ================================================
     SUPER ADMIN
     ================================================ */
  SUPER_ADMIN_DASHBOARD: '/super-admin/dashboard',
  SUPER_ADMIN_COMPANIES: '/super-admin/companies',
  SUPER_ADMIN_USERS: '/super-admin/users',
  SUPER_ADMIN_ROLES: '/super-admin/roles',
  SUPER_ADMIN_APPROVAL: '/super-admin/approval',
  SUPER_ADMIN_SUBSCRIPTIONS: '/super-admin/subscriptions',
  SUPER_ADMIN_COMMISSIONS: '/super-admin/commissions',
  SUPER_ADMIN_REPORTS: '/super-admin/reports',
  SUPER_ADMIN_AUDIT: '/super-admin/audit',
  SUPER_ADMIN_SETTINGS: '/super-admin/settings',
  SUPER_ADMIN_NOTIFICATIONS: '/super-admin/notifications',

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
  [ROUTES.COMPANY_TRIPS]: 'Voyages',
  [ROUTES.COMPANY_TRIP_DETAIL]: 'Détail du voyage',
  [ROUTES.COMPANY_BUSES]: 'Bus',
  [ROUTES.COMPANY_DRIVERS]: 'Chauffeurs',
  [ROUTES.COMPANY_BOOKINGS]: 'Réservations',
  [ROUTES.COMPANY_PAYMENTS]: 'Paiements',
  [ROUTES.COMPANY_CLIENTS]: 'Clients',
  [ROUTES.COMPANY_COUNTERS]: 'Guichets',
  [ROUTES.COMPANY_COUNTER_AGENTS]: 'Agents de guichet',
  [ROUTES.COMPANY_COUNTER_AGENT_DETAIL]: 'Détail agent',
  [ROUTES.COMPANY_BRANCHES]: 'Points de vente',
  [ROUTES.COMPANY_BRANCH_DETAIL]: 'Détail point de vente',
  [ROUTES.COMPANY_REPORTS]: 'Rapports',
  [ROUTES.COMPANY_SETTINGS]: 'Paramètres',
  [ROUTES.COMPANY_PROFILE]: 'Profil',
  [ROUTES.COMPANY_NOTIFICATIONS]: 'Notifications',
  [ROUTES.COMPANY_MESSAGES]: 'Messagerie',
  [ROUTES.COUNTER_DASHBOARD]: 'Tableau de bord',
  [ROUTES.COUNTER_SALE]: 'Vente',
  [ROUTES.COUNTER_BOOKINGS]: 'Réservations',
  [ROUTES.COUNTER_PAYMENTS]: 'Paiements',
  [ROUTES.COUNTER_CUSTOMERS]: 'Clients',
  [ROUTES.COUNTER_NOTIFICATIONS]: 'Notifications',
  [ROUTES.COUNTER_MESSAGES]: 'Messagerie',
  [ROUTES.COUNTER_TICKETS]: 'Billets',
  [ROUTES.COUNTER_PROFILE]: 'Profil',
  [ROUTES.COUNTER_SETTINGS]: 'Paramètres',
  [ROUTES.SUPER_ADMIN_DASHBOARD]: 'Tableau de bord',
  [ROUTES.SUPER_ADMIN_COMPANIES]: 'Compagnies',
  [ROUTES.SUPER_ADMIN_USERS]: 'Utilisateurs',
  [ROUTES.SUPER_ADMIN_ROLES]: 'Rôles',
  [ROUTES.SUPER_ADMIN_APPROVAL]: 'Approbations',
  [ROUTES.SUPER_ADMIN_SUBSCRIPTIONS]: 'Abonnements',
  [ROUTES.SUPER_ADMIN_COMMISSIONS]: 'Commissions',
  [ROUTES.SUPER_ADMIN_REPORTS]: 'Rapports',
  [ROUTES.SUPER_ADMIN_AUDIT]: 'Audit',
  [ROUTES.SUPER_ADMIN_SETTINGS]: 'Paramètres',
  [ROUTES.SUPER_ADMIN_NOTIFICATIONS]: 'Notifications',
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
