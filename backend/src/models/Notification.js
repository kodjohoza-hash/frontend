/**
 * Modèle NOTIFICATION — table `notification` (Module 16, système centralisé)
 * Notifications persistées par utilisateur (client, company_admin, counter_agent,
 * super_admin). Chaque notification cible un destinataire unique (recipient_id)
 * identifié par son rôle : le backend ne fait JAMAIS confiance à un user_id
 * fourni par le frontend — l'API déduit le destinataire de l'utilisateur
 * authentifié (req.user.id).
 *
 * - type         : catégorie d'événement (reservation_created, payment_confirmed,
 *                  ticket_available, voyage_annule, abonnement_*, ...).
 * - data         : payload JSON sans donnée sensible (références, ids, lien).
 * - reference_key: clé d'idempotence (ex: `booking:RSV-...`, `payment:PAY-...`,
 *                  `subscription:5:expiration`). L'index unique (recipient_id,
 *                  type, reference_key) garantit qu'un même événement ne crée
 *                  jamais deux notifications identiques pour le même destinataire.
 * - read_at      : date de lecture (NULL = non lue).
 */
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      recipient_id: { type: DataTypes.STRING(26), allowNull: false },
      role: {
        type: DataTypes.ENUM('client', 'company_admin', 'counter_agent', 'super_admin'),
        allowNull: false,
      },
      type: { type: DataTypes.STRING(50), allowNull: false },
      title: { type: DataTypes.STRING(160), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      data: { type: DataTypes.JSON, allowNull: true },
      reference_key: { type: DataTypes.STRING(120), allowNull: true },
      read_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'notification',
      timestamps: false,
      indexes: [
        { unique: true, fields: ['recipient_id', 'type', 'reference_key'] },
        { fields: ['recipient_id'] },
        { fields: ['recipient_id', 'read_at'] },
        { fields: ['created_at'] },
      ],
    }
  );

  return Notification;
};
