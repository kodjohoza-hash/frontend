/**
 * Modèle PLACE_RESERVEE — table `place_reservee` (MCD section 2)
 * Un passager par place : association entre une réservation et un siège
 * (ex : A3, 12B). `tarif` = prix unitaire du siège au moment de la réservation.
 */
module.exports = (sequelize, DataTypes) => {
  const PlaceReservee = sequelize.define(
    'PlaceReservee',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      reservation_id: { type: DataTypes.CHAR(15), allowNull: false },
      siege: { type: DataTypes.STRING(5), allowNull: false },
      nom_passager: { type: DataTypes.STRING(120), allowNull: true },
      tarif: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'place_reservee',
      timestamps: false,
      indexes: [{ fields: ['reservation_id'] }, { fields: ['siege'] }],
    }
  );

  PlaceReservee.associate = (db) => {
    PlaceReservee.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
    /* Un siège = un passager (le passager porte la FK place_reservee_id). */
    PlaceReservee.hasOne(db.Passenger, { foreignKey: 'place_reservee_id', as: 'passenger' });
  };

  return PlaceReservee;
};
