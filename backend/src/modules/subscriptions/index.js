const routes = require('./routes');
const cron = require('./cron/subscription.cron');

/** Point d'entrée du module SaaS Subscriptions. */
module.exports = {
  routes,
  startCron: cron.startCron,
  runSubscriptionJob: cron.runSubscriptionJob,
  requireActiveSubscription: require('./middlewares/requireActiveSubscription'),
};
