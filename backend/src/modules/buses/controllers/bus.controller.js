const asyncHandler = require('../../../utils/asyncHandler');
const { busService, busPhotoService } = require('../services');

/** GET /buses — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await busService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /buses/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await busService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /buses/:id — détail d'un bus. */
const getById = asyncHandler(async (req, res) => {
  const bus = await busService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: bus });
});

/** POST /buses — création. */
const create = asyncHandler(async (req, res) => {
  const bus = await busService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: bus, message: 'Bus créé.' });
});

/** PATCH /buses/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const bus = await busService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: bus, message: 'Bus mis à jour.' });
});

/** PATCH /buses/:id/status — changer le statut opérationnel. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await busService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** DELETE /buses/:id — suppression (soft delete). */
const remove = asyncHandler(async (req, res) => {
  const result = await busService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

/** GET /buses/:id/seat-layout — plan de sièges du bus. */
const getSeatLayout = asyncHandler(async (req, res) => {
  const result = await busService.getSeatLayout({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** PUT /buses/:id/seat-layout — enregistrer le plan de sièges. */
const saveSeatLayout = asyncHandler(async (req, res) => {
  const result = await busService.saveSeatLayout({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: result, message: 'Plan de sièges enregistré.' });
});

/** GET /buses/:id/maintenance — historique des maintenances. */
const listMaintenances = asyncHandler(async (req, res) => {
  const result = await busService.listMaintenances({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** POST /buses/:id/maintenance — planifier une maintenance. */
const createMaintenance = asyncHandler(async (req, res) => {
  const result = await busService.createMaintenance({ id: req.params.id, data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: result, message: 'Maintenance planifiée.' });
});

/** PATCH /buses/maintenance/:maintenanceId — mettre à jour une maintenance. */
const updateMaintenance = asyncHandler(async (req, res) => {
  const result = await busService.updateMaintenance({
    maintenanceId: req.params.maintenanceId,
    data: req.body,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: 'Maintenance mise à jour.' });
});

/** DELETE /buses/maintenance/:maintenanceId — supprimer une maintenance. */
const deleteMaintenance = asyncHandler(async (req, res) => {
  const result = await busService.deleteMaintenance({
    maintenanceId: req.params.maintenanceId,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** POST /buses/:id/photo — upload / remplacement de la photo du bus. */
const uploadPhoto = asyncHandler(async (req, res) => {
  const result = await busService.uploadPhoto({ id: req.params.id, file: req.file, actor: req.user });
  res.status(201).json({ success: true, data: result, message: 'Photo de bus ajoutée.' });
});

/** DELETE /buses/:id/photo — supprimer la photo (optionnellement par imageId). */
const deletePhoto = asyncHandler(async (req, res) => {
  const result = await busService.deletePhoto({
    id: req.params.id,
    imageId: req.query.imageId || null,
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
  getSeatLayout,
  saveSeatLayout,
  listMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  uploadPhoto,
  deletePhoto,
  busPhotoService,
};
