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

/* Auth Pages — Role Selector */
const RoleSelector = lazy(() => import('@pages/Auth/RoleSelector'));

/* Auth Pages — Client (independent) */
const LoginClient = lazy(() => import('@pages/auth/client/LoginClient'));
const RegisterClient = lazy(() => import('@pages/auth/client/RegisterClient'));

/* Auth Pages — Company (independent) */
const LoginCompany = lazy(() => import('@pages/auth/company/LoginCompany'));
const RegisterCompany = lazy(() => import('@pages/auth/company/RegisterCompany'));

/* Auth Pages — Counter Agent (login only) */
const LoginCounter = lazy(() => import('@pages/auth/counter/LoginCounter'));

/* Auth Pages — Super Admin (login only) */
const LoginAdmin = lazy(() => import('@pages/auth/admin/LoginAdmin'));

/* Auth Pages — Shared */
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
const AgencyDrivers = lazy(() => import('@pages/Agency/Drivers'));
const AgencyDriverDetail = lazy(() => import('@pages/Agency/DriverDetail'));
const AgencyCounterAgents = lazy(() => import('@pages/Agency/CounterAgents'));
const AgencyCounterAgentDetail = lazy(() => import('@pages/Agency/CounterAgentDetail'));
const AgencyBranches = lazy(() => import('@pages/Agency/Branches'));
const AgencyBranchDetail = lazy(() => import('@pages/Agency/BranchDetail'));
const AgencyBookings = lazy(() => import('@pages/Agency/Bookings'));
const AgencyBookingDetail = lazy(() => import('@pages/Agency/BookingDetail'));
const AgencyPayments = lazy(() => import('@pages/Agency/Payments'));
const AgencyPaymentDetail = lazy(() => import('@pages/Agency/PaymentDetail'));
const AgencyReports = lazy(() => import('@pages/Agency/Reports'));
const AgencyClients = lazy(() => import('@pages/Agency/Clients'));
const AgencyClientDetail = lazy(() => import('@pages/Agency/ClientDetail'));
const AgencySettings = lazy(() => import('@pages/Agency/Settings'));
const AgencyProfile = lazy(() => import('@pages/Agency/Profile'));
const AgencyNotifications = lazy(() => import('@pages/Agency/Notifications'));
const AgencyMessages = lazy(() => import('@pages/Agency/Messages'));
const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));
const CounterSalePage = lazy(() => import('@pages/Counter/Sale'));
const CounterBookingPage = lazy(() => import('@pages/Counter/Bookings'));
const CounterScannerPage = lazy(() => import('@pages/Counter/Scanner'));
const CounterPaymentsPage = lazy(() => import('@pages/Counter/Payments'));
const CounterCustomersPage = lazy(() => import('@pages/Counter/Customers'));
const CounterNotificationsPage = lazy(() => import('@pages/Counter/Notifications'));
const CounterMessagesPage = lazy(() => import('@pages/Counter/Messages'));
const CounterProfilePage = lazy(() => import('@pages/Counter/Profile'));
const CounterSettingsPage = lazy(() => import('@pages/Counter/Settings'));
const SuperAdminDashboard = lazy(() => import('@pages/SuperAdmin/Dashboard'));
const SuperAdminCompanies = lazy(() => import('@pages/SuperAdmin/Companies'));
const SuperAdminUsers = lazy(() => import('@pages/SuperAdmin/Users'));

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
            AUTH — Role Selector + Independent Auth per Role
            ================================================ */}
        <Route element={<AuthLayout />}>
          {/* Role Selector */}
          <Route path={ROUTES.AUTH} element={
            <PublicRoute restricted><RoleSelector /></PublicRoute>
          } />

          {/* CLIENT — Independent Auth */}
          <Route path={ROUTES.AUTH_LOGIN_CLIENT} element={
            <PublicRoute restricted><LoginClient /></PublicRoute>
          } />
          <Route path={ROUTES.AUTH_REGISTER_CLIENT} element={
            <PublicRoute restricted><RegisterClient /></PublicRoute>
          } />

          {/* COMPANY — Independent Auth */}
          <Route path={ROUTES.AUTH_LOGIN_COMPANY} element={
            <PublicRoute restricted><LoginCompany /></PublicRoute>
          } />
          <Route path={ROUTES.AUTH_REGISTER_COMPANY} element={
            <PublicRoute restricted><RegisterCompany /></PublicRoute>
          } />

          {/* COUNTER — Login only */}
          <Route path={ROUTES.AUTH_LOGIN_COUNTER} element={
            <PublicRoute restricted><LoginCounter /></PublicRoute>
          } />

          {/* SUPER ADMIN — Login only */}
          <Route path={ROUTES.AUTH_LOGIN_SUPER_ADMIN} element={
            <PublicRoute restricted><LoginAdmin /></PublicRoute>
          } />

          {/* Legacy redirects */}
          <Route path={ROUTES.LOGIN} element={
            <PublicRoute restricted><RoleSelector /></PublicRoute>
          } />
          <Route path={ROUTES.REGISTER} element={
            <PublicRoute restricted><RoleSelector /></PublicRoute>
          } />

          {/* Shared auth pages */}
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
          <Route path={ROUTES.COMPANY_DRIVERS} element={<AgencyDrivers />} />
          <Route path={`${ROUTES.COMPANY_DRIVERS}/:id`} element={<AgencyDriverDetail />} />
          <Route path={ROUTES.COMPANY_BOOKINGS} element={<AgencyBookings />} />
          <Route path={`${ROUTES.COMPANY_BOOKINGS}/:id`} element={<AgencyBookingDetail />} />
          <Route path={ROUTES.COMPANY_PAYMENTS} element={<AgencyPayments />} />
          <Route path={`${ROUTES.COMPANY_PAYMENTS}/:id`} element={<AgencyPaymentDetail />} />
          <Route path={ROUTES.COMPANY_CLIENTS} element={<AgencyClients />} />
          <Route path={`${ROUTES.COMPANY_CLIENTS}/:id`} element={<AgencyClientDetail />} />
          <Route path={ROUTES.COMPANY_COUNTERS} element={<PlaceholderPage title="Guichets" description="Gérez vos points de vente et agents de guichet." icon="bi-shop" backTo={ROUTES.COMPANY_DASHBOARD} />} />
          <Route path={ROUTES.COMPANY_COUNTER_AGENTS} element={<AgencyCounterAgents />} />
          <Route path={`${ROUTES.COMPANY_COUNTER_AGENTS}/:id`} element={<AgencyCounterAgentDetail />} />
          <Route path={ROUTES.COMPANY_BRANCHES} element={<AgencyBranches />} />
          <Route path={`${ROUTES.COMPANY_BRANCHES}/:id`} element={<AgencyBranchDetail />} />
          <Route path={ROUTES.COMPANY_REPORTS} element={<AgencyReports />} />
          <Route path={ROUTES.COMPANY_SETTINGS} element={<AgencySettings />} />
          <Route path={ROUTES.COMPANY_PROFILE} element={<AgencyProfile />} />
          <Route path={ROUTES.COMPANY_NOTIFICATIONS} element={<AgencyNotifications />} />
          <Route path={ROUTES.COMPANY_MESSAGES} element={<AgencyMessages />} />
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
          <Route path={ROUTES.COUNTER_SALE} element={<CounterSalePage />} />
          <Route path={ROUTES.COUNTER_BOOKINGS} element={<CounterBookingPage />} />
          <Route path={ROUTES.COUNTER_CUSTOMERS} element={<CounterCustomersPage />} />
          <Route path={ROUTES.COUNTER_NOTIFICATIONS} element={<CounterNotificationsPage />} />
          <Route path={ROUTES.COUNTER_MESSAGES} element={<CounterMessagesPage />} />
          <Route path={ROUTES.COUNTER_PAYMENTS} element={<CounterPaymentsPage />} />
          <Route path={ROUTES.COUNTER_TICKETS} element={<CounterScannerPage />} />
          <Route path={ROUTES.COUNTER_PROFILE} element={<CounterProfilePage />} />
          <Route path={ROUTES.COUNTER_SETTINGS} element={<CounterSettingsPage />} />
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
          <Route path={ROUTES.SUPER_ADMIN_COMPANIES} element={<SuperAdminCompanies />} />
          <Route path={ROUTES.SUPER_ADMIN_USERS} element={<SuperAdminUsers />} />
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
