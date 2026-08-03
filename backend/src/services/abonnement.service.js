const { Op, fn, col } = require('sequelize');
const { Abonnement, Agence, PaiementAbonnement, Compagnie } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Suspend automatiquement les abonnements expirés (date_fin dépassée, non payé)
 * et passe les agences concernées en statut 'suspendu'. Appelé par un cron.
 */
const suspendreAbonnementsExpires = async () => {
  const aujourdhui = new Date();

  const expires = await Abonnement.findAll({
    where: {
      date_fin: { [Op.lt]: aujourdhui },
      statut_paiement: { [Op.ne]: 'paye' },
      statut: 'actif',
    },
  });

  let count = 0;
  for (const abo of expires) {
    await abo.update({ statut: 'expire' });
    await Agence.update(
      { statut_abonnement: 'suspendu', abonnement_expire_le: abo.date_fin },
      { where: { id: abo.agence_id } }
    );
    count += 1;
  }
  return count;
};

/**
 * Marque comme en retard les abonnements dont la date_fin est dépassée
 * et qui ne sont pas encore payés.
 */
const marquerEnRetard = async () => {
  const aujourdhui = new Date();
  const [count] = await Abonnement.update(
    { statut_paiement: 'en_retard', statut: 'suspendu' },
    {
      where: {
        date_fin: { [Op.lt]: aujourdhui },
        statut_paiement: 'impaye',
      },
    }
  );
  return count;
};

/**
 * Crée un abonnement mensuel pour une agence (unicité mois/année).
 * Une agence est d'office 'actif' dès création d'un abonnement.
 */
const creerAbonnement = async (data) => {
  const { agence_id, mois, annee } = data;
  const existant = await Abonnement.findOne({ where: { agence_id, mois, annee } });
  if (existant) throw new ApiError(409, 'Un abonnement existe déjà pour ce mois et cette année.');

  const abonnement = await Abonnement.create(data);
  await Agence.update({ statut_abonnement: 'actif' }, { where: { id: agence_id } });
  return abonnement;
};

/**
 * Revenus d'abonnement par compagnie (Super Admin / BI).
 * Équivalent de la vue `vue_revenu_par_compagnie` du MCD.
 */
const revenusParCompagnie = async () => {
  const lignes = await PaiementAbonnement.findAll({
    include: [{ model: Compagnie, as: 'compagnie' }],
    attributes: [
      'compagnie_id',
      [col('compagnie.nom'), 'compagnie_nom'],
      [fn('SUM', col('PaiementAbonnement.montant')), 'revenu_total'],
      [fn('COUNT', col('PaiementAbonnement.id')), 'nb_paiements'],
    ],
    group: ['compagnie_id'],
  });

  return lignes.map((l) => ({
    compagnie_id: l.compagnie_id,
    compagnie_nom: l.getDataValue('compagnie_nom') || 'Inconnue',
    revenu_total: Number(l.getDataValue('revenu_total')) || 0,
    nb_paiements: Number(l.getDataValue('nb_paiements')) || 0,
  }));
};

module.exports = { suspendreAbonnementsExpires, marquerEnRetard, creerAbonnement, revenusParCompagnie };
