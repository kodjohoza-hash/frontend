import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import { ROLES } from '@utils/roles';
import ProtectedRoute from './ProtectedRoute';

const CompanyDashboard = lazy(() => import('@pages/Company/Dashboard'));

const CompanyRoutes = () => (
  <Route path="/company">
    <Route
      path="dashboard"
      element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY_ADMIN]}>
          <CompanyDashboard />
        </ProtectedRoute>
      }
    />
  </Route>
);

export default CompanyRoutes;
