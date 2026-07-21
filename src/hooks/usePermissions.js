import useAuthStore from '@store/auth.store';
import { useCallback } from 'react';
import { hasAllPermissions, hasAnyPermission } from '@utils/permissions';

/**
 * usePermissions — Hook for checking user permissions
 */
export const usePermissions = () => {
  const permissions = useAuthStore((s) => s.permissions);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const check = useCallback(
    (permission) => permissions.includes(permission),
    [permissions]
  );

  const checkAll = useCallback(
    (required) => hasAllPermissions(permissions, required),
    [permissions]
  );

  const checkAny = useCallback(
    (required) => hasAnyPermission(permissions, required),
    [permissions]
  );

  return {
    permissions,
    hasPermission: check,
    hasAllPermissions: checkAll,
    hasAnyPermission: checkAny,
    count: permissions.length,
  };
};

export default usePermissions;
