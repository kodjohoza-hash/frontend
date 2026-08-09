/**
 * BUS TIX CONNECT — Development Mode
 *
 * When DEV_MODE = true:
 *   - All guards (RoleGuard, AuthGuard, ProtectedRoute, PublicRoute, PermissionGuard) are bypassed
 *   - All dashboards are accessible without authentication
 *   - A yellow banner is shown on all layouts
 *   - The /dev page is available with links to every interface
 *
 * To enable: set DEV_MODE = true
 */
export const DEV_MODE = false;

export const isDevMode = () => DEV_MODE;
