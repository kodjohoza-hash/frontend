const { Compagnie } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const compagnies = await Compagnie.findAll({ order: [['nom', 'ASC']] });
  res.json({ success: true, data: compagnies });
});

const getById = asyncHandler(async (req, res) => {
  const compagnie = await Compagnie.findByPk(req.params.id);
  if (!compagnie) throw new ApiError(404, 'Compagnie introuvable.');
  res.json({ success: true, data: compagnie });
});

const create = asyncHandler(async (req, res) => {
  const compagnie = await Compagnie.create(req.body);
  res.status(201).json({ success: true, data: compagnie, message: 'Compagnie créée.' });
});

const update = asyncHandler(async (req, res) => {
  const compagnie = await Compagnie.findByPk(req.params.id);
  if (!compagnie) throw new ApiError(404, 'Compagnie introuvable.');
  await compagnie.update(req.body);
  res.json({ success: true, data: compagnie, message: 'Compagnie mise à jour.' });
});

const remove = asyncHandler(async (req, res) => {
  const compagnie = await Compagnie.findByPk(req.params.id);
  if (!compagnie) throw new ApiError(404, 'Compagnie introuvable.');
  await compagnie.destroy();
  res.json({ success: true, message: 'Compagnie supprimée.' });
});

module.exports = { list, getById, create, update, remove };
