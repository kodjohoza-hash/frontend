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
      telephone: { type: DataTypes.STRING(20), allowNull: true },
      couleur: { type: DataTypes.CHAR(7), allowNull: true },
      logo: { type: DataTypes.STRING(255), allowNull: true },
      actif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      statut_abonnement: {
        type: DataTypes.ENUM('actif', 'en_retard', 'expire', 'suspendu'),
        allowNull: false,
        defaultValue: 'suspendu',
      },
      abonnement_expire_le: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      tableName: 'compagnie',
      indexes: [{ fields: ['nom'] }, { fields: ['statut_abonnement'] }],
    }
  );

  Compagnie.associate = (db) => {
    Compagnie.hasMany(db.Agence, { foreignKey: 'compagnie_id', as: 'agences' });
    Compagnie.hasMany(db.PaiementAbonnement, { foreignKey: 'compagnie_id', as: 'paiements_abonnement' });
    Compagnie.hasMany(db.RappelAbonnement, { foreignKey: 'compagnie_id', as: 'relances' });
    Compagnie.hasOne(db.AbonnementCompagnie, { foreignKey: 'compagnie_id', as: 'abonnementSaaS' });
    Compagnie.hasMany(db.PaiementAbonnementCompagnie, { foreignKey: 'compagnie_id', as: 'paiements_saas' });
    Compagnie.hasMany(db.NotificationAbonnement, { foreignKey: 'compagnie_id', as: 'notifications_abonnement' });
    Compagnie.hasMany(db.HistoriqueAbonnement, { foreignKey: 'compagnie_id', as: 'historique_abonnement' });
  };

  return Compagnie;
};
