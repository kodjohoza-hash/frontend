const { sequelize, Compagnie, Agence, Agent, Abonnement, PaiementAbonnement } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const globalStats = asyncHandler(async (_req, res) => {
  const [
    compagnies,
    agences,
    agents,
    abonnementsActifs,
    abonnementsEnRetard,
    revenus,
  ] = await Promise.all([
    Compagnie.count(),
    Agence.count(),
    Agent.count(),
    Abonnement.count({ where: { statut: 'actif' } }),
    Abonnement.count({ where: { statut_paiement: 'en_retard' } }),
    PaiementAbonnement.sum('montant'),
  ]);

  res.json({
    success: true,
    data: {
      compagnies,
      agences,
      agents,
      abonnementsActifs,
      abonnementsEnRetard,
      revenus: revenus || 0,
    },
  });
});

const dbHealth = asyncHandler(async (_req, res) => {
  await sequelize.authenticate();
  res.json({ success: true, message: 'Connexion base de données OK.' });
});

module.exports = { globalStats, dbHealth };
