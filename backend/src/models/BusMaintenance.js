/**
 * Modèle BUS_MAINTENANCE — table `bus_maintenance`
 * Historique des maintenances d'un bus (révision, vidange, pneus, freins…).
 *
 * Statuts (alignés sur le frontend) :
 *   planifiee / en_cours / terminee
 */
module.exports = (sequelize, DataTypes) => {
  const BusMaintenance = sequelize.define(
    'BusMaintenance',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      type: {
        type: DataTypes.ENUM(
          'revision',
          'vidange',
          'pneu',
          'frein',
          'climatisation',
          'carrosserie',
          'electrique',
          'moteur',
          'controle_technique',
          'nettoyage',
          'autre'
        ),
        allowNull: false,
        defaultValue: 'autre',
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      completed_date: { type: DataTypes.DATEONLY, allowNull: true },
      mileage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      cost: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      provider: { type: DataTypes.STRING(120), allowNull: true },
      status: {
        type: DataTypes.ENUM('planifiee', 'en_cours', 'terminee'),
        allowNull: false,
        defaultValue: 'planifiee',
      },
      notes: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'bus_maintenance',
      timestamps: false,
      indexes: [{ fields: ['bus_id'] }, { fields: ['status'] }],
    }
  );

  BusMaintenance.associate = (db) => {
    BusMaintenance.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
  };

  return BusMaintenance;
};
