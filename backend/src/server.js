const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/database');
const db = require('./models');
const logger = require('./utils/logger');
const subscriptionsModule = require('./modules/subscriptions');
const bookingsModule = require('./modules/bookings');

async function start() {
  try {
    /* Vérifie la connexion MySQL */
    await sequelize.authenticate();
    logger.info('Connexion MySQL établie');

    /* Synchronisation optionnelle (développement uniquement) */
    if (env.db.sync) {
      await sequelize.sync({ alter: env.nodeEnv === 'development' });
      logger.info('Modèles synchronisés avec la base de données');
    }

    /* Tâches planifiées (abonnements SaaS) */
    subscriptionsModule.startCron();

    /* Tâches planifiées (expiration des réservations) */
    bookingsModule.startCron();

    app.listen(env.port, () => {
      console.log(`✓ API Bus Tix Connect démarrée sur http://localhost:${env.port}/api/v1`);
      console.log(`  Modèles chargés : ${Object.keys(db).filter((k) => k !== 'sequelize' && k !== 'Sequelize').join(', ')}`);
    });
  } catch (err) {
    logger.error("Impossible de démarrer l'API", { error: err.message });
    process.exit(1);
  }
}

start();
