/**
 * Modèle AGENCE (point de vente) — table `agence` (MCD section 1)
 * Une agence sans abonnement payé est suspendue : les agents sont déconnectés.
 * Module Agencies & Counters : profils enrichis (GPS, horaires, statut, type).
 */
module.exports = (sequelize, DataTypes) => {
  const Agence = sequelize.define(
    'Agence',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      nom: { type: DataTypes.STRING(120), allowNull: false },
      ville_id: { type: DataTypes.CHAR(3), allowNull: false }, // FK vers ville
      region: { type: DataTypes.STRING(60), allowNull: true },
      adresse: { type: DataTypes.STRING(255), allowNull: true },
      quartier: { type: DataTypes.STRING(120), allowNull: true },
      telephone: { type: DataTypes.STRING(20), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      email: { type: DataTypes.STRING(120), allowNull: true },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: true },
      statut_abonnement: {
        type: DataTypes.ENUM('actif', 'en_retard', 'suspendu'),
        allowNull: false,
        defaultValue: 'suspendu',
      },
      statut: {
        type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
        allowNull: false,
        defaultValue: 'actif',
      },
      type: {
        type: DataTypes.ENUM('gare', 'agence', 'bouette', 'bureau'),
        allowNull: true,
      },
      latitude: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(9, 6), allowNull: true },
      heure_ouverture: { type: DataTypes.TIME, allowNull: true },
      heure_fermeture: { type: DataTypes.TIME, allowNull: true },
      jours_ouverture: { type: DataTypes.STRING(255), allowNull: true },
      services: { type: DataTypes.JSON, allowNull: true },
      abonnement_expire_le: { type: DataTypes.DATEONLY, allowNull: true },
    },
    {
      tableName: 'agence',
      indexes: [
        { fields: ['nom'] },
        { fields: ['compagnie_id'] },
        { fields: ['statut'] },
        { fields: ['type'] },
        { fields: ['ville_id'] },
      ],
    }
  );

  Agence.associate = (db) => {
    Agence.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    Agence.belongsTo(db.Ville, { foreignKey: 'ville_id', as: 'ville' });
    Agence.hasMany(db.Agent, { foreignKey: 'agence_id', as: 'agents' });
    Agence.hasMany(db.Guichet, { foreignKey: 'agence_id', as: 'guichets' });
    Agence.hasMany(db.Abonnement, { foreignKey: 'agence_id', as: 'abonnements' });
    Agence.hasMany(db.PaiementAbonnement, { foreignKey: 'agence_id', as: 'paiements_abonnement' });
    Agence.hasMany(db.RappelAbonnement, { foreignKey: 'agence_id', as: 'relances' });
  };

  return Agence;
};
