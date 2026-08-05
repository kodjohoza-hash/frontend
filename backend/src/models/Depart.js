/**
 * Modèle DEPART — table `depart` (MCD section 1)
 * Instance programmée d'un trajet (une sortie de bus sur une route donnée).
 * C'est la table des VOYAGES : bus + chauffeur (+ remplaçant) + itinéraire
 * + date/heures + prix + places + statut.
 * Utilisé par le module Buses (statistiques d'utilisation), le module
 * Drivers (affectation des chauffeurs) et le module Trips (CRUD voyages).
 */
module.exports = (sequelize, DataTypes) => {
  const Depart = sequelize.define(
    'Depart',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      code: { type: DataTypes.STRING(30), allowNull: true },
      trajet_id: { type: DataTypes.CHAR(10), allowNull: false },
      compagnie_id: { type: DataTypes.CHAR(4), allowNull: true },
      agence_id: { type: DataTypes.CHAR(10), allowNull: true },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      chauffeur_id: { type: DataTypes.CHAR(10), allowNull: true },
      chauffeur_remplacant_id: { type: DataTypes.CHAR(10), allowNull: true },
      date_depart: { type: DataTypes.DATEONLY, allowNull: false },
      date_arrivee: { type: DataTypes.DATEONLY, allowNull: true },
      heure_depart: { type: DataTypes.TIME, allowNull: false },
      heure_arrivee: { type: DataTypes.TIME, allowNull: false },
      prix_base: { type: DataTypes.INTEGER, allowNull: false },
      places_total: { type: DataTypes.SMALLINT, allowNull: false },
      places_dispo: { type: DataTypes.SMALLINT, allowNull: false },
      quai: { type: DataTypes.STRING(20), allowNull: true },
      observations: { type: DataTypes.TEXT, allowNull: true },
      statut: {
        type: DataTypes.ENUM('programme', 'embarquement', 'en_cours', 'termine', 'annule', 'retarde'),
        allowNull: false,
        defaultValue: 'programme',
      },
      date_creation: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'depart',
      timestamps: false,
      indexes: [{ fields: ['bus_id'] }, { fields: ['trajet_id'] }, { fields: ['statut'] }],
    }
  );

  Depart.associate = (db) => {
    Depart.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
    Depart.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
    Depart.belongsTo(db.Agent, { foreignKey: 'chauffeur_remplacant_id', as: 'chauffeurRemplacant' });
    Depart.belongsTo(db.Trajet, { foreignKey: 'trajet_id', as: 'trajet' });
    Depart.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    Depart.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
  };

  return Depart;
};
