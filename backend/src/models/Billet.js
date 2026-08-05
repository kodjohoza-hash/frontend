/**
 * Modèle BILLET — table `billet` (MCD section 2)
 * Ticket émis automatiquement quand une réservation devient entièrement payée
 * (statut `payee`). Un billet correspond à UN passager et UN siège : la
 * contrainte unique (reservation_id, siege) le garantit en base.
 *
 * Champs d'émission électronique :
 *   - qr_code  : payload unique scannable (BTC:<reference>:<token>).
 *   - token    : jeton aléatoire d'authentification du billet (vérification
 *                sécurisée, anti double utilisation).
 *   - signature: HMAC-SHA256 du contenu du billet (clé JWT) — infalsifiable.
 *   - validite_jusqua : fin de validité (date/heure de départ du voyage).
 *   - email_envoye / sms_envoye : drapeaux d'envoi au passager.
 * Statuts : valide / utilise / expire / annule / rembourse / impaye / inconnu.
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
      nom_passager: { type: DataTypes.STRING(120), allowNull: true },
      prix: { type: DataTypes.INTEGER, allowNull: false },
      statut: {
        type: DataTypes.ENUM('valide', 'utilise', 'expire', 'annule', 'rembourse', 'impaye', 'inconnu'),
        allowNull: false,
        defaultValue: 'valide',
      },
      token: { type: DataTypes.STRING(48), allowNull: true, unique: true },
      signature: { type: DataTypes.STRING(128), allowNull: true },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      cree_par: { type: DataTypes.CHAR(10), allowNull: true },
      validite_jusqua: { type: DataTypes.DATE, allowNull: true },
      email_envoye: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      sms_envoye: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
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
    Billet.belongsTo(db.Agent, { foreignKey: 'verifie_par', as: 'verifiePar' });
    Billet.hasMany(db.Paiement, { foreignKey: 'billet_id', as: 'paiements' });
  };

  return Billet;
};
