const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { userController } = require('./controllers');
const { photoService } = require('./services');
const {
  idSchema,
  listQuerySchema,
  createSchema,
  updateSchema,
  statusSchema,
  passwordSchema,
  profileUpdateSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);

/* Toutes les routes exigent une session authentifiée. */
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (profil, CRUD, statuts, photo, permissions)
 */

/* ── Profil (tous rôles) ─────────────────────────────────────────── */
router.get('/users/profile', userController.getProfile);
router.patch('/users/profile', validate(profileUpdateSchema), userController.updateProfile);
router.patch('/users/profile/photo', photoService.uploadPhoto, userController.updatePhoto);
router.delete('/users/profile/photo', userController.removePhoto);

/* ── Statut + mot de passe ───────────────────────────────────────── */
router.patch('/users/status', writeLimiter, validate(statusSchema), userController.updateStatus);
router.patch('/users/password', writeLimiter, validate(passwordSchema), userController.changePassword);

/* ── KPIs (super admin & company admin) ──────────────────────────── */
router.get('/users/stats', requireRole(ROLES.SUPER_ADMIN, ROLES.COMPANY_ADMIN), userController.stats);

/* ── Liste + création ────────────────────────────────────────────── */
router.get('/users', validate(listQuerySchema, 'query'), userController.list);
router.post('/users', writeLimiter, validate(createSchema), userController.create);

/* ── Détail / édition / suppression (scope par rôle dans le service) ── */
router.get('/users/:id', validate(idSchema, 'params'), userController.getById);
router.patch('/users/:id', validate(idSchema, 'params'), validate(updateSchema), userController.update);
router.delete('/users/:id', validate(idSchema, 'params'), userController.remove);

module.exports = router;
