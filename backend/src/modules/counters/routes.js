const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { counterController } = require('./controllers');
const {
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  assignSchema,
  transferSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Counters
 *   description: Gestion des guichets (points de vente internes) — CRUD, statuts, affectation d'agents, KPIs
 */

/* ── Dashboard agent de guichet (guichet courant) ──────────────── */
router.get('/guichets/mine', requireRole(ROLES.COUNTER_AGENT), counterController.getMine);

/* ── KPIs (super admin & company admin) ────────────────────────── */
router.get('/guichets/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), counterController.stats);

/* ── Liste + création ───────────────────────────────────────────── */
router.get('/guichets', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(listQuerySchema, 'query'), counterController.list);
router.post('/guichets', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), writeLimiter, validate(createSchema), counterController.create);

/* ── Affectation / retrait / transfert d'agents ─────────────────── */
router.patch('/guichets/:id/agents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(assignSchema), counterController.assignAgents);
router.delete('/guichets/:id/agents', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(assignSchema), counterController.removeAgents);
router.post('/guichets/:id/agents/transfer', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(transferSchema), counterController.transferAgents);

/* ── Détail / édition / statut / suppression (scope dans le service) ── */
router.get('/guichets/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), counterController.getById);
router.patch('/guichets/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(updateSchema), counterController.update);
router.patch('/guichets/:id/status', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), validate(statusSchema), counterController.updateStatus);
router.delete('/guichets/:id', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), validate(idSchema, 'params'), counterController.remove);

module.exports = router;
