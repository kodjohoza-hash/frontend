/**
 * Modèle NOTIFICATION_ABONNEMENT — table `notification_abonnement` (migration SaaS)
 * Rappels automatiques envoyés à la compagnie (J-15, J-7, J-3, J-1, J0…).
 */
module.exports = (sequelize, DataTypes) => {
  const NotificationAbonnement = sequelize.define(
    'NotificationAbonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      abonnement_compagnie_id: { type: DataTypes.INTEGER, allowNull: false },
      type: {
        type: DataTypes.ENUM('j15', 'j7', 'j3', 'j1', 'j0', 'expiration', 'retard_paiement', 'renouvellement'),
        allowNull: false,
      },
      canal: {
        type: DataTypes.ENUM('email', 'sms', 'notification', 'in_app', 'tous'),
        allowNull: false,
        defaultValue: 'notification',
      },
      statut: {
        type: DataTypes.ENUM('envoye', 'delivre', 'lu', 'echec'),
        allowNull: false,
        defaultValue: 'envoye',
      },
      sujet: { type: DataTypes.STRING(160), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      date_envoi: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'notification_abonnement',
      indexes: [{ fields: ['compagnie_id'] }, { fields: ['date_envoi'] }, { fields: ['type'] }],
    }
  );

  NotificationAbonnement.associate = (db) => {
    NotificationAbonnement.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    NotificationAbonnement.belongsTo(db.AbonnementCompagnie, { foreignKey: 'abonnement_compagnie_id', as: 'abonnementCompagnie' });
  };

  return NotificationAbonnement;
};
