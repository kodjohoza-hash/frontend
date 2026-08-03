const { PaiementAbonnement, Abonnement, Agence, Compagnie } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { abonnementService } = require('../services');

const list = asyncHandler(async (req, res) => {
  const paiements = await PaiementAbonnement.findAll({
    include: [
      { model: Abonnement, as: 'abonnement', include: [{ model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] }] },
      { model: Compagnie, as: 'compagnie' },
    ],
    order: [['date', 'DESC']],
  });
  res.json({ success: true, data: paiements });
});

const revenusParCompagnie = asyncHandler(async (_req, res) => {
  const revenus = await abonnementService.revenusParCompagnie();
  res.json({ success: true, data: revenus });
});

module.exports = { list, revenusParCompagnie };
