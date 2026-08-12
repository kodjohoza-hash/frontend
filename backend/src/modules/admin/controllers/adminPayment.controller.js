const asyncHandler = require('../../../utils/asyncHandler');
const { paymentService } = require('../../payments/services');

/**
 * Paiements opérationnels globaux (réservations / billets) pour le Super Admin.
 * Les paiements d'abonnement (SaaS) restent servis par le module Subscriptions
 * (`GET /payments` super admin) ; ce endpoint consolide les encaissements de
 * billets de TOUTES les compagnies, sans aucune délégation.
 */

/** GET /admin/payments — liste paginée et filtrable (scope super admin = tout). */
const list = asyncHandler(async (req, res) => {
  const data = await paymentService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data });
});

/** GET /admin/payments/stats — KPIs des paiements opérationnels (toutes compagnies). */
const stats = asyncHandler(async (req, res) => {
  const data = await paymentService.stats({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

module.exports = { list, stats };
