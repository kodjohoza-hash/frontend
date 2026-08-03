/**
 * Modèle CHAUFFEUR_INCIDENT — table `chauffeur_incident`
 * Incidents d'un chauffeur : accident, panne, retard, sanction, observation
 * (avec date + description, sévérité et résolution).
 */
module.exports = (sequelize, DataTypes) => {
  const ChauffeurIncident = sequelize.define(
    'ChauffeurIncident',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      chauffeur_id: { type: DataTypes.CHAR(10), allowNull: false },
      type: {
        type: DataTypes.ENUM('accident', 'panne', 'retard', 'sanction', 'observation'),
        allowNull: false,
        defaultValue: 'observation',
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      severite: { type: DataTypes.ENUM('low', 'medium', 'high'), allowNull: false, defaultValue: 'low' },
      resolu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'chauffeur_incident',
      indexes: [{ fields: ['chauffeur_id'] }, { fields: ['type'] }],
    }
  );

  ChauffeurIncident.associate = (db) => {
    ChauffeurIncident.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
  };

  return ChauffeurIncident;
};
