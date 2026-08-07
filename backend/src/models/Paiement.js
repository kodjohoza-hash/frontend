/**
 * Modèle PAIEMENT — table `paiement` (MCD section 2)
 * Comptabilité des paiements liés à une réservation (ou un billet).
 * Un paiement peut être en ligne (agent_id NULL) ou encaissé par un agent.
 * Le module Payments (Module 11) gère la consultation, le reporting et les
 * transitions de statut (confirm / cancel / fail / refund) de ces enregistrements.
 */
module.exports = (sequelize, DataTypes) => {
  const Paiement = sequelize.define(
    'Paiement',
    {
      id: { type: DataTypes.CHAR(15), primaryKey: true },
      reference: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      reservation_id: { type: DataTypes.CHAR(15), allowNull: true },
      billet_id: { type: DataTypes.CHAR(15), allowNull: true },
      client_id: { type: DataTypes.CHAR(12), allowNull: false },
      agent_id: { type: DataTypes.CHAR(10), allowNull: true },
      montant: { type: DataTypes.INTEGER, allowNull: false },
      frais: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      devise: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: require('../config/env').currency.default },
      methode: {
        type: DataTypes.ENUM('orange_money', 'mtn_money', 'carte_bancaire', 'especes', 'virement_bancaire', 'bon_reduction', 'code_promo', 'express_union_mobile', 'autre'),
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM('initie', 'paye', 'en_attente', 'echoue', 'annule', 'rembourse', 'partiellement_rembourse'),
        allowNull: false,
      },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      paiement_le: { type: DataTypes.DATE, allowNull: true },
      remboursement: { type: DataTypes.INTEGER, allowNull: true },
      motif_remboursement: { type: DataTypes.STRING(255), allowNull: true },
      note: { type: DataTypes.STRING(255), allowNull: true },
      reference_fournisseur: { type: DataTypes.STRING(100), allowNull: true },
      provider: { type: DataTypes.STRING(100), allowNull: true },
      type: {
        type: DataTypes.ENUM('encaissement', 'remboursement'),
        allowNull: false,
        defaultValue: 'encaissement',
      },
      categorie: {
        type: DataTypes.ENUM('reservation', 'abonnement', 'complement', 'remboursement', 'manuel'),
        allowNull: false,
        defaultValue: 'reservation',
      },
      abonnement_compagnie_id: { type: DataTypes.INTEGER, allowNull: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: true },
      guichet_id: { type: DataTypes.CHAR(10), allowNull: true },
      metadata: { type: DataTypes.JSON, allowNull: true },
    },
    {
      tableName: 'paiement',
      timestamps: false,
      indexes: [
        { fields: ['reservation_id'] },
        { fields: ['client_id'] },
        { fields: ['statut'] },
        { fields: ['type'] },
        { fields: ['categorie'] },
        { fields: ['abonnement_compagnie_id'] },
        { fields: ['compagnie_id'] },
        { fields: ['guichet_id'] },
        { fields: ['cree_le'] },
        { fields: ['methode'] },
      ],
    }
  );

  Paiement.associate = (db) => {
    Paiement.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
    Paiement.belongsTo(db.Billet, { foreignKey: 'billet_id', as: 'billet' });
    Paiement.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    Paiement.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
    Paiement.belongsTo(db.AbonnementCompagnie, { foreignKey: 'abonnement_compagnie_id', as: 'abonnementCompagnie' });
    Paiement.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    Paiement.belongsTo(db.Guichet, { foreignKey: 'guichet_id', as: 'guichet' });
  };

  return Paiement;
};
