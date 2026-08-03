const { Op } = require('sequelize');
const sequelize = require('../../../config/database');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { daysRemaining, isoDate } = require('../../../utils/generators');
const { subscriptionRepository, paymentRepository, historyRepository, planRepository } = require('../repositories');
const { Compagnie } = require('../../../models');

/** Appose jours restants + date d'expiration sur une ligne d'abonnement. */
const decorate = (sub) => {
  if (!sub) return null;
  const data = sub.toJSON();
  data.jours_restants = daysRemaining(data.date_fin);
  data.expire = data.jours_restants === 0;
  return data;
};

const list = async (filters = {}) => {
  const where = {};
  if (filters.statut) where.statut = filters.statut;
  if (filters.plan_id) where.plan_id = filters.plan_id;

  const include = [];
  if (filters.recherche) {
    include.push({
      model: Compagnie,
      as: 'compagnie',
      where: { nom: { [Op.like]: `%${filters.recherche}%` } },
    });
  }

  let rows = await subscriptionRepository.findAll(where, { include });

  if (filters.expirant) {
    rows = rows.filter((r) => r.jours_restants === undefined || daysRemaining(r.date_fin) <= 7);
  }

  return rows.map(decorate);
};

const getByCompany = async (compagnieId) => {
  const sub = await subscriptionRepository.findByCompany(compagnieId);
  if (!sub) return null;
  return decorate(sub);
};

const getById = async (id) => {
  const sub = await subscriptionRepository.findById(id);
  if (!sub) throw new ApiError(404, 'Abonnement introuvable.');
  return decorate(sub);
};

/**
 * Crée l'abonnement SaaS d'une compagnie (1 par compagnie).
 * Transaction : création + mise à jour compagnie + historique.
 */
const create = async (data, auteur = 'systeme') => {
  const compagnie = await Compagnie.findByPk(data.compagnie_id);
  if (!compagnie) throw new ApiError(404, 'Compagnie introuvable.');

  const existant = await subscriptionRepository.findByCompany(data.compagnie_id);
  if (existant) throw new ApiError(409, 'Cette compagnie possède déjà un abonnement SaaS.');

  const plan = await planRepository.findById(data.plan_id);
  if (!plan) throw new ApiError(404, 'Plan introuvable.');

  return sequelize.transaction(async (t) => {
    const sub = await subscriptionRepository.create(
      {
        compagnie_id: data.compagnie_id,
        plan_id: data.plan_id,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
        renouvellement_auto: data.renouvellement_auto ?? false,
        statut: 'actif',
      },
      t
    );

    await Compagnie.update(
      { statut_abonnement: 'actif', abonnement_expire_le: data.date_fin },
      { where: { id: data.compagnie_id }, transaction: t }
    );

    await historyRepository.create(
      {
        compagnie_id: data.compagnie_id,
        abonnement_compagnie_id: sub.id,
        action: 'creation',
        plan_id: data.plan_id,
        detail: `Abonnement ${plan.nom} activé du ${data.date_debut} au ${data.date_fin}`,
        auteur,
        date: new Date(),
      },
      t
    );

    return sub;
  });
};

/**
 * Renouvelle l'abonnement (paiement + extension + historique) en transaction.
 */
const renew = async (compagnieId, data, auteur = 'compagnie') => {
  const sub = await subscriptionRepository.findByCompany(compagnieId);
  if (!sub) throw new ApiError(404, 'Aucun abonnement actif pour cette compagnie.');

  const plan = await planRepository.findById(data.plan_id);
  if (!plan) throw new ApiError(404, 'Plan introuvable.');

  const dateDebut = data.date_debut || isoDate(new Date());
  const dateFin = data.date_fin || addDays(dateDebut, plan.duree_jours);

  return sequelize.transaction(async (t) => {
    const ancienPlanId = sub.plan_id !== data.plan_id ? sub.plan_id : null;

    await subscriptionRepository.update(
      sub,
      {
        plan_id: data.plan_id,
        plan_precedent_id: ancienPlanId,
        date_debut: dateDebut,
        date_fin: dateFin,
        renouvellement_auto: data.renouvellement_auto ?? sub.renouvellement_auto,
        statut: 'actif',
      },
      t
    );

    await Compagnie.update(
      { statut_abonnement: 'actif', abonnement_expire_le: dateFin },
      { where: { id: compagnieId }, transaction: t }
    );

    // Paiement enregistré (référence auto si non fournie)
    const paiement = await paymentRepository.create(
      {
        abonnement_compagnie_id: sub.id,
        compagnie_id: compagnieId,
        plan_id: data.plan_id,
        montant: data.montant ?? plan.prix_mensuel,
        methode: data.methode,
        statut: 'paye',
        date: new Date(),
        reference: `PAY-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1e3)}`,
      },
      t
    );

    await historyRepository.create(
      {
        compagnie_id: compagnieId,
        abonnement_compagnie_id: sub.id,
        action: 'renouvellement',
        plan_id: data.plan_id,
        detail: `Renouvellement ${plan.nom} du ${dateDebut} au ${dateFin} (${paiement.reference})`,
        auteur,
        date: new Date(),
      },
      t
    );

    logger.info(`Abonnement renouvelé pour la compagnie ${compagnieId} (${plan.nom})`);
    return { ...decorate(sub), paiement };
  });
};

const suspend = async (compagnieId, motif, auteur = 'super_admin') => {
  const sub = await subscriptionRepository.findByCompany(compagnieId);
  if (!sub) throw new ApiError(404, 'Aucun abonnement pour cette compagnie.');

  return sequelize.transaction(async (t) => {
    await subscriptionRepository.update(sub, { statut: 'suspendu' }, t);
    await Compagnie.update(
      { statut_abonnement: 'suspendu' },
      { where: { id: compagnieId }, transaction: t }
    );
    await historyRepository.create(
      {
        compagnie_id: compagnieId,
        abonnement_compagnie_id: sub.id,
        action: 'suspension',
        plan_id: sub.plan_id,
        detail: motif || 'Suspension par l\'administration',
        auteur,
        date: new Date(),
      },
      t
    );
    return decorate(sub);
  });
};

const reactivate = async (compagnieId, auteur = 'super_admin') => {
  const sub = await subscriptionRepository.findByCompany(compagnieId);
  if (!sub) throw new ApiError(404, 'Aucun abonnement pour cette compagnie.');

  return sequelize.transaction(async (t) => {
    await subscriptionRepository.update(sub, { statut: 'actif' }, t);
    await Compagnie.update(
      { statut_abonnement: 'actif', abonnement_expire_le: sub.date_fin },
      { where: { id: compagnieId }, transaction: t }
    );
    await historyRepository.create(
      {
        compagnie_id: compagnieId,
        abonnement_compagnie_id: sub.id,
        action: 'reprise',
        plan_id: sub.plan_id,
        detail: 'Abonnement réactivé',
        auteur,
        date: new Date(),
      },
      t
    );
    return decorate(sub);
  });
};

const expire = async (compagnieId, auteur = 'systeme') => {
  const sub = await subscriptionRepository.findByCompany(compagnieId);
  if (!sub) return null;

  return sequelize.transaction(async (t) => {
    await subscriptionRepository.update(sub, { statut: 'expire' }, t);
    await Compagnie.update(
      { statut_abonnement: 'expire' },
      { where: { id: compagnieId }, transaction: t }
    );
    await historyRepository.create(
      {
        compagnie_id: compagnieId,
        abonnement_compagnie_id: sub.id,
        action: 'expiration',
        plan_id: sub.plan_id,
        detail: 'Abonnement expiré automatiquement',
        auteur,
        date: new Date(),
      },
      t
    );
    return decorate(sub);
  });
};

const addDays = (dateStr, days) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return isoDate(d);
};

module.exports = { list, getByCompany, getById, create, renew, suspend, reactivate, expire, decorate };
