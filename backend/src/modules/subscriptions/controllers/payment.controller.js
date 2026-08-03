const asyncHandler = require('../../../utils/asyncHandler');
const { paymentService } = require('../services');

const list = asyncHandler(async (req, res) => {
  const paiements = await paymentService.list(req.query);
  res.json({ success: true, data: paiements });
});

const record = asyncHandler(async (req, res) => {
  const paiement = await paymentService.recordPayment(req.body, req.user.role);
  res.status(201).json({ success: true, data: paiement, message: 'Paiement enregistré.' });
});

const byCompany = asyncHandler(async (_req, res) => {
  const revenus = await paymentService.revenueByCompany();
  res.json({ success: true, data: revenus });
});

module.exports = { list, record, byCompany };
