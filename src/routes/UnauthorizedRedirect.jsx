import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';

/**
 * UnauthorizedRedirect — Smart redirect for unauthorized access
 * If authenticated: redirect to role dashboard
 * If not authenticated: redirect to login
 */
const UnauthorizedRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const dashboard = user?.role ? getRoleDashboard(user.role) : '/';
  return <Navigate to={dashboard} replace />;
};

export default UnauthorizedRedirect;
