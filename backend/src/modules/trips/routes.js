const express = require('express');
const router = express.Router();

const { authenticate, authOptional, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { tripController } = require('./controllers');
const {
  idSchema,
  listQuerySchema,
  tripCreateSchema,
  tripUpdateSchema,
  statusSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Gestion des voyages (instances d'itinéraire) — CRUD, statuts, recherche publique, KPIs
 */

/* ── Routes publiques (recherche de billets côté client, sans session) ──
   Déclarées avant /trips/:id pour éviter le masquage par le paramètre. */
router.get('/trips/available', validate(listQuerySchema, 'query'), tripController.searchPublic);
router.get('/trips/stats', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), tripController.stats);
router.get('/trips', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), validate(listQuerySchema, 'query'), tripController.list);

router.post('/trips', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), writeLimiter, validate(tripCreateSchema), tripController.create);

/* Détail : auth facultative — public si le voyage est réservable, sinon scope par rôle. */
router.get('/trips/:id', authOptional, validate(idSchema, 'params'), tripController.getById);

router.patch('/trips/:id', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), validate(idSchema, 'params'), validate(tripUpdateSchema), tripController.update);
router.patch('/trips/:id/status', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), validate(idSchema, 'params'), validate(statusSchema), tripController.updateStatus);
router.delete('/trips/:id', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT), validate(idSchema, 'params'), tripController.remove);

module.exports = router;
