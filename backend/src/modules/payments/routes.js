const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { paymentController } = require('./controllers');
const {
  idSchema,
  listQuerySchema,
  statsQuerySchema,
  cancelSchema,
  failSchema,
  refundSchema,
  createPaymentSchema,
  updatePaymentSchema,
} = require('./validators');

const writeLimiter = rateLimit(100, 15 * 60 * 1000);
const paymentRoles = requireRole(ROLES.CLIENT, ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN);
/* POST /payments : le super_admin est délégué au module SaaS Subscriptions
   (paiements d'abonnement) — voir le middleware de délégation ci-dessous. */
const createPaymentRoles = requireRole(ROLES.CLIENT, ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements — consultation, statuts, remboursements, statistiques
 */

/* ── Toutes les routes exigent une session authentifiée ───────── */
router.use(authenticate);

/* GET /payments (liste) + POST /payments (création) : le super_admin reste
   géré par le module SaaS Subscriptions (paiements d'abonnement). On saute
   tout le module via next('router') AVANT toute validation, afin de ne pas
   altérer req.query / req.body. Les autres rôles (client, guichet, compagnie)
   obtiennent ici les paiements opérationnels. /payments/stats,
   /payments/statistics et /payments/:id restent gérés par ce module pour tous
   les rôles, super_admin inclus. */
router.use('/payments', (req, _res, next) => {
  if (
    (req.method === 'GET' || req.method === 'POST') &&
    req.path === '/' &&
    req.user?.role === ROLES.SUPER_ADMIN
  ) {
    return next('router');
  }
  return next();
});

/* ── Liste + statistiques ─────────────────────────────────────── */
router.get('/payments', paymentRoles, validate(listQuerySchema, 'query'), paymentController.list);
router.get('/payments/stats', paymentRoles, validate(statsQuerySchema, 'query'), paymentController.stats);
router.get('/payments/statistics', paymentRoles, validate(statsQuerySchema, 'query'), paymentController.statistics);

/* ── Création / mise à jour (grand livre) ─────────────────────── */
router.post('/payments', createPaymentRoles, writeLimiter, validate(createPaymentSchema), paymentController.create);
router.patch('/payments/:id', paymentRoles, writeLimiter, validate(idSchema, 'params'), validate(updatePaymentSchema), paymentController.update);

/* ── Détail / reçu ────────────────────────────────────────────── */
router.get('/payments/:id', paymentRoles, validate(idSchema, 'params'), paymentController.getById);
router.get('/payments/:id/receipt', paymentRoles, validate(idSchema, 'params'), paymentController.receipt);

/* ── Transitions de statut + remboursement ────────────────────── */
router.post('/payments/:id/confirm', paymentRoles, writeLimiter, validate(idSchema, 'params'), paymentController.confirm);
router.post('/payments/:id/cancel', paymentRoles, writeLimiter, validate(idSchema, 'params'), validate(cancelSchema), paymentController.cancel);
router.post('/payments/:id/fail', paymentRoles, writeLimiter, validate(idSchema, 'params'), validate(failSchema), paymentController.fail);
router.post('/payments/:id/refund', paymentRoles, writeLimiter, validate(idSchema, 'params'), validate(refundSchema), paymentController.refund);

module.exports = router;
