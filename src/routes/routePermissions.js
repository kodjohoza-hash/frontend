import { ROUTES } from '@routes/routeConstants';
import { PERMISSIONS } from '@utils/permissions';

/**
 * BUS TIX CONNECT — Route-Permission Map
 * Maps each route to its required permissions and roles
 * Used by navigation builder to show/hide menu items
 */
export const ROUTE_PERMISSIONS = {
  /* Client */
  [ROUTES.CLIENT_DASHBOARD]: { roles: ['client'], permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  [ROUTES.CLIENT_BOOKINGS]: { roles: ['client'], permissions: [PERMISSIONS.BOOKINGS_VIEW] },
  [ROUTES.CLIENT_TICKETS]: { roles: ['client'], permissions: [PERMISSIONS.TICKETS_VIEW] },
  [ROUTES.CLIENT_PROFILE]: { roles: ['client'], permissions: [PERMISSIONS.PROFILE_VIEW] },
  [ROUTES.CLIENT_SETTINGS]: { roles: ['client'], permissions: [PERMISSIONS.SETTINGS_VIEW] },

  /* Company */
  [ROUTES.COMPANY_DASHBOARD]: { roles: ['company_admin'], permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  [ROUTES.COMPANY_ROUTES]: { roles: ['company_admin'], permissions: [PERMISSIONS.TRIPS_VIEW] },
  [ROUTES.COMPANY_BUSES]: { roles: ['company_admin'], permissions: [PERMISSIONS.BUSES_VIEW] },
  [ROUTES.COMPANY_DRIVERS]: { roles: ['company_admin'], permissions: [PERMISSIONS.DRIVERS_VIEW] },
  [ROUTES.COMPANY_BOOKINGS]: { roles: ['company_admin'], permissions: [PERMISSIONS.BOOKINGS_VIEW] },
  [ROUTES.COMPANY_COUNTERS]: { roles: ['company_admin'], permissions: [PERMISSIONS.COUNTERS_VIEW] },
  [ROUTES.COMPANY_REPORTS]: { roles: ['company_admin'], permissions: [PERMISSIONS.REPORTS_VIEW] },
  [ROUTES.COMPANY_SETTINGS]: { roles: ['company_admin'], permissions: [PERMISSIONS.SETTINGS_VIEW] },
  [ROUTES.COMPANY_PROFILE]: { roles: ['company_admin'], permissions: [PERMISSIONS.PROFILE_VIEW] },

  /* Counter */
  [ROUTES.COUNTER_DASHBOARD]: { roles: ['counter_agent'], permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  [ROUTES.COUNTER_SALE]: { roles: ['counter_agent'], permissions: [PERMISSIONS.BOOKINGS_CREATE] },
  [ROUTES.COUNTER_BOOKINGS]: { roles: ['counter_agent'], permissions: [PERMISSIONS.BOOKINGS_VIEW] },
  [ROUTES.COUNTER_TICKETS]: { roles: ['counter_agent'], permissions: [PERMISSIONS.TICKETS_VIEW] },
  [ROUTES.COUNTER_PROFILE]: { roles: ['counter_agent'], permissions: [PERMISSIONS.PROFILE_VIEW] },

  /* Super Admin */
  [ROUTES.SUPER_ADMIN_DASHBOARD]: { roles: ['super_admin'], permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  [ROUTES.SUPER_ADMIN_COMPANIES]: { roles: ['super_admin'], permissions: [PERMISSIONS.COMPANIES_VIEW] },
  [ROUTES.SUPER_ADMIN_USERS]: { roles: ['super_admin'], permissions: [PERMISSIONS.USERS_VIEW] },
  [ROUTES.SUPER_ADMIN_ROLES]: { roles: ['super_admin'], permissions: [PERMISSIONS.ROLES_VIEW] },
  [ROUTES.SUPER_ADMIN_REPORTS]: { roles: ['super_admin'], permissions: [PERMISSIONS.REPORTS_VIEW] },
  [ROUTES.SUPER_ADMIN_SETTINGS]: { roles: ['super_admin'], permissions: [PERMISSIONS.SETTINGS_VIEW] },
};

/**
 * Check if a user can see a menu item
 */
export const canSeeMenuItem = (userRole, userPermissions, menuItem) => {
  /* Super admin sees everything */
  if (userRole === 'super_admin') return true;

  const req = ROUTE_PERMISSIONS[menuItem.path];
  if (!req) return true;

  /* Check role */
  if (req.roles.length > 0 && !req.roles.includes(userRole)) return false;

  /* Check permissions */
  if (req.permissions.length > 0) {
    const hasAll = req.permissions.every((p) => userPermissions.includes(p));
    if (!hasAll) return false;
  }

  return true;
};

/**
 * Filter menu items based on user role and permissions
 * Also filters children within grouped items
 */
export const filterMenuItems = (items, userRole, userPermissions) => {
  return items
    .filter((item) => canSeeMenuItem(userRole, userPermissions, item))
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) =>
          canSeeMenuItem(userRole, userPermissions, child)
        );
        /* Don't show group if no children are visible */
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter(Boolean);
};

export default ROUTE_PERMISSIONS;
