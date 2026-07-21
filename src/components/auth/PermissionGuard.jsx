import useAuth from '@hooks/useAuth';
import AccessDenied from './AccessDenied';

/**
 * PermissionGuard Component — UI-level permission gate
 * Renders children only if user has required permissions
 * Shows AccessDenied when permissions fail
 */
const PermissionGuard = ({ children, permissions = [], fallback = null }) => {
  const { isAuthenticated, permissions: userPermissions, isSuperAdmin } = useAuth();

  if (!isAuthenticated) return null;

  /* Super admin bypasses */
  if (isSuperAdmin()) return children;

  /* Check all required permissions */
  if (permissions.length > 0) {
    const hasAll = permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) return fallback || <AccessDenied />;
  }

  return children;
};

export default PermissionGuard;
