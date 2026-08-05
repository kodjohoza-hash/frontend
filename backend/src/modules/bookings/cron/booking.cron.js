const cron = require('node-cron');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../../models');
const env = require('../../../config/env');
const logger = require('../../../utils/logger');

/**
 * Expiration automatique des réservations non payées :
 *   les réservations en « brouillon » / « en attente » dont la date
 *   d'expiration est dépassée passent à « expirée » et libèrent leurs sièges.
 */
const runExpirationJob = async () => {
  const now = new Date();

  const expired = await sequelize.query(
    `SELECT r.id AS id, r.depart_id AS depart_id, r.reference AS reference,
            COUNT(pr.id) AS nb
       FROM reservation r
       JOIN place_reservee pr ON pr.reservation_id = r.id
      WHERE r.statut IN ('brouillon', 'en_attente')
        AND r.date_expiration IS NOT NULL
        AND r.date_expiration < :now
      GROUP BY r.id, r.depart_id, r.reference`,
    { type: QueryTypes.SELECT, replacements: { now } }
  );

  if (!expired.length) return 0;

  let count = 0;
  await sequelize.transaction(async (t) => {
    for (const row of expired) {
      await sequelize.query(
        'UPDATE reservation SET statut = :statut WHERE id = :id',
        { type: QueryTypes.UPDATE, replacements: { statut: 'expiree', id: row.id }, transaction: t }
      );
      await sequelize.query(
        'UPDATE depart SET places_dispo = places_dispo + :nb WHERE id = :departId',
        { type: QueryTypes.UPDATE, replacements: { nb: Number(row.nb), departId: row.depart_id }, transaction: t }
      );
      await sequelize.query(
        'INSERT INTO historique_reservation (reservation_id, action, timestamp, utilisateur) VALUES (:rid, :action, :ts, :user)',
        {
          type: QueryTypes.INSERT,
          replacements: {
            rid: row.id,
            action: 'Réservation expirée automatiquement (paiement non finalisé)',
            ts: now,
            user: 'systeme',
          },
          transaction: t,
        }
      );
      count += 1;
    }
  });

  logger.info(`Cron réservations : ${count} réservation(s) expirée(s), sièges libérés.`);
  return count;
};

/** Démarre le cron si activé (CRON_ENABLED=true). */
const startCron = () => {
  if (!env.cron.enabled) {
    logger.info('Cron réservations désactivé (CRON_ENABLED=false).');
    return null;
  }
  const job = cron.schedule(env.cron.bookingsSchedule, runExpirationJob, { timezone: 'Africa/Douala' });
  logger.info(`Cron réservations planifié : ${env.cron.bookingsSchedule} (Africa/Douala)`);
  return job;
};

module.exports = { startCron, runExpirationJob };
