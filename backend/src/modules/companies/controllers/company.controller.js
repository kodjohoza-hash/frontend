const asyncHandler = require('../../../utils/asyncHandler');
const { companyService } = require('../services');
const { auditWriter } = require('../../admin/services');

/** GET /companies — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await companyService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /companies/profile — profil de la compagnie de l'utilisateur courant. */
const getProfile = asyncHandler(async (req, res) => {
  const company = await companyService.getProfile({ actor: req.user });
  res.json({ success: true, data: company });
});

/** PATCH /companies/profile — mise à jour de sa propre compagnie. */
const updateProfile = asyncHandler(async (req, res) => {
  const company = await companyService.updateProfile({ data: req.body, actor: req.user, req });
  res.json({ success: true, data: company, message: 'Compagnie mise à jour.' });
});

/** PATCH /companies/profile/logo — upload / remplacement du logo. */
const updateLogo = asyncHandler(async (req, res) => {
  const result = await companyService.updateLogo({ file: req.file, id: null, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Logo mis à jour.' });
});

/** DELETE /companies/profile/logo — suppression du logo. */
const removeLogo = asyncHandler(async (req, res) => {
  const result = await companyService.removeLogo({ id: null, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Logo supprimé.' });
});

/** GET /companies/profile/documents — documents de ma compagnie. */
const listMyDocuments = asyncHandler(async (req, res) => {
  const docs = await companyService.listDocuments({ id: null, query: req.query, actor: req.user });
  res.json({ success: true, data: docs });
});

/** POST /companies/profile/documents — upload d'un document. */
const uploadMyDocument = asyncHandler(async (req, res) => {
  const doc = await companyService.uploadDocument({ file: req.file, id: null, body: req.body, actor: req.user, req });
  res.status(201).json({ success: true, data: doc, message: 'Document ajouté.' });
});

/** DELETE /companies/profile/documents/:documentId — suppression d'un document. */
const removeMyDocument = asyncHandler(async (req, res) => {
  const result = await companyService.removeDocument({ documentId: req.params.documentId, id: null, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Document supprimé.' });
});

/** GET /companies/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await companyService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /companies/:id — détail d'une compagnie. */
const getById = asyncHandler(async (req, res) => {
  const company = await companyService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: company });
});

/** POST /companies — création (super admin). */
const create = asyncHandler(async (req, res) => {
  const company = await companyService.create({ data: req.body, actor: req.user, req });
  await auditWriter.audit({
    actor: req.user,
    action: 'create',
    entite: 'compagnie',
    entiteId: company.id,
    details: { nom: company.name, plan: company.subscription },
    req,
  });
  res.status(201).json({ success: true, data: company, message: 'Compagnie créée.' });
});

/** PATCH /companies/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const company = await companyService.update({ id: req.params.id, data: req.body, actor: req.user, req });
  await auditWriter.audit({
    actor: req.user,
    action: 'update',
    entite: 'compagnie',
    entiteId: company.id,
    details: { nom: company.name },
    req,
  });
  res.json({ success: true, data: company, message: 'Compagnie mise à jour.' });
});

/** PATCH /companies/:id/status — changer le statut (super admin). */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await companyService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
    req,
  });
  await auditWriter.audit({
    actor: req.user,
    action: req.body.statut === 'actif' ? 'validate' : req.body.statut === 'banni' ? 'delete' : 'status',
    entite: 'compagnie',
    entiteId: result.id,
    details: { statut: result.statut, raison: req.body.raison || null },
    req,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** PATCH /companies/:id/logo — upload du logo (super admin). */
const updateCompanyLogo = asyncHandler(async (req, res) => {
  const result = await companyService.updateLogo({ file: req.file, id: req.params.id, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Logo mis à jour.' });
});

/** DELETE /companies/:id/logo — suppression du logo (super admin). */
const removeCompanyLogo = asyncHandler(async (req, res) => {
  const result = await companyService.removeLogo({ id: req.params.id, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Logo supprimé.' });
});

/** GET /companies/:id/documents — documents d'une compagnie. */
const listCompanyDocuments = asyncHandler(async (req, res) => {
  const docs = await companyService.listDocuments({ id: req.params.id, query: req.query, actor: req.user });
  res.json({ success: true, data: docs });
});

/** POST /companies/:id/documents — upload d'un document (super admin). */
const uploadCompanyDocument = asyncHandler(async (req, res) => {
  const doc = await companyService.uploadDocument({ file: req.file, id: req.params.id, body: req.body, actor: req.user, req });
  res.status(201).json({ success: true, data: doc, message: 'Document ajouté.' });
});

/** DELETE /companies/:id/documents/:documentId — suppression d'un document. */
const removeCompanyDocument = asyncHandler(async (req, res) => {
  const result = await companyService.removeDocument({ documentId: req.params.documentId, id: req.params.id, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Document supprimé.' });
});

/** DELETE /companies/:id — suppression (soft delete, super admin). */
const remove = asyncHandler(async (req, res) => {
  const result = await companyService.remove({ id: req.params.id, actor: req.user, req });
  await auditWriter.audit({
    actor: req.user,
    action: 'delete',
    entite: 'compagnie',
    entiteId: result.id,
    details: { statut: 'banni' },
    req,
  });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  list,
  getProfile,
  updateProfile,
  updateLogo,
  removeLogo,
  listMyDocuments,
  uploadMyDocument,
  removeMyDocument,
  stats,
  getById,
  create,
  update,
  updateStatus,
  updateCompanyLogo,
  removeCompanyLogo,
  listCompanyDocuments,
  uploadCompanyDocument,
  removeCompanyDocument,
  remove,
};
