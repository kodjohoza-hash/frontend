import useAuthStore from '@store/auth.store';
import usePermissions from './usePermissions';
import useRole from './useRole';
import useCan from './useCan';
import { getRoleDashboard, ROLES } from '@utils/roles';

/**
 * useAuthorization — Master authorization hook
 * Combines auth, role, permissions, and route access into a single API
 */
export const useAuthorization = () => {
  const store = useAuthStore();
  const permissionsHook = usePermissions();
  const roleHook = useRole();
  const canHook = useCan();

  return {
    /* Auth state */
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    token: store.token,
    loading: store.loading,

    /* Role */
    role: store.role,
    ...roleHook,

    /* Permissions */
    permissions: store.permissions,
    ...permissionsHook,

    /* Route access */
    ...canHook,

    /* Convenience */
    dashboard: getRoleDashboard(store.role),

    /** Get the user's display name */
    displayName: store.user
      ? `${store.user.firstName || ''} ${store.user.lastName || ''}`.trim() || store.user.email
      : '',

    /** Get the user's initials */
    initials: store.user
      ? `${(store.user.firstName || '')[0] || ''}${(store.user.lastName || '')[0] || ''}`.toUpperCase()
      : '',
  };
};

export default useAuthorization;
