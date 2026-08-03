const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { sendMail } = require('../../../services/mailer.service');
const { notificationRepository } = require('../repositories');

/** Libellés des types de rappel. */
const TYPE_LABELS = {
  j15: 'Renouvellement dans 15 jours',
  j7: 'Renouvellement dans 7 jours',
  j3: 'Renouvellement dans 3 jours',
  j1: 'Renouvellement dans 1 jour',
  j0: 'Votre abonnement expire aujourd\'hui',
  expiration: 'Abonnement expiré',
  retard_paiement: 'Retard de paiement',
  renouvellement: 'Renouvellement effectué',
};

/**
 * Crée un rappel (canal in_app + email si demandé).
 * Dédoublonne par (abonnement_compagnie_id, type) pour ne pas re-émettre.
 */
const sendReminder = async ({ compagnieId, abonnementCompagnieId, type, email, canal = 'notification', detail }) => {
  const existant = await notificationRepository.findOne({
    abonnement_compagnie_id: abonnementCompagnieId,
    type,
  });
  if (existant) return null; // déjà envoyé pour ce cycle

  const sujet = TYPE_LABELS[type] || 'Notification d\'abonnement';
  const message = detail || sujet;

  const notif = await notificationRepository.create({
    compagnie_id: compagnieId,
    abonnement_compagnie_id: abonnementCompagnieId,
    type,
    canal,
    statut: 'envoye',
    sujet,
    message,
    date_envoi: new Date(),
  });

  if (email && canal !== 'sms') {
    await sendMail({
      to: email,
      subject: `Bus Tix Connect — ${sujet}`,
      html: `<p>Bonjour,</p><p>${message}</p><p>L'équipe Bus Tix Connect</p>`,
    });
  }

  logger.info(`Rappel envoyé (${type}) → compagnie ${compagnieId}`);
  return notif;
};

const listByCompany = async (compagnieId) => notificationRepository.findByCompany(compagnieId);

const listAll = async () => notificationRepository.findAll();

module.exports = { sendReminder, listByCompany, listAll, TYPE_LABELS };
