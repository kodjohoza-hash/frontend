const asyncHandler = require('../../../utils/asyncHandler');
const { ticketService } = require('../services');

/**
 * GET /tickets — liste paginée des billets (scope par rôle).
 */
const list = asyncHandler(async (req, res) => {
  const data = await ticketService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /tickets/stats — KPIs tableau de bord (émis, valides, utilisés, vérifiés…).
 */
const stats = asyncHandler(async (req, res) => {
  const data = await ticketService.stats({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /tickets/:id — détail d'un billet (client, voyage, compagnie).
 */
const getById = asyncHandler(async (req, res) => {
  const data = await ticketService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data });
});

/**
 * PATCH /tickets/:id/status — transition de statut (utilisation, annulation, expiration).
 */
const updateStatus = asyncHandler(async (req, res) => {
  const data = await ticketService.updateStatus({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /tickets/:id/qrcode — image PNG du QR code (payload = id, token, version).
 */
const getQrCode = asyncHandler(async (req, res) => {
  const buffer = await ticketService.getQrCode({ id: req.params.id, actor: req.user });
  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', `inline; filename="billet-${req.params.id}.png"`);
  res.set('Cache-Control', 'private, no-store');
  res.send(buffer);
});

/**
 * GET /tickets/verify/:token — vérification sécurisée d'un QR scanné.
 * Journalise chaque scan (anti-fraude).
 */
const verify = asyncHandler(async (req, res) => {
  const data = await ticketService.verify({ token: req.params.token, actor: req.user, ip: req.ip });
  res.json({ success: true, data });
});

/**
 * POST /tickets/:id/regenerate-qrcode — régénération (Super Admin uniquement).
 */
const regenerateQrCode = asyncHandler(async (req, res) => {
  const data = await ticketService.regenerateQrCode({ id: req.params.id, actor: req.user });
  res.json({ success: true, data });
});

module.exports = {
  list,
  stats,
  getById,
  updateStatus,
  getQrCode,
  verify,
  regenerateQrCode,
};
