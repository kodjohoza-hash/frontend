const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { notFoundHandler } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

/**
 * Résout dynamiquement si une origine est autorisée (aucune IP en dur) :
 *  - origines sans en-tête Origin (curl, Postman, appels serveur) → autorisées ;
 *  - allowlist CORS_ORIGINS (config) → autorisées ;
 *  - localhost / 127.0.0.1 (tout port) → autorisés (dev local) ;
 *  - adresses IPv4 privées du LAN (10.x, 172.16-31.x, 192.168.x) → autorisées,
 *    pour que le téléphone/tablette atteigne l'app sans reconfigurer à chaque
 *    changement d'IP du PC.
 */
const isPrivateIpv4 = (hostname) => {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  if (parts[0] === 10) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  return false;
};

const isAllowedOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (env.app.allowedOrigins.includes(origin)) return callback(null, true);
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);
  try {
    const hostname = new URL(origin).hostname;
    return callback(null, isPrivateIpv4(hostname));
  } catch {
    return callback(null, false);
  }
};

/* Middlewares globaux */
app.use(
  cors({
    origin: isAllowedOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* Logs simples (dev) */
if (env.nodeEnv === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

/* Fichiers statiques uploadés (logos, documents…) */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* Santé du serveur */
app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
});

/* Routes API */
app.use('/api/v1', routes);

/* Module Trips (voyages : instances d'itinéraire, CRUD, statuts, recherche publique, KPIs).
   Monté AVANT les modules à `router.use(authenticate)` racine (bookings, payments, …) pour que
   les routes publiques GET /trips/available et GET /trips/:id (authOptional) soient atteintes.
   Le router trips est déclaratif (auth inline) : aucune route non-trips n'est interceptée. */
const tripsModule = require('./modules/trips');
app.use('/api/v1', tripsModule.routes);

/* Module Bookings (réservations : CRUD, sièges, paiements, expirations, statistiques)
   Monté en premier : la route publique GET /bookings/availability doit être
   atteinte avant les `router.use(authenticate)` des autres modules. */
const bookingsModule = require('./modules/bookings');
app.use('/api/v1', bookingsModule.routes);

/* Module Payments (gestion des paiements opérationnels : liste, statuts, remboursements, stats).
   Monté avant Subscriptions : GET /payments y est consommé par le super_admin pour les
   paiements d'abonnement (SaaS), les autres rôles obtiennent les paiements de réservations. */
const paymentsModule = require('./modules/payments');
app.use('/api/v1', paymentsModule.routes);

/* Module SaaS Subscriptions (plans, abonnements compagnie, paiements, notifications, revenus) */
const subscriptionsModule = require('./modules/subscriptions');
app.use('/api/v1', subscriptionsModule.routes);

/* Abonnements legacy (MCD) : montés APRÈS Subscriptions pour que
   /abonnements/notifications et /abonnements/notifications/mine soient
   gérés par le module, pas par la route legacy `/:id`. */
app.use('/api/v1/abonnements', require('./routes/abonnement.routes'));

/* Module Users (gestion des utilisateurs : profil, CRUD, statuts, photo, permissions) */
const usersModule = require('./modules/users');
app.use('/api/v1', usersModule.routes);

/* Module Companies (compagnies de transport : CRUD, profil, logo, documents, statuts, KPIs) */
const companiesModule = require('./modules/companies');
app.use('/api/v1', companiesModule.routes);

/* Module Agencies (points de vente : CRUD, statuts, GPS, agences proches, KPIs) */
const agenciesModule = require('./modules/agencies');
app.use('/api/v1', agenciesModule.routes);

/* Module Counters (guichets : CRUD, statuts, affectation d'agents, dashboards) */
const countersModule = require('./modules/counters');
app.use('/api/v1', countersModule.routes);

/* Module Buses (flotte : CRUD, statuts, plan de sièges, maintenances, photos) */
const busesModule = require('./modules/buses');
app.use('/api/v1', busesModule.routes);

/* Module Drivers (chauffeurs : CRUD, statuts, disponibilité, voyages, affectations, incidents, documents, photos) */
const driversModule = require('./modules/drivers');
app.use('/api/v1', driversModule.routes);

/* Module Routes (itinéraires : CRUD, escales, calculs, villes, KPIs) */
const routesModule = require('./modules/routes');
app.use('/api/v1', routesModule.routes);

/* Module Tickets (billets électroniques : consultation, statuts, statistiques).
   Émission automatique branchée sur les modules Bookings & Payments. */
const ticketsModule = require('./modules/tickets');
app.use('/api/v1', ticketsModule.routes);

/* Module Notifications (système centralisé par utilisateur : lecture, compteur
   non lues, marquage lu, tout lire, suppression). Le destinataire est toujours
   déduit de l'utilisateur authentifié — aucun user_id externe n'est accepté. */
const notificationsModule = require('./modules/notifications');
app.use('/api/v1', notificationsModule.routes);

/* Module Messagerie interne (Module 17 : conversations, messages, participants).
   L'accès est strictement contrôlé par la table `conversation_participant` :
   un utilisateur ne peut jamais consulter/écrire dans une conversation dont il
   n'est pas participant, quel que soit l'id transmis. */
const messagesModule = require('./modules/messages');
app.use('/api/v1', messagesModule.routes);

/* Module Statistiques & Rapports (Module 18 : dashboards par rôle, revenus,
   réservations, voyages, billets, abonnements, performances agence/guichet).
   Le périmètre de chaque requête est déduit du token (req.user) ; l'isolation
   est appliquée en SQL, jamais côté frontend. */
const statisticsModule = require('./modules/statistics');
app.use('/api/v1', statisticsModule.routes);

/* Module Admin (Module 19 : journal d'audit + paiements opérationnels globaux).
   Réservé au super admin — le journal ne contient jamais de donnée sensible. */
const adminModule = require('./modules/admin');
app.use('/api/v1', adminModule.routes);

/* 404 + gestion centralisée des erreurs */
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
