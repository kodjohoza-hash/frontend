const { PaiementAbonnementCompagnie, Compagnie, PlanAbonnement } = require('../../../models');

const includeCompanyPlan = [
  { model: Compagnie, as: 'compagnie' },
  { model: PlanAbonnement, as: 'plan' },
];

const findAll = (where = {}, options = {}) =>
  PaiementAbonnementCompagnie.findAll({ where, include: includeCompanyPlan, order: [['date', 'DESC']], ...options });

const findById = (id) => PaiementAbonnementCompagnie.findByPk(id, { include: includeCompanyPlan });

const create = (data, transaction) => PaiementAbonnementCompagnie.create(data, { transaction });

const sumByCompany = async () => {
  const rows = await PaiementAbonnementCompagnie.findAll({
    include: [{ model: Compagnie, as: 'compagnie' }],
    attributes: [
      'compagnie_id',
      [require('sequelize').col('compagnie.nom'), 'compagnie_nom'],
      [require('sequelize').fn('SUM', require('sequelize').col('PaiementAbonnementCompagnie.montant')), 'total'],
      [require('sequelize').fn('COUNT', require('sequelize').col('PaiementAbonnementCompagnie.id')), 'nb_paiements'],
    ],
    where: { statut: 'paye' },
    group: ['compagnie_id'],
  });
  return rows;
};

module.exports = { findAll, findById, create, sumByCompany };
