import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import ProtectedRoute from './ProtectedRoute';

const CompanyDashboard = lazy(() => import('@pages/Company/Dashboard'));

const CompanyRoutes = () => (
  <Route path="/company">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={['company']}>
          <CompanyDashboard />
        </ProtectedRoute>
      }
    />
  </Route>
);

export default CompanyRoutes;
