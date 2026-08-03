const { Abonnement, Agence, Compagnie } = require('../models');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { abonnementService } = require('../services');

const list = asyncHandler(async (req, res) => {
  const abonnements = await Abonnement.findAll({
    include: [{ model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] }],
    order: [['annee', 'DESC'], ['mois', 'DESC']],
  });
  res.json({ success: true, data: abonnements });
});

const getById = asyncHandler(async (req, res) => {
  const abonnement = await Abonnement.findByPk(req.params.id, {
    include: [{ model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] }],
  });
  if (!abonnement) throw new ApiError(404, 'Abonnement introuvable.');
  res.json({ success: true, data: abonnement });
});

const create = asyncHandler(async (req, res) => {
  const abonnement = await abonnementService.creerAbonnement(req.body);
  res.status(201).json({ success: true, data: abonnement, message: 'Abonnement créé.' });
});

const update = asyncHandler(async (req, res) => {
  const abonnement = await Abonnement.findByPk(req.params.id);
  if (!abonnement) throw new ApiError(404, 'Abonnement introuvable.');
  await abonnement.update(req.body);
  res.json({ success: true, data: abonnement, message: 'Abonnement mis à jour.' });
});

/** Exécute la suspension automatique (utile en dev / admin). */
const runSuspension = asyncHandler(async (_req, res) => {
  const suspendus = await abonnementService.suspendreAbonnementsExpires();
  const retards = await abonnementService.marquerEnRetard();
  res.json({ success: true, message: 'Suspension effectuée.', data: { suspendus, retards } });
});

module.exports = { list, getById, create, update, runSuspension };
