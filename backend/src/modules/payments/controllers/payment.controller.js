const asyncHandler = require('../../../utils/asyncHandler');
const { paymentService } = require('../services');

/**
 * GET /payments — liste paginée des paiements.
 * (La délégation du super_admin vers le module SaaS Subscriptions est
 * gérée dans routes.js, avant la validation du schéma de requête.)
 */
const list = asyncHandler(async (req, res) => {
  const data = await paymentService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /payments/stats (ou /payments/statistics) — synthèse pour tableaux de bord.
 */
const stats = asyncHandler(async (req, res) => {
  const data = await paymentService.stats({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /payments/statistics — alias de /payments/stats.
 */
const statistics = asyncHandler(async (req, res) => {
  const data = await paymentService.statistics({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/**
 * POST /payments — enregistre un paiement (réservation / abonnement / manuel).
 */
const create = asyncHandler(async (req, res) => {
  const data = await paymentService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data });
});

/**
 * PATCH /payments/:id — met à jour un paiement (métadonnées + statut gardé).
 */
const update = asyncHandler(async (req, res) => {
  const data = await paymentService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /payments/:id — détail d'un paiement.
 */
const getById = asyncHandler(async (req, res) => {
  const data = await paymentService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data });
});

/**
 * GET /payments/:id/receipt — données d'un reçu imprimable.
 */
const receipt = asyncHandler(async (req, res) => {
  const data = await paymentService.receipt({ id: req.params.id, actor: req.user });
  res.json({ success: true, data });
});

/**
 * POST /payments/:id/confirm — confirme un paiement en attente.
 */
const confirm = asyncHandler(async (req, res) => {
  const data = await paymentService.confirm({ id: req.params.id, actor: req.user });
  res.json({ success: true, data });
});

/**
 * POST /payments/:id/cancel — annule un paiement en attente.
 */
const cancel = asyncHandler(async (req, res) => {
  const data = await paymentService.cancel({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data });
});

/**
 * POST /payments/:id/fail — marque un paiement comme échoué.
 */
const fail = asyncHandler(async (req, res) => {
  const data = await paymentService.fail({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data });
});

/**
 * POST /payments/:id/refund — rembourse un paiement encaissé.
 */
const refund = asyncHandler(async (req, res) => {
  const data = await paymentService.refund({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data });
});

module.exports = {
  list,
  stats,
  statistics,
  create,
  update,
  getById,
  receipt,
  confirm,
  cancel,
  fail,
  refund,
};
