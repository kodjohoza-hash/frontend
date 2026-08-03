const asyncHandler = require('../../../utils/asyncHandler');
const { driverService } = require('../services');

/** GET /drivers — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await driverService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /drivers/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await driverService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /drivers/:id — détail d'un chauffeur. */
const getById = asyncHandler(async (req, res) => {
  const driver = await driverService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: driver });
});

/** POST /drivers — création. */
const create = asyncHandler(async (req, res) => {
  const driver = await driverService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: driver, message: 'Chauffeur créé.' });
});

/** PATCH /drivers/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const driver = await driverService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: driver, message: 'Chauffeur mis à jour.' });
});

/** PATCH /drivers/:id/status — changer le statut opérationnel. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await driverService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** DELETE /drivers/:id — suppression (soft delete). */
const remove = asyncHandler(async (req, res) => {
  const result = await driverService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

/** GET /drivers/:id/availability — disponibilité + voyage/bus actuels. */
const availability = asyncHandler(async (req, res) => {
  const result = await driverService.availability({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /drivers/:id/voyages — historique des voyages. */
const voyages = asyncHandler(async (req, res) => {
  const result = await driverService.voyages({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /drivers/:id/affectations — historique d'affectation bus. */
const affectations = asyncHandler(async (req, res) => {
  const result = await driverService.affectations({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** PATCH /drivers/:id/trip — affecter / libérer un voyage (un seul actif). */
const assignTrip = asyncHandler(async (req, res) => {
  const result = await driverService.assignTrip({
    id: req.params.id,
    departId: req.body.departId || null,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: 'Affectation voyage mise à jour.' });
});

/** GET /drivers/:id/incidents — historique des incidents. */
const listIncidents = asyncHandler(async (req, res) => {
  const result = await driverService.listIncidents({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** POST /drivers/:id/incidents — déclarer un incident. */
const createIncident = asyncHandler(async (req, res) => {
  const result = await driverService.createIncident({ id: req.params.id, data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: result, message: 'Incident enregistré.' });
});

/** PATCH /drivers/incidents/:incidentId — mettre à jour un incident. */
const updateIncident = asyncHandler(async (req, res) => {
  const result = await driverService.updateIncident({
    incidentId: req.params.incidentId,
    data: req.body,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: 'Incident mis à jour.' });
});

/** DELETE /drivers/incidents/:incidentId — supprimer un incident. */
const deleteIncident = asyncHandler(async (req, res) => {
  const result = await driverService.deleteIncident({ incidentId: req.params.incidentId, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

/** GET /drivers/:id/documents — documents du chauffeur. */
const listDocuments = asyncHandler(async (req, res) => {
  const result = await driverService.listDocuments({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result });
});

/** POST /drivers/:id/documents — upload d'un document (champ `document`). */
const uploadDocument = asyncHandler(async (req, res) => {
  const result = await driverService.uploadDocument({
    id: req.params.id,
    file: req.file,
    type: req.body.type,
    notes: req.body.notes,
    actor: req.user,
  });
  res.status(201).json({ success: true, data: result, message: 'Document ajouté.' });
});

/** DELETE /drivers/documents/:documentId — supprimer un document. */
const deleteDocument = asyncHandler(async (req, res) => {
  const result = await driverService.deleteDocument({ documentId: req.params.documentId, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

/** POST /drivers/:id/photo — upload / remplacement de la photo. */
const uploadPhoto = asyncHandler(async (req, res) => {
  const result = await driverService.uploadPhoto({ id: req.params.id, file: req.file, actor: req.user });
  res.status(201).json({ success: true, data: result, message: 'Photo de chauffeur mise à jour.' });
});

/** DELETE /drivers/:id/photo — suppression de la photo. */
const deletePhoto = asyncHandler(async (req, res) => {
  const result = await driverService.deletePhoto({ id: req.params.id, actor: req.user });
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
  availability,
  voyages,
  affectations,
  assignTrip,
  listIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
  listDocuments,
  uploadDocument,
  deleteDocument,
  uploadPhoto,
  deletePhoto,
};
