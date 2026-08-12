const asyncHandler = require('../../../utils/asyncHandler');
const { planService } = require('../services');
const { auditWriter } = require('../../admin/services');

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
  await auditWriter.audit({
    actor: req.user,
    action: 'create',
    entite: 'plan',
    entiteId: plan.id,
    details: { code: plan.code, nom: plan.nom },
    req,
  });
  res.status(201).json({ success: true, data: plan, message: 'Plan créé.' });
});

const update = asyncHandler(async (req, res) => {
  const plan = await planService.updatePlan(req.params.id, req.body);
  await auditWriter.audit({
    actor: req.user,
    action: 'update',
    entite: 'plan',
    entiteId: plan.id,
    details: { code: plan.code, nom: plan.nom },
    req,
  });
  res.json({ success: true, data: plan, message: 'Plan mis à jour.' });
});

const remove = asyncHandler(async (req, res) => {
  const plan = await planService.removePlan(req.params.id);
  await auditWriter.audit({
    actor: req.user,
    action: 'delete',
    entite: 'plan',
    entiteId: plan.id,
    details: { code: plan.code, nom: plan.nom },
    req,
  });
  res.json({ success: true, message: 'Plan supprimé.' });
});

module.exports = { list, getById, create, update, remove };
