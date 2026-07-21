import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import LoadingAuth from '@components/auth/LoadingAuth';

/**
 * RoleGuard — Guard for role-based routes
 * Checks both authentication and role authorization
 * Shows skeleton during loading, redirects to appropriate page on failure
 */
const RoleGuard = ({ children, allowedRoles = [], redirectTo }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  /* Show loading skeleton during initial auth check */
  if (loading && !isAuthenticated) {
    return <LoadingAuth />;
  }

  /* Not authenticated → redirect to login */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* Role check */
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    const to = redirectTo || getRoleDashboard(user.role);
    return <Navigate to={to} replace />;
  }

  return children;
};

export default RoleGuard;
