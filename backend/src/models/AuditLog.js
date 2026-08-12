/**
 * Modèle JOURNAL_AUDIT — table `journal_audit`
 * Journal d'audit (Module 19) : traçabilité des actions réalisées par les
 * administrateurs (super admin principalement) — connexions, changements de
 * statut compagnie, gestion des abonnements/plans, paiements administrés.
 * Ne contient JAMAIS de mot de passe, de jeton ou de donnée sensible :
 * seul un texte descriptif + des identifiants d'entités sont conservés.
 */
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      utilisateur: { type: DataTypes.STRING(120), allowNull: true }, // nom ou email de l'acteur
      role: { type: DataTypes.STRING(40), allowNull: true }, // super_admin / company_admin / systeme…
      action: { type: DataTypes.STRING(60), allowNull: false }, // login, create, update, delete, validate, suspend…
      entite: { type: DataTypes.STRING(60), allowNull: false }, // auth, compagnie, abonnement, plan, paiement…
      entite_id: { type: DataTypes.STRING(60), allowNull: true }, // id de l'entité ciblée
      details: { type: DataTypes.TEXT('medium'), allowNull: true }, // JSON sérialisé (descriptif, jamais sensible)
      ip: { type: DataTypes.STRING(45), allowNull: true },
      date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'journal_audit',
      indexes: [{ fields: ['date'] }, { fields: ['action'] }, { fields: ['entite'] }],
    }
  );

  AuditLog.associate = () => {
    /* table autonome : aucune clé étrangère (l'entité peut être supprimée) */
  };

  return AuditLog;
};
