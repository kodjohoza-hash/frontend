import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

const ClientDashboard = lazy(() => import('@pages/Client/Dashboard'));

const ClientRoutes = () => (
  <Route path="/client">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={['client']}>
          <ClientDashboard />
        </ProtectedRoute>
      }
    />
  </Route>
);

export default ClientRoutes;
