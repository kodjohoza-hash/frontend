const asyncHandler = require('../../../utils/asyncHandler');
const { routeService } = require('../services');

/** GET /routes — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await routeService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /routes/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await routeService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /routes/:id — détail d'un itinéraire (villes, escales, voyages). */
const getById = asyncHandler(async (req, res) => {
  const route = await routeService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: route });
});

/** POST /routes — création d'un itinéraire. */
const create = asyncHandler(async (req, res) => {
  const route = await routeService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: route, message: 'Itinéraire créé.' });
});

/** PATCH /routes/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const route = await routeService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: route, message: 'Itinéraire mis à jour.' });
});

/** PATCH /routes/:id/status — changer le statut. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await routeService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result.route, message: result.message });
});

/** DELETE /routes/:id — suppression (archivage). */
const remove = asyncHandler(async (req, res) => {
  const result = await routeService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

/** GET /routes/:id/calculs — distance, durée, escales, temps estimé. */
const calculs = asyncHandler(async (req, res) => {
  const result = await routeService.calculs({
    id: req.params.id,
    heureDepart: req.query.heureDepart,
    actor: req.user,
  });
  res.json({ success: true, data: result });
});

/* ══════════════════════════════════════════════════════════════
   Villes
   ══════════════════════════════════════════════════════════════ */

/** GET /routes/villes — liste des villes (filtrable par statut). */
const listVilles = asyncHandler(async (req, res) => {
  const villes = await routeService.listVilles({ query: req.query });
  res.json({ success: true, data: villes });
});

/** GET /routes/villes/:villeId — détail d'une ville. */
const getVille = asyncHandler(async (req, res) => {
  const ville = await routeService.getVille({ villeId: req.params.villeId });
  res.json({ success: true, data: ville });
});

/** POST /routes/villes — création d'une ville. */
const createVille = asyncHandler(async (req, res) => {
  const ville = await routeService.createVille({ data: req.body });
  res.status(201).json({ success: true, data: ville, message: 'Ville créée.' });
});

/** PATCH /routes/villes/:villeId — mise à jour d'une ville. */
const updateVille = asyncHandler(async (req, res) => {
  const ville = await routeService.updateVille({ villeId: req.params.villeId, data: req.body });
  res.json({ success: true, data: ville, message: 'Ville mise à jour.' });
});

/** DELETE /routes/villes/:villeId — archivage d'une ville. */
const removeVille = asyncHandler(async (req, res) => {
  const result = await routeService.removeVille({ villeId: req.params.villeId });
  res.json({ success: true, data: result, message: result.message });
});

/* ══════════════════════════════════════════════════════════════
   Escales
   ══════════════════════════════════════════════════════════════ */

/** GET /routes/:id/stops — escales d'un itinéraire. */
const listStops = asyncHandler(async (req, res) => {
  const stops = await routeService.listStops({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: stops });
});

/** POST /routes/:id/stops — ajouter une escale. */
const addStop = asyncHandler(async (req, res) => {
  const stops = await routeService.addStop({ id: req.params.id, data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: stops, message: 'Escale ajoutée.' });
});

/** PATCH /routes/:id/stops/:stopId — mettre à jour une escale. */
const updateStop = asyncHandler(async (req, res) => {
  const stops = await routeService.updateStop({
    id: req.params.id,
    stopId: req.params.stopId,
    data: req.body,
    actor: req.user,
  });
  res.json({ success: true, data: stops, message: 'Escale mise à jour.' });
});

/** DELETE /routes/:id/stops/:stopId — supprimer une escale. */
const removeStop = asyncHandler(async (req, res) => {
  const result = await routeService.removeStop({
    id: req.params.id,
    stopId: req.params.stopId,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  list,
  stats,
  getById,
  create,
  update,
  updateStatus,
  remove,
  calculs,
  listVilles,
  getVille,
  createVille,
  updateVille,
  removeVille,
  listStops,
  addStop,
  updateStop,
  removeStop,
};
