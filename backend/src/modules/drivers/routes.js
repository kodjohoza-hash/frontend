const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { driverController } = require('./controllers');
const { fileService } = require('./services');
const {
  idSchema,
  incidentIdSchema,
  documentIdSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  incidentCreateSchema,
  incidentUpdateSchema,
  tripSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);
const photoLimiter = rateLimit(10, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Gestion des chauffeurs — CRUD, statuts, disponibilité, voyages, affectations, incidents, documents, photos
 */

/* ── KPIs ─────────────────────────────────────────────────────── */
router.get('/drivers/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), driverController.stats);

/* ── Liste + création ─────────────────────────────────────────── */
router.get('/drivers', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), driverController.list);
router.post('/drivers', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(createSchema), driverController.create);

/* ── Détail / édition / statut / suppression (scope dans le service) ── */
router.get('/drivers/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.getById);
router.patch('/drivers/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(updateSchema), driverController.update);
router.patch('/drivers/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(statusSchema), driverController.updateStatus);
router.delete('/drivers/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.remove);

/* ── Disponibilité / voyages / affectations / voyage actif ────── */
router.get('/drivers/:id/availability', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.availability);
router.get('/drivers/:id/voyages', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.voyages);
router.get('/drivers/:id/affectations', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.affectations);
router.patch('/drivers/:id/trip', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(tripSchema), driverController.assignTrip);

/* ── Incidents ────────────────────────────────────────────────── */
router.get('/drivers/:id/incidents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.listIncidents);
router.post('/drivers/:id/incidents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), writeLimiter, validate(incidentCreateSchema), driverController.createIncident);
router.patch('/drivers/incidents/:incidentId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(incidentIdSchema, 'params'), validate(incidentUpdateSchema), driverController.updateIncident);
router.delete('/drivers/incidents/:incidentId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(incidentIdSchema, 'params'), driverController.deleteIncident);

/* ── Documents (upload champ `document`) ──────────────────────── */
router.get('/drivers/:id/documents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.listDocuments);
router.post('/drivers/:id/documents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), writeLimiter, fileService.uploadDocument, driverController.uploadDocument);
router.delete('/drivers/documents/:documentId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(documentIdSchema, 'params'), driverController.deleteDocument);

/* ── Photo (upload champ `photo`) ─────────────────────────────── */
router.post('/drivers/:id/photo', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), photoLimiter, fileService.uploadPhoto, driverController.uploadPhoto);
router.delete('/drivers/:id/photo', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), driverController.deletePhoto);

module.exports = router;
