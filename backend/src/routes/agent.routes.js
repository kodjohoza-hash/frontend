const express = require('express');
const router = express.Router();
const { agentController } = require('../controllers');
const { commonValidation } = require('../validations');
const validate = require('../middlewares/validate');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');
const requireActiveSubscription = require('../modules/subscriptions/middlewares/requireActiveSubscription');

router.use(authenticate);
router.use(requireActiveSubscription);
router.use(requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN));

/** @swagger tags: name: Agents */
router.get('/', agentController.list);
router.get('/:id', validate(commonValidation.idSchema, 'params'), agentController.getById);
router.post('/', agentController.create);
router.patch('/:id', validate(commonValidation.idSchema, 'params'), agentController.update);
router.delete('/:id', validate(commonValidation.idSchema, 'params'), agentController.remove);

module.exports = router;
