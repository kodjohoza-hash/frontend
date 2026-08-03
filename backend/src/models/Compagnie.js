/**
 * Modèle COMPAGNIE — table `compagnie` (MCD section 1)
 * Une compagnie de transport possède plusieurs agences.
 */
module.exports = (sequelize, DataTypes) => {
  const Compagnie = sequelize.define(
    'Compagnie',
    {
      id: { type: DataTypes.CHAR(4), primaryKey: true },
      nom: { type: DataTypes.STRING(120), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      telephone: { type: DataTypes.STRING(20), allowNull: true },
      email: { type: DataTypes.STRING(120), allowNull: true },
      site_web: { type: DataTypes.STRING(255), allowNull: true },
      adresse: { type: DataTypes.STRING(255), allowNull: true },
      ville: { type: DataTypes.STRING(120), allowNull: true },
      pays: { type: DataTypes.STRING(60), allowNull: true },
      rccm: { type: DataTypes.STRING(60), allowNull: true },
      numero_contribuable: { type: DataTypes.STRING(60), allowNull: true },
      date_creation: { type: DataTypes.DATEONLY, allowNull: true },
      couleur: { type: DataTypes.CHAR(7), allowNull: true },
      logo: { type: DataTypes.STRING(255), allowNull: true },
      actif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      statut: {
        type: DataTypes.ENUM('actif', 'en_attente', 'suspendu', 'banni', 'expire'),
        allowNull: false,
        defaultValue: 'actif',
      },
      statut_abonnement: {
        type: DataTypes.ENUM('actif', 'en_retard', 'expire', 'suspendu'),
        allowNull: false,
        defaultValue: 'suspendu',
      },
      abonnement_expire_le: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      tableName: 'compagnie',
      indexes: [{ fields: ['nom'] }, { fields: ['statut_abonnement'] }, { fields: ['statut'] }],
    }
  );

  Compagnie.associate = (db) => {
    Compagnie.hasMany(db.Agence, { foreignKey: 'compagnie_id', as: 'agences' });
    Compagnie.hasMany(db.DocumentCompagnie, { foreignKey: 'compagnie_id', as: 'documents' });
    Compagnie.hasMany(db.PaiementAbonnement, { foreignKey: 'compagnie_id', as: 'paiements_abonnement' });
    Compagnie.hasMany(db.RappelAbonnement, { foreignKey: 'compagnie_id', as: 'relances' });
    Compagnie.hasOne(db.AbonnementCompagnie, { foreignKey: 'compagnie_id', as: 'abonnementSaaS' });
    Compagnie.hasMany(db.PaiementAbonnementCompagnie, { foreignKey: 'compagnie_id', as: 'paiements_saas' });
    Compagnie.hasMany(db.NotificationAbonnement, { foreignKey: 'compagnie_id', as: 'notifications_abonnement' });
    Compagnie.hasMany(db.HistoriqueAbonnement, { foreignKey: 'compagnie_id', as: 'historique_abonnement' });
  };

  return Compagnie;
};
