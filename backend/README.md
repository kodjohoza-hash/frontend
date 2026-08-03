# Bus Tix Connect — Backend API

API REST **Express 5 + Sequelize 6 + MySQL**, alignée sur le MCD (`mcd_bus_tix_connect.sql`).

## Structure

```
backend/
├── .env.example          # Variables d'environnement (copier vers .env)
├── src/
│   ├── server.js         # Point d'entrée (démarrage + sync DB optionnelle)
│   ├── app.js            # Configuration Express (CORS, JSON, routes, erreurs)
│   ├── config/
│   │   ├── env.js        # Lecture/validation des variables d'env
│   │   └── database.js   # Instance Sequelize (MySQL)
│   ├── models/           # Modèles Sequelize (auto-chargés via index.js)
│   ├── controllers/      # Handlers HTTP (réponses aux routes)
│   ├── routes/           # Définitions Express Router (montées sous /api/v1)
│   ├── services/         # Logique métier (séparée des controllers)
│   ├── middlewares/      # auth (JWT), rbac, validate (Joi), erreurs, rate limit
│   ├── validations/      # Schémas Joi
│   ├── utils/            # ApiError, asyncHandler, jwt, password
│   ├── modules/          # Sous-systèmes métier autonomes (SaaS subscriptions)
│   └── seeders/          # Données initiales (super admin, paramètres)
└── package.json
```

## Module SaaS (Abonnements)

Sous-système autonome dans `src/modules/subscriptions/` — plans, abonnements
compagnie, paiements, notifications de renouvellement et blocage en cas
d'impayé. Il **coexiste** avec l'historique « Abonnements mensuels par agence »
du MCD (routes `/abonnements` conservées).

- **Validation** : Zod (`validators/`) via le middleware `validateZod` (Joi conservé pour l'existant).
- **Sécurité** : JWT + RBAC (`company_admin`, `super_admin`, `counter_agent`), endpoint `POST /subscriptions/:id/renew` uniquement pour le `company_admin` titulaire.
- **Cron** (`cron/subscription.cron.js`) : quotidien à 02:00 (Africa/Douala) — expiration, renouvellement automatique, rappels J-15/J-7/J-3/J-1/J0 et retard de paiement.
- **Statut calculé** : `jours_restants` retourné à la lecture, dérivé de `date_fin`.

### Table des routes (préfixe `/api/v1`, module `subscriptions`)

| Méthode | Route | Accès | Description |
| --- | --- | --- | --- |
| GET | `/subscriptions/plans` | public (list), super_admin (CRUD) | Plans SaaS |
| POST/PATCH/DELETE | `/subscriptions/plans` | super_admin | CRUD plans |
| GET | `/subscriptions/mine` | company_admin | Abonnement de ma compagnie |
| GET | `/subscriptions` | super_admin | Tous les abonnements |
| GET | `/subscriptions/companies/:id` | super_admin | Détail compagnie + abonnement |
| POST | `/subscriptions` | super_admin | Souscrire un abonnement |
| POST | `/subscriptions/:id/renew` | company_admin titulaire | Renouveler (+ renouvellement auto) |
| POST | `/subscriptions/:id/suspend` | super_admin | Suspendre (blocage) |
| POST | `/subscriptions/:id/reactivate` | super_admin | Réactiver |
| POST | `/subscriptions/:id/expire` | super_admin | Forcer l'expiration |
| GET/POST | `/subscriptions/payments` | super_admin | Paiements d'abonnement SaaS |
| GET | `/subscriptions/notifications` | super_admin | Notifications SaaS (rappels) |
| GET | `/subscriptions/notifications/mine` | company_admin, counter_agent | Notifications de ma compagnie |
| GET | `/subscriptions/revenue` | super_admin | MRR, ARR, graphe 12 mois |

### Migration

Additive, à appliquer une seule fois (tables `saas_*` + colonnes `compagnie` + 4 plans) :

```bash
mysql -u root -p bus_tix_connect < database/migrations/2026_add_saas_subscriptions.sql
```

## Démarrage

```bash
# 1. Configurer la base de données
cp .env.example .env        # éditer DB_*, JWT_SECRET

# 2. Installer les dépendances (partagées avec node_modules racine)
npm install

# 3. Créer la base (une seule fois)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bus_tix_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Lancer en dev (avec rechargement auto)
npm run dev

# 5. (Optionnel) synchroniser les modèles Sequelize avec la base
npm run db:sync

# 6. Charger les données de démonstration (comptes + abonnement)
npm run seed
```

## Comptes de démonstration

Créés par `npm run seed`, identiques aux mocks du frontend (`frontend/src/mock/users.js`) :

| Espace | Email | Mot de passe | Rôle |
| --- | --- | --- | --- |
| Super Admin | `admin@bustixconnect.com` | `Admin@123` | `super_admin` |
| Compagnie | `company@bustixconnect.com` | `Company@123` | `company_admin` |
| Guichet | `counter@bustixconnect.com` | `Counter@123` | `counter_agent` |

Le seed crée aussi : compagnie `C001` (Bus Tix Connect), agence `AG00000001`,
et un abonnement payé pour le mois courant (50 000 FCFA) avec son paiement.

## Endpoints (préfixe `/api/v1`)

| Méthode | Route | Accès | Description |
| --- | --- | --- | --- |
| POST | `/auth/login` | public | Connexion (email + motDePasse) → `{ token, user }` |
| GET | `/auth/me` | authentifié | Utilisateur courant |
| POST | `/auth/register` | super_admin | Créer un agent + compte |
| GET/POST/PATCH/DELETE | `/compagnies` | super_admin, company_admin | Gestion compagnies |
| GET/POST/PATCH/DELETE | `/agences` | super_admin, company_admin | Gestion agences |
| GET/POST/PATCH/DELETE | `/agents` | super_admin, company_admin | Gestion agents |
| GET/POST/PATCH | `/abonnements` | super_admin, company_admin | Abonnements mensuels |
| POST | `/abonnements/suspend-expires` | super_admin | Suspension automatique des abonnements expirés |
| GET | `/paiements` | super_admin, company_admin | Paiements d'abonnement |
| GET | `/paiements/revenus/compagnies` | super_admin, company_admin | Revenus agrégés par compagnie |
| GET | `/stats/global` | super_admin | Statistiques globales |
| GET | `/stats/db` | authentifié | Vérification connexion DB |
| GET | `/health` | public | Santé du serveur |

## Conventions

- **Routes** : `GET/POST/PUT/DELETE` sous `/api/v1/<ressource>`, versionnée.
- **Auth** : `Authorization: Bearer <token>` — JWT signé par rôle (client, company_admin, counter_agent, super_admin).
- **RBAC** : chaque route protégée déclare `requireRole(...)` / `requirePermission(...)`.
- **Validation** : schémas Joi dans `validations/`, appliqués par le middleware `validate`.
- **Réponses** : JSON uniforme `{ success, data, message }` ; erreurs via `ApiError`.
- **Modèles** : auto-chargés depuis `models/` — toute table du MCD se déclare dans un fichier `<Nom>.js`.
