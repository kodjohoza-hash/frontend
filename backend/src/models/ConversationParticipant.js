/**
 * Modèle CONVERSATION_PARTICIPANT — table `conversation_participant` (Module 17)
 * Liste d'accès stricte d'une conversation : on n'est membre que si une ligne
 * existe ici. participant_type ∈ {client, agent} ; participant_id = client.id
 * ou agent.id (les company_admin / counter_agent / super_admin sont tous des
 * agents). Un index unique (conversation_id, participant_type, participant_id)
 * garantit l'absence de doublons.
 *
 * - read_at : dernière lecture du participant dans la conversation. Le compteur
 *   de non lues d'un utilisateur = messages des AUTRES postérieurs à ce
 *   read_at (tous les messages si read_at est NULL).
 */
module.exports = (sequelize, DataTypes) => {
  const ConversationParticipant = sequelize.define(
    'ConversationParticipant',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      conversation_id: { type: DataTypes.CHAR(26), allowNull: false },
      participant_type: { type: DataTypes.ENUM('client', 'agent'), allowNull: false },
      participant_id: { type: DataTypes.STRING(26), allowNull: false },
      read_at: { type: DataTypes.DATE(3), allowNull: true },
      created_at: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'conversation_participant',
      timestamps: false,
      indexes: [
        { name: 'uq_conversation_participant', unique: true, fields: ['conversation_id', 'participant_type', 'participant_id'] },
        { fields: ['participant_type', 'participant_id'] },
        { fields: ['conversation_id'] },
      ],
    }
  );

  ConversationParticipant.associate = (db) => {
    ConversationParticipant.belongsTo(db.Conversation, { foreignKey: 'conversation_id', as: 'conversation' });
  };

  return ConversationParticipant;
};
