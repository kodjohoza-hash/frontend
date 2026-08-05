/**
 * Modèle PAIEMENT — table `paiement` (MCD section 2)
 * Comptabilité des paiements liés à une réservation (ou un billet).
 * Un paiement peut être en ligne (agent_id NULL) ou encaissé par un agent.
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
      methode: {
        type: DataTypes.ENUM('orange_money', 'mtn_money', 'carte_bancaire', 'especes', 'virement_bancaire', 'bon_reduction', 'code_promo'),
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM('paye', 'en_attente', 'echoue', 'annule', 'rembourse', 'partiellement_rembourse'),
        allowNull: false,
      },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      paiement_le: { type: DataTypes.DATE, allowNull: true },
      remboursement: { type: DataTypes.INTEGER, allowNull: true },
      motif_remboursement: { type: DataTypes.STRING(255), allowNull: true },
      note: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'paiement',
      timestamps: false,
      indexes: [{ fields: ['reservation_id'] }, { fields: ['client_id'] }, { fields: ['statut'] }],
    }
  );

  Paiement.associate = (db) => {
    Paiement.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
    Paiement.belongsTo(db.Billet, { foreignKey: 'billet_id', as: 'billet' });
    Paiement.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    Paiement.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
  };

  return Paiement;
};
