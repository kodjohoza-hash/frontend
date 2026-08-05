const asyncHandler = require('../../../utils/asyncHandler');
const { bookingService } = require('../services');

/** GET /bookings/availability — plan de sièges d'un voyage (public). */
const availability = asyncHandler(async (req, res) => {
  const result = await bookingService.availability({ departId: req.query.departId, actor: req.user || null });
  res.json({ success: true, data: result });
});

/** GET /bookings — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await bookingService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /bookings/stats — KPIs tableau de bord (client / guichet / compagnie / admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await bookingService.stats({ actor: req.user, query: req.query });
  res.json({ success: true, data: result });
});

/** GET /bookings/:id — détail d'une réservation (sièges, paiements, historique). */
const getById = asyncHandler(async (req, res) => {
  const booking = await bookingService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: booking });
});

/** POST /bookings — création d'une réservation (avec blocage des sièges). */
const create = asyncHandler(async (req, res) => {
  const booking = await bookingService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: booking, message: 'Réservation créée.' });
});

/** PATCH /bookings/:id — mise à jour (sièges, remise, taxes, observations). */
const update = asyncHandler(async (req, res) => {
  const booking = await bookingService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: booking, message: 'Réservation mise à jour.' });
});

/** PATCH /bookings/:id/confirm — confirmation de la réservation. */
const confirm = asyncHandler(async (req, res) => {
  const result = await bookingService.confirm({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result.booking, message: result.message });
});

/** PATCH /bookings/:id/cancel — annulation (libère les sièges). */
const cancel = asyncHandler(async (req, res) => {
  const result = await bookingService.cancel({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: result.booking, message: result.message });
});

/** POST /bookings/:id/payments — enregistrement d'un paiement. */
const pay = asyncHandler(async (req, res) => {
  const result = await bookingService.pay({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: result.booking, message: result.message });
});

/** POST /bookings/:id/refund — remboursement d'une réservation payée. */
const refund = asyncHandler(async (req, res) => {
  const result = await bookingService.refund({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: result.booking, message: result.message });
});

/** DELETE /bookings/:id — suppression (brouillons uniquement). */
const remove = asyncHandler(async (req, res) => {
  const result = await bookingService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  availability,
  list,
  stats,
  getById,
  create,
  update,
  confirm,
  cancel,
  pay,
  refund,
  remove,
};
