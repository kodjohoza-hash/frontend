const express = require('express');
const router = express.Router();

const { authenticate, ROLES } = require('../../middlewares/auth');
const { requireRole } = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const rateLimit = require('../../middlewares/rateLimiter');
const { ticketController } = require('./controllers');
const {
  idSchema,
  verifyTokenSchema,
  listQuerySchema,
  statsQuerySchema,
  statusSchema,
  sendEmailSchema,
} = require('./validators');

const writeLimiter = rateLimit(30, 15 * 60 * 1000);
const verifyLimiter = rateLimit(120, 60 * 1000);
const ticketRoles = requireRole(ROLES.CLIENT, ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN);
const staffRoles = requireRole(ROLES.COUNTER_AGENT, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN);
const adminOnly = requireRole(ROLES.SUPER_ADMIN);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Billets électroniques — consultation, statuts, QR codes sécurisés, statistiques
 */

/* ── Toutes les routes exigent une session authentifiée ───────── */
router.use(authenticate);

/* ── Liste + statistiques + vérification (DOIT être avant /tickets/:id) ── */
router.get('/tickets', ticketRoles, validate(listQuerySchema, 'query'), ticketController.list);
router.get('/tickets/stats', ticketRoles, validate(statsQuerySchema, 'query'), ticketController.stats);
router.get('/tickets/verify/:token', staffRoles, verifyLimiter, validate(verifyTokenSchema, 'params'), ticketController.verify);

/* ── Détail, QR code, PDF, transitions de statut, régénération ── */
router.get('/tickets/:id', ticketRoles, validate(idSchema, 'params'), ticketController.getById);
router.get('/tickets/:id/qrcode', ticketRoles, validate(idSchema, 'params'), ticketController.getQrCode);
router.get('/tickets/:id/pdf', ticketRoles, validate(idSchema, 'params'), ticketController.getPdf);
router.post('/tickets/:id/send-email', ticketRoles, writeLimiter, validate(idSchema, 'params'), validate(sendEmailSchema), ticketController.sendEmail);
router.patch('/tickets/:id/status', ticketRoles, writeLimiter, validate(idSchema, 'params'), validate(statusSchema), ticketController.updateStatus);
router.post('/tickets/:id/regenerate-qrcode', adminOnly, writeLimiter, validate(idSchema, 'params'), ticketController.regenerateQrCode);

module.exports = router;
