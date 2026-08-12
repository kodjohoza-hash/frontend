const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares/auth');
const { requireSuperAdmin } = require('../../middlewares/rbac');
const validateZod = require('./middlewares/validateZod');
const validate = require('../../middlewares/validate');
const { auditQuerySchema } = require('./validators');
const { auditLogController, adminPaymentController } = require('./controllers');
const { listQuerySchema: paymentsListSchema, statsQuerySchema: paymentsStatsSchema } = require('../payments/validators');

/* Module ADMIN (Module 19) — administration Super Admin.
   Toutes les routes sont réservées au rôle super_admin : le journal d'audit
   et les paiements opérationnels globaux ne sont jamais exposés aux autres
   rôles, quelle que soit la requête. */
router.use(authenticate, requireSuperAdmin);

/* Journal d'audit */
router.get('/admin/audit-logs', validateZod(auditQuerySchema, 'query'), auditLogController.list);
router.get('/admin/audit-logs/stats', validateZod(auditQuerySchema, 'query'), auditLogController.stats);
router.get('/admin/audit-logs/:id', auditLogController.getById);

/* Paiements opérationnels globaux (billets/réservations) — toutes compagnies */
router.get('/admin/payments', validate(paymentsListSchema, 'query'), adminPaymentController.list);
router.get('/admin/payments/stats', validate(paymentsStatsSchema, 'query'), adminPaymentController.stats);

module.exports = router;
