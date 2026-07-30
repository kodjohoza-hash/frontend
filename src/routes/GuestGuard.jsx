import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import { DEV_MODE } from '@config/devMode';

/**
 * GuestGuard — Accessible only when user is NOT authenticated
 * Redirects to role dashboard if already logged in
 */
const GuestGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (DEV_MODE) return children;

  if (isAuthenticated) {
    const to = user?.role ? getRoleDashboard(user.role) : '/';
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
};

export default GuestGuard;
