/**
 * Modèle CHAUFFEUR_DOCUMENT — table `chauffeur_document`
 * Documents d'un chauffeur : Permis, Carte nationale, Certificat médical,
 * Contrat, Photo, Autres. Les fichiers sont stockés sous /uploads/drivers/docs.
 */
module.exports = (sequelize, DataTypes) => {
  const ChauffeurDocument = sequelize.define(
    'ChauffeurDocument',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      chauffeur_id: { type: DataTypes.CHAR(10), allowNull: false },
      type: {
        type: DataTypes.ENUM('permis', 'cni', 'medical', 'contrat', 'photo', 'autre'),
        allowNull: false,
        defaultValue: 'autre',
      },
      url: { type: DataTypes.STRING(255), allowNull: false },
      notes: { type: DataTypes.STRING(255), allowNull: true },
      date_creation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'chauffeur_document',
      indexes: [{ fields: ['chauffeur_id'] }, { fields: ['type'] }],
    }
  );

  ChauffeurDocument.associate = (db) => {
    ChauffeurDocument.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
  };

  return ChauffeurDocument;
};
