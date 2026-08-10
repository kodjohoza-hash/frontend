const {
  Conversation,
  ConversationParticipant,
  Message,
  Client,
  Agent,
  Agence,
  Compagnie,
  Depart,
  Reservation,
} = require('../../../models');
const { Op } = require('sequelize');

/* ══════════════════════════════════════════════════════════════
   Conversations & participants
   ══════════════════════════════════════════════════════════════ */

const createConversation = (data) => Conversation.create(data);

const createParticipants = (rows) => ConversationParticipant.bulkCreate(rows);

const touchConversation = (id, date = new Date()) =>
  Conversation.update({ updated_at: date }, { where: { id } });

const findConversationById = (id) =>
  Conversation.findByPk(id, {
    include: [{ model: ConversationParticipant, as: 'participants', required: false }],
  });

const findParticipant = ({ conversationId, participantType, participantId }) =>
  ConversationParticipant.findOne({
    where: { conversation_id: conversationId, participant_type: participantType, participant_id: participantId },
  });

/** Participants de l'utilisateur (avec leur conversation, triées par activité). */
const findMyConversationsPage = async (participantType, participantId, { page = 1, limit = 20 }) => {
  const matched = await ConversationParticipant.findAll({
    where: { participant_type: participantType, participant_id: participantId },
    include: [{ model: Conversation, as: 'conversation', required: true, attributes: ['updated_at'] }],
    order: [[{ model: Conversation, as: 'conversation' }, 'updated_at', 'DESC']],
  });
  const count = matched.length;
  const pageIds = matched.slice((page - 1) * limit, (page - 1) * limit + limit).map((m) => m.conversation_id);
  let rows = [];
  if (pageIds.length) {
    rows = await ConversationParticipant.findAll({
      where: {
        conversation_id: { [Op.in]: pageIds },
        participant_type: participantType,
        participant_id: participantId,
      },
      include: [
        {
          model: Conversation,
          as: 'conversation',
          required: true,
          include: [{ model: ConversationParticipant, as: 'participants', required: false }],
        },
      ],
    });
  }
  return { rows, count };
};

/** Dédoublonnage : conversation existante client ↔ compagnie (même contexte). */
const findClientCompanyConversation = async (clientId, compagnieId, contextType, contextId) =>
  Conversation.findOne({
    where: {
      context_type: contextType || null,
      context_id: contextId || null,
      company_id: compagnieId,
    },
    include: [
      {
        model: ConversationParticipant,
        as: 'participants',
        required: true,
        where: { participant_type: 'client', participant_id: clientId },
      },
    ],
  });

/** Dédoublonnage : conversation existante compagnie (super_admin ↔ compagnie). */
const findCompanyConversation = async (compagnieId, contextType, contextId) =>
  Conversation.findOne({
    where: { context_type: contextType || null, context_id: contextId || null, company_id: compagnieId },
  });

/** Dédoublonnage générique : conversation contenant EXACTEMENT tous les participants attendus. */
const findConversationByParticipants = async ({ agentIds = [], clientIds = [], compagnieId = null, contextType = null, contextId = null }) => {
  const expected = [
    ...agentIds.map((id) => `agent:${id}`),
    ...clientIds.map((id) => `client:${id}`),
  ];
  if (!expected.length) return null;
  const where = { context_type: contextType || null, context_id: contextId || null };
  where.company_id = compagnieId ? compagnieId : null;
  const convs = await Conversation.findAll({
    where,
    include: [{ model: ConversationParticipant, as: 'participants', required: true }],
  });
  for (const c of convs) {
    const ids = c.participants.map((p) => `${p.participant_type}:${p.participant_id}`);
    if (expected.every((e) => ids.includes(e))) return c;
  }
  return null;
};

/** Dédoublonnage : conversation agent ↔ agent (même compagnie). */
const findAgentPairConversation = async (agentA, agentB, compagnieId) => {
  const rows = await Conversation.findAll({
    where: { company_id: compagnieId },
    include: [
      {
        model: ConversationParticipant,
        as: 'participants',
        required: true,
        where: { participant_type: 'agent', participant_id: { [Op.in]: [agentA, agentB] } },
      },
    ],
  });
  for (const c of rows) {
    const ids = c.participants.map((p) => p.participant_id);
    if (ids.includes(agentA) && ids.includes(agentB)) return c;
  }
  return null;
};

/* ══════════════════════════════════════════════════════════════
   Messages
   ══════════════════════════════════════════════════════════════ */

const findLastMessage = (conversationId) =>
  Message.findOne({ where: { conversation_id: conversationId }, order: [['created_at', 'DESC']] });

const findMessages = async (conversationId, { before, limit = 50 }) => {
  const where = { conversation_id: conversationId };
  if (before) where.created_at = { [Op.lt]: before };
  const rows = await Message.findAll({
    where,
    order: [['created_at', 'DESC']],
    limit: limit + 1,
  });
  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  return { items: page.reverse(), hasMore };
};

const createMessage = (data) => Message.create(data);

const findMessageById = (id) => Message.findByPk(id);

const markMessageRead = (message, date = new Date()) =>
  message.update({ read_at: date, status: 'read' });

/** Avance le curseur de lecture d'un participant (messages lus individuellement). */
const advanceParticipantRead = async (conversationId, participantType, participantId, date) => {
  const participant = await findParticipant({ conversationId, participantType, participantId });
  if (!participant) return null;
  const current = participant.read_at ? new Date(participant.read_at).getTime() : 0;
  const next = new Date(date).getTime();
  if (next > current) await participant.update({ read_at: date });
  return participant;
};

const destroyMessage = (message) => message.destroy();

/** Non lues pour un participant dans une conversation (messages des autres). */
const countUnread = (conversationId, participantId, readAt) =>
  Message.count({
    where: {
      conversation_id: conversationId,
      sender_id: { [Op.ne]: participantId },
      created_at: { [Op.gt]: readAt || new Date(0) },
    },
  });

const unreadCountFor = async (participantType, participantId) => {
  const parts = await ConversationParticipant.findAll({
    where: { participant_type: participantType, participant_id: participantId },
  });
  let total = 0;
  for (const p of parts) total += await countUnread(p.conversation_id, p.participant_id, p.read_at);
  return total;
};

/** Nombre de conversations avec au moins un message non lu. */
const unreadConversationsCount = async (participantType, participantId) => {
  const parts = await ConversationParticipant.findAll({
    where: { participant_type: participantType, participant_id: participantId },
  });
  let n = 0;
  for (const p of parts) if ((await countUnread(p.conversation_id, p.participant_id, p.read_at)) > 0) n += 1;
  return n;
};

/** Marquage « lu » : read_at du participant + témoin de lecture des messages. */
const markConversationRead = async ({ conversationId, participantType, participantId, date = new Date() }) => {
  const participant = await findParticipant({ conversationId, participantType, participantId });
  if (!participant) return null;
  await participant.update({ read_at: date });
  await Message.update(
    { read_at: date, status: 'read' },
    { where: { conversation_id: conversationId, sender_id: { [Op.ne]: participantId }, read_at: null } }
  );
  return participant;
};

/* ══════════════════════════════════════════════════════════════
   Entités métier (validation des règles de communication)
   ══════════════════════════════════════════════════════════════ */

const findClientById = (id) => Client.findByPk(id, { attributes: ['id', 'prenom', 'nom', 'telephone', 'email', 'ville_id', 'statut'] });

const findAgentById = (id) =>
  Agent.findByPk(id, {
    attributes: ['id', 'prenom', 'nom', 'email', 'telephone', 'role', 'agence_id', 'statut'],
    include: [
      { model: Agence, as: 'agence', attributes: ['id', 'compagnie_id'], include: [{ model: Compagnie, as: 'compagnie', attributes: ['id', 'nom'] }] },
    ],
  });

const findCompanyById = (id) => Compagnie.findByPk(id, { attributes: ['id', 'nom', 'statut'] });

const findCompanyAdmins = (compagnieId) =>
  Agent.findAll({
    where: { role: 'company_admin', statut: 'actif' },
    include: [{ model: Agence, as: 'agence', where: { compagnie_id: compagnieId }, required: true }],
  });

const findAgentsOfCompany = async (compagnieId, excludeId) => {
  const where = { statut: 'actif' };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Agent.findAll({
    where,
    include: [
      { model: Agence, as: 'agence', where: { compagnie_id: compagnieId }, required: true, include: [{ model: Compagnie, as: 'compagnie', attributes: ['id', 'nom'] }] },
    ],
  });
};

/** Réservation (avec voyage + agence → compagnie). */
const findReservation = (reservationId) =>
  Reservation.findByPk(reservationId, {
    attributes: ['id', 'reference', 'client_id', 'depart_id', 'agence_id'],
    include: [
      { model: Depart, as: 'depart', attributes: ['id', 'code', 'compagnie_id'], include: [{ model: Agence, as: 'agence', attributes: ['compagnie_id'] }] },
    ],
  });

const companyIdOfReservation = (reservation) =>
  reservation?.depart?.compagnie_id ?? reservation?.depart?.agence?.compagnie_id ?? null;

const findDepart = (departId) =>
  Depart.findByPk(departId, {
    attributes: ['id', 'code', 'compagnie_id'],
    include: [{ model: Agence, as: 'agence', attributes: ['compagnie_id'] }],
  });

const findReservationsByIds = (ids) =>
  Reservation.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'reference'] });

const findDepartsByIds = (ids) =>
  Depart.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'code'] });

const companyIdOfDepart = (depart) => depart?.compagnie_id ?? depart?.agence?.compagnie_id ?? null;

/** Compagnie d'un agent (via son agence) — null pour un super_admin sans agence. */
const companyIdOfAgent = (agent) => agent?.agence?.compagnie_id ?? agent?.agence?.compagnie?.id ?? null;

/** Compagnies avec lesquelles un client a au moins une réservation. */
const findCompaniesOfClient = async (clientId) => {
  const reservations = await Reservation.findAll({
    where: { client_id: clientId },
    attributes: ['id'],
    include: [
      { model: Depart, as: 'depart', attributes: ['id', 'compagnie_id'], include: [{ model: Agence, as: 'agence', attributes: ['compagnie_id'] }] },
    ],
  });
  const set = new Set();
  for (const r of reservations) {
    const c = companyIdOfReservation(r);
    if (c) set.add(c);
  }
  return [...set];
};

/** Clients ayant au moins une réservation sur la compagnie. */
const findClientIdsOfCompany = async (compagnieId) => {
  const [byDepart, byAgency] = await Promise.all([
    Reservation.findAll({
      attributes: ['client_id'],
      group: ['client_id'],
      include: [
        { model: Depart, as: 'depart', required: true, attributes: [], where: { compagnie_id: compagnieId } },
      ],
    }),
    Reservation.findAll({
      attributes: ['client_id'],
      group: ['client_id'],
      include: [
        {
          model: Depart,
          as: 'depart',
          required: true,
          attributes: [],
          include: [{ model: Agence, as: 'agence', required: true, attributes: [], where: { compagnie_id: compagnieId } }],
        },
      ],
    }),
  ]);
  return [...new Set([...byDepart, ...byAgency].map((r) => r.client_id))];
};

const findActiveCompanies = () =>
  Compagnie.findAll({ where: { statut: 'actif' }, attributes: ['id', 'nom'] });

/* ── Résolution en masse (sérialisation des listes) ── */
const findClientsByIds = (ids) =>
  Client.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'prenom', 'nom'] });

const findAgentsByIds = (ids) =>
  Agent.findAll({
    where: { id: { [Op.in]: ids } },
    attributes: ['id', 'prenom', 'nom', 'role', 'agence_id'],
    include: [
      { model: Agence, as: 'agence', attributes: ['compagnie_id'], include: [{ model: Compagnie, as: 'compagnie', attributes: ['id', 'nom'] }] },
    ],
  });

const findCompaniesByIds = (ids) =>
  Compagnie.findAll({ where: { id: { [Op.in]: ids } }, attributes: ['id', 'nom'] });

module.exports = {
  createConversation,
  createParticipants,
  touchConversation,
  findConversationById,
  findParticipant,
  findMyConversationsPage,
  findClientCompanyConversation,
  findCompanyConversation,
  findConversationByParticipants,
  findAgentPairConversation,
  findLastMessage,
  findMessages,
  createMessage,
  findMessageById,
  markMessageRead,
  advanceParticipantRead,
  destroyMessage,
  countUnread,
  unreadCountFor,
  unreadConversationsCount,
  markConversationRead,
  findClientById,
  findAgentById,
  findCompanyById,
  findCompanyAdmins,
  findAgentsOfCompany,
  findReservation,
  companyIdOfReservation,
  findDepart,
  companyIdOfDepart,
  companyIdOfAgent,
  findCompaniesOfClient,
  findClientIdsOfCompany,
  findActiveCompanies,
  findClientsByIds,
  findAgentsByIds,
  findReservationsByIds,
  findDepartsByIds,
  findCompaniesByIds,
};
