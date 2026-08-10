const express = require('express');
const router = express.Router();

const { authenticate } = require('../../middlewares/auth');
const validateZod = require('./middlewares/validateZod');
const { messageController } = require('./controllers');
const {
  listQuerySchema,
  conversationIdParamSchema,
  idParamSchema,
  createConversationSchema,
  sendMessageSchema,
} = require('./validators');

/* Toutes les routes messagerie exigent un utilisateur authentifié.
   L'accès est TOUJOURS déduit de req.user (participant de la conversation) :
   aucun id de conversation transmis par le frontend ne fait autorité. */
router.use(authenticate);

/* Conversations */
router.get('/messages/conversations', validateZod(listQuerySchema, 'query'), messageController.listConversations);
router.post('/messages/conversations', validateZod(createConversationSchema, 'body'), messageController.createConversation);
router.get(
  '/messages/conversations/:conversationId',
  validateZod(conversationIdParamSchema, 'params'),
  messageController.getConversation
);
router.patch(
  '/messages/conversations/:conversationId/read',
  validateZod(conversationIdParamSchema, 'params'),
  messageController.markConversationRead
);

/* Messages d'une conversation */
router.get(
  '/messages/conversations/:conversationId/messages',
  validateZod(conversationIdParamSchema, 'params'),
  validateZod(listQuerySchema, 'query'),
  messageController.listMessages
);
router.post(
  '/messages/conversations/:conversationId/messages',
  validateZod(conversationIdParamSchema, 'params'),
  validateZod(sendMessageSchema, 'body'),
  messageController.sendMessage
);

/* Messages individuels */
router.patch('/messages/:id/read', validateZod(idParamSchema, 'params'), messageController.markMessageRead);
router.delete('/messages/:id', validateZod(idParamSchema, 'params'), messageController.destroyMessage);

/* Compteurs & annuaires */
router.get('/messages/unread-count', messageController.unreadCount);
router.get('/messages/companies', messageController.listCompanies);
router.get('/messages/companies/:id/clients', messageController.listClientsOfCompany);

module.exports = router;
