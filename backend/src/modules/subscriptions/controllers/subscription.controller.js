const asyncHandler = require('../../../utils/asyncHandler');
const { subscriptionService } = require('../services');

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
  res.status(201).json({ success: true, data: abonnement, message: 'Abonnement créé.' });
});

const renew = asyncHandler(async (req, res) => {
  const abonnement = await subscriptionService.renew(req.params.compagnieId, req.body, req.user.role);
  res.json({ success: true, data: abonnement, message: 'Abonnement renouvelé.' });
});

const suspend = asyncHandler(async (req, res) => {
  await subscriptionService.suspend(req.params.compagnieId, req.body.motif, req.user.role);
  res.json({ success: true, message: 'Abonnement suspendu.' });
});

const reactivate = asyncHandler(async (req, res) => {
  await subscriptionService.reactivate(req.params.compagnieId, req.user.role);
  res.json({ success: true, message: 'Abonnement réactivé.' });
});

module.exports = { list, getById, mine, create, renew, suspend, reactivate };
