/**
 * Modèle VILLE — table `ville` (liste des villes desservies).
 * Les agences y sont rattachées via `agence.ville_id`.
 */
module.exports = (sequelize, DataTypes) => {
  const Ville = sequelize.define(
    'Ville',
    {
      id: { type: DataTypes.CHAR(3), primaryKey: true },
      nom: { type: DataTypes.STRING(60), allowNull: false },
    },
    {
      tableName: 'ville',
      indexes: [{ fields: ['nom'] }],
    }
  );

  Ville.associate = (db) => {
    Ville.hasMany(db.Agence, { foreignKey: 'ville_id', as: 'agences' });
  };

  return Ville;
};
