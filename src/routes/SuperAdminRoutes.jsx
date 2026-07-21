import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

const SuperAdminDashboard = lazy(() => import('@pages/SuperAdmin/Dashboard'));

const SuperAdminRoutes = () => (
  <Route path="/super-admin">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      }
    />
  </Route>
);

export default SuperAdminRoutes;
