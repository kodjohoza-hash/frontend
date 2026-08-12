const asyncHandler = require('../../../utils/asyncHandler');
const { subscriptionService } = require('../services');
const { auditWriter } = require('../../admin/services');

const list = asyncHandler(async (req, res) => {
  const abonnements = await subscriptionService.list(req.query);
  res.json({ success: true, data: abonnements });
});

const getById = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.getById(req.params.id);
  res.json({ success: true, data: abonnement });
});

/** Abonnement de MA compagnie (espace compagnie/guichet). */
const mine = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.getByCompany(req.user.compagnieId);
  res.json({ success: true, data: abonnement });
});

const create = asyncHandler(async (req, res) => {
  const auteur = req.user.role === 'super_admin' ? 'super_admin' : 'systeme';
  const abonnement = await subscriptionService.create(req.body, auteur);
  await auditWriter.audit({
    actor: req.user,
    action: 'create',
    entite: 'abonnement',
    entiteId: abonnement.id,
    details: { compagnie_id: abonnement.compagnie_id, plan_id: abonnement.plan_id, statut: abonnement.statut },
    req,
  });
  res.status(201).json({ success: true, data: abonnement, message: 'Abonnement créé.' });
});

const renew = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.renew(req.params.compagnieId, req.body, req.user.role);
  await auditWriter.audit({
    actor: req.user,
    action: 'renew',
    entite: 'abonnement',
    entiteId: abonnement.id,
    details: { compagnie_id: req.params.compagnieId, plan_id: abonnement.plan_id, statut: 'actif' },
    req,
  });
  res.json({ success: true, data: abonnement, message: 'Abonnement renouvelé.' });
});

const suspend = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.suspend(req.params.compagnieId, req.body.motif, req.user.role);
  await auditWriter.audit({
    actor: req.user,
    action: 'suspend',
    entite: 'abonnement',
    entiteId: abonnement.id,
    details: { compagnie_id: req.params.compagnieId, motif: req.body.motif || null },
    req,
  });
  res.json({ success: true, message: 'Abonnement suspendu.' });
});

const reactivate = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.reactivate(req.params.compagnieId, req.user.role);
  await auditWriter.audit({
    actor: req.user,
    action: 'reactivate',
    entite: 'abonnement',
    entiteId: abonnement.id,
    details: { compagnie_id: req.params.compagnieId, statut: 'actif' },
    req,
  });
  res.json({ success: true, message: 'Abonnement réactivé.' });
});

module.exports = { list, getById, mine, create, renew, suspend, reactivate };
