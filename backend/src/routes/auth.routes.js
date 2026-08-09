const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authValidation } = require('../validations');
const validate = require('../middlewares/validate');
const rateLimit = require('../middlewares/rateLimiter');
const { authenticate, ROLES } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/rbac');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des espaces (Super Admin, Compagnie, Guichet)
 */

const loginLimiter = rateLimit(20, 15 * 60 * 1000);
const emailLimiter = rateLimit(5, 15 * 60 * 1000);
const refreshLimiter = rateLimit(120, 15 * 60 * 1000);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion (access token + refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, motDePasse]
 *             properties:
 *               email: { type: string, example: admin@bustixconnect.com }
 *               motDePasse: { type: string, example: Admin@123 }
 *     responses:
 *       200:
 *         description: { user, token, refreshToken, expiresAt }
 *       401: { description: Identifiants invalides }
 *       423: { description: Compte temporairement verrouillé }
 */
router.post('/login', loginLimiter, validate(authValidation.loginSchema), authController.login);

/**
 * @swagger
 * /auth/register-client:
 *   post:
 *     summary: Inscription client (publique)
 *     tags: [Auth]
 */
router.post(
  '/register-client',
  loginLimiter,
  validate(authValidation.registerClientSchema),
  authController.registerClient
);

/**
 * @swagger
 * /auth/register-company:
 *   post:
 *     summary: Inscription compagnie (publique — validation requise)
 *     tags: [Auth]
 */
router.post(
  '/register-company',
  loginLimiter,
  validate(authValidation.registerCompanySchema),
  authController.registerCompany
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un agent + compte (réservé au Super Admin)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 */
router.post(
  '/register',
  authenticate,
  requireRole(ROLES.SUPER_ADMIN),
  validate(authValidation.registerAgentSchema),
  authController.registerAgent
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion sécurisée (révocation du refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 */
router.post('/logout', validate(authValidation.logoutSchema), authController.logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir la session (rotation du refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 */
router.post(
  '/refresh-token',
  refreshLimiter,
  validate(authValidation.refreshTokenSchema),
  authController.refreshToken
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Demander un lien de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 */
router.post(
  '/forgot-password',
  emailLimiter,
  validate(authValidation.forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un jeton
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, motDePasse]
 *             properties:
 *               token: { type: string }
 *               motDePasse: { type: string, example: Nouveau@123 }
 */
router.post(
  '/reset-password',
  emailLimiter,
  validate(authValidation.resetPasswordSchema),
  authController.resetPassword
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Vérifier l'adresse email avec un jeton
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string }
 */
router.post(
  '/verify-email',
  emailLimiter,
  validate(authValidation.verifyEmailSchema),
  authController.verifyEmail
);

/**
 * @swagger
 * /auth/verify-email/resend:
 *   post:
 *     summary: Renvoyer le lien de vérification d'email
 *     tags: [Auth]
 */
router.post(
  '/verify-email/resend',
  emailLimiter,
  validate(authValidation.resendVerificationSchema),
  authController.resendVerificationEmail
);

/* ── Routes authentifiées ─────────────────────────────────────────── */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Utilisateur courant
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/me', authenticate, authController.me);

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Mettre à jour le profil
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 */
router.patch(
  '/profile',
  authenticate,
  validate(authValidation.updateProfileSchema),
  authController.updateProfile
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Changer le mot de passe (révoque les autres sessions)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 */
router.patch(
  '/change-password',
  authenticate,
  validate(authValidation.changePasswordSchema),
  authController.changePassword
);

module.exports = router;
