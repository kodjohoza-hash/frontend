import { lazy } from 'react';
import { ROLES } from '@utils/roles';
import { PERMISSIONS } from '@utils/permissions';

/**
 * BUS TIX CONNECT — Route Definitions
 * Centralized, metadata-rich route configuration
 * Each route: path, name, title, layout, roles, permissions, breadcrumb, component, meta
 */

/* ================================================
   LAZY COMPONENTS
   ================================================ */

/* Auth */
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@pages/Auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@pages/Auth/VerifyEmail'));
const SessionExpired = lazy(() => import('@pages/Auth/SessionExpired'));

/* Home */
const HomePage = lazy(() => import('@pages/Home/HomePage'));

/* Client */
const ClientDashboard = lazy(() => import('@pages/Client/Dashboard'));

/* Company */
const CompanyDashboard = lazy(() => import('@pages/Company/Dashboard'));

/* Counter */
const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));

/* Super Admin */
const SuperAdminDashboard = lazy(() => import('@pages/SuperAdmin/Dashboard'));

/* Errors */
const NotFound = lazy(() => import('@pages/Errors/NotFound'));
const Unauthorized = lazy(() => import('@pages/Errors/Unauthorized'));
const ServerError = lazy(() => import('@pages/Errors/ServerError'));

/* ================================================
   ROUTE DEFINITIONS
   ================================================ */

/**
 * Public routes (accessible without auth)
 */
export const PUBLIC_ROUTES = [
  {
    id: 'home',
    path: '/',
    name: 'Accueil',
    title: 'Bus Tix Connect — Réservation de billets de bus',
    component: HomePage,
    layout: null,
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil' }],
    meta: { isPublic: true, showNavbar: false },
  },
];

/**
 * Auth routes (guest-only — redirect if authenticated)
 */
export const AUTH_ROUTES = [
  {
    id: 'login',
    path: '/login',
    name: 'Connexion',
    title: 'Connexion — Bus Tix Connect',
    component: Login,
    layout: 'AuthLayout',
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Connexion' }],
    meta: { isPublic: true, isGuestOnly: true },
  },
  {
    id: 'register',
    path: '/register',
    name: 'Inscription',
    title: 'Inscription — Bus Tix Connect',
    component: Register,
    layout: 'AuthLayout',
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Inscription' }],
    meta: { isPublic: true, isGuestOnly: true },
  },
  {
    id: 'forgot-password',
    path: '/forgot-password',
    name: 'Mot de passe oublié',
    title: 'Mot de passe oublié — Bus Tix Connect',
    component: ForgotPassword,
    layout: 'AuthLayout',
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Mot de passe oublié' }],
    meta: { isPublic: true, isGuestOnly: true },
  },
  {
    id: 'reset-password',
    path: '/reset-password',
    name: 'Réinitialiser le mot de passe',
    title: 'Nouveau mot de passe — Bus Tix Connect',
    component: ResetPassword,
    layout: 'AuthLayout',
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Nouveau mot de passe' }],
    meta: { isPublic: true },
  },
  {
    id: 'verify-email',
    path: '/verify-email',
    name: 'Vérification de l\'email',
    title: 'Vérification — Bus Tix Connect',
    component: VerifyEmail,
    layout: 'AuthLayout',
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Vérification' }],
    meta: { isPublic: true, isGuestOnly: true },
  },
  {
    id: 'session-expired',
    path: '/session-expired',
    name: 'Session expirée',
    title: 'Session expirée — Bus Tix Connect',
    component: SessionExpired,
    layout: null,
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Session expirée' }],
    meta: { isPublic: true },
  },
];

/**
 * Client routes
 */
export const CLIENT_ROUTES = [
  {
    id: 'client-dashboard',
    path: '/client/dashboard',
    name: 'Tableau de bord',
    title: 'Mon espace — Bus Tix Connect',
    component: ClientDashboard,
    layout: 'ClientLayout',
    roles: [ROLES.CLIENT],
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Mon espace' }],
    meta: { icon: 'bi-grid-1x2' },
  },
];

/**
 * Company routes
 */
export const COMPANY_ROUTES = [
  {
    id: 'company-dashboard',
    path: '/company/dashboard',
    name: 'Tableau de bord',
    title: 'Espace compagnie — Bus Tix Connect',
    component: CompanyDashboard,
    layout: 'CompanyLayout',
    roles: [ROLES.COMPANY_ADMIN],
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Compagnie' }, { label: 'Tableau de bord' }],
    meta: { icon: 'bi-grid-1x2' },
  },
];

/**
 * Counter routes
 */
export const COUNTER_ROUTES = [
  {
    id: 'counter-dashboard',
    path: '/counter/dashboard',
    name: 'Tableau de bord',
    title: 'Espace guichet — Bus Tix Connect',
    component: CounterDashboard,
    layout: 'CounterLayout',
    roles: [ROLES.COUNTER_AGENT],
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Guichet' }, { label: 'Tableau de bord' }],
    meta: { icon: 'bi-grid-1x2' },
  },
];

/**
 * Super Admin routes
 */
export const SUPER_ADMIN_ROUTES = [
  {
    id: 'super-admin-dashboard',
    path: '/super-admin/dashboard',
    name: 'Tableau de bord',
    title: 'Administration — Bus Tix Connect',
    component: SuperAdminDashboard,
    layout: 'SuperAdminLayout',
    roles: [ROLES.SUPER_ADMIN],
    permissions: [PERMISSIONS.DASHBOARD_VIEW],
    breadcrumb: [{ label: 'Accueil', path: '/' }, { label: 'Admin' }, { label: 'Tableau de bord' }],
    meta: { icon: 'bi-grid-1x2' },
  },
];

/**
 * Error routes
 */
export const ERROR_ROUTES = [
  {
    id: 'not-found',
    path: '/404',
    name: 'Page non trouvée',
    title: '404 — Bus Tix Connect',
    component: NotFound,
    layout: null,
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Page non trouvée' }],
    meta: { isPublic: true },
  },
  {
    id: 'unauthorized',
    path: '/403',
    name: 'Accès non autorisé',
    title: '403 — Bus Tix Connect',
    component: Unauthorized,
    layout: null,
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Accès refusé' }],
    meta: { isPublic: true },
  },
  {
    id: 'server-error',
    path: '/500',
    name: 'Erreur serveur',
    title: '500 — Bus Tix Connect',
    component: ServerError,
    layout: null,
    roles: [],
    permissions: [],
    breadcrumb: [{ label: 'Erreur serveur' }],
    meta: { isPublic: true },
  },
];

/* ================================================
   AGGREGATED ROUTE MAPS
   ================================================ */

export const ALL_ROUTES = [
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...CLIENT_ROUTES,
  ...COMPANY_ROUTES,
  ...COUNTER_ROUTES,
  ...SUPER_ADMIN_ROUTES,
  ...ERROR_ROUTES,
];

/**
 * Lookup route by path
 */
export const getRouteByPath = (path) => {
  return ALL_ROUTES.find((route) => route.path === path) || null;
};

/**
 * Lookup route by id
 */
export const getRouteById = (id) => {
  return ALL_ROUTES.find((route) => route.id === id) || null;
};

/**
 * Get all routes for a specific role
 */
export const getRoutesByRole = (role) => {
  return ALL_ROUTES.filter((route) => route.roles.includes(role));
};

/**
 * Get breadcrumb for a path
 */
export const getBreadcrumbForPath = (path) => {
  const route = getRouteByPath(path);
  return route?.breadcrumb || [{ label: 'Accueil', path: '/' }, { label: path }];
};

export default ALL_ROUTES;
