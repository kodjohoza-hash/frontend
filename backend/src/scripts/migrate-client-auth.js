/**
 * Migration — Authentification client (rétro-compatible, idempotente).
 *
 * Ajoute le stockage du mot de passe client et la prise en charge des
 * refresh tokens / sessions de connexion pour les clients :
 *   - client.mot_de_passe_hash  VARCHAR(255) NULL
 *   - refresh_token.client_id   CHAR(12) NULL  (+ agent_id nullable)
 *   - session_connexion.client_id CHAR(12) NULL (+ agent_id nullable)
 *   - index + contrainte unique sur client.email
 *
 * Exécution :  node src/scripts/migrate-client-auth.js
 */
const { sequelize } = require('../models');

const columnExists = async (table, column) => {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND COLUMN_NAME = :column`,
    { replacements: { table, column } }
  );
  return Number(rows[0]?.n) > 0;
};

const indexExists = async (table, index) => {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS n FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table AND INDEX_NAME = :index`,
    { replacements: { table, index } }
  );
  return Number(rows[0]?.n) > 0;
};

async function run() {
  console.log('▶ Migration authentification client…');

  if (!(await columnExists('client', 'mot_de_passe_hash'))) {
    await sequelize.query(
      `ALTER TABLE client ADD COLUMN mot_de_passe_hash VARCHAR(255) NULL AFTER numero_piece`
    );
    console.log('✔ client.mot_de_passe_hash ajouté');
  } else {
    console.log('– client.mot_de_passe_hash déjà présent');
  }

  if (!(await indexExists('client', 'email'))) {
    await sequelize.query(`ALTER TABLE client ADD UNIQUE INDEX email (email)`);
    console.log('✔ index unique client.email ajouté');
  } else {
    console.log('– index client.email déjà présent');
  }

  if (!(await columnExists('refresh_token', 'client_id'))) {
    await sequelize.query(`ALTER TABLE refresh_token ADD COLUMN client_id CHAR(12) NULL AFTER agent_id`);
    console.log('✔ refresh_token.client_id ajouté');
  } else {
    console.log('– refresh_token.client_id déjà présent');
  }

  await sequelize.query(`ALTER TABLE refresh_token MODIFY COLUMN agent_id CHAR(10) NULL`);
  if (!(await indexExists('refresh_token', 'client_id'))) {
    await sequelize.query(`ALTER TABLE refresh_token ADD INDEX client_id (client_id)`);
    console.log('✔ index refresh_token.client_id ajouté');
  }

  if (!(await columnExists('session_connexion', 'client_id'))) {
    await sequelize.query(`ALTER TABLE session_connexion ADD COLUMN client_id CHAR(12) NULL AFTER agent_id`);
    console.log('✔ session_connexion.client_id ajouté');
  } else {
    console.log('– session_connexion.client_id déjà présent');
  }

  await sequelize.query(`ALTER TABLE session_connexion MODIFY COLUMN agent_id CHAR(10) NULL`);
  if (!(await indexExists('session_connexion', 'client_id'))) {
    await sequelize.query(`ALTER TABLE session_connexion ADD INDEX client_id (client_id)`);
    console.log('✔ index session_connexion.client_id ajouté');
  }

  console.log('✔ Migration terminée.');
  process.exit(0);
}

run().catch(async (err) => {
  console.error('✖ Migration échouée :', err.message);
  process.exit(1);
});
