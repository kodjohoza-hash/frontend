/**
 * Modèle ABONNEMENT_COMPAGNIE — table `abonnement_compagnie` (migration SaaS)
 * Abonnement courant d'une compagnie (1 ligne par compagnie, unique).
 * L'historique est journalisé dans `historique_abonnement`.
 */
module.exports = (sequelize, DataTypes) => {
  const AbonnementCompagnie = sequelize.define(
    'AbonnementCompagnie',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      plan_id: { type: DataTypes.INTEGER, allowNull: false },
      plan_precedent_id: { type: DataTypes.INTEGER, allowNull: true },
      date_debut: { type: DataTypes.DATEONLY, allowNull: false },
      date_fin: { type: DataTypes.DATEONLY, allowNull: false },
      renouvellement_auto: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      statut: {
        type: DataTypes.ENUM('actif', 'en_attente', 'en_retard', 'expire', 'suspendu', 'annule'),
        allowNull: false,
        defaultValue: 'actif',
      },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    },
    {
      tableName: 'abonnement_compagnie',
      indexes: [
        { unique: true, fields: ['compagnie_id'] },
        { fields: ['statut'] },
        { fields: ['date_debut', 'date_fin'] },
      ],
    }
  );

  AbonnementCompagnie.associate = (db) => {
    AbonnementCompagnie.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    AbonnementCompagnie.belongsTo(db.PlanAbonnement, { foreignKey: 'plan_id', as: 'plan' });
    AbonnementCompagnie.belongsTo(db.PlanAbonnement, { foreignKey: 'plan_precedent_id', as: 'planPrecedent' });
    AbonnementCompagnie.hasMany(db.PaiementAbonnementCompagnie, { foreignKey: 'abonnement_compagnie_id', as: 'paiements' });
    AbonnementCompagnie.hasMany(db.NotificationAbonnement, { foreignKey: 'abonnement_compagnie_id', as: 'notifications' });
    AbonnementCompagnie.hasMany(db.HistoriqueAbonnement, { foreignKey: 'abonnement_compagnie_id', as: 'historique' });
  };

  return AbonnementCompagnie;
};
