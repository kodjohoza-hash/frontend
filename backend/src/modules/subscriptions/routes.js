const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validateZod = require('./middlewares/validateZod');

const { planController, subscriptionController, paymentController, notificationController, revenueController } = require('./controllers');
const {
  planCreateSchema,
  planUpdateSchema,
  subscriptionCreateSchema,
  subscriptionRenewSchema,
  subscriptionSuspendSchema,
  subscriptionFilterSchema,
} = require('./validators');
const { idParamSchema } = require('./validators/common.validator');
const { paymentCreateSchema } = require('./validators/payment.validator');

/* Toutes les routes du module exigent un utilisateur authentifié. */
router.use(authenticate);

/* ── Plans (lecture : tous rôles authentifiés ; écriture : super_admin) ── */
router.get('/plans', planController.list);
router.get('/plans/:id', validateZod(idParamSchema, 'params'), planController.getById);
router.post('/plans', requireRole(ROLES.SUPER_ADMIN), validateZod(planCreateSchema), planController.create);
router.patch('/plans/:id', requireRole(ROLES.SUPER_ADMIN), validateZod(idParamSchema, 'params'), validateZod(planUpdateSchema), planController.update);
router.delete('/plans/:id', requireRole(ROLES.SUPER_ADMIN), validateZod(idParamSchema, 'params'), planController.remove);

/* ── Abonnements compagnie ── */
router.get(
  '/subscriptions',
  requireRole(ROLES.SUPER_ADMIN),
  validateZod(subscriptionFilterSchema, 'query'),
  subscriptionController.list
);
router.get(
  '/subscriptions/mine',
  requireRole(ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT),
  subscriptionController.mine
);
router.get('/subscriptions/:id', requireRole(ROLES.SUPER_ADMIN), validateZod(idParamSchema, 'params'), subscriptionController.getById);
router.post('/subscriptions', requireRole(ROLES.SUPER_ADMIN), validateZod(subscriptionCreateSchema), subscriptionController.create);
router.post(
  '/subscriptions/:compagnieId/renew',
  requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN),
  validateZod(subscriptionRenewSchema),
  subscriptionController.renew
);
router.post(
  '/subscriptions/:compagnieId/suspend',
  requireRole(ROLES.SUPER_ADMIN),
  validateZod(subscriptionSuspendSchema),
  subscriptionController.suspend
);
router.post('/subscriptions/:compagnieId/reactivate', requireRole(ROLES.SUPER_ADMIN), subscriptionController.reactivate);

/* ── Paiements abonnements ── */
router.get('/payments', requireRole(ROLES.SUPER_ADMIN), paymentController.list);
router.get('/payments/revenue/by-company', requireRole(ROLES.SUPER_ADMIN), paymentController.byCompany);
router.post('/payments', requireRole(ROLES.SUPER_ADMIN), validateZod(paymentCreateSchema), paymentController.record);

/* ── Notifications abonnements ── */
/* Précédées de /abonnements pour ne pas entrer en collision avec le module
   centralisé Notifications (GET /api/v1/notifications, par utilisateur). */
router.get('/abonnements/notifications', requireRole(ROLES.SUPER_ADMIN), notificationController.listAll);
router.get('/abonnements/notifications/mine', requireRole(ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), notificationController.mine);

/* ── Revenus (dashboard financier Super Admin) ── */
router.get('/revenue', requireRole(ROLES.SUPER_ADMIN), revenueController.dashboard);

module.exports = router;
