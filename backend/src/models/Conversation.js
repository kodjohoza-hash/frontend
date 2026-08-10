/**
 * Modèle CONVERSATION — table `conversation` (Module 17, messagerie interne)
 * Fil de discussion entre un client et une compagnie (et ses company_admin),
 * entre agents d'une même compagnie, ou entre un super_admin et une compagnie.
 * L'accès est strictement contrôlé par la table `conversation_participant` :
 * un utilisateur ne peut jamais consulter une conversation dont il n'est pas
 * participant (aucune confiance envers un id transmis par le frontend).
 *
 * - context_type / context_id : rattachement optionnel à une réservation,
 *   un voyage (depart) ou une compagnie — évite les conversations sans contexte.
 * - company_id : compagnie impliquée (déduite côté serveur, jamais du frontend).
 * - updated_at : dernière activité (tri des listes).
 */
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    'Conversation',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      subject: { type: DataTypes.STRING(160), allowNull: true },
      context_type: { type: DataTypes.ENUM('reservation', 'voyage', 'company'), allowNull: true },
      context_id: { type: DataTypes.STRING(40), allowNull: true },
      company_id: { type: DataTypes.CHAR(4), allowNull: true },
      created_by: { type: DataTypes.STRING(26), allowNull: false },
      created_at: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE(3), allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'conversation',
      timestamps: false,
      indexes: [
        { fields: ['context_type', 'context_id'] },
        { fields: ['company_id'] },
        { fields: ['updated_at'] },
      ],
    }
  );

  Conversation.associate = (db) => {
    Conversation.hasMany(db.ConversationParticipant, { foreignKey: 'conversation_id', as: 'participants' });
    Conversation.hasMany(db.Message, { foreignKey: 'conversation_id', as: 'messages' });
  };

  return Conversation;
};
