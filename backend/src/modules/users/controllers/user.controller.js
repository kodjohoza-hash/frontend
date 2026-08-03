const asyncHandler = require('../../../utils/asyncHandler');
const { userService } = require('../services');

/** GET /users — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await userService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /users/profile — profil de l'utilisateur connecté. */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile({ actor: req.user });
  res.json({ success: true, data: user });
});

/** PATCH /users/profile — mise à jour de son propre profil. */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile({ data: req.body, actor: req.user });
  res.json({ success: true, data: user, message: 'Profil mis à jour.' });
});

/** PATCH /users/profile/photo — upload / remplacement de la photo. */
const updatePhoto = asyncHandler(async (req, res) => {
  const result = await userService.updatePhoto({ file: req.file, actor: req.user, req });
  res.json({ success: true, data: result, message: 'Photo mise à jour.' });
});

/** DELETE /users/profile/photo — suppression de la photo de profil. */
const removePhoto = asyncHandler(async (req, res) => {
  const result = await userService.removePhoto({ actor: req.user, req });
  res.json({ success: true, data: result, message: 'Photo supprimée.' });
});

/** PATCH /users/status — changer le statut (actif/suspendu/banni/supprime…). */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await userService.updateStatus({
    id: req.body.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
    req,
  });
  res.json({ success: true, data: result });
});

/** PATCH /users/password — changement de mot de passe (soi-même). */
const changePassword = asyncHandler(async (req, res) => {
  const result = await userService.changePassword({
    motDePasseActuel: req.body.motDePasseActuel,
    nouveauMotDePasse: req.body.nouveauMotDePasse,
    actor: req.user,
    req,
  });
  res.json({ success: true, data: result });
});

/** GET /users/stats — KPIs par rôle / statut (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await userService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /users/:id — détail d'un utilisateur. */
const getById = asyncHandler(async (req, res) => {
  const user = await userService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: user });
});

/** POST /users — création (super admin / company admin). */
const create = asyncHandler(async (req, res) => {
  const user = await userService.create({ data: req.body, actor: req.user, req });
  res.status(201).json({ success: true, data: user, message: 'Utilisateur créé.' });
});

/** PATCH /users/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const user = await userService.update({ id: req.params.id, data: req.body, actor: req.user, req });
  res.json({ success: true, data: user, message: 'Utilisateur mis à jour.' });
});

/** DELETE /users/:id — suppression (soft delete). */
const remove = asyncHandler(async (req, res) => {
  const result = await userService.remove({ id: req.params.id, actor: req.user, req });
  res.json({ success: true, data: result });
});

module.exports = {
  list,
  getProfile,
  updateProfile,
  updatePhoto,
  removePhoto,
  updateStatus,
  changePassword,
  stats,
  getById,
  create,
  update,
  remove,
};
