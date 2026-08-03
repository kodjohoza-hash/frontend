const { Agent, Agence } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const agents = await Agent.findAll({ include: [{ model: Agence, as: 'agence' }], order: [['matricule', 'ASC']] });
  res.json({ success: true, data: agents });
});

const getById = asyncHandler(async (req, res) => {
  const agent = await Agent.findByPk(req.params.id, { include: [{ model: Agence, as: 'agence' }] });
  if (!agent) throw new ApiError(404, 'Agent introuvable.');
  res.json({ success: true, data: agent });
});

const create = asyncHandler(async (req, res) => {
  const agent = await Agent.create(req.body);
  res.status(201).json({ success: true, data: agent, message: 'Agent créé.' });
});

const update = asyncHandler(async (req, res) => {
  const agent = await Agent.findByPk(req.params.id);
  if (!agent) throw new ApiError(404, 'Agent introuvable.');
  await agent.update(req.body);
  res.json({ success: true, data: agent, message: 'Agent mis à jour.' });
});

const remove = asyncHandler(async (req, res) => {
  const agent = await Agent.findByPk(req.params.id);
  if (!agent) throw new ApiError(404, 'Agent introuvable.');
  await agent.destroy();
  res.json({ success: true, message: 'Agent supprimé.' });
});

module.exports = { list, getById, create, update, remove };
