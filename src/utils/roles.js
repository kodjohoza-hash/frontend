/**
 * BUS TIX CONNECT — Role Constants
 * Centralized role definitions for the entire application
 * NEVER use string literals — always import from this file
 */

export const ROLES = {
  CLIENT: 'client',
  COMPANY_ADMIN: 'company_admin',
  COUNTER_AGENT: 'counter_agent',
  SUPER_ADMIN: 'super_admin',
};

export const ROLE_LABELS = {
  [ROLES.CLIENT]: 'Client',
  [ROLES.COMPANY_ADMIN]: 'Administrateur de compagnie',
  [ROLES.COUNTER_AGENT]: 'Agent de guichet',
  [ROLES.SUPER_ADMIN]: 'Super Administrateur',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.CLIENT]: 'Réservation et gestion de billets',
  [ROLES.COMPANY_ADMIN]: 'Gestion complète d\'une compagnie de transport',
  [ROLES.COUNTER_AGENT]: 'Vente de billets en guichet',
  [ROLES.SUPER_ADMIN]: 'Administration complète de la plateforme',
};

export const ROLE_ICONS = {
  [ROLES.CLIENT]: 'bi-person',
  [ROLES.COMPANY_ADMIN]: 'bi-building',
  [ROLES.COUNTER_AGENT]: 'bi-shop',
  [ROLES.SUPER_ADMIN]: 'bi-shield-lock',
};

export const ROLE_BADGE_VARIANTS = {
  [ROLES.CLIENT]: 'info',
  [ROLES.COMPANY_ADMIN]: 'primary',
  [ROLES.COUNTER_AGENT]: 'warning',
  [ROLES.SUPER_ADMIN]: 'danger',
};

/**
 * Get the default dashboard path for a role
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
 * Get the layout component name for a role
 */
export const getRoleLayout = (role) => {
  const layouts = {
    [ROLES.CLIENT]: 'ClientLayout',
    [ROLES.COMPANY_ADMIN]: 'CompanyLayout',
    [ROLES.COUNTER_AGENT]: 'CounterLayout',
    [ROLES.SUPER_ADMIN]: 'SuperAdminLayout',
  };
  return layouts[role] || 'GuestLayout';
};

/**
 * All valid role values (for validation)
 */
export const VALID_ROLES = Object.values(ROLES);

/**
 * Check if a value is a valid role
 */
export const isValidRole = (role) => VALID_ROLES.includes(role);

export default ROLES;
