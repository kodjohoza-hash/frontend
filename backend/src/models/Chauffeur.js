/**
 * Modèle CHAUFFEUR — table `chauffeur` (migration 2026_drivers_module)
 * Extension profil chauffeur (1:1 avec agent). Un chauffeur EST un agent
 * de rôle 'chauffeur' ; cette table porte les champs spécifiques :
 * permis, expérience, ville/pays, observations et le statut opérationnel
 * AVAILABLE / ON_TRIP / ON_LEAVE / SUSPENDED / INACTIVE.
 */
module.exports = (sequelize, DataTypes) => {
  const Chauffeur = sequelize.define(
    'Chauffeur',
    {
      agent_id: { type: DataTypes.CHAR(10), primaryKey: true },
      ville: { type: DataTypes.STRING(120), allowNull: true },
      pays: { type: DataTypes.STRING(60), allowNull: true },
      permis_numero: { type: DataTypes.STRING(40), allowNull: true },
      permis_categorie: { type: DataTypes.ENUM('A', 'B', 'C', 'D', 'E'), allowNull: true },
      permis_obtention: { type: DataTypes.DATEONLY, allowNull: true },
      permis_expiration: { type: DataTypes.DATEONLY, allowNull: true },
      annees_experience: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      observations: { type: DataTypes.TEXT, allowNull: true },
      statut: {
        type: DataTypes.ENUM('available', 'on_trip', 'on_leave', 'suspended', 'inactive'),
        allowNull: false,
        defaultValue: 'available',
      },
      date_creation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'chauffeur',
      indexes: [{ fields: ['statut'] }],
    }
  );

  Chauffeur.associate = (db) => {
    Chauffeur.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return Chauffeur;
};
