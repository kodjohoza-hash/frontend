const ApiError = require('../../../utils/ApiError');
const { Compagnie } = require('../../../models');

const BLOCKED_STATUSES = ['expire', 'suspendu'];

/**
 * Bloque l'accès aux fonctionnalités métier pour les utilisateurs
 * d'une compagnie dont l'abonnement SaaS est expiré ou suspendu.
 * - Super Admin : toujours autorisé.
 * - Client : non concerné.
 * Les compagnies bloquées reçoivent un code dédié pour que le frontend
 * affiche « Votre abonnement a expiré ».
 */
// eslint-disable-next-line no-unused-vars
const requireActiveSubscription = async (req, _res, next) => {
  const user = req.user;

  if (!user || user.role === 'super_admin' || user.role === 'client') {
    return next();
  }

  const compagnieId = user.compagnieId;
  if (!compagnieId) return next();

  try {
    const compagnie = await Compagnie.findByPk(compagnieId, {
      attributes: ['id', 'statut_abonnement', 'abonnement_expire_le'],
    });

    if (compagnie && BLOCKED_STATUSES.includes(compagnie.statut_abonnement)) {
      return next(
        new ApiError(403, 'Votre abonnement a expiré. Veuillez renouveler votre abonnement.')
      );
    }
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = requireActiveSubscription;
