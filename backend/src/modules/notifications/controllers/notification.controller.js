const asyncHandler = require('../../../utils/asyncHandler');
const ApiError = require('../../../utils/ApiError');
const { notificationService } = require('../services');

/**
 * GET /notifications — notifications de l'utilisateur authentifié.
 * Le destinataire est TOUJOURS req.user.id (jamais un user_id du frontend).
 */
const list = asyncHandler(async (req, res) => {
  const data = await notificationService.listFor(req.user.id, req.query);
  res.json({ success: true, data });
});

/** GET /notifications/unread-count — compteur de notifications non lues. */
const unreadCount = asyncHandler(async (req, res) => {
  const unread = await notificationService.unreadCount(req.user.id);
  res.json({ success: true, data: { unread } });
});

/** PATCH /notifications/:id/read — marque comme lue (propriété exclusive). */
const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead({ id: req.params.id, recipientId: req.user.id });
  if (!notification) throw new ApiError(404, 'Notification introuvable.');
  res.json({ success: true, data: notificationService.serialize(notification) });
});

/** PATCH /notifications/read-all — marque toutes les siennes comme lues. */
const markAllRead = asyncHandler(async (req, res) => {
  const affected = await notificationService.markAllRead(req.user.id);
  const unread = await notificationService.unreadCount(req.user.id);
  res.json({ success: true, data: { affected, unread } });
});

/** DELETE /notifications/:id — suppression de sa propre notification. */
const remove = asyncHandler(async (req, res) => {
  const notification = await notificationService.remove({ id: req.params.id, recipientId: req.user.id });
  if (!notification) throw new ApiError(404, 'Notification introuvable.');
  res.json({ success: true, data: { id: notification.id, message: 'Notification supprimée.' } });
});

module.exports = { list, unreadCount, markRead, markAllRead, remove };
