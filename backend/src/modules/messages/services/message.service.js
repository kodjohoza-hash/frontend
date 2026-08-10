const ApiError = require('../../../utils/ApiError');
const { ulid } = require('../../../utils/ulid');
const messageRepository = require('../repositories/message.repository');

/**
 * Service de messagerie interne (Module 17).
 *
 * Règles de communication strictes :
 *  - un CLIENT ne peut écrire qu'à une compagnie avec laquelle il a une
 *    réservation, ou au super_admin (support) ;
 *  - un company_admin / counter_agent ne peut contacter que des agents de SA
 *    propre compagnie ; seul le company_admin peut écrire à un client (client
 *    ayant au moins une réservation sur la compagnie) ;
 *  - un super_admin peut écrire à toute compagnie active, à tout agent et à
 *    tout client.
 * L'accès à une conversation est TOUJOURS validé par la table
 * `conversation_participant` : aucun id reçu du frontend ne fait autorité.
 */

/* ══════════════════════════════════════════════════════════════
   Acteur & utilitaires de sérialisation
   ══════════════════════════════════════════════════════════════ */

const getActorInfo = (actor) => {
  const isClient = actor.role === 'client';
  return {
    isClient,
    participantType: isClient ? 'client' : 'agent',
    participantId: actor.id,
    compagnieId: isClient ? null : actor.compagnieId ?? null,
  };
};

const initials = (name) =>
  String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

const serializeMessage = (message) => ({
  id: message.id,
  conversationId: message.conversation_id,
  senderType: message.sender_type,
  senderId: message.sender_id,
  content: message.content,
  status: message.status,
  read: Boolean(message.read_at),
  readAt: message.read_at || null,
  createdAt: message.created_at || null,
});

/** Vérifie que l'utilisateur est bien participant de la conversation. */
const assertParticipant = async (conversation, actor) => {
  if (!conversation) throw new ApiError(404, 'Conversation introuvable.');
  const { participantType, participantId } = getActorInfo(actor);
  const isMember = (conversation.participants || []).some(
    (p) => p.participant_type === participantType && p.participant_id === participantId
  );
  if (!isMember) throw new ApiError(403, 'Accès refusé à cette conversation.');
};

/** Résolution en masse des noms (clients / agents / compagnies) d'un lot de conversations. */
const resolveNameMaps = async (conversations) => {
  const clientIds = new Set();
  const agentIds = new Set();
  const companyIds = new Set();
  conversations.forEach((c) => {
    if (c.company_id) companyIds.add(c.company_id);
    (c.participants || []).forEach((p) => {
      if (p.participant_type === 'client') clientIds.add(p.participant_id);
      else agentIds.add(p.participant_id);
    });
  });
  const [clients, agents, companies] = await Promise.all([
    clientIds.size ? messageRepository.findClientsByIds([...clientIds]) : Promise.resolve([]),
    agentIds.size ? messageRepository.findAgentsByIds([...agentIds]) : Promise.resolve([]),
    companyIds.size ? messageRepository.findCompaniesByIds([...companyIds]) : Promise.resolve([]),
  ]);
  return {
    clientMap: new Map(clients.map((c) => [c.id, c])),
    agentMap: new Map(agents.map((a) => [a.id, a])),
    companyMap: new Map(companies.map((c) => [c.id, c])),
  };
};

/** Résolution en masse des contextes (réservation / voyage / compagnie). */
const resolveContextMap = async (conversations) => {
  const resIds = new Set();
  const depIds = new Set();
  const compIds = new Set();
  conversations.forEach((c) => {
    if (c.context_type === 'reservation' && c.context_id) resIds.add(c.context_id);
    else if (c.context_type === 'voyage' && c.context_id) depIds.add(c.context_id);
    else if (c.context_type === 'company' && c.context_id) compIds.add(c.context_id);
  });
  const [reservations, departs, companies] = await Promise.all([
    resIds.size ? messageRepository.findReservationsByIds([...resIds]) : Promise.resolve([]),
    depIds.size ? messageRepository.findDepartsByIds([...depIds]) : Promise.resolve([]),
    compIds.size ? messageRepository.findCompaniesByIds([...compIds]) : Promise.resolve([]),
  ]);
  const resMap = new Map(reservations.map((r) => [r.id, r]));
  const depMap = new Map(departs.map((d) => [d.id, d]));
  const compMap = new Map(companies.map((c) => [c.id, c]));

  const map = new Map();
  conversations.forEach((c) => {
    const t = c.context_type;
    if (t === 'reservation') {
      const r = resMap.get(c.context_id);
      map.set(c.id, { type: t, id: c.context_id, reference: r?.reference || null, label: r ? `Réservation ${r.reference}` : null });
    } else if (t === 'voyage') {
      const d = depMap.get(c.context_id);
      map.set(c.id, { type: t, id: c.context_id, reference: d?.code || null, label: d ? `Voyage ${d.code}` : null });
    } else if (t === 'company') {
      const co = compMap.get(c.context_id);
      map.set(c.id, { type: t, id: c.context_id, reference: co?.nom || null, label: co?.nom || null });
    } else {
      map.set(c.id, null);
    }
  });
  return map;
};

const serializeParticipant = (p, { clientMap, agentMap }) => {
  if (p.participant_type === 'client') {
    const c = clientMap.get(p.participant_id);
    return {
      type: 'client',
      id: p.participant_id,
      name: c ? `${c.prenom} ${c.nom}` : 'Client',
      initials: c ? initials(`${c.prenom} ${c.nom}`) : 'CL',
      role: 'client',
      company: null,
      companyName: null,
    };
  }
  const a = agentMap.get(p.participant_id);
  return {
    type: 'agent',
    id: p.participant_id,
    name: a ? `${a.prenom} ${a.nom}` : 'Agent',
    initials: a ? initials(`${a.prenom} ${a.nom}`) : 'AG',
    role: a?.role || 'agent',
    company: a?.agence?.compagnie?.id || null,
    companyName: a?.agence?.compagnie?.nom || null,
  };
};

/** Interlocuteur affiché en en-tête (compagnie pour le client, sinon client / autre agent). */
const resolveOtherParty = ({ conversation, actor, participants, companyName }) => {
  if (actor.role === 'client') {
    return {
      type: 'company',
      id: conversation.company_id,
      name: companyName,
      initials: initials(companyName || 'Cie'),
      role: 'company',
    };
  }
  const client = participants.find((p) => p.type === 'client');
  if (client) return client;
  const otherAgent = participants.find((p) => p.type === 'agent' && p.id !== actor.id);
  if (otherAgent) return otherAgent;
  return {
    type: 'company',
    id: conversation.company_id,
    name: companyName,
    initials: initials(companyName || 'Cie'),
    role: 'company',
  };
};

const serializeConversation = async ({ conversation, actor, nameMaps, contextMap }) => {
  const { participantType, participantId } = getActorInfo(actor);
  const participants = (conversation.participants || []).map((p) => serializeParticipant(p, nameMaps));
  const companyName = nameMaps.companyMap.get(conversation.company_id)?.nom || null;
  const lastMessage = await messageRepository.findLastMessage(conversation.id);
  const myParticipant = (conversation.participants || []).find(
    (p) => p.participant_type === participantType && p.participant_id === participantId
  );
  const myReadAt = myParticipant?.read_at || null;
  const unreadCount = await messageRepository.countUnread(conversation.id, participantId, myReadAt);

  return {
    id: conversation.id,
    subject: conversation.subject,
    context: contextMap.get(conversation.id) || null,
    company: { id: conversation.company_id, name: companyName },
    otherParty: resolveOtherParty({ conversation, actor, participants, companyName }),
    participants,
    lastMessage: lastMessage ? serializeMessage(lastMessage) : null,
    lastMessageAt: lastMessage ? lastMessage.created_at : conversation.updated_at,
    unreadCount,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
};

/* ══════════════════════════════════════════════════════════════
   Conversations
   ══════════════════════════════════════════════════════════════ */

const listConversations = async ({ actor, query }) => {
  const { participantType, participantId } = getActorInfo(actor);
  const { rows, count } = await messageRepository.findMyConversationsPage(participantType, participantId, query);
  const conversations = rows.map((r) => r.conversation);
  const [nameMaps, contextMap] = await Promise.all([
    resolveNameMaps(conversations),
    resolveContextMap(conversations),
  ]);
  const items = [];
  for (const conversation of conversations) {
    items.push(await serializeConversation({ conversation, actor, nameMaps, contextMap }));
  }
  return { items, total: count, page: query.page || 1, limit: query.limit || 20 };
};

const getConversation = async ({ actor, conversationId }) => {
  const conversation = await messageRepository.findConversationById(conversationId);
  await assertParticipant(conversation, actor);
  const [nameMaps, contextMap] = await Promise.all([
    resolveNameMaps([conversation]),
    resolveContextMap([conversation]),
  ]);
  return serializeConversation({ conversation, actor, nameMaps, contextMap });
};

const createConversation = async ({ actor, body }) => {
  const isClient = actor.role === 'client';
  const { subject, recipient, context } = body;
  const recipientType = recipient?.type;
  const recipientId = recipient?.id;

  if (!recipientType || !recipientId) throw new ApiError(400, 'Destinataire requis.');

  let agentIds = [];
  let clientIds = [];
  let compagnieId = null;

  if (isClient) {
    if (recipientType === 'agent') {
      const target = await messageRepository.findAgentById(recipientId);
      if (!target || target.statut !== 'actif') throw new ApiError(404, 'Agent introuvable.');
      if (target.role !== 'super_admin') {
        throw new ApiError(403, 'Vous ne pouvez écrire qu’au support (super admin).');
      }
      clientIds = [actor.id];
      agentIds = [target.id];
      compagnieId = null;
    } else if (recipientType === 'company') {
      const companies = await messageRepository.findCompaniesOfClient(actor.id);
      if (!companies.includes(recipientId)) {
        throw new ApiError(403, 'Vous n’avez aucune réservation avec cette compagnie.');
      }
      const admins = await messageRepository.findCompanyAdmins(recipientId);
      clientIds = [actor.id];
      agentIds = admins.map((a) => a.id);
      compagnieId = recipientId;
    } else {
      throw new ApiError(400, 'Destinataire invalide.');
    }
  } else if (actor.role === 'super_admin') {
    if (recipientType === 'company') {
      const company = await messageRepository.findCompanyById(recipientId);
      if (!company || company.statut !== 'actif') throw new ApiError(404, 'Compagnie introuvable.');
      const admins = await messageRepository.findCompanyAdmins(recipientId);
      agentIds = [actor.id, ...admins.map((a) => a.id)];
      compagnieId = recipientId;
    } else if (recipientType === 'agent') {
      const target = await messageRepository.findAgentById(recipientId);
      if (!target || target.statut !== 'actif') throw new ApiError(404, 'Agent introuvable.');
      agentIds = [actor.id, target.id];
      compagnieId = messageRepository.companyIdOfAgent(target);
    } else if (recipientType === 'client') {
      const target = await messageRepository.findClientById(recipientId);
      if (!target) throw new ApiError(404, 'Client introuvable.');
      clientIds = [target.id];
      agentIds = [actor.id];
      compagnieId = null;
    } else {
      throw new ApiError(400, 'Destinataire invalide.');
    }
  } else {
    /* company_admin / counter_agent : uniquement sa propre compagnie */
    const ownCompany = actor.compagnieId;
    if (!ownCompany) throw new ApiError(403, 'Aucune compagnie rattachée à ce compte.');

    if (recipientType === 'agent') {
      const target = await messageRepository.findAgentById(recipientId);
      if (!target || target.statut !== 'actif') throw new ApiError(404, 'Agent introuvable.');
      const targetCompany = messageRepository.companyIdOfAgent(target);
      if (targetCompany !== ownCompany) {
        throw new ApiError(403, 'Impossible de contacter un agent d’une autre compagnie.');
      }
      if (target.id === actor.id) throw new ApiError(400, 'Impossible de se contacter soi-même.');
      agentIds = [actor.id, target.id];
      compagnieId = ownCompany;
    } else if (recipientType === 'client' && actor.role === 'company_admin') {
      const target = await messageRepository.findClientById(recipientId);
      if (!target) throw new ApiError(404, 'Client introuvable.');
      const clientIdsOfCompany = await messageRepository.findClientIdsOfCompany(ownCompany);
      if (!clientIdsOfCompany.includes(target.id)) {
        throw new ApiError(403, 'Ce client n’a pas de réservation avec votre compagnie.');
      }
      const admins = await messageRepository.findCompanyAdmins(ownCompany);
      clientIds = [target.id];
      agentIds = admins.map((a) => a.id);
      compagnieId = ownCompany;
    } else {
      throw new ApiError(403, 'Action non autorisée pour ce profil.');
    }
  }

  /* Contexte optionnel : réservation / voyage / compagnie */
  let contextType = null;
  let contextId = null;
  if (context?.type && context?.id) {
    const { type, id } = context;
    if (type === 'reservation') {
      const res = await messageRepository.findReservation(id);
      if (!res) throw new ApiError(404, 'Réservation introuvable.');
      if (compagnieId && messageRepository.companyIdOfReservation(res) !== compagnieId) {
        throw new ApiError(403, 'Réservation d’une autre compagnie.');
      }
      if (isClient && res.client_id !== actor.id) throw new ApiError(403, 'Réservation introuvable.');
      contextType = 'reservation';
      contextId = res.id;
    } else if (type === 'voyage') {
      const dep = await messageRepository.findDepart(id);
      if (!dep) throw new ApiError(404, 'Voyage introuvable.');
      if (compagnieId && messageRepository.companyIdOfDepart(dep) !== compagnieId) {
        throw new ApiError(403, 'Voyage d’une autre compagnie.');
      }
      contextType = 'voyage';
      contextId = dep.id;
    } else if (type === 'company') {
      contextType = 'company';
      contextId = compagnieId;
    } else {
      throw new ApiError(400, 'Contexte invalide.');
    }
  }

  /* Dédoublonnage : réutilise la conversation existante (mêmes participants + contexte). */
  const existing = await messageRepository.findConversationByParticipants({
    agentIds,
    clientIds,
    compagnieId,
    contextType,
    contextId,
  });
  if (existing) return { conversation: existing, created: false };

  const now = new Date();
  const id = ulid();
  await messageRepository.createConversation({
    id,
    subject: subject || null,
    context_type: contextType,
    context_id: contextId,
    company_id: compagnieId,
    created_by: actor.id,
    created_at: now,
    updated_at: now,
  });
  const participantRows = [
    ...agentIds.map((aid) => ({
      id: ulid(),
      conversation_id: id,
      participant_type: 'agent',
      participant_id: aid,
      read_at: aid === actor.id ? now : null,
      created_at: now,
    })),
    ...clientIds.map((cid) => ({
      id: ulid(),
      conversation_id: id,
      participant_type: 'client',
      participant_id: cid,
      read_at: cid === actor.id ? now : null,
      created_at: now,
    })),
  ];
  await messageRepository.createParticipants(participantRows);

  const created = await messageRepository.findConversationById(id);
  return { conversation: created, created: true };
};

/* ══════════════════════════════════════════════════════════════
   Messages
   ══════════════════════════════════════════════════════════════ */

const listMessages = async ({ actor, conversationId, query }) => {
  const conversation = await messageRepository.findConversationById(conversationId);
  await assertParticipant(conversation, actor);
  const { items, hasMore } = await messageRepository.findMessages(conversationId, query);
  return { items: items.map(serializeMessage), hasMore, conversationId };
};

const sendMessage = async ({ actor, conversationId, content }) => {
  const conversation = await messageRepository.findConversationById(conversationId);
  await assertParticipant(conversation, actor);
  const { participantType, participantId } = getActorInfo(actor);
  const now = new Date();
  const message = await messageRepository.createMessage({
    id: ulid(),
    conversation_id: conversation.id,
    sender_type: participantType,
    sender_id: participantId,
    content: content.trim(),
    status: 'sent',
    read_at: null,
    created_at: now,
  });
  await messageRepository.touchConversation(conversation.id, now);
  return serializeMessage(message);
};

const markConversationRead = async ({ actor, conversationId }) => {
  const conversation = await messageRepository.findConversationById(conversationId);
  await assertParticipant(conversation, actor);
  const { participantType, participantId } = getActorInfo(actor);
  await messageRepository.markConversationRead({
    conversationId: conversation.id,
    participantType,
    participantId,
  });
  return { conversationId: conversation.id, read: true };
};

const markMessageRead = async ({ actor, messageId }) => {
  const message = await messageRepository.findMessageById(messageId);
  if (!message) throw new ApiError(404, 'Message introuvable.');
  const conversation = await messageRepository.findConversationById(message.conversation_id);
  await assertParticipant(conversation, actor);
  const { participantType, participantId } = getActorInfo(actor);
  if (message.sender_id !== participantId && !message.read_at) {
    await messageRepository.markMessageRead(message);
    await messageRepository.advanceParticipantRead(
      conversation.id,
      participantType,
      participantId,
      new Date(message.created_at)
    );
  }
  return serializeMessage(message);
};

const destroyMessage = async ({ actor, messageId }) => {
  const message = await messageRepository.findMessageById(messageId);
  if (!message) throw new ApiError(404, 'Message introuvable.');
  const conversation = await messageRepository.findConversationById(message.conversation_id);
  await assertParticipant(conversation, actor);
  if (message.sender_id !== actor.id) {
    throw new ApiError(403, 'Vous ne pouvez supprimer que vos propres messages.');
  }
  await messageRepository.destroyMessage(message);
  return { id: message.id, deleted: true };
};

/* ══════════════════════════════════════════════════════════════
   Compteurs & annuaires
   ══════════════════════════════════════════════════════════════ */

const unreadCount = async ({ actor }) => {
  const { participantType, participantId } = getActorInfo(actor);
  return messageRepository.unreadCountFor(participantType, participantId);
};

const listCompanies = async ({ actor }) => {
  if (actor.role !== 'super_admin') throw new ApiError(403, 'Accès réservé au super admin.');
  const companies = await messageRepository.findActiveCompanies();
  return companies.map((c) => ({ id: c.id, name: c.nom }));
};

const listClientsOfCompany = async ({ actor, compagnieId }) => {
  if (actor.role === 'client' || actor.role === 'counter_agent') {
    throw new ApiError(403, 'Accès refusé pour ce profil.');
  }
  if (actor.role === 'company_admin' && actor.compagnieId !== compagnieId) {
    throw new ApiError(403, 'Accès refusé à cette compagnie.');
  }
  const clientIds = await messageRepository.findClientIdsOfCompany(compagnieId);
  const clients = clientIds.length ? await messageRepository.findClientsByIds(clientIds) : [];
  return clients.map((c) => ({
    id: c.id,
    name: `${c.prenom} ${c.nom}`,
    initials: initials(`${c.prenom} ${c.nom}`),
  }));
};

module.exports = {
  listConversations,
  getConversation,
  createConversation,
  listMessages,
  sendMessage,
  markConversationRead,
  markMessageRead,
  destroyMessage,
  unreadCount,
  listCompanies,
  listClientsOfCompany,
  serializeMessage,
};
