/**
 * Modèle CHAUFFEUR_AFFECTATION — table `chauffeur_affectation`
 * Historique d'affectation d'un chauffeur à un bus. Une ligne « ouverte »
 * (date_fin NULL) indique l'affectation en cours. Un chauffeur peut
 * conduire plusieurs bus au cours de sa carrière.
 */
module.exports = (sequelize, DataTypes) => {
  const ChauffeurAffectation = sequelize.define(
    'ChauffeurAffectation',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      chauffeur_id: { type: DataTypes.CHAR(10), allowNull: false },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      date_debut: { type: DataTypes.DATEONLY, allowNull: true },
      date_fin: { type: DataTypes.DATEONLY, allowNull: true },
      notes: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'chauffeur_affectation',
      indexes: [{ fields: ['chauffeur_id'] }, { fields: ['bus_id'] }],
    }
  );

  ChauffeurAffectation.associate = (db) => {
    ChauffeurAffectation.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
    ChauffeurAffectation.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
  };

  return ChauffeurAffectation;
};
