const { NotificationAbonnement, Compagnie } = require('../../../models');

const create = (data, transaction) => NotificationAbonnement.create(data, { transaction });

const findOne = (where) => NotificationAbonnement.findOne({ where });

const findByCompany = (compagnieId, limit = 20) =>
  NotificationAbonnement.findAll({
    where: { compagnie_id: compagnieId },
    include: [{ model: Compagnie, as: 'compagnie' }],
    order: [['date_envoi', 'DESC']],
    limit,
  });

const findAll = (where = {}, options = {}) =>
  NotificationAbonnement.findAll({ where, include: [{ model: Compagnie, as: 'compagnie' }], order: [['date_envoi', 'DESC']], ...options });

module.exports = { create, findOne, findByCompany, findAll };
