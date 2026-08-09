const asyncHandler = require('../../../utils/asyncHandler');
const { tripService } = require('../services');

/** GET /trips — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await tripService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /trips/stats — KPIs voyages (scope par rôle). */
const stats = asyncHandler(async (req, res) => {
  const result = await tripService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /trips/available — recherche publique des voyages réservables (sans auth). */
const searchPublic = asyncHandler(async (req, res) => {
  const result = await tripService.searchPublic({ query: req.query });
  res.json({ success: true, data: result });
});

/** GET /trips/:id — détail d'un voyage (public si réservable, sinon scope). */
const getById = asyncHandler(async (req, res) => {
  const trip = await tripService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: trip });
});

/** POST /trips — création d'un voyage. */
const create = asyncHandler(async (req, res) => {
  const trip = await tripService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: trip, message: 'Voyage créé.' });
});

/** PATCH /trips/:id — mise à jour d'un voyage. */
const update = asyncHandler(async (req, res) => {
  const trip = await tripService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: trip, message: 'Voyage mis à jour.' });
});

/** PATCH /trips/:id/status — changer le statut d'un voyage. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await tripService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result.trip, message: result.message });
});

/** DELETE /trips/:id — suppression protégée (409 si réservations). */
const remove = asyncHandler(async (req, res) => {
  const result = await tripService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  list,
  stats,
  searchPublic,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
