const cron = require('node-cron');
const env = require('../../../config/env');
const logger = require('../../../utils/logger');
const { daysRemaining } = require('../../../utils/generators');
const { subscriptionRepository } = require('../repositories');
const { subscriptionService } = require('../services');
const notificationService = require('../services/notification.service');
const { notificationService: centralNotif } = require('../../notifications/services');
const { Compagnie } = require('../../../models');

/** Exécute une notification sans jamais casser le traitement du cron. */
const notifySafe = async (fn) => {
  try {
    await fn();
  } catch (err) {
    logger.warn(`[notifications] envoi ignoré : ${err.message}`);
  }
};

/**
 * Rappels à envoyer selon les jours restants (J-15, J-7, J-3, J-1, J0).
 */
const REMINDER_SCHEDULE = [
  { jours: 15, type: 'j15' },
  { jours: 7, type: 'j7' },
  { jours: 3, type: 'j3' },
  { jours: 1, type: 'j1' },
  { jours: 0, type: 'j0' },
];

/**
 * Passe quotidien :
 *  1. expire les abonnements dont date_fin < aujourd'hui (non renouvelés)
 *  2. active le renouvellement automatique si demandé
 *  3. envoie les rappels selon l'échéance
 */
const runSubscriptionJob = async () => {
  logger.info('Cron abonnements : début du traitement quotidien…');

  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  const aujourdhuiISO = aujourdhui.toISOString().slice(0, 10);

  const subs = await subscriptionRepository.findActive();
  let expires = 0;
  let autoRenews = 0;
  let rappels = 0;

  for (const sub of subs) {
    const dateFin = new Date(`${sub.date_fin}T23:59:59`);
    const reste = daysRemaining(sub.date_fin);
    const email = sub.compagnie?.email;

    /* 1. Expiration */
    if (dateFin < aujourdhui) {
      // Tentative de renouvellement automatique (1 seul cycle par exécution)
      if (sub.renouvellement_auto && sub.plan) {
        await subscriptionService.renew(sub.compagnie_id, {
          plan_id: sub.plan_id,
          date_debut: aujourdhuiISO,
          date_fin: addDaysIso(aujourdhui, sub.plan.duree_jours),
          methode: 'virement_bancaire',
          montant: sub.plan.prix_mensuel,
        }, 'systeme');
        autoRenews += 1;
        logger.info(`Renouvellement auto : compagnie ${sub.compagnie_id}`);
      } else {
        await subscriptionService.expire(sub.compagnie_id, 'systeme');
        expires += 1;
        await notificationService.sendReminder({
          compagnieId: sub.compagnie_id,
          abonnementCompagnieId: sub.id,
          type: 'expiration',
          email,
          canal: 'tous',
          detail: 'Votre abonnement a expiré. Renouvelez pour réactiver vos services.',
        });
      }
      continue;
    }

    /* 2. Rappels planifiés */
    const rappel = REMINDER_SCHEDULE.find((r) => r.jours === reste);
    if (rappel) {
      const notif = await notificationService.sendReminder({
        compagnieId: sub.compagnie_id,
        abonnementCompagnieId: sub.id,
        type: rappel.type,
        email,
        canal: 'tous',
        detail: `Votre abonnement arrive à échéance dans ${reste} jour${reste > 1 ? 's' : ''} (${sub.date_fin}).`,
      });
      if (notif) rappels += 1;

      /* Notifications centralisées : échéance proche. */
      await notifySafe(async () => {
        await centralNotif.sendToCompanyAdmins({
          compagnieId: sub.compagnie_id,
          type: 'abonnement_bientot_expire',
          title: 'Abonnement arrive à échéance',
          message: `Votre abonnement arrive à échéance dans ${reste} jour${reste > 1 ? 's' : ''} (${sub.date_fin}).`,
          data: { compagnieId: sub.compagnie_id, actionPath: '/agency/subscriptions' },
          referenceKey: `subscription:${sub.id}:${rappel.type}`,
        });
        await centralNotif.sendToSuperAdmins({
          type: 'abonnement_bientot_expire',
          title: 'Abonnement proche de l\'échéance',
          message: `L'abonnement de la compagnie ${sub.compagnie?.nom || sub.compagnie_id} expire dans ${reste} jour${reste > 1 ? 's' : ''}.`,
          data: { compagnieId: sub.compagnie_id, actionPath: '/admin/subscriptions' },
          referenceKey: `subscription:${sub.id}:${rappel.type}`,
        });
      });
    }
  }

  logger.info('Cron abonnements terminé.', { expires, autoRenews, rappels });
};

const addDaysIso = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Démarre le cron si activé (CRON_ENABLED=true). */
const startCron = () => {
  if (!env.cron.enabled) {
    logger.info('Cron abonnements désactivé (CRON_ENABLED=false).');
    return null;
  }
  const job = cron.schedule(env.cron.subscriptionSchedule, runSubscriptionJob, { timezone: 'Africa/Douala' });
  logger.info(`Cron abonnements planifié : ${env.cron.subscriptionSchedule} (Africa/Douala)`);
  return job;
};

module.exports = { startCron, runSubscriptionJob };
