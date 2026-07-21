import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from './permissions';

/**
 * PublicRoute — Guard for public routes (login, register, etc.)
 * When restricted=true, redirects authenticated users to their dashboard
 */
const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isAuthenticated && restricted) {
    const to = user?.role ? getRoleDashboard(user.role) : '/';
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute;
