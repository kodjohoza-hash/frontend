/**
 * subscriptionGuard — bloque les utilisateurs d'une compagnie dont
 * l'abonnement SaaS est expiré/suspendu.
 *
 * Réutilise la logique du module Subscriptions (source unique).
 * - Super Admin et Client : toujours autorisés.
 * - Sans compagnie rattachée : autorisé.
 * - Compagnie bloquée : erreur 403 dédiée (le frontend affiche
 *   « Votre abonnement a expiré »).
 */
module.exports = require('../modules/subscriptions/middlewares/requireActiveSubscription');
