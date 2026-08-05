const express = require('express');
const router = express.Router();

const { authenticate, authOptional, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { bookingController } = require('./controllers');
const {
  idSchema,
  availabilityQuerySchema,
  statsQuerySchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  cancelSchema,
  paymentSchema,
  refundSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);
const bookingRoles = requireRole(ROLES.CLIENT, ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Gestion des réservations — CRUD, sièges, paiements, statistiques
 */

/* ── Disponibilité des sièges : consultable sans session (site public) ── */
router.get('/bookings/availability', authOptional, validate(availabilityQuerySchema, 'query'), bookingController.availability);

/* ── Toutes les autres routes exigent une session authentifiée ────────── */
router.use(authenticate);

/* ── Liste + statistiques ─────────────────────────────────────── */
router.get('/bookings', bookingRoles, validate(listQuerySchema, 'query'), bookingController.list);
router.get('/bookings/stats', bookingRoles, validate(statsQuerySchema, 'query'), bookingController.stats);

/* ── Création ─────────────────────────────────────────────────── */
router.post('/bookings', bookingRoles, writeLimiter, validate(createSchema), bookingController.create);

/* ── Détail / édition / transitions / paiements / suppression ── */
router.get('/bookings/:id', bookingRoles, validate(idSchema, 'params'), bookingController.getById);
router.patch('/bookings/:id', bookingRoles, validate(idSchema, 'params'), validate(updateSchema), bookingController.update);
router.patch('/bookings/:id/confirm', bookingRoles, validate(idSchema, 'params'), bookingController.confirm);
router.patch('/bookings/:id/cancel', bookingRoles, validate(idSchema, 'params'), validate(cancelSchema), bookingController.cancel);
router.post('/bookings/:id/payments', bookingRoles, writeLimiter, validate(idSchema, 'params'), validate(paymentSchema), bookingController.pay);
router.post('/bookings/:id/refund', bookingRoles, writeLimiter, validate(idSchema, 'params'), validate(refundSchema), bookingController.refund);
router.delete('/bookings/:id', bookingRoles, validate(idSchema, 'params'), bookingController.remove);

module.exports = router;
