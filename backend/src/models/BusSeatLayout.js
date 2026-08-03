/**
 * Modèle BUS_SEAT_LAYOUT — table `bus_seat_layout`
 * Plan de sièges d'un bus (nombre de rangées, sièges par côté, allées,
 * rangées VIP, sièges PMR).
 */
module.exports = (sequelize, DataTypes) => {
  const BusSeatLayout = sequelize.define(
    'BusSeatLayout',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      rows_count: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 12 },
      seats_per_side: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 2 },
      aisle_after: { type: DataTypes.JSON, allowNull: true },
      vip_rows: { type: DataTypes.JSON, allowNull: true },
      pmr_seats: { type: DataTypes.JSON, allowNull: true },
      total_seats: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    },
    {
      tableName: 'bus_seat_layout',
      timestamps: false,
      indexes: [{ fields: ['bus_id'] }],
    }
  );

  BusSeatLayout.associate = (db) => {
    BusSeatLayout.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
  };

  return BusSeatLayout;
};
