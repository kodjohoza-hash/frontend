const { HistoriqueAbonnement, PlanAbonnement } = require('../../../models');

const create = (data, transaction) => HistoriqueAbonnement.create(data, { transaction });

const findByCompany = (compagnieId, limit = 50) =>
  HistoriqueAbonnement.findAll({
    where: { compagnie_id: compagnieId },
    include: [{ model: PlanAbonnement, as: 'plan' }],
    order: [['date', 'DESC']],
    limit,
  });

module.exports = { create, findByCompany };
