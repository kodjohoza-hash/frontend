/**
 * Modèle PASSENGER — table `passenger`
 * Un passager correspond TOUJOURS à un siège (place_reservee_id UNIQUE → 1:1)
 * et à un billet (billet.passenger_id UNIQUE → 1:1). Le contact d'urgence
 * n'est jamais un passager : il vit dans `emergency_contact` (0..1 par passager).
 *
 * Statuts : BOOKED / CHECKED_IN / BOARDED / CANCELLED
 */
module.exports = (sequelize, DataTypes) => {
  const Passenger = sequelize.define(
    'Passenger',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      reservation_id: { type: DataTypes.CHAR(15), allowNull: false },
      place_reservee_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      client_id: { type: DataTypes.CHAR(12), allowNull: true },
      first_name: { type: DataTypes.STRING(80), allowNull: false },
      last_name: { type: DataTypes.STRING(80), allowNull: false },
      gender: { type: DataTypes.ENUM('M', 'F'), allowNull: false },
      birth_date: { type: DataTypes.DATEONLY, allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: true },
      document_type: { type: DataTypes.STRING(20), allowNull: false },
      document_number: { type: DataTypes.STRING(40), allowNull: false },
      nationality: { type: DataTypes.STRING(60), allowNull: true },
      status: {
        type: DataTypes.ENUM('BOOKED', 'CHECKED_IN', 'BOARDED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'BOOKED',
      },
    },
    {
      tableName: 'passenger',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{ fields: ['reservation_id'] }, { fields: ['client_id'] }],
    }
  );

  Passenger.associate = (db) => {
    Passenger.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
    Passenger.belongsTo(db.PlaceReservee, { foreignKey: 'place_reservee_id', as: 'place' });
    Passenger.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    Passenger.hasOne(db.EmergencyContact, { foreignKey: 'passenger_id', as: 'emergencyContact' });
    Passenger.hasOne(db.Billet, { foreignKey: 'passenger_id', as: 'billet' });
  };

  return Passenger;
};
