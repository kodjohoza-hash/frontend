const { authService } = require('../services');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);
  res.json({ success: true, data: result, message: 'Connexion réussie.' });
});

const registerAgent = asyncHandler(async (req, res) => {
  const user = await authService.registerAgent(req.body);
  res.status(201).json({ success: true, data: user, message: 'Agent créé avec succès.' });
});

const registerClient = asyncHandler(async (req, res) => {
  const result = await authService.registerClient(req.body, req);
  res.status(201).json({ success: true, data: result, message: 'Compte client créé avec succès.' });
});

const registerCompany = asyncHandler(async (req, res) => {
  const result = await authService.registerCompany(req.body);
  res.status(201).json({
    success: true,
    data: result,
    message: 'Demande de création de compagnie enregistrée.',
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body, req);
  res.json({ success: true, data: result, message: 'Déconnexion réussie.' });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body, req);
  res.json({ success: true, data: result, message: 'Session rafraîchie.' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  res.json({ success: true, data: result });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  res.json({ success: true, data: result });
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.body, req);
  res.json({ success: true, data: result });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.body, req);
  res.json({ success: true, data: user, message: 'Profil mis à jour.' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  res.json({ success: true, data: result });
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const result = await authService.resendVerificationEmail(req.body);
  res.json({ success: true, data: result });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.user });
});

module.exports = {
  login,
  registerAgent,
  registerClient,
  registerCompany,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  me,
};
