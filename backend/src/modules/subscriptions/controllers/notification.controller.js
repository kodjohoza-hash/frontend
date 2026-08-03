const asyncHandler = require('../../../utils/asyncHandler');
const { notificationService } = require('../services');

const listAll = asyncHandler(async (req, res) => {
  const where = {};
  if (req.query.compagnie_id) where.compagnie_id = req.query.compagnie_id;
  const notifications = await notificationService.listAll(where);
  res.json({ success: true, data: notifications });
});

const mine = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listByCompany(req.user.compagnieId);
  res.json({ success: true, data: notifications });
});

module.exports = { listAll, mine };
