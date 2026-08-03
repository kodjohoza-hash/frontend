const { Sequelize } = require('sequelize');
const env = require('./env');

/**
 * Instance Sequelize connectée à MySQL (base bus_tix_connect).
 * Les modèles sont chargés dans models/index.js sur cette instance.
 */
const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: env.nodeEnv === 'development' ? console.log : false,
  timezone: '+01:00',
  define: {
    underscored: true, // colonnes en snake_case (ex: nom_agence)
    freezeTableName: false,
    timestamps: false, // le MCD déclare ses propres colonnes de dates
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
