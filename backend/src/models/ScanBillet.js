/**
 * Modèle SCAN_BILLET — table `scan_billet` (Module 12, Étape 2)
 * Journal de vérification des billets (anti-fraude) : chaque scan d'un QR
 * code est enregistré avec le résultat (valide / refuse + raison), l'agent
 * qui a scanné, son guichet (agence), la compagnie, l'adresse IP et la date.
 *
 * - statut     : valide | refuse
 * - raison     : motif du refus (ex: « Billet déjà utilisé »).
 * - cree_le    : date/heure du scan.
 */
module.exports = (sequelize, DataTypes) => {
  const ScanBillet = sequelize.define(
    'ScanBillet',
    {
      id: { type: DataTypes.CHAR(15), primaryKey: true },
      billet_id: { type: DataTypes.CHAR(15), allowNull: false },
      scanner_agent_id: { type: DataTypes.CHAR(10), allowNull: true },
      client_id: { type: DataTypes.CHAR(12), allowNull: true },
      agence_id: { type: DataTypes.CHAR(10), allowNull: true },
      compagnie_id: { type: DataTypes.CHAR(10), allowNull: true },
      statut: { type: DataTypes.STRING(20), allowNull: false },
      raison: { type: DataTypes.STRING(120), allowNull: true },
      adresse_ip: { type: DataTypes.STRING(45), allowNull: true },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'scan_billet',
      timestamps: false,
      indexes: [
        { fields: ['billet_id'] },
        { fields: ['cree_le'] },
        { fields: ['statut'] },
        { fields: ['agence_id'] },
        { fields: ['compagnie_id'] },
      ],
    }
  );

  ScanBillet.associate = (db) => {
    ScanBillet.belongsTo(db.Billet, { foreignKey: 'billet_id', as: 'billet' });
    ScanBillet.belongsTo(db.Agent, { foreignKey: 'scanner_agent_id', as: 'scannerAgent' });
    ScanBillet.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });
    ScanBillet.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    ScanBillet.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
  };

  return ScanBillet;
};
