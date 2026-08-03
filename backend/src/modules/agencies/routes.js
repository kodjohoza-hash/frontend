const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { agencyController } = require('./controllers');
const {
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Agencies
 *   description: Gestion des agences (points de vente) — CRUD, statuts, GPS, KPIs
 */

/* ── KPIs / villes / agences proches (super admin & company admin) ── */
router.get('/agencies/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), agencyController.stats);
router.get('/agencies/villes', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), agencyController.listVilles);
router.get('/agencies/nearby', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), agencyController.nearby);

/* ── Liste + création ────────────────────────────────────────────── */
router.get('/agencies', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), agencyController.list);
router.post('/agencies', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(createSchema), agencyController.create);

/* ── Détail / édition / statut / suppression (scope dans le service) ── */
router.get('/agencies/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), agencyController.getById);
router.patch('/agencies/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(updateSchema), agencyController.update);
router.patch('/agencies/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(statusSchema), agencyController.updateStatus);
router.delete('/agencies/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), agencyController.remove);

module.exports = router;
