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
const PassengerInfo = lazy(() => import('@pages/Booking/PassengerInfoPage'));
const PaymentPage = lazy(() => import('@pages/Booking/PaymentPage'));
const ConfirmationPage = lazy(() => import('@pages/Booking/ConfirmationPage'));

/* Placeholder Page */
const PlaceholderPage = lazy(() => import('@pages/Shared/PlaceholderPage'));

/* Client Pages */
const ClientDashboard = lazy(() => import('@pages/Client/Dashboard'));
const ClientBookings = lazy(() => import('@pages/Client/Bookings'));
const ClientTickets = lazy(() => import('@pages/Client/Tickets'));
const ClientProfile = lazy(() => import('@pages/Client/Profile'));
const ClientSettings = lazy(() => import('@pages/Client/Settings'));
const ClientNotifications = lazy(() => import('@pages/Client/Notifications'));
const ClientSupport = lazy(() => import('@pages/Client/Support'));
const ClientMessages = lazy(() => import('@pages/Client/Messages'));

/* Role Dashboards */
const AgencyDashboard = lazy(() => import('@pages/Agency/Dashboard'));
const AgencyTrips = lazy(() => import('@pages/Agency/Trips'));
const AgencyTripDetail = lazy(() => import('@pages/Agency/TripDetail'));
const AgencyBuses = lazy(() => import('@pages/Agency/Bus'));
const AgencyBusDetail = lazy(() => import('@pages/Agency/BusDetail'));
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
          <Route path={ROUTES.BOOKING_SEARCH} element={<SearchResults />} />
          <Route path={ROUTES.BOOKING_SEATS} element={<SeatSelection />} />
          <Route path={ROUTES.BOOKING_PASSENGER} element={<PassengerInfo />} />
          <Route path={ROUTES.BOOKING_PAYMENT} element={<PaymentPage />} />
          <Route path={ROUTES.BOOKING_CONFIRMATION} element={<ConfirmationPage />} />
          <Route path="/booking/trips/:id" element={<PlaceholderPage title="Détails du voyage" description="Consultez toutes les informations détaillées sur ce voyage." icon="bi-bus-front-fill" backTo={ROUTES.BOOKING_SEARCH} />} />
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
          <Route path={ROUTES.CLIENT_BOOKINGS} element={<ClientBookings />} />
          <Route path={ROUTES.CLIENT_TICKETS} element={<ClientTickets />} />
          <Route path={ROUTES.CLIENT_PROFILE} element={<ClientProfile />} />
          <Route path={ROUTES.CLIENT_SETTINGS} element={<ClientSettings />} />
          <Route path={ROUTES.CLIENT_SUPPORT} element={<ClientSupport />} />
          <Route path={ROUTES.CLIENT_MESSAGES} element={<ClientMessages />} />
        </Route>

        {/* ================================================
            COMPANY — Espace compagnie (RoleGuard + CompanyLayout)
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.COMPANY_ADMIN]}>
            <CompanyLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.COMPANY_DASHBOARD} element={<AgencyDashboard />} />
          <Route path={ROUTES.COMPANY_TRIPS} element={<AgencyTrips />} />
          <Route path={ROUTES.COMPANY_TRIP_DETAIL} element={<AgencyTripDetail />} />
          <Route path={ROUTES.COMPANY_ROUTES} element={<PlaceholderPage title="Trajets" description="Gérez les itinéraires et horaires de vos bus." icon="bi-signpost-2" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_BUSES} element={<AgencyBuses />} />
          <Route path={`${ROUTES.COMPANY_BUSES}/:id`} element={<AgencyBusDetail />} />
          <Route path={ROUTES.COMPANY_DRIVERS} element={<PlaceholderPage title="Chauffeurs" description="Gérez les chauffeurs assignés à vos bus." icon="bi-person-badge" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_BOOKINGS} element={<PlaceholderPage title="Réservations" description="Suivez et gérez les réservations de vos clients." icon="bi-ticket-perforated" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_COUNTERS} element={<PlaceholderPage title="Guichets" description="Gérez vos points de vente et agents de guichet." icon="bi-shop" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_REPORTS} element={<PlaceholderPage title="Rapports" description="Consultez les statistiques et rapports de votre compagnie." icon="bi-bar-chart-line" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_SETTINGS} element={<PlaceholderPage title="Paramètres" description="Configurez les options de votre compagnie." icon="bi-gear" backTo={ROUTES.COMPANY_DASHBOARD} />} />
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
          <Route path={ROUTES.COUNTER_SALE} element={<PlaceholderPage title="Vente" description="Vendez des billets directement depuis votre guichet." icon="bi-cart-plus" backTo={ROUTES.COUNTER_DASHBOARD} />} />
          <Route path={ROUTES.COUNTER_BOOKINGS} element={<PlaceholderPage title="Réservations" description="Consultez et gérez les réservations de votre guichet." icon="bi-ticket-perforated" backTo={ROUTES.COUNTER_DASHBOARD} />} />
          <Route path={ROUTES.COUNTER_TICKETS} element={<PlaceholderPage title="Billets" description="Imprimez et gérez les billets émis depuis votre guichet." icon="bi-postcard" backTo={ROUTES.COUNTER_DASHBOARD} />} />
          <Route path={ROUTES.COUNTER_PROFILE} element={<PlaceholderPage title="Mon profil" description="Gérez vos informations personnelles." icon="bi-person" backTo={ROUTES.COUNTER_DASHBOARD} />} />
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
          <Route path={ROUTES.SUPER_ADMIN_COMPANIES} element={<PlaceholderPage title="Compagnies" description="Gérez les compagnies de transport enregistrées." icon="bi-building" backTo={ROUTES.SUPER_ADMIN_DASHBOARD} />} />
          <Route path={ROUTES.SUPER_ADMIN_USERS} element={<PlaceholderPage title="Utilisateurs" description="Gérez les comptes utilisateurs de la plateforme." icon="bi-people" backTo={ROUTES.SUPER_ADMIN_DASHBOARD} />} />
          <Route path={ROUTES.SUPER_ADMIN_ROLES} element={<PlaceholderPage title="Rôles et permissions" description="Configurez les rôles et permissions du système." icon="bi-shield-lock" backTo={ROUTES.SUPER_ADMIN_DASHBOARD} />} />
          <Route path={ROUTES.SUPER_ADMIN_REPORTS} element={<PlaceholderPage title="Rapports" description="Consultez les statistiques globales de la plateforme." icon="bi-bar-chart-line" backTo={ROUTES.SUPER_ADMIN_DASHBOARD} />} />
          <Route path={ROUTES.SUPER_ADMIN_SETTINGS} element={<PlaceholderPage title="Paramètres" description="Configurez les paramètres globaux de la plateforme." icon="bi-gear" backTo={ROUTES.SUPER_ADMIN_DASHBOARD} />} />
        </Route>

        {/* ================================================
            SHARED ROUTES
            ================================================ */}
        <Route element={
          <RoleGuard allowedRoles={[ROLES.CLIENT, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT, ROLES.SUPER_ADMIN]}>
            <ClientLayout />
          </RoleGuard>
        }>
          <Route path={ROUTES.NOTIFICATIONS} element={<ClientNotifications />} />
          <Route path={ROUTES.PROFILE} element={<PlaceholderPage title="Mon profil" description="Gérez vos informations personnelles et préférences." icon="bi-person" backTo="/" />} />
          <Route path={ROUTES.SETTINGS} element={<PlaceholderPage title="Paramètres" description="Configurez vos options de sécurité et préférences." icon="bi-gear" backTo="/" />} />
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
