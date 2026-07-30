# BUS TIX CONNECT — Frontend

Plateforme de réservation de billets de bus multi-rôles avec Super Admin, Company Admin, Counter Agent et Client.

## Stack Technique

| Technologie | Version | Usage |
|---|---|---|
| **React** | 19.2.7 | UI |
| **Vite** | 8.1.1 | Build tool |
| **React Router** | 7.18.1 | Routing + Guards |
| **Zustand** | 5.0.14 | State management (persist) |
| **Axios** | 1.18.1 | HTTP client (Express.js ready) |
| **React Query** | 5.101.2 | Server state + caching |
| **React Hook Form** | 7.82.0 | Formulaires |
| **Zod** | 4.4.3 | Validation |
| **Bootstrap 5** | 5.3.8 | CSS framework |
| **Bootstrap Icons** | 1.13.1 | Icônes |
| **Recharts** | 3.10.1 | Graphiques |

## Architecture

```
src/
├── assets/styles/     # 65 fichiers CSS (design system unifié)
├── components/        # 280+ composants React
│   ├── admin/         # 154 composants Super Admin
│   ├── agency/        # Composants Company (Agency)
│   ├── auth/          # Composants authentification
│   ├── booking/       # Composants réservation
│   ├── client/        # 11 composants Client
│   └── counter/       # 115 composants Counter Agent
├── config/            # app.js, axios.js, env.js
├── contexts/          # 7 contextes React
├── data/              # 53 fichiers de données mockées
├── hooks/             # 11 hooks personnalisés
├── layouts/           # 7 layouts par rôle
├── pages/             # 89 pages
│   ├── SuperAdmin/    # 16 pages (15 modules + Health Report)
│   ├── Agency/        # 22 pages
│   ├── Client/        # 8 pages
│   ├── Counter/       # 10 pages
│   ├── Auth/          # 14 pages multi-rôle
│   ├── Booking/       # 5 pages flow réservation
│   └── Errors/        # 3 pages d'erreur
├── routes/            # 19 fichiers (guards, permissions, constants)
├── services/          # Service layer (Express.js ready)
├── store/             # 3 stores Zustand
└── utils/             # 9 utilitaires
```

## Modules Super Admin (15)

### Gestion
| Module | Route | Composants | Data |
|---|---|---|---|
| Dashboard | `/super-admin/dashboard` | 10 | adminData.js |
| Companies | `/super-admin/companies` | 10 | adminCompanyData.js |
| Users | `/super-admin/users` | 10 | adminUserData.js |
| Roles | `/super-admin/roles` | 10 | adminRoleData.js |
| Approval | `/super-admin/approval` | 10 | adminApprovalData.js |
| Subscriptions | `/super-admin/subscriptions` | 10 | adminSubscriptionData.js |
| Commissions | `/super-admin/commissions` | 10 | adminCommissionData.js |

### Analytics
| Module | Route | Composants | Data |
|---|---|---|---|
| BI Reports | `/super-admin/reports` | 12 | adminReportData.js |
| Audit | `/super-admin/audit` | 10 | adminAuditData.js |

### Communications
| Module | Route | Composants | Data |
|---|---|---|---|
| Notifications | `/super-admin/notifications` | 10 | adminNotificationData.js |
| Support | `/super-admin/support` | 10 | adminSupportData.js |
| Integrations | `/super-admin/integrations` | 10 | adminIntegrationData.js |
| AI & Automation | `/super-admin/ai` | 10 | adminAIData.js |

### System
| Module | Route | Composants | Data |
|---|---|---|---|
| Backup | `/super-admin/backup` | 10 | adminBackupData.js |
| Settings | `/super-admin/settings` | 8 | adminSettingsData.js |
| Health Report | `/super-admin/health` | — | — |

## Routing & Guards

Multi-role routing with lazy loading and permission guards:

```
Guest     → GuestLayout     → Landing, Booking flow
Auth      → AuthLayout      → Login/Register per role
Client    → RoleGuard + ClientLayout    → 7 routes
Company   → RoleGuard + CompanyLayout   → 22 routes
Counter   → RoleGuard + CounterLayout   → 10 routes
SuperAdmin → RoleGuard + SuperAdminLayout → 16 routes
```

- `RoleGuard` — checks allowed roles
- `PermissionGuard` — checks specific permissions
- `PublicRoute` — redirects authenticated users
- `RouteLoader` — skeleton loading fallback

## Auth & State

**Zustand** with `persist` middleware (key: `btc-auth`):
- Token, refresh token, session expiry
- Full RBAC: roles, permissions, `hasRole()`, `hasPermission()`, `canAccess()`
- Super Admin bypass

## Express.js Integration

The frontend is ready for Express.js backend:

1. **`src/config/axios.js`** — `axios.create()` with baseURL from `.env`, request interceptor (Bearer token), response interceptor (401 → session-expired, 403 → 403 page)
2. **`src/config/app.js`** — `import.meta.env.VITE_API_*` variables
3. **`src/services/auth.service.js`** — mock service; swap imports to use real Express endpoints
4. **`src/hooks/useAxios.js`** — hooks-based axios instance with auth state

### Endpoints (planned Express.js)
```
POST   /api/auth/:role/login
POST   /api/auth/:role/register
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/profile
PUT    /api/profile
PUT    /api/profile/password
```

## Design System

- **Primary**: `#1E1B4B` (deep indigo)
- **Accent**: `#8B5CF6` (purple)
- **Font**: Inter (body) + Poppins (headings)
- **CSS Prefixes**: `adm-`, `admc-`, `admu-`, `admr-`, `adma-`, `adms-`, `adcm-`, `adbi-`, `ada-`, `adst-`, `adn-`, `ads-`, `adi-`, `adb-`, `adai-`

## Scripts

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Environnement

`.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=15000
VITE_APP_NAME=Bus Tix Connect
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```
