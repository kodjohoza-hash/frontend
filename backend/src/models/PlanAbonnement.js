/**
 * Modèle PLAN_ABONNEMENT — table `plan_abonnement` (migration SaaS)
 * Formules SaaS (Gratuit / Standard / Premium / Enterprise) avec quotas.
 */
module.exports = (sequelize, DataTypes) => {
  const PlanAbonnement = sequelize.define(
    'PlanAbonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      nom: { type: DataTypes.STRING(60), allowNull: false },
      description: { type: DataTypes.STRING(255), allowNull: true },
      prix_mensuel: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // XAF
      prix_annuel: { type: DataTypes.INTEGER, allowNull: true }, // XAF
      duree_jours: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 30 },
      max_bus: { type: DataTypes.SMALLINT, allowNull: true }, // NULL = illimité
      max_agences: { type: DataTypes.SMALLINT, allowNull: true },
      max_agents: { type: DataTypes.SMALLINT, allowNull: true },
      max_reservations: { type: DataTypes.INTEGER, allowNull: true },
      fonctionnalites: { type: DataTypes.JSON, allowNull: true },
      statut: {
        type: DataTypes.ENUM('actif', 'inactif'),
        allowNull: false,
        defaultValue: 'actif',
      },
      ordre: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    },
    {
      tableName: 'plan_abonnement',
      indexes: [{ fields: ['code'] }, { fields: ['statut'] }],
    }
  );

  PlanAbonnement.associate = (db) => {
    PlanAbonnement.hasMany(db.AbonnementCompagnie, { foreignKey: 'plan_id', as: 'abonnements' });
  };

  return PlanAbonnement;
};
