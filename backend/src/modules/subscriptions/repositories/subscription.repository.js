const { Op } = require('sequelize');
const { AbonnementCompagnie, Compagnie, PlanAbonnement } = require('../../../models');

const includeCompanyAndPlan = [
  { model: Compagnie, as: 'compagnie' },
  { model: PlanAbonnement, as: 'plan' },
  { model: PlanAbonnement, as: 'planPrecedent' },
];

const findByCompany = (compagnieId, options = {}) =>
  AbonnementCompagnie.findOne({ where: { compagnie_id: compagnieId }, include: includeCompanyAndPlan, ...options });

const findById = (id, options = {}) =>
  AbonnementCompagnie.findByPk(id, { include: includeCompanyAndPlan, ...options });

const findAll = (where = {}, options = {}) =>
  AbonnementCompagnie.findAll({ where, include: includeCompanyAndPlan, ...options });

const findActive = () =>
  AbonnementCompagnie.findAll({ where: { statut: { [Op.in]: ['actif', 'en_retard'] } }, include: includeCompanyAndPlan });

const create = (data, transaction) =>
  AbonnementCompagnie.create(data, { transaction });

const update = (sub, data, transaction) => sub.update(data, { transaction });

const destroy = (sub, transaction) => sub.destroy({ transaction });

module.exports = { findByCompany, findById, findAll, findActive, create, update, destroy };
