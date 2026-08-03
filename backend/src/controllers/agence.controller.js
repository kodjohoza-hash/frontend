const { Agence, Compagnie } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.compagnie_id) where.compagnie_id = req.query.compagnie_id;

  const agences = await Agence.findAll({ where, include: [{ model: Compagnie, as: 'compagnie' }], order: [['nom', 'ASC']] });
  res.json({ success: true, data: agences });
});

const getById = asyncHandler(async (req, res) => {
  const agence = await Agence.findByPk(req.params.id, { include: [{ model: Compagnie, as: 'compagnie' }] });
  if (!agence) throw new ApiError(404, 'Agence introuvable.');
  res.json({ success: true, data: agence });
});

const create = asyncHandler(async (req, res) => {
  const agence = await Agence.create(req.body);
  res.status(201).json({ success: true, data: agence, message: 'Agence créée.' });
});

const update = asyncHandler(async (req, res) => {
  const agence = await Agence.findByPk(req.params.id);
  if (!agence) throw new ApiError(404, 'Agence introuvable.');
  await agence.update(req.body);
  res.json({ success: true, data: agence, message: 'Agence mise à jour.' });
});

const remove = asyncHandler(async (req, res) => {
  const agence = await Agence.findByPk(req.params.id);
  if (!agence) throw new ApiError(404, 'Agence introuvable.');
  await agence.destroy();
  res.json({ success: true, message: 'Agence supprimée.' });
});

module.exports = { list, getById, create, update, remove };
