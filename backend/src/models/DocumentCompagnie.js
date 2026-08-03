/**
 * Modèle DOCUMENT_COMPAGNIE — table `document_compagnie` (migration module Companies)
 * Documents légaux / administratifs d'une compagnie (RCCM, contribuable, licence…).
 */
module.exports = (sequelize, DataTypes) => {
  const DocumentCompagnie = sequelize.define(
    'DocumentCompagnie',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: false },
      categorie: {
        type: DataTypes.ENUM('rccm', 'contribuable', 'licence', 'autorisation_transport', 'autre'),
        allowNull: false,
        defaultValue: 'autre',
      },
      nom_original: { type: DataTypes.STRING(255), allowNull: false },
      fichier: { type: DataTypes.STRING(255), allowNull: false },
      mime: { type: DataTypes.STRING(100), allowNull: false },
      taille: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
      televerse_le: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      tableName: 'document_compagnie',
      indexes: [{ fields: ['compagnie_id'] }, { fields: ['categorie'] }],
    }
  );

  DocumentCompagnie.associate = (db) => {
    DocumentCompagnie.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
  };

  return DocumentCompagnie;
};
