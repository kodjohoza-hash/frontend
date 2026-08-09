/**
 * Modèle SESSION_CONNEXION — table `session_connexion` (MCD)
 * Journal des connexions / déconnexions / échecs de connexion.
 * Propriétaire : un agent (`agent_id`) OU un client (`client_id`).
 */
module.exports = (sequelize, DataTypes) => {
  const SessionConnexion = sequelize.define(
    'SessionConnexion',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agent_id: { type: DataTypes.CHAR(10), allowNull: true },
      client_id: { type: DataTypes.CHAR(12), allowNull: true },
      date: { type: DataTypes.DATE, allowNull: false },
      ip: { type: DataTypes.STRING(45), allowNull: false },
      navigateur: { type: DataTypes.STRING(120), allowNull: true },
      appareil: { type: DataTypes.STRING(120), allowNull: true },
      localisation: { type: DataTypes.STRING(120), allowNull: true },
      type: {
        type: DataTypes.ENUM('connexion', 'deconnexion', 'echec', 'suspect'),
        allowNull: false,
        defaultValue: 'connexion',
      },
    },
    {
      tableName: 'session_connexion',
      indexes: [{ fields: ['agent_id'] }, { fields: ['client_id'] }],
    }
  );

  SessionConnexion.associate = (db) => {
    SessionConnexion.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
    SessionConnexion.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
  };

  return SessionConnexion;
};
