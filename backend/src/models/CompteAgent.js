/**
 * Modèle COMPTE_AGENT — table `compte_agent` (MCD section 2)
 * Paramètres de sécurité / accès de l'agent (mot de passe haché, 2FA, thème).
 */
module.exports = (sequelize, DataTypes) => {
  const CompteAgent = sequelize.define(
    'CompteAgent',
    {
      agent_id: { type: DataTypes.CHAR(10), primaryKey: true },
      mot_de_passe_hash: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: false },
      telephone: { type: DataTypes.STRING(20), allowNull: false },
      double_authentification: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expiration_pwd: { type: DataTypes.DATEONLY, allowNull: true },
      langue_preferee: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'fr' },
      theme: {
        type: DataTypes.ENUM('sombre', 'clair', 'systeme'),
        allowNull: false,
        defaultValue: 'sombre',
      },
      derniere_connexion: { type: DataTypes.DATE, allowNull: true },
      nb_echecs_connexion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      bloque_jusque: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'compte_agent' }
  );

  CompteAgent.associate = (db) => {
    CompteAgent.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return CompteAgent;
};
