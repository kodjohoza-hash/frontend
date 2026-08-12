const { AuditLog } = require('../../../models');
const logger = require('../../../utils/logger');

/** Nom lisible de l'acteur (user sérialisé) ou identifiant brut. */
const actorName = (actor) => {
  const u = actor?.user;
  const name = [u?.firstName, u?.lastName].filter(Boolean).join(' ').trim();
  return name || actor?.email || actor?.id || null;
};

/**
 * Écrit une entrée dans le journal d'audit (table `journal_audit`).
 * N'échoue JAMAIS le flux métier : une erreur d'écriture est simplement loguée.
 * @param {Object} opts
 * @param {Object|string} opts.actor acteur (req.user) ou rôle texte
 * @param {string} opts.action login / create / update / delete / validate / suspend…
 * @param {string} opts.entite auth / compagnie / abonnement / plan / paiement…
 * @param {string|number} [opts.entiteId]
 * @param {Object} [opts.details] descriptif JSON (jamais de mot de passe / jeton)
 * @param {Object} [opts.req] requête Express (pour l'IP)
 */
const audit = async ({ actor, action, entite, entiteId, details, req }) => {
  try {
    await AuditLog.create({
      utilisateur: actorName(actor) || (typeof actor === 'string' ? actor : null),
      role: actor?.role || (typeof actor === 'string' ? actor : null),
      action,
      entite,
      entite_id: entiteId == null ? null : String(entiteId).slice(0, 60),
      details: details ? JSON.stringify(details) : null,
      ip: req?.ip || req?.connection?.remoteAddress || null,
      date: new Date(),
    });
  } catch (err) {
    logger.warn(`[audit] écriture ignorée : ${err.message}`);
  }
};

module.exports = { audit, actorName };
