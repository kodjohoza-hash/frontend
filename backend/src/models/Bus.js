/**
 * Modèle BUS — table `bus` (MCD section 1)
 * Module Buses : profil complet du véhicule (n° interne, marque, année,
 * type, carburant, couleur, équipements, photo, chauffeur, maintenances…).
 *
 * Statuts (alignés sur la demande) :
 *   AVAILABLE / ON_TRIP / MAINTENANCE / OUT_OF_SERVICE / INACTIVE
 *     → available / on_trip / maintenance / out_of_service / inactive
 */
module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define(
    'Bus',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      immatriculation: { type: DataTypes.STRING(15), allowNull: false },
      interne: { type: DataTypes.STRING(30), allowNull: true },
      modele: { type: DataTypes.STRING(60), allowNull: false },
      marque: { type: DataTypes.STRING(40), allowNull: true },
      annee: { type: DataTypes.SMALLINT, allowNull: true },
      capacite: { type: DataTypes.SMALLINT, allowNull: false },
      classe: {
        type: DataTypes.ENUM('first', 'business', 'economy', 'mixed'),
        allowNull: false,
        defaultValue: 'economy',
      },
      type_bus: {
        type: DataTypes.ENUM('vip', 'confort', 'standard', 'economique', 'minibus', 'double_deck'),
        allowNull: false,
        defaultValue: 'standard',
      },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      carburant: {
        type: DataTypes.ENUM('diesel', 'essence', 'electrique', 'hybride'),
        allowNull: false,
        defaultValue: 'diesel',
      },
      couleur: { type: DataTypes.CHAR(7), allowNull: true, defaultValue: '#0B1D51' },
      equipements: { type: DataTypes.JSON, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      photo_url: { type: DataTypes.STRING(255), allowNull: true },
      chauffeur_id: { type: DataTypes.CHAR(10), allowNull: true },
      dernier_maintenance: { type: DataTypes.DATEONLY, allowNull: true },
      prochaine_maintenance: { type: DataTypes.DATEONLY, allowNull: true },
      mise_en_service: { type: DataTypes.DATEONLY, allowNull: true },
      kilometrage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      statut: {
        type: DataTypes.ENUM('available', 'on_trip', 'maintenance', 'out_of_service', 'inactive'),
        allowNull: false,
        defaultValue: 'available',
      },
      date_creation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'bus',
      timestamps: false,
      indexes: [
        { fields: ['compagnie_id'] },
        { fields: ['statut'] },
        { fields: ['type_bus'] },
        { fields: ['marque'] },
        { fields: ['chauffeur_id'] },
      ],
    }
  );

  Bus.associate = (db) => {
    Bus.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    Bus.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
    Bus.hasOne(db.BusSeatLayout, { foreignKey: 'bus_id', as: 'seatLayout' });
    Bus.hasMany(db.BusMaintenance, { foreignKey: 'bus_id', as: 'maintenances' });
    Bus.hasMany(db.BusImage, { foreignKey: 'bus_id', as: 'images' });
    Bus.hasMany(db.Depart, { foreignKey: 'bus_id', as: 'departs' });
  };

  return Bus;
};
