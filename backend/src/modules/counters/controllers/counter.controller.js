const asyncHandler = require('../../../utils/asyncHandler');
const { counterService } = require('../services');

/** GET /guichets — liste paginée, filtrable, triée (scope par rôle). */
const list = asyncHandler(async (req, res) => {
  const result = await counterService.list({ query: req.query, actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /guichets/mine — guichet courant de l'agent de guichet. */
const getMine = asyncHandler(async (req, res) => {
  const result = await counterService.getMine({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /guichets/stats — KPIs (super admin & company admin). */
const stats = asyncHandler(async (req, res) => {
  const result = await counterService.stats({ actor: req.user });
  res.json({ success: true, data: result });
});

/** GET /guichets/:id — détail d'un guichet. */
const getById = asyncHandler(async (req, res) => {
  const counter = await counterService.getById({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: counter });
});

/** POST /guichets — création. */
const create = asyncHandler(async (req, res) => {
  const counter = await counterService.create({ data: req.body, actor: req.user });
  res.status(201).json({ success: true, data: counter, message: 'Guichet créé.' });
});

/** PATCH /guichets/:id — mise à jour. */
const update = asyncHandler(async (req, res) => {
  const counter = await counterService.update({ id: req.params.id, data: req.body, actor: req.user });
  res.json({ success: true, data: counter, message: 'Guichet mis à jour.' });
});

/** PATCH /guichets/:id/status — changer le statut opérationnel. */
const updateStatus = asyncHandler(async (req, res) => {
  const result = await counterService.updateStatus({
    id: req.params.id,
    statut: req.body.statut,
    raison: req.body.raison,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** PATCH /guichets/:id/agents — affectation d'agents. */
const assignAgents = asyncHandler(async (req, res) => {
  const result = await counterService.assignAgents({
    id: req.params.id,
    agentIds: req.body.agentIds,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: 'Agents affectés au guichet.' });
});

/** DELETE /guichets/:id/agents — retrait d'agents. */
const removeAgents = asyncHandler(async (req, res) => {
  const result = await counterService.removeAgents({
    id: req.params.id,
    agentIds: req.body.agentIds,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** POST /guichets/:id/agents/transfer — transfert d'agents vers un autre guichet. */
const transferAgents = asyncHandler(async (req, res) => {
  const result = await counterService.transferAgents({
    id: req.params.id,
    agentIds: req.body.agentIds,
    toGuichetId: req.body.toGuichetId,
    actor: req.user,
  });
  res.json({ success: true, data: result, message: result.message });
});

/** DELETE /guichets/:id — suppression (soft delete). */
const remove = asyncHandler(async (req, res) => {
  const result = await counterService.remove({ id: req.params.id, actor: req.user });
  res.json({ success: true, data: result, message: result.message });
});

module.exports = {
  list,
  getMine,
  stats,
  getById,
  create,
  update,
  updateStatus,
  assignAgents,
  removeAgents,
  transferAgents,
  remove,
};
