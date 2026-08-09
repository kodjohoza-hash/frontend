const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares/auth');
const validateZod = require('./middlewares/validateZod');
const { notificationController } = require('./controllers');
const { listSchema, idParamSchema } = require('./validators');

/* Toutes les routes notifications exigent un utilisateur authentifié.
   Le destinataire est déduit de req.user : un utilisateur ne peut jamais
   consulter/modifier les notifications d'un autre. */
router.use(authenticate);

router.get('/notifications', validateZod(listSchema, 'query'), notificationController.list);
router.get('/notifications/unread-count', notificationController.unreadCount);

router.patch('/notifications/read-all', notificationController.markAllRead);
router.patch('/notifications/:id/read', validateZod(idParamSchema, 'params'), notificationController.markRead);
router.delete('/notifications/:id', validateZod(idParamSchema, 'params'), notificationController.remove);

module.exports = router;
