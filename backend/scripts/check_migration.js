const { sequelize } = require('../src/models');

const q = async (sql) => {
  const [rows] = await sequelize.query(sql);
  return rows;
};

(async () => {
  try {
    const tables = await q(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('plan_abonnement','abonnement_compagnie','paiement_abonnement_compagnie','notification_abonnement','historique_abonnement')"
    );
    console.log('Tables SaaS:', tables.map((t) => t.TABLE_NAME).join(', ') || 'AUCUNE');

    const cols = await q(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='compagnie' AND COLUMN_NAME IN ('statut_abonnement','abonnement_expire_le')"
    );
    console.log('Colonnes compagnie:', cols.map((c) => c.COLUMN_NAME).join(', ') || 'AUCUNE');

    const plans = await q('SELECT COUNT(*) AS n FROM plan_abonnement');
    console.log('Plans en base:', plans[0].n);
  } finally {
    await sequelize.close();
  }
})();
