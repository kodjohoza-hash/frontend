const asyncHandler = require('../../../utils/asyncHandler');
const { planService } = require('../services');

const list = asyncHandler(async (_req, res) => {
  const plans = await planService.listPlans();
  res.json({ success: true, data: plans });
});

const getById = asyncHandler(async (req, res) => {
  const plan = await planService.getPlan(req.params.id);
  res.json({ success: true, data: plan });
});

const create = asyncHandler(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  res.status(201).json({ success: true, data: plan, message: 'Plan créé.' });
});

const update = asyncHandler(async (req, res) => {
  const plan = await planService.updatePlan(req.params.id, req.body);
  res.json({ success: true, data: plan, message: 'Plan mis à jour.' });
});

const remove = asyncHandler(async (req, res) => {
  await planService.removePlan(req.params.id);
  res.json({ success: true, message: 'Plan supprimé.' });
});

module.exports = { list, getById, create, update, remove };
