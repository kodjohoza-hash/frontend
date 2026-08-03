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

/* Module SaaS Subscriptions (plans, abonnements compagnie, paiements, notifications, revenus) */
const subscriptionsModule = require('./modules/subscriptions');
app.use('/api/v1', subscriptionsModule.routes);

/* Module Users (gestion des utilisateurs : profil, CRUD, statuts, photo, permissions) */
const usersModule = require('./modules/users');
app.use('/api/v1', usersModule.routes);

/* 404 + gestion centralisée des erreurs */
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
