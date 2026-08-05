const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { notFoundHandler } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

/* Middlewares globaux */
app.use(
  cors({
    origin: env.app.allowedOrigins.length ? env.app.allowedOrigins : env.clientUrl,
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

/* 404 + gestion centralisée des erreurs */
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
