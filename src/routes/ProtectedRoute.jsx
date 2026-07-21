import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from './permissions';

/**
 * ProtectedRoute — Guard for authenticated routes
 * Redirects to login if not authenticated
 * Redirects to role dashboard if role is not allowed
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    const fallback = getRoleDashboard(user.role);
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
