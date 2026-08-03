/**
 * Modèle BUS_IMAGE — table `bus_image`
 * Galerie de photos d'un bus (URL relative + photo principale).
 */
module.exports = (sequelize, DataTypes) => {
  const BusImage = sequelize.define(
    'BusImage',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false },
      is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      tableName: 'bus_image',
      timestamps: false,
      indexes: [{ fields: ['bus_id'] }],
    }
  );

  BusImage.associate = (db) => {
    BusImage.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
  };

  return BusImage;
};
