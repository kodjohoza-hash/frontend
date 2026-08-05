/**
 * Modèle EMERGENCY_CONTACT — table `emergency_contact`
 * Contact d'urgence rattaché à UN passager (passenger_id UNIQUE → 0..1 par
 * passager). Jamais un passager : ne réserve aucun siège, ne compte dans
 * aucun calcul de prix ni de places.
 *
 * Champs : full_name / phone / relationship / address (optionnel).
 */
module.exports = (sequelize, DataTypes) => {
  const EmergencyContact = sequelize.define(
    'EmergencyContact',
    {
      id: { type: DataTypes.CHAR(26), primaryKey: true },
      passenger_id: { type: DataTypes.CHAR(26), allowNull: false, unique: true },
      full_name: { type: DataTypes.STRING(160), allowNull: false },
      phone: { type: DataTypes.STRING(20), allowNull: false },
      relationship: { type: DataTypes.STRING(60), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'emergency_contact',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  EmergencyContact.associate = (db) => {
    EmergencyContact.belongsTo(db.Passenger, { foreignKey: 'passenger_id', as: 'passenger' });
  };

  return EmergencyContact;
};
