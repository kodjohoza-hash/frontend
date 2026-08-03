const express = require('express');
const router = express.Router();
const { agenceController } = require('../controllers');
const { agenceValidation, commonValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const requireActiveSubscription = require('../modules/subscriptions/middlewares/requireActiveSubscription');

router.use(authenticate);
router.use(requireActiveSubscription);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN));

/** @swagger tags: name: Agences */
router.get('/', agenceController.list);
router.get('/:id', validate(commonValidation.idSchema, 'params'), agenceController.getById);
router.post('/', validate(agenceValidation.createAgenceSchema), agenceController.create);
router.patch('/:id',
  validate(commonValidation.idSchema, 'params'),
  validate(agenceValidation.updateAgenceSchema),
  agenceController.update);
router.delete('/:id', validate(commonValidation.idSchema, 'params'), agenceController.remove);

module.exports = router;
