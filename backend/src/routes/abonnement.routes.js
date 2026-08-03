const express = require('express');
const router = express.Router();
const { abonnementController } = require('../controllers');
const { abonnementValidation, commonValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const requireActiveSubscription = require('../modules/subscriptions/middlewares/requireActiveSubscription');

router.use(authenticate);
router.use(requireActiveSubscription);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN));

/** @swagger tags: name: Abonnements */
router.get('/', abonnementController.list);
router.get('/:id', validate(commonValidation.idSchema, 'params'), abonnementController.getById);
router.post('/', validate(abonnementValidation.createAbonnementSchema), abonnementController.create);
router.patch('/:id',
  validate(commonValidation.idSchema, 'params'),
  validate(abonnementValidation.updateAbonnementSchema),
  abonnementController.update);
router.post('/suspend-expires', requireRole(ROLES.SUPER_ADMIN), abonnementController.runSuspension);

module.exports = router;
