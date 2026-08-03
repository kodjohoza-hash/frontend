const ApiError = require('../../../utils/ApiError');
const logger = require('../../../utils/logger');
const { planRepository } = require('../repositories');

const listPlans = async () => planRepository.findAll();

const getPlan = async (id) => {
  const plan = await planRepository.findById(id);
  if (!plan) throw new ApiError(404, 'Plan introuvable.');
  return plan;
};

const createPlan = async (data) => {
  const existant = await planRepository.findByCode(data.code);
  if (existant) throw new ApiError(409, `Un plan avec le code "${data.code}" existe déjà.`);
  const plan = await planRepository.create(data);
  logger.info(`Plan créé : ${plan.nom} (${plan.code})`);
  return plan;
};

const updatePlan = async (id, data) => {
  const plan = await getPlan(id);
  if (data.code && data.code !== plan.code) {
    const existant = await planRepository.findByCode(data.code);
    if (existant) throw new ApiError(409, `Un plan avec le code "${data.code}" existe déjà.`);
  }
  await planRepository.update(plan, data);
  logger.info(`Plan mis à jour : ${plan.nom}`);
  return plan;
};

const removePlan = async (id) => {
  const plan = await getPlan(id);
  await planRepository.remove(plan);
  logger.info(`Plan supprimé : ${plan.code}`);
  return plan;
};

module.exports = { listPlans, getPlan, createPlan, updatePlan, removePlan };
