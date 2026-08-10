const asyncHandler = require('../../../utils/asyncHandler');
const ApiError = require('../../../utils/ApiError');
const { messageService } = require('../services');

/** GET /messages/conversations — conversations de l'utilisateur authentifié. */
const listConversations = asyncHandler(async (req, res) => {
  const data = await messageService.listConversations({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** POST /messages/conversations — nouvelle conversation (dédoublonnée). */
const createConversation = asyncHandler(async (req, res) => {
  const { conversation, created } = await messageService.createConversation({ actor: req.user, body: req.body });
  res.status(created ? 201 : 200).json({ success: true, data: { conversationId: conversation.id, created } });
});

/** GET /messages/conversations/:id — détail d'une conversation (participants, contexte, non-lus). */
const getConversation = asyncHandler(async (req, res) => {
  const conversation = await messageService.getConversation({ actor: req.user, conversationId: req.params.conversationId });
  res.json({ success: true, data: conversation });
});

/** GET /messages/conversations/:id/messages — messages paginés (du plus ancien au plus récent). */
const listMessages = asyncHandler(async (req, res) => {
  const data = await messageService.listMessages({ actor: req.user, conversationId: req.params.conversationId, query: req.query });
  res.json({ success: true, data });
});

/** POST /messages/conversations/:id/messages — envoi d'un message. */
const sendMessage = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage({ actor: req.user, conversationId: req.params.conversationId, content: req.body.content });
  res.status(201).json({ success: true, data: message });
});

/** PATCH /messages/conversations/:id/read — marque la conversation comme lue pour l'utilisateur. */
const markConversationRead = asyncHandler(async (req, res) => {
  const data = await messageService.markConversationRead({ actor: req.user, conversationId: req.params.conversationId });
  res.json({ success: true, data });
});

/** PATCH /messages/:id/read — témoin de lecture d'un message reçu. */
const markMessageRead = asyncHandler(async (req, res) => {
  const message = await messageService.markMessageRead({ actor: req.user, messageId: req.params.id });
  if (!message) throw new ApiError(404, 'Message introuvable.');
  res.json({ success: true, data: message });
});

/** DELETE /messages/:id — suppression de son propre message. */
const destroyMessage = asyncHandler(async (req, res) => {
  const data = await messageService.destroyMessage({ actor: req.user, messageId: req.params.id });
  res.json({ success: true, data });
});

/** GET /messages/unread-count — nombre total de messages non lus. */
const unreadCount = asyncHandler(async (req, res) => {
  const unread = await messageService.unreadCount({ actor: req.user });
  res.json({ success: true, data: { unread } });
});

/** GET /messages/companies — compagnies actives (super_admin uniquement). */
const listCompanies = asyncHandler(async (req, res) => {
  const companies = await messageService.listCompanies({ actor: req.user });
  res.json({ success: true, data: companies });
});

/** GET /messages/companies/:id/clients — clients ayant une réservation sur la compagnie. */
const listClientsOfCompany = asyncHandler(async (req, res) => {
  const clients = await messageService.listClientsOfCompany({ actor: req.user, compagnieId: req.params.id });
  res.json({ success: true, data: clients });
});

module.exports = {
  listConversations,
  createConversation,
  getConversation,
  listMessages,
  sendMessage,
  markConversationRead,
  markMessageRead,
  destroyMessage,
  unreadCount,
  listCompanies,
  listClientsOfCompany,
};
