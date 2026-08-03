const express = require('express');
const router = express.Router();
const { statsController } = require('../controllers');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

/** @swagger tags: name: Stats */
router.use(authenticate);

router.get('/global', requireRole(ROLES.SUPER_ADMIN), statsController.globalStats);
router.get('/db', statsController.dbHealth);

module.exports = router;
