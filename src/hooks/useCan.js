import useAuthStore from '@store/auth.store';
import { useCallback } from 'react';
import { ROLES } from '@utils/roles';

/**
 * useCan — High-level authorization hook
 * Combines role + permission checks into a single API
 */
export const useCan = () => {
  const canAccess = useAuthStore((s) => s.canAccess);
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  /**
   * Check if the current user can access a specific resource
   * @param {{ roles?: string[], permissions?: string[] }} requirements
   * @returns {boolean}
   */
  const can = useCallback(
    (requirements) => {
      if (!isAuthenticated) return false;
      return canAccess(requirements);
    },
    [isAuthenticated, canAccess]
  );

  /**
   * Check if the user can access a route definition
   * @param {{ roles?: string[], permissions?: string[] }} route
   */
  const canAccessRoute = useCallback(
    (route) => {
      if (!isAuthenticated) return false;
      if (route.meta?.isPublic) return true;
      return canAccess({
        roles: route.roles || [],
        permissions: route.permissions || [],
      });
    },
    [isAuthenticated, canAccess]
  );

  /**
   * Super admin bypass check
   */
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  return {
    can,
    canAccess,
    canAccessRoute,
    isSuperAdmin,
    isAuthenticated,
  };
};

export default useCan;
