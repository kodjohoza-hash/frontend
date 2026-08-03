/**
 * Modèle AGENT (utilisateur du guichet) — table `agent` (MCD section 2)
 * Rattaché à une agence, peut avoir un superviseur (auto-référence).
 */
module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define(
    'Agent',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      matricule: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      prenom: { type: DataTypes.STRING(60), allowNull: false },
      nom: { type: DataTypes.STRING(60), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      telephone: { type: DataTypes.STRING(20), allowNull: false },
      role: { type: DataTypes.STRING(60), allowNull: false }, // Agent de guichet / Superviseur / ...
      date_naissance: { type: DataTypes.DATEONLY, allowNull: true },
      genre: { type: DataTypes.ENUM('F', 'M', 'Autre'), allowNull: true },
      adresse: { type: DataTypes.STRING(255), allowNull: true },
      langue: { type: DataTypes.STRING(40), allowNull: true },
      date_embauche: { type: DataTypes.DATEONLY, allowNull: false },
      statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        allowNull: false,
        defaultValue: 'actif',
      },
      verifie: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false },
      superieur_id: { type: DataTypes.CHAR(10), allowNull: true },
    },
    {
      tableName: 'agent',
      indexes: [{ fields: ['agence_id'] }, { fields: ['matricule'] }, { fields: ['email'] }],
    }
  );

  Agent.associate = (db) => {
    Agent.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    Agent.belongsTo(db.Agent, { foreignKey: 'superieur_id', as: 'superieur' });
    Agent.hasMany(db.Agent, { foreignKey: 'superieur_id', as: 'subordonnes' });
    Agent.hasOne(db.CompteAgent, { foreignKey: 'agent_id', as: 'compte' });
    Agent.hasMany(db.SessionConnexion, { foreignKey: 'agent_id', as: 'sessions' });
    Agent.hasMany(db.RefreshToken, { foreignKey: 'agent_id', as: 'refreshTokens' });
    Agent.hasMany(db.PasswordResetToken, { foreignKey: 'agent_id', as: 'passwordResetTokens' });
    Agent.hasMany(db.EmailVerificationToken, { foreignKey: 'agent_id', as: 'emailVerificationTokens' });
  };

  return Agent;
};
