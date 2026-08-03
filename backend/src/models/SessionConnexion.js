/**
 * Modèle SESSION_CONNEXION — table `session_connexion` (MCD)
 * Journal des connexions / déconnexions / échecs de connexion des agents.
 */
module.exports = (sequelize, DataTypes) => {
  const SessionConnexion = sequelize.define(
    'SessionConnexion',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agent_id: { type: DataTypes.CHAR(10), allowNull: false },
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
    { tableName: 'session_connexion', indexes: [{ fields: ['agent_id'] }] }
  );

  SessionConnexion.associate = (db) => {
    SessionConnexion.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return SessionConnexion;
};
