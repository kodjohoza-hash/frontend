const asyncHandler = require('../../../utils/asyncHandler');
const { agencyService } = require('../services');

/** GET /agencies — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await agencyService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /agencies/nearby — agences proches d'un point GPS. */
const nearby = asyncHandler(async (req, res) => {
  const result = await agencyService.nearby({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /agencies/villes — villes disponibles (filtres + formulaires). */
const listVilles = asyncHandler(async (req, res) => {
  const result = await agencyService.listVilles();
  res.json({ success: true, data: result });
});

/** GET /agencies/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await agencyService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /agencies/:id — détail d'une agence. */
const getById = asyncHandler(async (req, res) => {
  const agency = await agencyService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: agency });
});

/** POST /agencies — création. */
const create = asyncHandler(async (req, res) => {
  const agency = await agencyService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: agency, message: 'Agence créée.' });
});

/** PATCH /agencies/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const agency = await agencyService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: agency, message: 'Agence mise à jour.' });
});

/** PATCH /agencies/:id/status — changer le statut opérationnel. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await agencyService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** DELETE /agencies/:id — suppression (soft delete). */
const remove = asyncHandler(async (req, res) => {
  const result = await agencyService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  list,
  nearby,
  listVilles,
  stats,
  getById,
  create,
  update,
  updateStatus,
  remove,
};
