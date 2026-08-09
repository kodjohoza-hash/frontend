const logger = require('../../../utils/logger');
const { ulid } = require('../../../utils/ulid');
const { notificationRepository } = require('../repositories');

/**
 * Configuration des types de notification — utilisée pour la sérialisation
 * (libellé, icône, couleur, catégorie, priorité, lien de navigation par défaut).
 */
const TYPE_CONFIG = {
  reservation_created: { label: 'Réservation créée', icon: 'bi-check-circle-fill', color: 'success', category: 'reservation', priority: 'medium', actionPath: '/client/bookings' },
  payment_confirmed: { label: 'Paiement confirmé', icon: 'bi-credit-card-fill', color: 'success', category: 'payment', priority: 'high', actionPath: '/client/bookings' },
  payment_failed: { label: 'Paiement échoué', icon: 'bi-x-circle-fill', color: 'danger', category: 'payment', priority: 'high', actionPath: '/client/bookings' },
  ticket_available: { label: 'Billet disponible', icon: 'bi-ticket-perforated-fill', color: 'info', category: 'ticket', priority: 'high', actionPath: '/client/tickets' },
  trip_reminder: { label: 'Rappel avant voyage', icon: 'bi-bell-fill', color: 'warning', category: 'trip', priority: 'high', actionPath: '/client/bookings' },
  voyage_annule: { label: 'Voyage annulé', icon: 'bi-x-octagon-fill', color: 'danger', category: 'trip', priority: 'high', actionPath: '/client/bookings' },
  voyage_modifie: { label: 'Voyage modifié', icon: 'bi-clock-fill', color: 'warning', category: 'trip', priority: 'medium', actionPath: '/client/bookings' },
  remboursement: { label: 'Remboursement', icon: 'bi-arrow-counterclockwise', color: 'info', category: 'payment', priority: 'medium', actionPath: '/client/bookings' },
  nouvelle_reservation: { label: 'Nouvelle réservation', icon: 'bi-ticket-perforated', color: 'info', category: 'booking', priority: 'medium', actionPath: '/agency/bookings' },
  nouveau_paiement: { label: 'Nouveau paiement', icon: 'bi-cash-stack', color: 'success', category: 'payment', priority: 'medium', actionPath: '/agency/payments' },
  voyage_proche: { label: 'Voyage proche', icon: 'bi-bus-front', color: 'warning', category: 'trip', priority: 'medium', actionPath: '/agency/trips' },
  abonnement_bientot_expire: { label: 'Abonnement bientôt expiré', icon: 'bi-hourglass-split', color: 'warning', category: 'subscription', priority: 'high', actionPath: '/agency/subscription' },
  abonnement_expire: { label: 'Abonnement expiré', icon: 'bi-x-circle-fill', color: 'danger', category: 'subscription', priority: 'critical', actionPath: '/agency/subscription' },
  paiement_abonnement_confirme: { label: 'Paiement d\'abonnement confirmé', icon: 'bi-check2-circle', color: 'success', category: 'subscription', priority: 'medium', actionPath: '/agency/subscription' },
  paiement_abonnement_echoue: { label: 'Paiement d\'abonnement échoué', icon: 'bi-exclamation-triangle', color: 'danger', category: 'subscription', priority: 'high', actionPath: '/agency/subscription' },
  nouveau_voyage: { label: 'Nouveau voyage', icon: 'bi-bus-front-fill', color: 'info', category: 'trip', priority: 'low', actionPath: '/agency/trips' },
  modification_voyage: { label: 'Voyage modifié', icon: 'bi-clock-fill', color: 'warning', category: 'trip', priority: 'medium', actionPath: '/agency/trips' },
  annulation_voyage: { label: 'Voyage annulé', icon: 'bi-x-octagon-fill', color: 'danger', category: 'trip', priority: 'high', actionPath: '/agency/trips' },
  information_compagnie: { label: 'Information compagnie', icon: 'bi-megaphone', color: 'info', category: 'system', priority: 'low', actionPath: '/agency/dashboard' },
  nouvelle_compagnie: { label: 'Nouvelle compagnie', icon: 'bi-buildings', color: 'info', category: 'company', priority: 'medium', actionPath: '/super-admin/companies' },
  nouvel_abonnement: { label: 'Nouvel abonnement', icon: 'bi-star', color: 'accent', category: 'subscription', priority: 'medium', actionPath: '/super-admin/subscriptions' },
  paiement_abonnement: { label: 'Paiement d\'abonnement', icon: 'bi-credit-card', color: 'success', category: 'subscription', priority: 'medium', actionPath: '/super-admin/subscriptions' },
  abonnement_expirant: { label: 'Abonnement expirant', icon: 'bi-hourglass-split', color: 'warning', category: 'subscription', priority: 'high', actionPath: '/super-admin/subscriptions' },
  abonnement_expire_admin: { label: 'Abonnement expiré', icon: 'bi-x-circle-fill', color: 'danger', category: 'subscription', priority: 'critical', actionPath: '/super-admin/subscriptions' },
  evenement_plateforme: { label: 'Événement plateforme', icon: 'bi-bell', color: 'muted', category: 'system', priority: 'low', actionPath: '/super-admin/dashboard' },
};

/** Sérialise une notification pour l'API (aucune donnée sensible). */
const parseData = (raw) => {
  if (raw == null) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch (_) { return null; }
};

const serialize = (n) => {
  const row = n.toJSON ? n.toJSON() : n;
  const cfg = TYPE_CONFIG[row.type] || TYPE_CONFIG.evenement_plateforme;
  const data = parseData(row.data);
  return {
    id: row.id,
    type: row.type,
    label: cfg.label,
    title: row.title,
    message: row.message,
    data,
    read: !!row.read_at,
    readAt: row.read_at || null,
    createdAt: row.created_at || null,
    icon: cfg.icon,
    color: cfg.color,
    category: cfg.category,
    priority: cfg.priority,
    actionPath: data?.actionPath || cfg.actionPath,
  };
};

/**
 * Envoi idempotent : si referenceKey est fourni, une notification existante
 * pour (recipient_id, type, reference_key) empêche toute ré-émission.
 */
const send = async ({ recipientId, role, type, title, message, data, referenceKey }) => {
  if (!recipientId) return null;
  const existant = await notificationRepository.findDuplicate({ recipientId, type, referenceKey });
  if (existant) return null;

  try {
    return await notificationRepository.create({
      id: ulid(),
      recipient_id: recipientId,
      role,
      type,
      title: String(title).slice(0, 160),
      message: String(message),
      data: data || null,
      reference_key: referenceKey || null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (err) {
    /* Contrainte d'unicité : course possible entre deux événements simultanés. */
    if (err.name === 'SequelizeUniqueConstraintError') return null;
    throw err;
  }
};

/** Notifie tous les company_admin actifs d'une compagnie (idempotent par destinataire). */
const sendToCompanyAdmins = async ({ compagnieId, type, title, message, data, referenceKey }) => {
  if (!compagnieId) return 0;
  const admins = await notificationRepository.findCompanyAdmins(compagnieId);
  let sent = 0;
  for (const admin of admins) {
    const n = await send({
      recipientId: admin.id,
      role: 'company_admin',
      type,
      title,
      message,
      data: { ...data, compagnieId },
      referenceKey,
    });
    if (n) sent += 1;
  }
  return sent;
};

/** Notifie tous les super_admin actifs (idempotent par destinataire). */
const sendToSuperAdmins = async ({ type, title, message, data, referenceKey }) => {
  const admins = await notificationRepository.findSuperAdmins();
  let sent = 0;
  for (const admin of admins) {
    const n = await send({
      recipientId: admin.id,
      role: 'super_admin',
      type,
      title,
      message,
      data,
      referenceKey,
    });
    if (n) sent += 1;
  }
  return sent;
};

/** Notifie les clients ayant des réservations actives sur un voyage. */
const sendToClientsOfDepart = async ({ departId, type, title, message, data, referenceKey }) => {
  const clientIds = await notificationRepository.findClientsByDepart(departId);
  let sent = 0;
  for (const clientId of clientIds) {
    const n = await send({
      recipientId: clientId,
      role: 'client',
      type,
      title,
      message,
      data,
      referenceKey,
    });
    if (n) sent += 1;
  }
  return sent;
};

/** Récupère les notifications de l'utilisateur authentifié (filtrage + pagination). */
const listFor = async (recipientId, { statut, type, page = 1, limit = 20 } = {}) => {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 20));
  const { rows, count } = await notificationRepository.findPage({
    recipientId,
    where: { statut, type },
    page: p,
    limit: l,
  });
  return {
    items: rows.map(serialize),
    total: count,
    unread: await notificationRepository.unreadCount(recipientId),
    page: p,
    limit: l,
    totalPages: Math.ceil(count / l),
  };
};

const unreadCount = async (recipientId) => notificationRepository.unreadCount(recipientId);

const markRead = async ({ id, recipientId }) => {
  const notification = await notificationRepository.findByOwned(id, recipientId);
  if (!notification) return null;
  if (notification.read_at) return notification;
  await notificationRepository.markRead(notification);
  return notification;
};

const markAllRead = async (recipientId) => {
  const updated = await notificationRepository.markAllRead(recipientId);
  return updated?.[0] ?? 0;
};

const remove = async ({ id, recipientId }) => {
  const notification = await notificationRepository.findByOwned(id, recipientId);
  if (!notification) return null;
  await notificationRepository.destroy(notification);
  return notification;
};

module.exports = {
  TYPE_CONFIG,
  serialize,
  send,
  sendToCompanyAdmins,
  sendToSuperAdmins,
  sendToClientsOfDepart,
  listFor,
  unreadCount,
  markRead,
  markAllRead,
  remove,
};
