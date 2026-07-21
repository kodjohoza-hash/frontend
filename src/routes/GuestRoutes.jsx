import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from './routeConstants';
import PublicRoute from './PublicRoute';

const Home = lazy(() => import('@pages/Home'));

const GuestRoutes = () => (
  <Route path={ROUTES.HOME}>
    <Route index element={<Home />} />
    <Route
      path="booking"
      element={
        <PublicRoute>
          <div className="container py-5 text-center">
            <h1>Réservation</h1>
            <p className="text-muted">Page en cours de développement</p>
          </div>
        </PublicRoute>
      }
    />
  </Route>
);

export default GuestRoutes;
