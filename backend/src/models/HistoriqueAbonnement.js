/**
 * Modèle HISTORIQUE_ABONNEMENT — table `historique_abonnement` (migration SaaS)
 * Journal des changements : création, renouvellement, changement de plan,
 * suspension, reprise, expiration, annulation, paiement.
 */
module.exports = (sequelize, DataTypes) => {
  const HistoriqueAbonnement = sequelize.define(
    'HistoriqueAbonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      abonnement_compagnie_id: { type: DataTypes.INTEGER, allowNull: false },
      action: {
        type: DataTypes.ENUM('creation', 'renouvellement', 'changement_plan', 'suspension', 'reprise', 'expiration', 'annulation', 'paiement'),
        allowNull: false,
      },
      plan_id: { type: DataTypes.INTEGER, allowNull: true },
      detail: { type: DataTypes.STRING(255), allowNull: true },
      auteur: { type: DataTypes.STRING(120), allowNull: true }, // super_admin / systeme / compagnie
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'historique_abonnement',
      indexes: [{ fields: ['compagnie_id'] }, { fields: ['date'] }],
    }
  );

  HistoriqueAbonnement.associate = (db) => {
    HistoriqueAbonnement.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    HistoriqueAbonnement.belongsTo(db.PlanAbonnement, { foreignKey: 'plan_id', as: 'plan' });
  };

  return HistoriqueAbonnement;
};
