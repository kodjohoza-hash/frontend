const asyncHandler = require('../../../utils/asyncHandler');
const { auditLogService } = require('../services');

/** GET /admin/audit-logs — journal d'audit paginé + filtrable. */
const list = asyncHandler(async (req, res) => {
  const data = await auditLogService.list({ query: req.query });
  res.json({ success: true, data });
});

/** GET /admin/audit-logs/stats — KPIs du journal d'audit. */
const stats = asyncHandler(async (req, res) => {
  const data = await auditLogService.stats({ query: req.query });
  res.json({ success: true, data });
});

/** GET /admin/audit-logs/:id — détail d'une entrée du journal. */
const getById = asyncHandler(async (req, res) => {
  const data = await auditLogService.getById({ id: req.params.id });
  res.json({ success: true, data });
});

module.exports = { list, stats, getById };
