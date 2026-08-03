const express = require('express');
const router = express.Router();
const { paiementController } = require('../controllers');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const requireActiveSubscription = require('../modules/subscriptions/middlewares/requireActiveSubscription');

router.use(authenticate);
router.use(requireActiveSubscription);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN));

/** @swagger tags: name: Paiements */
router.get('/', paiementController.list);
router.get('/revenus/compagnies', paiementController.revenusParCompagnie);

module.exports = router;
