/**
 * BUS TIX CONNECT — Roles & Permissions
 * Centralized role definitions, permission maps, and route guards
 */

export const ROLES = {
  GUEST: 'guest',
  CLIENT: 'client',
  COMPANY_ADMIN: 'company_admin',
  COUNTER_AGENT: 'counter_agent',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  [ROLES.GUEST]: 'Invité',
  [ROLES.CLIENT]: 'Client',
  [ROLES.COMPANY_ADMIN]: 'Administrateur de compagnie',
  [ROLES.COUNTER_AGENT]: 'Agent de guichet',
  [ROLES.SUPER_ADMIN]: 'Super Administrateur',
};

export const PERMISSIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  BOOK: 'book',
  SELL: 'sell',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
  [ROLES.CLIENT]: [PERMISSIONS.READ, PERMISSIONS.BOOK],
  [ROLES.COUNTER_AGENT]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.SELL],
  [ROLES.COMPANY_ADMIN]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE, PERMISSIONS.MANAGE],
  [ROLES.SUPER_ADMIN]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE, PERMISSIONS.MANAGE, PERMISSIONS.ADMIN],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
};

/**
 * Check if a role has all required permissions
 */
export const hasAllPermissions = (role, requiredPermissions = []) => {
  return requiredPermissions.every((perm) => hasPermission(role, perm));
};

/**
 * Check if a role has at least one of the required permissions
 */
export const hasAnyPermission = (role, requiredPermissions = []) => {
  return requiredPermissions.some((perm) => hasPermission(role, perm));
};

/**
 * Get the default dashboard route for a given role
 */
export const getRoleDashboard = (role) => {
  const dashboards = {
    [ROLES.CLIENT]: '/client/dashboard',
    [ROLES.COMPANY_ADMIN]: '/company/dashboard',
    [ROLES.COUNTER_AGENT]: '/counter/dashboard',
    [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  };
  return dashboards[role] || '/';
};

/**
 * Route-level role guards
 * Maps route prefixes to allowed roles
 */
export const ROUTE_ROLES = {
  '/client': [ROLES.CLIENT],
  '/company': [ROLES.COMPANY_ADMIN],
  '/counter': [ROLES.COUNTER_AGENT],
  '/super-admin': [ROLES.SUPER_ADMIN],
};

/**
 * Get allowed roles for a given path
 */
export const getAllowedRolesForPath = (path) => {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLES)) {
    if (path.startsWith(prefix)) return roles;
  }
  return [];
};

export default ROLES;
