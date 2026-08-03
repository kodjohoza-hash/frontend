const asyncHandler = require('../../../utils/asyncHandler');
const { revenueService } = require('../services');

const dashboard = asyncHandler(async (_req, res) => {
  const stats = await revenueService.getDashboard();
  res.json({ success: true, data: stats });
});

module.exports = { dashboard };
