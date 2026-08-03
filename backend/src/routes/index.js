const express = require('express');
const router = express.Router();

/**
 * Routes API v1 — montées sous /api/v1 dans app.js.
 * Chaque module est monté sur son préfixe.
 */
router.use('/auth', require('./auth.routes'));
router.use('/compagnies', require('./compagnie.routes'));
router.use('/agences', require('./agence.routes'));
router.use('/agents', require('./agent.routes'));
router.use('/abonnements', require('./abonnement.routes'));
router.use('/paiements', require('./paiement.routes'));
router.use('/stats', require('./stats.routes'));

module.exports = router;
