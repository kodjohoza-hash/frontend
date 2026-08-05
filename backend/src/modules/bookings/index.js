const routes = require('./routes');
const cron = require('./cron/booking.cron');

/** Point d'entrée du module Bookings (Réservations). */
module.exports = {
  routes,
  startCron: cron.startCron,
  runExpirationJob: cron.runExpirationJob,
};
