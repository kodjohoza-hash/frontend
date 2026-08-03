const ApiError = require('../utils/ApiError');

/**
 * Contrôle d'accès par rôle.
 * Usage : router.get('/', roleGuard('company_admin'), controller)
 */
const roleGuard = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentification requise.'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Accès refusé pour ce rôle.'));
  }
  next();
};

/**
 * Contrôle d'accès par permission (ex: bookings.view).
 * Usage : authorize('bookings.view')
 */
const authorize = (...permissions) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentification requise.'));
  const userPermissions = req.user.permissions || [];
  const hasAll = permissions.every((p) => userPermissions.includes(p));
  if (!hasAll) return next(new ApiError(403, 'Permission manquante.'));
  next();
};

/**
 * Aliases rétro-compatibles (ancien nommage).
 */
const requireRole = roleGuard;
const requirePermission = authorize;

/**
 * Super Admin uniquement.
 */
const requireSuperAdmin = roleGuard('super_admin');

/* ──────────────────────────────────────────────────────────────
   Guards nommés (module Users) — réutilisent authenticate.
   Usage : router.get('/', authenticate, isSuperAdmin, controller)
   ────────────────────────────────────────────────────────────── */
const isSuperAdmin = roleGuard('super_admin');
const isCompanyAdmin = roleGuard('company_admin');
const isCounterAgent = roleGuard('counter_agent');
const isClient = roleGuard('client');

module.exports = {
  requireRole,
  requirePermission,
  requireSuperAdmin,
  roleGuard,
  authorize,
  isSuperAdmin,
  isCompanyAdmin,
  isCounterAgent,
  isClient,
};
