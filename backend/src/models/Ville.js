/**
 * Modèle VILLE — table `ville` (liste des villes desservies).
 * Les agences y sont rattachées via `agence.ville_id`, les itinéraires
 * via `trajet.ville_depart_id` / `trajet.ville_arrivee_id` et les
 * escales via `escale.ville_id`.
 */
module.exports = (sequelize, DataTypes) => {
  const Ville = sequelize.define(
    'Ville',
    {
      id: { type: DataTypes.CHAR(3), primaryKey: true },
      nom: { type: DataTypes.STRING(60), allowNull: false },
      region: { type: DataTypes.STRING(100), allowNull: true },
      pays: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'Cameroun' },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      statut: {
        type: DataTypes.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'ville',
      timestamps: false,
      indexes: [{ fields: ['nom'] }, { fields: ['statut'] }],
    }
  );

  Ville.associate = (db) => {
    Ville.hasMany(db.Agence, { foreignKey: 'ville_id', as: 'agences' });
    Ville.hasMany(db.Trajet, { foreignKey: 'ville_depart_id', as: 'trajetsDepart' });
    Ville.hasMany(db.Trajet, { foreignKey: 'ville_arrivee_id', as: 'trajetsArrivee' });
    Ville.hasMany(db.Escale, { foreignKey: 'ville_id', as: 'escales' });
  };

  return Ville;
};
