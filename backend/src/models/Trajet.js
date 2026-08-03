/**
 * Modèle TRAJET — table `trajet` (MCD section 1)
 * Un itinéraire (route) entre une ville de départ et une ville d'arrivée,
 * avec escales intermédiaires (table `escale`).
 * Utilisé par le module Routes (CRUD, escales, calculs) et référencé par
 * `depart.trajet_id` (voyages).
 */
module.exports = (sequelize, DataTypes) => {
  const Trajet = sequelize.define(
    'Trajet',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      nom: { type: DataTypes.STRING(120), allowNull: true },
      code: { type: DataTypes.STRING(20), allowNull: true, unique: true },
      ville_depart_id: { type: DataTypes.CHAR(3), allowNull: false },
      ville_arrivee_id: { type: DataTypes.CHAR(3), allowNull: false },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: true },
      distance_km: { type: DataTypes.SMALLINT, allowNull: true },
      duree: { type: DataTypes.STRING(10), allowNull: false },
      prix_min: { type: DataTypes.INTEGER, allowNull: true },
      prix_max: { type: DataTypes.INTEGER, allowNull: true },
      statut: {
        type: DataTypes.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'trajet',
      timestamps: false,
      indexes: [
        { fields: ['ville_depart_id'] },
        { fields: ['ville_arrivee_id'] },
        { fields: ['compagnie_id'] },
        { fields: ['statut'] },
      ],
    }
  );

  Trajet.associate = (db) => {
    Trajet.belongsTo(db.Ville, { foreignKey: 'ville_depart_id', as: 'villeDepart' });
    Trajet.belongsTo(db.Ville, { foreignKey: 'ville_arrivee_id', as: 'villeArrivee' });
    Trajet.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    Trajet.hasMany(db.Escale, { foreignKey: 'trajet_id', as: 'escales' });
    Trajet.hasMany(db.Depart, { foreignKey: 'trajet_id', as: 'departs' });
  };

  return Trajet;
};
