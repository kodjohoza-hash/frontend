const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { paymentRepository, historyRepository, subscriptionRepository, planRepository } = require('../repositories');

const list = async (filters = {}) => paymentRepository.findAll(filters);

const recordPayment = async (data, auteur = 'systeme') => {
  const sub = await subscriptionRepository.findById(data.abonnement_compagnie_id);
  if (!sub) throw new ApiError(404, 'Abonnement compagnie introuvable.');

  const paiement = await paymentRepository.create({
    abonnement_compagnie_id: data.abonnement_compagnie_id,
    compagnie_id: sub.compagnie_id,
    plan_id: data.plan_id ?? sub.plan_id,
    montant: data.montant,
    methode: data.methode,
    statut: data.statut ?? 'paye',
    date: data.date ? new Date(data.date) : new Date(),
    reference: data.reference ?? `PAY-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1e3)}`,
    facture_url: data.facture_url ?? null,
  });

  await historyRepository.create({
    compagnie_id: sub.compagnie_id,
    abonnement_compagnie_id: sub.id,
    action: 'paiement',
    plan_id: data.plan_id ?? sub.plan_id,
    detail: `Paiement ${paiement.montant} FCFA (${paiement.methode}) — ${paiement.reference}`,
    auteur,
    date: new Date(),
  });

  logger.info(`Paiement enregistré : ${paiement.reference} (${paiement.montant} FCFA)`);
  return paymentRepository.findById(paiement.id);
};

const revenueByCompany = async () => {
  const rows = await paymentRepository.sumByCompany();
  return rows.map((r) => ({
    compagnie_id: r.compagnie_id,
    compagnie_nom: r.getDataValue('compagnie_nom') || 'Inconnue',
    total: Number(r.getDataValue('total')) || 0,
    nb_paiements: Number(r.getDataValue('nb_paiements')) || 0,
  }));
};

module.exports = { list, recordPayment, revenueByCompany };
