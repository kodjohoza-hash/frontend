/**
 * Modèle ABONNEMENT — table `abonnement` (MCD section 9)
 * Abonnement mensuel d'une agence. Unique par (agence_id, mois, annee).
 */
module.exports = (sequelize, DataTypes) => {
  const Abonnement = sequelize.define(
    'Abonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false },
      mois: { type: DataTypes.TINYINT, allowNull: false }, // 1..12
      annee: { type: DataTypes.SMALLINT, allowNull: false },
      montant: { type: DataTypes.INTEGER, allowNull: false }, // en FCFA
      date_debut: { type: DataTypes.DATEONLY, allowNull: false },
      date_fin: { type: DataTypes.DATEONLY, allowNull: false },
      statut_paiement: {
        type: DataTypes.ENUM('paye', 'partiel', 'impaye', 'en_retard'),
        allowNull: false,
        defaultValue: 'impaye',
      },
      statut: {
        type: DataTypes.ENUM('actif', 'expire', 'suspendu', 'renouvele', 'annule'),
        allowNull: false,
        defaultValue: 'actif',
      },
      date_paiement: { type: DataTypes.DATE, allowNull: true },
      reference_paiement: { type: DataTypes.STRING(40), allowNull: true },
    },
    {
      tableName: 'abonnement',
      indexes: [
        { unique: true, fields: ['agence_id', 'mois', 'annee'] },
        { fields: ['statut'] },
        { fields: ['statut_paiement'] },
      ],
    }
  );

  Abonnement.associate = (db) => {
    Abonnement.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    Abonnement.hasMany(db.PaiementAbonnement, { foreignKey: 'abonnement_id', as: 'paiements' });
    Abonnement.hasMany(db.RappelAbonnement, { foreignKey: 'abonnement_id', as: 'relances' });
  };

  return Abonnement;
};
