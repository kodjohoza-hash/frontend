/**
 * Modèle EMAIL_VERIFICATION_TOKEN — table `email_verification_token`
 * Jeton de vérification d'adresse email (hash SHA-256 stocké).
 */
module.exports = (sequelize, DataTypes) => {
  const EmailVerificationToken = sequelize.define(
    'EmailVerificationToken',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agent_id: { type: DataTypes.CHAR(10), allowNull: false },
      token_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(120), allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      used_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'email_verification_token', indexes: [{ fields: ['agent_id'] }] }
  );

  EmailVerificationToken.associate = (db) => {
    EmailVerificationToken.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return EmailVerificationToken;
};
