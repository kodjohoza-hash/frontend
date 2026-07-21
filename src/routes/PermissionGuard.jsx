import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import AccessDenied from '@components/auth/AccessDenied';

/**
 * PermissionGuard — Guard for permission-based routes
 * Checks if the user has ALL required permissions
 * Super admin bypasses all permission checks
 * Shows AccessDenied page (not redirect) when permissions fail
 */
const PermissionGuard = ({ children, permissions = [], fallback }) => {
  const { isAuthenticated, role, permissions: userPermissions, isSuperAdmin } = useAuth();
  const location = useLocation();

  /* Not authenticated → redirect to login */
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* Super admin bypasses permission checks */
  if (isSuperAdmin()) {
    return children;
  }

  /* Check if user has ALL required permissions */
  if (permissions.length > 0) {
    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) {
      if (fallback) return fallback;
      return <AccessDenied />;
    }
  }

  return children;
};

export default PermissionGuard;
