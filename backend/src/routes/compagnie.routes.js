const express = require('express');
const router = express.Router();
const { compagnieController } = require('../controllers');
const { compagnieValidation, commonValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const requireActiveSubscription = require('../modules/subscriptions/middlewares/requireActiveSubscription');

router.use(authenticate);
router.use(requireActiveSubscription);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN));

/** @swagger tags: name: Compagnies */
router.get('/', compagnieController.list);
router.get('/:id', validate(commonValidation.idSchema, 'params'), compagnieController.getById);
router.post('/', validate(compagnieValidation.createCompagnieSchema), compagnieController.create);
router.patch('/:id',
  validate(commonValidation.idSchema, 'params'),
  validate(compagnieValidation.updateCompagnieSchema),
  compagnieController.update);
router.delete('/:id', validate(commonValidation.idSchema, 'params'), compagnieController.remove);

module.exports = router;
