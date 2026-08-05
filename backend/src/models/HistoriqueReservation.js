/**
 * Modèle HISTORIQUE_RESERVATION — table `historique_reservation` (MCD section 2)
 * Journal d'audit des actions sur une réservation
 * (création, confirmation, paiement, annulation, expiration, remboursement…).
 */
module.exports = (sequelize, DataTypes) => {
  const HistoriqueReservation = sequelize.define(
    'HistoriqueReservation',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      reservation_id: { type: DataTypes.CHAR(15), allowNull: false },
      action: { type: DataTypes.STRING(120), allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      utilisateur: { type: DataTypes.STRING(120), allowNull: false },
    },
    {
      tableName: 'historique_reservation',
      timestamps: false,
      indexes: [{ fields: ['reservation_id'] }],
    }
  );

  HistoriqueReservation.associate = (db) => {
    HistoriqueReservation.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
  };

  return HistoriqueReservation;
};
