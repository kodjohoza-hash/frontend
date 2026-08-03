const { sequelize, Compagnie } = require('../../../models');
const { paymentRepository, subscriptionRepository } = require('../repositories');
const { daysRemaining } = require('../../../utils/generators');

const START_OF_DAY = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const START_OF_WEEK = () => {
  const d = START_OF_DAY();
  d.setDate(d.getDate() - d.getDay());
  return d;
};
const START_OF_MONTH = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const START_OF_YEAR = () => new Date(new Date().getFullYear(), 0, 1);

const sumPaidSince = async (from) => {
  const [row] = await sequelize.query(
    `SELECT COALESCE(SUM(montant),0) AS total FROM paiement_abonnement_compagnie WHERE statut = 'paye' AND date >= :from`,
    { replacements: { from }, type: sequelize.QueryTypes.SELECT }
  );
  return Number(row?.total) || 0;
};

const monthlyGraph = async (months = 12) => {
  const [rows] = await sequelize.query(
    `SELECT DATE_FORMAT(date, '%Y-%m') AS mois, COALESCE(SUM(montant),0) AS total
     FROM paiement_abonnement_compagnie
     WHERE statut = 'paye' AND date >= DATE_SUB(CURDATE(), INTERVAL :months MONTH)
     GROUP BY DATE_FORMAT(date, '%Y-%m') ORDER BY mois ASC`,
    { replacements: { months } }
  );
  return rows.map((r) => ({ mois: r.mois, total: Number(r.total) }));
};

const topCompanies = async (limit = 5) => {
  const [rows] = await sequelize.query(
    `SELECT p.compagnie_id, c.nom AS compagnie_nom, COALESCE(SUM(p.montant),0) AS total, COUNT(*) AS nb_paiements
     FROM paiement_abonnement_compagnie p
     JOIN compagnie c ON c.id = p.compagnie_id
     WHERE p.statut = 'paye'
     GROUP BY p.compagnie_id, c.nom
     ORDER BY total DESC
     LIMIT :limit`,
    { replacements: { limit } }
  );
  return rows;
};

/**
 * Dashboard financier Super Admin.
 */
const getDashboard = async () => {
  const [revenuAujourdhui, revenuSemaine, revenuMois, revenuAnnee, revenuTotal] = await Promise.all([
    sumPaidSince(START_OF_DAY()),
    sumPaidSince(START_OF_WEEK()),
    sumPaidSince(START_OF_MONTH()),
    sumPaidSince(START_OF_YEAR()),
    sumPaidSince(new Date(0)),
  ]);

  const [compagniesActives, compagniesExpirees, compagniesSuspendues, compagniesTotales] = await Promise.all([
    Compagnie.count({ where: { statut_abonnement: 'actif' } }),
    Compagnie.count({ where: { statut_abonnement: 'expire' } }),
    Compagnie.count({ where: { statut_abonnement: 'suspendu' } }),
    Compagnie.count(),
  ]);

  // MRR = revenus du mois courant (paiements payés). ARR = MRR * 12.
  const mrr = revenuMois;
  const arr = mrr * 12;

  const [graph, top] = await Promise.all([monthlyGraph(), topCompanies(5)]);

  // Abonnements actifs + expirant bientôt
  const subs = await subscriptionRepository.findAll({ statut: 'actif' });
  const expirantBientot = subs.filter((s) => daysRemaining(s.date_fin) <= 7).length;

  return {
    revenuAujourdhui,
    revenuSemaine,
    revenuMois,
    revenuAnnee,
    revenuTotal,
    mrr,
    arr,
    compagniesActives,
    compagniesExpirees,
    compagniesSuspendues,
    compagniesTotales,
    abonnementsExpirantBientot: expirantBientot,
    graph,
    topCompagnies: top,
  };
};

module.exports = { getDashboard };
