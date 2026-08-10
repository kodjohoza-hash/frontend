/**
 * Modèle MESSAGE — table `message` (Module 17, messagerie interne)
 * Message au sein d'une conversation. sender_type ∈ {client, agent} ;
 * sender_id = client.id ou agent.id de l'expéditeur (déduit de req.user).
 *
 * - status : sent | read (témoin de lecture côté expéditeur).
 * - read_at : date de lecture par un autre participant (cosmétique).
 *   Le calcul du compteur de non lues repose sur conversation_participant.read_at.
 */
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      conversation_id: { type: DataTypes.CHAR(26), allowNull: false },
      sender_type: { type: DataTypes.ENUM('client', 'agent'), allowNull: false },
      sender_id: { type: DataTypes.STRING(26), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.ENUM('sent', 'read'), allowNull: false, defaultValue: 'sent' },
      read_at: { type: DataTypes.DATE(3), allowNull: true },
      created_at: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'message',
      timestamps: false,
      indexes: [
        { fields: ['conversation_id', 'created_at'] },
        { fields: ['conversation_id'] },
        { fields: ['sender_id'] },
      ],
    }
  );

  Message.associate = (db) => {
    Message.belongsTo(db.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
  };

  return Message;
};
