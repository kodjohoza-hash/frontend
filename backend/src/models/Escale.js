/**
 * Modèle ESCALE — table `escale`
 * Étape intermédiaire d'un itinéraire (trajet) : ville traversée, ordre,
 * heure estimée d'arrivée et durée d'arrêt en minutes.
 */
module.exports = (sequelize, DataTypes) => {
  const Escale = sequelize.define(
    'Escale',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      trajet_id: { type: DataTypes.CHAR(10), allowNull: false },
      ville_id: { type: DataTypes.CHAR(3), allowNull: false },
      ordre: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
      heure_estimee: { type: DataTypes.TIME, allowNull: true },
      duree_arret: { type: DataTypes.SMALLINT, allowNull: true },
      description: { type: DataTypes.STRING(255), allowNull: true },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'escale',
      timestamps: false,
      indexes: [{ fields: ['trajet_id'] }, { fields: ['ville_id'] }, { fields: ['ordre'] }],
    }
  );

  Escale.associate = (db) => {
    Escale.belongsTo(db.Trajet, { foreignKey: 'trajet_id', as: 'trajet' });
    Escale.belongsTo(db.Ville, { foreignKey: 'ville_id', as: 'ville' });
  };

  return Escale;
};
