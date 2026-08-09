/**
 * Modèle CHECKIN_BILLET — table `checkin_billet` (Module 15, contrôle des billets)
 * Historique des contrôles d'embarquement : chaque tentative de check-in d'un
 * billet (autorisée ou refusée) est journalisée avec l'agent, sa compagnie,
 * son agence, son guichet, la date/heure, le type d'action et le résultat.
 *
 * - action   : type d'action (ex: 'checkin' = contrôle d'embarquement).
 * - resultat : 'embarque' (validé) | 'refuse' (refusé avec raison).
 * - raison   : motif du refus (ex: « Billet déjà utilisé »).
 * - cree_le  : date/heure du contrôle.
 *
 * Le client ne peut JAMAIS contrôler son propre billet : cette table ne
 * référence qu'un agent (agent_id) — jamais un client.
 */
module.exports = (sequelize, DataTypes) => {
  const CheckInBillet = sequelize.define(
    'CheckInBillet',
    {
      id: { type: DataTypes.CHAR(15), primaryKey: true },
      billet_id: { type: DataTypes.CHAR(15), allowNull: false },
      agent_id: { type: DataTypes.CHAR(10), allowNull: true },
      compagnie_id: { type: DataTypes.CHAR(10), allowNull: true },
      agence_id: { type: DataTypes.CHAR(10), allowNull: true },
      guichet_id: { type: DataTypes.CHAR(10), allowNull: true },
      action: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'checkin' },
      resultat: { type: DataTypes.ENUM('embarque', 'refuse'), allowNull: false },
      raison: { type: DataTypes.STRING(120), allowNull: true },
      adresse_ip: { type: DataTypes.STRING(45), allowNull: true },
      cree_le: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'checkin_billet',
      timestamps: false,
      indexes: [
        { fields: ['billet_id'] },
        { fields: ['agent_id'] },
        { fields: ['compagnie_id'] },
        { fields: ['agence_id'] },
        { fields: ['guichet_id'] },
        { fields: ['cree_le'] },
      ],
    }
  );

  CheckInBillet.associate = (db) => {
    CheckInBillet.belongsTo(db.Billet, { foreignKey: 'billet_id', as: 'billet' });
    CheckInBillet.belongsTo(db.Agent, { foreignKey: 'agent_id', as: 'agent' });
    CheckInBillet.belongsTo(db.Compagnie, { foreignKey: 'compagnie_id', as: 'compagnie' });
    CheckInBillet.belongsTo(db.Agence, { foreignKey: 'agence_id', as: 'agence' });
    CheckInBillet.belongsTo(db.Guichet, { foreignKey: 'guichet_id', as: 'guichet' });
  };

  return CheckInBillet;
};
