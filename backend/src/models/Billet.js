/**
 * Modèle BILLET — table `billet` (MCD section 2)
 * Ticket émis après paiement d'une réservation (un billet par siège).
 * Modèle créé pour l'intégrité du schéma ; la génération de billets n'est
 * pas encore déclenchée par le module Bookings.
 */
module.exports = (sequelize, DataTypes) => {
  const Billet = sequelize.define(
    'Billet',
    {
      id: { type: DataTypes.CHAR(15), primaryKey: true },
      reference: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      qr_code: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      code_barre: { type: DataTypes.STRING(40), allowNull: false },
      reservation_id: { type: DataTypes.CHAR(15), allowNull: true },
      depart_id: { type: DataTypes.CHAR(10), allowNull: false },
      client_id: { type: DataTypes.CHAR(12), allowNull: false },
      siege: { type: DataTypes.STRING(5), allowNull: false },
      prix: { type: DataTypes.INTEGER, allowNull: false },
      statut: {
        type: DataTypes.ENUM('valide', 'utilise', 'expire', 'annule', 'rembourse', 'impaye', 'inconnu'),
        allowNull: false,
        defaultValue: 'valide',
      },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      cree_par: { type: DataTypes.CHAR(10), allowNull: false },
      verifie_le: { type: DataTypes.DATE, allowNull: true },
      verifie_par: { type: DataTypes.CHAR(10), allowNull: true },
    },
    {
      tableName: 'billet',
      timestamps: false,
      indexes: [
        { fields: ['reservation_id'] },
        { fields: ['depart_id'] },
        { fields: ['client_id'] },
        { fields: ['statut'] },
      ],
    }
  );

  Billet.associate = (db) => {
    Billet.belongsTo(db.Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
    Billet.belongsTo(db.Depart, { foreignKey: 'depart_id', as: 'depart' });
    Billet.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    Billet.belongsTo(db.Agent, { foreignKey: 'cree_par', as: 'creePar' });
    Billet.hasMany(db.Paiement, { foreignKey: 'billet_id', as: 'paiements' });
  };

  return Billet;
};
