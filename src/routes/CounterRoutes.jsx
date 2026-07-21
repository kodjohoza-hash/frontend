import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

const CounterDashboard = lazy(() => import('@pages/Counter/Dashboard'));

const CounterRoutes = () => (
  <Route path="/counter">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={['counter']}>
          <CounterDashboard />
        </ProtectedRoute>
      }
    />
  </Route>
);

export default CounterRoutes;
