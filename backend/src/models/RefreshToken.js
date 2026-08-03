/**
 * Modèle REFRESH_TOKEN — table `refresh_token` (migration auth sécurisée)
 * Jeton de rafraîchissement : seul le hash SHA-256 est stocké.
 * Rotation : un nouveau jeton remplace l'ancien (replaced_by_token_id).
 */
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agent_id: { type: DataTypes.CHAR(10), allowNull: false },
      token_hash: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      ip: { type: DataTypes.STRING(45), allowNull: true },
      user_agent: { type: DataTypes.STRING(255), allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      revoked_at: { type: DataTypes.DATE, allowNull: true },
      replaced_by_token_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'refresh_token',
      indexes: [{ fields: ['agent_id'] }, { fields: ['expires_at'] }],
    }
  );

  RefreshToken.associate = (db) => {
    RefreshToken.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
    RefreshToken.belongsTo(db.RefreshToken, { foreignKey: 'replaced_by_token_id', as: 'replacedBy' });
  };

  return RefreshToken;
};
