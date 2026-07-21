import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import PublicRoute from './PublicRoute';
import GuestLayout from '@layouts/GuestLayout';
import AuthLayout from '@layouts/AuthLayout';
import ClientLayout from '@layouts/ClientLayout';
import CompanyLayout from '@layouts/CompanyLayout';
import CounterLayout from '@layouts/CounterLayout';
import SuperAdminLayout from '@layouts/SuperAdminLayout';

/* Auth Pages */
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ForgotPassword = lazy(() => import('@pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@pages/Auth/ResetPassword'));

/* Guest Pages */
const HomePage = lazy(() => import('@pages/Home/HomePage'));
const Home = lazy(() => import('@pages/Home'));

/* Role Dashboards */
const ClientDashboard = lazy(() => import('@pages/Client/Dashboard'));
const CompanyDashboard = lazy(() => import('@pages/Company/Dashboard'));
const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));
const SuperAdminDashboard = lazy(() => import('@pages/SuperAdmin/Dashboard'));

/* Error Pages */
const NotFound = lazy(() => import('@pages/Errors/NotFound'));
const Unauthorized = lazy(() => import('@pages/Errors/Unauthorized'));
const ServerError = lazy(() => import('@pages/Errors/ServerError'));

/* Loading fallback */
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
    <div className="text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ================================================
            HOME — Landing page (its own navbar + footer)
            ================================================ */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* ================================================
            GUEST — Public pages (Navbar + Footer)
            ================================================ */}
        <Route element={<GuestLayout />}>
          <Route path="booking" element={
            <PublicRoute>
              <div className="container py-5 text-center">
                <h1>Réservation</h1>
                <p className="text-muted">Page en cours de développement</p>
              </div>
            </PublicRoute>
          } />
        </Route>

        {/* ================================================
            AUTH — Login, Register, etc. (Split layout)
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
        </Route>

        {/* ================================================
            CLIENT — Espace client (Sidebar + Navbar)
            ================================================ */}
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={
            <ClientDashboard />
          } />
        </Route>

        {/* ================================================
            COMPANY — Espace compagnie (Sidebar + Navbar)
            ================================================ */}
        <Route element={<CompanyLayout />}>
          <Route path="/company/dashboard" element={
            <CompanyDashboard />
          } />
        </Route>

        {/* ================================================
            COUNTER — Espace guichet (Sidebar + Navbar)
            ================================================ */}
        <Route element={<CounterLayout />}>
          <Route path="/counter/dashboard" element={
            <CounterDashboard />
          } />
        </Route>

        {/* ================================================
            SUPER ADMIN — Administration (Sidebar + Navbar)
            ================================================ */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/super-admin/dashboard" element={
            <SuperAdminDashboard />
          } />
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
