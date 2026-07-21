import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import { ROLES } from '@utils/roles';
import PublicRoute from './PublicRoute';
import RoleGuard from './RoleGuard';
import GuestLayout from '@layouts/GuestLayout';
import AuthLayout from '@layouts/AuthLayout';
import ClientLayout from '@layouts/ClientLayout';
import CompanyLayout from '@layouts/CompanyLayout';
import CounterLayout from '@layouts/CounterLayout';
import SuperAdminLayout from '@layouts/SuperAdminLayout';
import RouteLoader from './RouteLoader';

/* Auth Pages */
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@pages/Auth/ResetPassword'));
const VerifyEmail = lazy(() => import('@pages/Auth/VerifyEmail'));
const SessionExpired = lazy(() => import('@pages/Auth/SessionExpired'));

/* Guest Pages */
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const SearchResults = lazy(() => import('@pages/Booking/SearchResults'));
const SeatSelection = lazy(() => import('@pages/Booking/SeatSelection'));
const PaymentPage = lazy(() => import('@pages/Booking/PaymentPage'));
const ConfirmationPage = lazy(() => import('@pages/Booking/ConfirmationPage'));

/* Role Dashboards */
const ClientDashboard = lazy(() => import('@pages/Client/Dashboard'));
const CompanyDashboard = lazy(() => import('@pages/Company/Dashboard'));
const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));
const SuperAdminDashboard = lazy(() => import('@pages/SuperAdmin/Dashboard'));

/* Error Pages */
const NotFound = lazy(() => import('@pages/Errors/NotFound'));
const Unauthorized = lazy(() => import('@pages/Errors/Unauthorized'));
const ServerError = lazy(() => import('@pages/Errors/ServerError'));

const AppRouter = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* ================================================
            HOME — Landing page (standalone, no layout)
            ================================================ */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* ================================================
            GUEST — Public pages (GuestLayout: Navbar + Footer)
            ================================================ */}
        <Route element={<GuestLayout />}>
          <Route path={ROUTES.BOOKING} element={
            <div className="container py-5 text-center">
              <h1>Réservation</h1>
              <p className="text-muted">Page en cours de développement</p>
            </div>
          } />
          <Route path={ROUTES.BOOKING_SEARCH} element={<SearchResults />} />
          <Route path={ROUTES.BOOKING_SEATS} element={<SeatSelection />} />
          <Route path={ROUTES.BOOKING_PAYMENT} element={<PaymentPage />} />
          <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ConfirmationPage />} />
        </Route>

        {/* ================================================
            AUTH — Login, Register, etc. (AuthLayout: Split screen)
            Guest-only: redirects to dashboard if already authenticated
            ================================================ */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={
            <PublicRoute restricted><Login /></PublicRoute>
          } />
          <Route path={ROUTES.REGISTER} element={
            <PublicRoute restricted><Register /></PublicRoute>
          } />
          <Route path={ROUTES.FORGOT_PASSWORD} element={
            <PublicRoute restricted><ForgotPassword /></PublicRoute>
          } />
          <Route path={ROUTES.RESET_PASSWORD} element={
            <PublicRoute><ResetPassword /></PublicRoute>
          } />
          <Route path={ROUTES.VERIFY_EMAIL} element={
            <PublicRoute restricted><VerifyEmail /></PublicRoute>
          } />
          <Route path={ROUTES.SESSION_EXPIRED} element={
            <SessionExpired />
          } />
        </Route>

        {/* ================================================
            CLIENT — Espace client (RoleGuard + ClientLayout)
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.CLIENT]}>
            <ClientLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.CLIENT_DASHBOARD} element={<ClientDashboard />} />
        </Route>

        {/* ================================================
            COMPANY — Espace compagnie (RoleGuard + CompanyLayout)
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.COMPANY_ADMIN]}>
            <CompanyLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.COMPANY_DASHBOARD} element={<CompanyDashboard />} />
        </Route>

        {/* ================================================
            COUNTER — Espace guichet (RoleGuard + CounterLayout)
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.COUNTER_AGENT]}>
            <CounterLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.COUNTER_DASHBOARD} element={<CounterDashboard />} />
        </Route>

        {/* ================================================
            SUPER ADMIN — Administration (RoleGuard + SuperAdminLayout)
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>
            <SuperAdminLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.SUPER_ADMIN_DASHBOARD} element={<SuperAdminDashboard />} />
        </Route>

        {/* ================================================
            ERROR PAGES
            ================================================ */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
