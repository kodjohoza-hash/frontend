/**
 * BUS TIX CONNECT — Development Mode
 *
 * When DEV_MODE = true:
 *   - All guards (RoleGuard, AuthGuard, ProtectedRoute, PublicRoute, PermissionGuard) are bypassed
 *   - All dashboards are accessible without authentication
 *   - A yellow banner is shown on all layouts
 *   - The /dev page is available with links to every interface
 *
 * To disable: set DEV_MODE = false
 * No other code changes needed.
 */

export const DEV_MODE = true;

export const DEV_USER = {
  id: 'DEV-001',
  firstName: 'Développement',
  lastName: 'Mode',
  email: 'dev@bus-tix-connect.com',
  phone: '+237 600 000 000',
  role: 'super_admin',
  permissions: ['*'],
  avatar: 'DM',
  status: 'online',
};

export const isDevMode = () => DEV_MODE;
