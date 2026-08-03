const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { routeController } = require('./controllers');
const {
  idSchema,
  villeIdSchema,
  stopIdSchema,
  listQuerySchema,
  routeCreateSchema,
  routeUpdateSchema,
  statusSchema,
  calculsQuerySchema,
  villeCreateSchema,
  villeUpdateSchema,
  stopCreateSchema,
  stopUpdateSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Gestion des itinéraires — CRUD, escales, calculs, villes, KPIs
 */

/* ── KPIs + Villes (DOIT être déclaré avant /routes/:id) ──────── */
router.get('/routes/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), routeController.stats);

router.get('/routes/villes', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), routeController.listVilles);
router.post('/routes/villes', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(villeCreateSchema), routeController.createVille);
router.get('/routes/villes/:villeId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(villeIdSchema, 'params'), routeController.getVille);
router.patch('/routes/villes/:villeId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(villeIdSchema, 'params'), validate(villeUpdateSchema), routeController.updateVille);
router.delete('/routes/villes/:villeId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(villeIdSchema, 'params'), routeController.removeVille);

/* ── Liste + création ─────────────────────────────────────────── */
router.get('/routes', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), routeController.list);
router.post('/routes', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(routeCreateSchema), routeController.create);

/* ── Détail / édition / statut / suppression (scope dans le service) ── */
router.get('/routes/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), routeController.getById);
router.get('/routes/:id/calculs', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(calculsQuerySchema, 'query'), routeController.calculs);
router.patch('/routes/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(routeUpdateSchema), routeController.update);
router.patch('/routes/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(statusSchema), routeController.updateStatus);
router.delete('/routes/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), routeController.remove);

/* ── Escales ──────────────────────────────────────────────────── */
router.get('/routes/:id/stops', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), routeController.listStops);
router.post('/routes/:id/stops', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), writeLimiter, validate(stopCreateSchema), routeController.addStop);
router.patch('/routes/:id/stops/:stopId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(stopIdSchema, 'params'), validate(stopUpdateSchema), routeController.updateStop);
router.delete('/routes/:id/stops/:stopId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(stopIdSchema, 'params'), routeController.removeStop);

module.exports = router;
