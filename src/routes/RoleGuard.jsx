import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from './permissions';

/**
 * RoleGuard — Guard for role-based routes
 * Checks both authentication and role authorization
 * Supports custom fallback
 */
const RoleGuard = ({ children, allowedRoles = [], fallback, redirectTo }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    const to = redirectTo || fallback || getRoleDashboard(user.role);
    return <Navigate to={to} replace />;
  }

  return children;
};

export default RoleGuard;
