/**
 * Modèle GUICHET (point de vente interne) — table `guichet`
 * Rattaché à une agence ; les agents (table `agent`) y sont affectés
 * via la colonne `agent.guichet_id`.
 */
module.exports = (sequelize, DataTypes) => {
  const Guichet = sequelize.define(
    'Guichet',
    {
      id: { type: DataTypes.CHAR(10), primaryKey: true },
      agence_id: { type: DataTypes.CHAR(10), allowNull: false }, // FK vers agence
      code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      nom: { type: DataTypes.STRING(120), allowNull: true },
      type: {
        type: DataTypes.ENUM('vente_billets', 'reservation', 'caisse', 'renseignement', 'autre'),
        allowNull: false,
        defaultValue: 'vente_billets',
      },
      statut: {
        type: DataTypes.ENUM('ouvert', 'ferme', 'maintenance'),
        allowNull: false,
        defaultValue: 'ouvert',
      },
      description: { type: DataTypes.STRING(255), allowNull: true },
      date_creation: { type: DataTypes.DATE, allowNull: true },
      date_modification: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'guichet',
      indexes: [{ fields: ['agence_id'] }, { fields: ['code'] }, { fields: ['statut'] }],
    }
  );

  Guichet.associate = (db) => {
    Guichet.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    Guichet.hasMany(db.Agent, { foreignKey: 'guichet_id', as: 'agents' });
  };

  return Guichet;
};
