/**
 * Modèle RAPPEL_ABONNEMENT — table `rappel_abonnement` (MCD section 9)
 * Relances de renouvellement automatiquement envoyées à la compagnie
 * (J-7 avant échéance, retard de paiement, dernière relance).
 */
module.exports = (sequelize, DataTypes) => {
  const RappelAbonnement = sequelize.define(
    'RappelAbonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      abonnement_id: { type: DataTypes.INTEGER, allowNull: false },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false },
      type: {
        type: DataTypes.ENUM('avant_echeance', 'retard_paiement', 'derniere_relance'),
        allowNull: false,
      },
      sujet: { type: DataTypes.STRING(160), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      date_envoi: { type: DataTypes.DATE, allowNull: false },
      statut: {
        type: DataTypes.ENUM('envoye', 'delivre', 'lu', 'vu'),
        allowNull: false,
        defaultValue: 'envoye',
      },
      canaux: {
        type: DataTypes.ENUM('email', 'sms', 'notification', 'tous'),
        allowNull: false,
        defaultValue: 'notification',
      },
    },
    {
      tableName: 'rappel_abonnement',
      indexes: [{ fields: ['agence_id'] }, { fields: ['compagnie_id'] }, { fields: ['date_envoi'] }],
    }
  );

  RappelAbonnement.associate = (db) => {
    RappelAbonnement.belongsTo(db.Abonnement, { foreignKey: 'abonnement_id', as: 'abonnement' });
    RappelAbonnement.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    RappelAbonnement.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
  };

  return RappelAbonnement;
};
