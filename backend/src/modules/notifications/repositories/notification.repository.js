const { Notification, Agent, Agence, Reservation, Depart } = require('../../../models');
const { Op } = require('sequelize');

/** Statuts de réservation « actives » — les voyageurs concernés par un événement voyage. */
const ACTIVE_STATUTS = ['confirmee', 'payee', 'partiellement_payee'];

const create = (data) => Notification.create(data);

/** Existence pour idempotence (même événement → pas de doublon). */
const findDuplicate = ({ recipientId, type, referenceKey }) => {
  if (!referenceKey) return Promise.resolve(null);
  return Notification.findOne({
    where: { recipient_id: recipientId, type, reference_key: referenceKey },
  });
};

const findPage = async ({ recipientId, where = {}, page = 1, limit = 20 }) => {
  const base = { recipient_id: recipientId };
  if (where.statut === 'lu') base.read_at = { [Op.ne]: null };
  if (where.statut === 'non_lu') base.read_at = null;
  if (where.type) base.type = where.type;

  const { rows, count } = await Notification.findAndCountAll({
    where: base,
    order: [['created_at', 'DESC']],
    offset: (page - 1) * limit,
    limit,
  });
  return { rows, count };
};

const unreadCount = (recipientId) =>
  Notification.count({ where: { recipient_id: recipientId, read_at: null } });

const findByOwned = (id, recipientId) =>
  Notification.findOne({ where: { id, recipient_id: recipientId } });

const markRead = (notification) => notification.update({ read_at: new Date() });

const markAllRead = (recipientId) =>
  Notification.update({ read_at: new Date() }, { where: { recipient_id: recipientId, read_at: null } });

const destroy = (notification) => notification.destroy();

/* ══════════════════════════════════════════════════════════════
   Cibles d'envoi (déduites côté serveur, jamais du frontend)
   ══════════════════════════════════════════════════════════════ */

/** Agents company_admin actifs rattachés à la compagnie (via leur agence). */
const findCompanyAdmins = (compagnieId) =>
  Agent.findAll({
    where: { role: 'company_admin', statut: 'actif' },
    include: [{ model: Agence, as: 'agence', where: { compagnie_id: compagnieId }, required: true }],
  });

/** Agents super_admin actifs. */
const findSuperAdmins = () => Agent.findAll({ where: { role: 'super_admin', statut: 'actif' } });

/** Clients ayant des réservations actives sur un voyage (destinataires d'une annulation). */
const findClientsByDepart = async (departId) => {
  const rows = await Reservation.findAll({
    where: { depart_id: departId, statut: { [Op.in]: ACTIVE_STATUTS } },
    attributes: ['client_id'],
    group: ['client_id'],
  });
  return rows.map((r) => r.client_id);
};

/** Compagnie propriétaire d'un voyage (via agence). */
const findCompanyByDepart = async (departId) => {
  const depart = await Depart.findByPk(departId, {
    attributes: ['id', 'agence_id'],
    include: [{ model: Agence, as: 'agence', attributes: ['id', 'compagnie_id'] }],
  });
  return depart?.agence?.compagnie_id ?? null;
};

module.exports = {
  create,
  findDuplicate,
  findPage,
  unreadCount,
  findByOwned,
  markRead,
  markAllRead,
  destroy,
  findCompanyAdmins,
  findSuperAdmins,
  findClientsByDepart,
  findCompanyByDepart,
  ACTIVE_STATUTS,
};
