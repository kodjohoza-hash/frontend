/**
 * BUS TIX CONNECT — Roles & Permissions
 */

export const ROLES = {
  GUEST: 'guest',
  CLIENT: 'client',
  COMPANY: 'company',
  COUNTER: 'counter',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  [ROLES.GUEST]: 'Invité',
  [ROLES.CLIENT]: 'Client',
  [ROLES.COMPANY]: 'Compagnie',
  [ROLES.COUNTER]: 'Guichet',
  [ROLES.SUPER_ADMIN]: 'Super Administrateur',
};

export const PERMISSIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
  [ROLES.CLIENT]: [PERMISSIONS.READ],
  [ROLES.COUNTER]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE],
  [ROLES.COMPANY]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE],
  [ROLES.SUPER_ADMIN]: [PERMISSIONS.READ, PERMISSIONS.CREATE, PERMISSIONS.UPDATE, PERMISSIONS.DELETE, PERMISSIONS.ADMIN],
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
 * Get the default route for a given role
 */
export const getRoleDashboard = (role) => {
  const dashboards = {
    [ROLES.CLIENT]: '/client/dashboard',
    [ROLES.COMPANY]: '/company/dashboard',
    [ROLES.COUNTER]: '/counter/dashboard',
    [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
  };
  return dashboards[role] || '/';
};

export default ROLES;
