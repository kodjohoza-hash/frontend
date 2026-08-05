/**
 * Modèle CLIENT — table `client` (MCD section 3 : Clients et fidélité)
 * Un client peut se créer un compte (inscription publique) : le mot de passe
 * est stocké haché dans `mot_de_passe_hash` (colonne ajoutée, absente du MCD).
 * Le client n'a ni rôle agent ni rattachement agence : role = 'client'.
 */
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    'Client',
    {
      id: { type: DataTypes.CHAR(12), primaryKey: true },
      prenom: { type: DataTypes.STRING(60), allowNull: false },
      nom: { type: DataTypes.STRING(60), allowNull: false },
      telephone: { type: DataTypes.STRING(20), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
      adresse: { type: DataTypes.STRING(255), allowNull: true },
      ville_id: { type: DataTypes.CHAR(3), allowNull: true },
      pays: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'Cameroun' },
      type_piece: {
        type: DataTypes.ENUM('cni', 'passeport', 'permis', 'aucune', 'autre'),
        allowNull: false,
        defaultValue: 'aucune',
      },
      numero_piece: { type: DataTypes.STRING(40), allowNull: true },
      date_inscription: { type: DataTypes.DATE, allowNull: false },
      statut: {
        type: DataTypes.ENUM('nouveau', 'actif', 'vip', 'inactif', 'suspendu'),
        allowNull: false,
        defaultValue: 'nouveau',
      },
      mot_de_passe_hash: { type: DataTypes.STRING(255), allowNull: true },
      /* Virtuel : permet d'unifier le traitement des comptes (agents vs clients). */
      role: {
        type: DataTypes.VIRTUAL,
        get() {
          return 'client';
        },
      },
    },
    {
      tableName: 'client',
      timestamps: false,
      indexes: [{ fields: ['email'] }, { fields: ['telephone'] }],
    }
  );

  Client.associate = (db) => {
    Client.belongsTo(db.Ville, { foreignKey: 'ville_id', as: 'ville' });
    Client.hasMany(db.RefreshToken, { foreignKey: 'client_id', as: 'refreshTokens' });
    Client.hasMany(db.SessionConnexion, { foreignKey: 'client_id', as: 'sessions' });
    /* Module Bookings */
    Client.hasMany(db.Reservation, { foreignKey: 'client_id', as: 'reservations' });
    Client.hasMany(db.Paiement, { foreignKey: 'client_id', as: 'paiements' });
  };

  return Client;
};
