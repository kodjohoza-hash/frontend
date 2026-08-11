const asyncHandler = require('../../../utils/asyncHandler');
const { statisticsService } = require('../services');

/** GET /statistics/dashboard — indicateurs agrégés du rôle authentifié. */
const dashboard = asyncHandler(async (req, res) => {
  const data = await statisticsService.dashboard({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/revenue — revenus (paiements confirmés) par période. */
const revenue = asyncHandler(async (req, res) => {
  const data = await statisticsService.revenue({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/bookings — statistiques des réservations. */
const bookings = asyncHandler(async (req, res) => {
  const data = await statisticsService.bookings({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/trips — statistiques des voyages. */
const trips = asyncHandler(async (req, res) => {
  const data = await statisticsService.trips({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/tickets — statistiques des billets. */
const tickets = asyncHandler(async (req, res) => {
  const data = await statisticsService.tickets({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/subscriptions — abonnements (super admin). */
const subscriptions = asyncHandler(async (req, res) => {
  const data = await statisticsService.subscriptions({ query: req.query });
  res.json({ success: true, data });
});

/** GET /statistics/performances — par agence / par guichet. */
const performance = asyncHandler(async (req, res) => {
  const data = await statisticsService.performance({ actor: req.user, query: req.query });
  res.json({ success: true, data });
});

module.exports = {
  dashboard,
  revenue,
  bookings,
  trips,
  tickets,
  subscriptions,
  performance,
};
