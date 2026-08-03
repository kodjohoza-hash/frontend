const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { companyController } = require('./controllers');
const { logoService, documentService } = require('./services');
const {
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  documentQuerySchema,
  documentIdSchema,
  companyDocumentParamsSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestion des compagnies de transport (CRUD, profil, logo, documents, statuts, KPIs)
 */

/* ── KPIs (super admin & company admin) ──────────────────────── */
router.get('/companies/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), companyController.stats);

/* ── Profil de MA compagnie (company admin / counter agent) ──── */
router.get('/companies/profile', requireRole(ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), companyController.getProfile);
router.patch('/companies/profile', requireRole(ROLES.COMPANY_ADMIN), validate(updateSchema), companyController.updateProfile);
router.patch('/companies/profile/logo', requireRole(ROLES.COMPANY_ADMIN), logoService.uploadLogo, companyController.updateLogo);
router.delete('/companies/profile/logo', requireRole(ROLES.COMPANY_ADMIN), companyController.removeLogo);

/* ── Documents de MA compagnie ───────────────────────────────── */
router.get(
  '/companies/profile/documents',
  requireRole(ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT),
  validate(documentQuerySchema, 'query'),
  companyController.listMyDocuments
);
router.post(
  '/companies/profile/documents',
  requireRole(ROLES.COMPANY_ADMIN),
  writeLimiter,
  validate(documentQuerySchema),
  documentService.uploadDocument,
  companyController.uploadMyDocument
);
router.delete(
  '/companies/profile/documents/:documentId',
  requireRole(ROLES.COMPANY_ADMIN),
  validate(documentIdSchema, 'params'),
  companyController.removeMyDocument
);

/* ── Liste + création ────────────────────────────────────────── */
router.get('/companies', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), companyController.list);
router.post('/companies', requireRole(ROLES.SUPER_ADMIN), writeLimiter, validate(createSchema), companyController.create);

/* ── Détail / édition / statut / logo / documents / suppression (scope dans le service) ── */
router.get('/companies/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), companyController.getById);
router.patch('/companies/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(updateSchema), companyController.update);
router.patch('/companies/:id/status', requireRole(ROLES.SUPER_ADMIN), validate(idSchema, 'params'), validate(statusSchema), companyController.updateStatus);
router.patch('/companies/:id/logo', requireRole(ROLES.SUPER_ADMIN), validate(idSchema, 'params'), logoService.uploadLogo, companyController.updateCompanyLogo);
router.delete('/companies/:id/logo', requireRole(ROLES.SUPER_ADMIN), validate(idSchema, 'params'), companyController.removeCompanyLogo);
router.get('/companies/:id/documents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(documentQuerySchema, 'query'), companyController.listCompanyDocuments);
router.post('/companies/:id/documents', requireRole(ROLES.SUPER_ADMIN), validate(idSchema, 'params'), writeLimiter, validate(documentQuerySchema), documentService.uploadDocument, companyController.uploadCompanyDocument);
router.delete('/companies/:id/documents/:documentId', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(companyDocumentParamsSchema, 'params'), companyController.removeCompanyDocument);
router.delete('/companies/:id', requireRole(ROLES.SUPER_ADMIN), validate(idSchema, 'params'), companyController.remove);

module.exports = router;
