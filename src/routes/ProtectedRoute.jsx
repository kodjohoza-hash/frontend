import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import LoadingAuth from '@components/auth/LoadingAuth';
import { DEV_MODE } from '@config/devMode';

/**
 * ProtectedRoute — Guard for authenticated routes
 * Redirects to /login if not authenticated
 * Redirects to role dashboard if role is not allowed
 * Shows skeleton while profile is loading
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (DEV_MODE) return children;

  /* Show loading skeleton during initial auth check */
  if (loading && !isAuthenticated) {
    return <LoadingAuth />;
  }

  /* Not authenticated → redirect to login with return path */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* Role check — if allowedRoles specified, verify user role */
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    const fallback = redirectTo || getRoleDashboard(user.role);
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
