/**
 * Modèle PAIEMENT_ABONNEMENT_COMPAGNIE — table `paiement_abonnement_compagnie`
 * (migration SaaS). Historique des paiements de plans SaaS par compagnie.
 */
module.exports = (sequelize, DataTypes) => {
  const PaiementAbonnementCompagnie = sequelize.define(
    'PaiementAbonnementCompagnie',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      abonnement_compagnie_id: { type: DataTypes.INTEGER, allowNull: false },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      plan_id: { type: DataTypes.INTEGER, allowNull: true },
      montant: { type: DataTypes.INTEGER, allowNull: false }, // XAF
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
      facture_url: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'paiement_abonnement_compagnie',
      indexes: [
        { unique: true, fields: ['reference'] },
        { fields: ['compagnie_id'] },
        { fields: ['date'] },
      ],
    }
  );

  PaiementAbonnementCompagnie.associate = (db) => {
    PaiementAbonnementCompagnie.belongsTo(db.AbonnementCompagnie, { foreignKey: 'abonnement_compagnie_id', as: 'abonnementCompagnie' });
    PaiementAbonnementCompagnie.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    PaiementAbonnementCompagnie.belongsTo(db.PlanAbonnement, { foreignKey: 'plan_id', as: 'plan' });
  };

  return PaiementAbonnementCompagnie;
};
