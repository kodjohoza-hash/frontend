const { PlanAbonnement } = require('../../../models');

const findAll = (where = {}, options = {}) =>
  PlanAbonnement.findAll({ where, order: [['ordre', 'ASC']], ...options });

const findById = (id) => PlanAbonnement.findByPk(id);

const findByCode = (code) => PlanAbonnement.findOne({ where: { code } });

const create = (data) => PlanAbonnement.create(data);

const update = (plan, data) => plan.update(data);

const remove = (plan) => plan.destroy();

module.exports = { findAll, findById, findByCode, create, update, remove };
