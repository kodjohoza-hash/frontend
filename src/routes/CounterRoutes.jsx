import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ROLES } from '@utils/roles';
import CounterLayout from '@layouts/CounterLayout';
import ProtectedRoute from './ProtectedRoute';
import RouteLoader from './RouteLoader';

const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));
const CounterSalePage = lazy(() => import('@pages/Counter/Sale'));
const CounterBookingPage = lazy(() => import('@pages/Counter/Bookings'));
const CounterCustomersPage = lazy(() => import('@pages/Counter/Customers'));
const CounterNotificationsPage = lazy(() => import('@pages/Counter/Notifications'));
const CounterMessagesPage = lazy(() => import('@pages/Counter/Messages'));
const CounterPaymentsPage = lazy(() => import('@pages/Counter/Payments'));
const CounterScannerPage = lazy(() => import('@pages/Counter/Scanner'));
const CounterProfilePage = lazy(() => import('@pages/Counter/Profile'));
const CounterSettingsPage = lazy(() => import('@pages/Counter/Settings'));

const wrapRoute = (Component) => (
  <Suspense fallback={<RouteLoader />}>
    <ProtectedRoute allowedRoles={[ROLES.COUNTER_AGENT]}>
      <Component />
    </ProtectedRoute>
  </Suspense>
);

const CounterRoutes = () => (
  <Route path="/counter">
    <Route element={<CounterLayout />}>
      <Route path="dashboard" element={wrapRoute(CounterDashboard)} />
      <Route path="sale" element={wrapRoute(CounterSalePage)} />
      <Route path="bookings" element={wrapRoute(CounterBookingPage)} />
      <Route path="customers" element={wrapRoute(CounterCustomersPage)} />
      <Route path="notifications" element={wrapRoute(CounterNotificationsPage)} />
      <Route path="messages" element={wrapRoute(CounterMessagesPage)} />
      <Route path="payments" element={wrapRoute(CounterPaymentsPage)} />
      <Route path="tickets" element={wrapRoute(CounterScannerPage)} />
      <Route path="profile" element={wrapRoute(CounterProfilePage)} />
      <Route path="settings" element={wrapRoute(CounterSettingsPage)} />
    </Route>
  </Route>
);

export default CounterRoutes;
