import useAuthStore from '@store/auth.store';
import { useCallback } from 'react';
import { ROLES } from '@utils/roles';

/**
 * useRole — Hook for checking user role
 */
export const useRole = () => {
  const role = useAuthStore((s) => s.role);
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasAnyRole = useAuthStore((s) => s.hasAnyRole);

  const is = useCallback(
    (targetRole) => role === targetRole,
    [role]
  );

  const isOneOf = useCallback(
    (roles) => roles.includes(role),
    [role]
  );

  return {
    role,
    is,
    isOneOf,
    isSuperAdmin: role === ROLES.SUPER_ADMIN,
    isClient: role === ROLES.CLIENT,
    isCompanyAdmin: role === ROLES.COMPANY_ADMIN,
    isCounterAgent: role === ROLES.COUNTER_AGENT,
    hasRole,
    hasAnyRole,
  };
};

export default useRole;
