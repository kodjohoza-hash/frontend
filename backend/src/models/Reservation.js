/**
 * Modèle RESERVATION — table `reservation` (MCD section 2 : Réservation)
 * Une réservation lie un client, un voyage (depart), une agence, un agent
 * (optionnel : réservation en ligne) et un ou plusieurs sièges (place_reservee).
 * Le montant tient compte de la remise et des taxes : montant = Σ(tarifs) − remise + taxes.
 */
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    'Reservation',
    {
      id: { type: DataTypes.CHAR(15), primaryKey: true },
      reference: { type: DataTypes.STRING(30), allowNull: false, unique: true },
      client_id: { type: DataTypes.CHAR(12), allowNull: false },
      depart_id: { type: DataTypes.CHAR(10), allowNull: false },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false },
      agent_id: { type: DataTypes.CHAR(10), allowNull: true },
      guichet_id: { type: DataTypes.CHAR(10), allowNull: true },
      mode_reservation: {
        type: DataTypes.ENUM('en_ligne', 'guichet', 'telephone'),
        allowNull: false,
        defaultValue: 'en_ligne',
      },
      mode_paiement: {
        type: DataTypes.ENUM('orange_money', 'mtn_money', 'carte_bancaire', 'especes', 'virement_bancaire', 'bon_reduction', 'code_promo'),
        allowNull: true,
      },
      nb_places: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1 },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      date_confirmation: { type: DataTypes.DATE, allowNull: true },
      date_annulation: { type: DataTypes.DATE, allowNull: true },
      date_expiration: { type: DataTypes.DATE, allowNull: true },
      montant: { type: DataTypes.INTEGER, allowNull: false },
      remise: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      taxes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      statut: {
        type: DataTypes.ENUM('brouillon', 'en_attente', 'confirmee', 'payee', 'partiellement_payee', 'annulee', 'expiree', 'remboursee', 'convertie'),
        allowNull: false,
        defaultValue: 'en_attente',
      },
      motif_annulation: { type: DataTypes.STRING(255), allowNull: true },
      observations: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      tableName: 'reservation',
      timestamps: false,
      indexes: [
        { fields: ['client_id'] },
        { fields: ['depart_id'] },
        { fields: ['statut'] },
        { fields: ['date_creation'] },
      ],
    }
  );

  Reservation.associate = (db) => {
    Reservation.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    Reservation.belongsTo(db.Depart, { foreignKey: 'depart_id', as: 'depart' });
    Reservation.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    Reservation.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
    Reservation.belongsTo(db.Guichet, { foreignKey: 'guichet_id', as: 'guichet' });
    Reservation.hasMany(db.PlaceReservee, { foreignKey: 'reservation_id', as: 'places' });
    Reservation.hasMany(db.Paiement, { foreignKey: 'reservation_id', as: 'paiements' });
    Reservation.hasMany(db.Billet, { foreignKey: 'reservation_id', as: 'billets' });
    Reservation.hasMany(db.HistoriqueReservation, { foreignKey: 'reservation_id', as: 'historique' });
  };

  return Reservation;
};
