/**
 * Modèle DEPART — table `depart` (MCD section 1)
 * Instance programmée d'un trajet (une sortie de bus sur une route donnée).
 * Utilisé par le module Buses pour les statistiques d'utilisation
 * (nombre de voyages, taux d'occupation moyen).
 */
module.exports = (sequelize, DataTypes) => {
  const Depart = sequelize.define(
    'Depart',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      trajet_id: { type: DataTypes.CHAR(10), allowNull: false },
      bus_id: { type: DataTypes.CHAR(10), allowNull: false },
      date_depart: { type: DataTypes.DATEONLY, allowNull: false },
      heure_depart: { type: DataTypes.TIME, allowNull: false },
      heure_arrivee: { type: DataTypes.TIME, allowNull: false },
      prix_base: { type: DataTypes.INTEGER, allowNull: false },
      places_total: { type: DataTypes.SMALLINT, allowNull: false },
      places_dispo: { type: DataTypes.SMALLINT, allowNull: false },
      quai: { type: DataTypes.STRING(20), allowNull: true },
      statut: {
        type: DataTypes.ENUM('disponible', 'bientot_complet', 'complet', 'annule', 'en_retard'),
        allowNull: false,
        defaultValue: 'disponible',
      },
    },
    {
      tableName: 'depart',
      timestamps: false,
      indexes: [{ fields: ['bus_id'] }, { fields: ['trajet_id'] }],
    }
  );

  Depart.associate = (db) => {
    Depart.belongsTo(db.Bus, { foreignKey: 'bus_id', as: 'bus' });
    Depart.belongsTo(db.Agent, { foreignKey: 'chauffeur_id', as: 'chauffeur' });
    Depart.belongsTo(db.Trajet, { foreignKey: 'trajet_id', as: 'trajet' });
  };

  return Depart;
};
