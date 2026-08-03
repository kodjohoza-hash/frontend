/**
 * Modèle PASSWORD_RESET_TOKEN — table `password_reset_token`
 * Jeton de réinitialisation de mot de passe (hash SHA-256 stocké).
 */
module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define(
    'PasswordResetToken',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agent_id: { type: DataTypes.CHAR(10), allowNull: false },
      token_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      used_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'password_reset_token', indexes: [{ fields: ['agent_id'] }] }
  );

  PasswordResetToken.associate = (db) => {
    PasswordResetToken.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return PasswordResetToken;
};
