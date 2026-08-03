/**
 * Modèle PAIEMENT_ABONNEMENT — table `paiement_abonnement` (MCD section 9)
 * Versements reçus des compagnies. C'est LA source de revenu de la plateforme,
 * agrégée par compagnie pour le dashboard Super Admin.
 */
module.exports = (sequelize, DataTypes) => {
  const PaiementAbonnement = sequelize.define(
    'PaiementAbonnement',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      abonnement_id: { type: DataTypes.INTEGER, allowNull: false },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false },
      montant: { type: DataTypes.INTEGER, allowNull: false }, // en FCFA
      methode: {
        type: DataTypes.ENUM('orange_money', 'mtn_money', 'carte_bancaire', 'virement_bancaire', 'especes'),
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM('paye', 'en_attente', 'echoue', 'rembourse'),
        allowNull: false,
        defaultValue: 'paye',
      },
      date: { type: DataTypes.DATE, allowNull: false },
      reference: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    },
    {
      tableName: 'paiement_abonnement',
      indexes: [
        { unique: true, fields: ['reference'] },
        { fields: ['compagnie_id'] },
        { fields: ['agence_id'] },
        { fields: ['abonnement_id'] },
        { fields: ['date'] },
      ],
    }
  );

  PaiementAbonnement.associate = (db) => {
    PaiementAbonnement.belongsTo(db.Abonnement, { foreignKey: 'abonnement_id', as: 'abonnement' });
    PaiementAbonnement.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    PaiementAbonnement.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
  };

  return PaiementAbonnement;
};
