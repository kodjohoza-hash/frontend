const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares/auth');
const { requireRole, requireSuperAdmin } = require('../../middlewares/rbac');
const { ROLES } = require('../../middlewares/auth');
const validateZod = require('./middlewares/validateZod');
const { statisticsQuerySchema } = require('./validators');
const { statisticsController } = require('./controllers');

/* Le périmètre est TOUJOURS déduit du token (req.user) côté service :
   aucun compagnieId/user_id envoyé par le frontend n'est accepté hors
   des cas explicitement ouverts ci-dessous (performances super admin). */
router.use(authenticate);

router.get('/statistics/dashboard', validateZod(statisticsQuerySchema, 'query'), statisticsController.dashboard);
router.get('/statistics/revenue', validateZod(statisticsQuerySchema, 'query'), statisticsController.revenue);
router.get('/statistics/bookings', validateZod(statisticsQuerySchema, 'query'), statisticsController.bookings);
router.get(
  '/statistics/trips',
  requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN, ROLES.COUNTER_AGENT),
  validateZod(statisticsQuerySchema, 'query'),
  statisticsController.trips
);
router.get('/statistics/tickets', validateZod(statisticsQuerySchema, 'query'), statisticsController.tickets);
router.get(
  '/statistics/performances',
  requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN),
  validateZod(statisticsQuerySchema, 'query'),
  statisticsController.performance
);
router.get('/statistics/subscriptions', requireSuperAdmin, validateZod(statisticsQuerySchema, 'query'), statisticsController.subscriptions);

module.exports = router;
