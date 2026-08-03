const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { busController } = require('./controllers');
const { busPhotoService } = require('./services');
const {
  idSchema,
  maintenanceIdSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  seatLayoutSchema,
  maintenanceCreateSchema,
  maintenanceUpdateSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Buses
 *   description: Gestion de la flotte de bus — CRUD, statuts, plan de sièges, maintenances, photos
 */

/* ── KPIs ─────────────────────────────────────────────────────── */
router.get('/buses/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), busController.stats);

/* ── Liste + création ─────────────────────────────────────────── */
router.get('/buses', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), busController.list);
router.post('/buses', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(createSchema), busController.create);

/* ── Détail / édition / statut / suppression (scope dans le service) ── */
router.get('/buses/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busController.getById);
router.patch('/buses/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(updateSchema), busController.update);
router.patch('/buses/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(statusSchema), busController.updateStatus);
router.delete('/buses/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busController.remove);

/* ── Plan de sièges ───────────────────────────────────────────── */
router.get('/buses/:id/seat-layout', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busController.getSeatLayout);
router.put('/buses/:id/seat-layout', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(seatLayoutSchema), busController.saveSeatLayout);

/* ── Photos ───────────────────────────────────────────────────── */
router.post('/buses/:id/photo', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busPhotoService.uploadPhoto, busController.uploadPhoto);
router.delete('/buses/:id/photo', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busController.deletePhoto);

/* ── Maintenances ─────────────────────────────────────────────── */
router.get('/buses/:id/maintenance', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), busController.listMaintenances);
router.post('/buses/:id/maintenance', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(maintenanceCreateSchema), busController.createMaintenance);
router.patch('/buses/maintenance/:maintenanceId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(maintenanceIdSchema, 'params'), validate(maintenanceUpdateSchema), busController.updateMaintenance);
router.delete('/buses/maintenance/:maintenanceId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(maintenanceIdSchema, 'params'), busController.deleteMaintenance);

module.exports = router;
