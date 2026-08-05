const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { ticketController } = require('./controllers');
const {
  idSchema,
  listQuerySchema,
  statsQuerySchema,
  statusSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);
const ticketRoles = requireRole(ROLES.CLIENT, ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Billets électroniques — consultation, statuts, statistiques
 */

/* ── Toutes les routes exigent une session authentifiée ───────── */
router.use(authenticate);

/* ── Liste + statistiques (DOIT être déclaré avant /tickets/:id) ── */
router.get('/tickets', ticketRoles, validate(listQuerySchema, 'query'), ticketController.list);
router.get('/tickets/stats', ticketRoles, validate(statsQuerySchema, 'query'), ticketController.stats);

/* ── Détail + transitions de statut ──────────────────────────── */
router.get('/tickets/:id', ticketRoles, validate(idSchema, 'params'), ticketController.getById);
router.patch('/tickets/:id/status', ticketRoles, writeLimiter, validate(idSchema, 'params'), validate(statusSchema), ticketController.updateStatus);

module.exports = router;
