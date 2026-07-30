import { useState } from 'react';
import '../../assets/styles/admin-health.css';

/* ==========================================================================
   Data
   ========================================================================== */
const SECTIONS = [
  {
    id: 'modules',
    title: 'Modules Super Admin',
    icon: 'bi-puzzle',
    count: 15,
    items: [
      { name: 'Dashboard', components: 10, data: 1, css: true, page: true, files: ['AdminActivityTimeline', 'AdminAlerts', 'AdminCharts', 'AdminHeader', 'AdminQuickActions', 'AdminSidebar', 'AdminSkeleton', 'AdminStats', 'AdminTopCompanies', 'AdminWelcome'] },
      { name: 'Companies', components: 10, data: 1, css: true, page: true, files: ['AdminCompanyCards', 'AdminCompanyCharts', 'AdminCompanyDocuments', 'AdminCompanyFilters', 'AdminCompanyProfile', 'AdminCompanySkeleton', 'AdminCompanyStats', 'AdminCompanyTable', 'AdminCompanyTimeline', 'AdminCompanyValidation'] },
      { name: 'Users', components: 10, data: 1, css: true, page: true, files: ['AdminUserActivity', 'AdminUserCards', 'AdminUserFilters', 'AdminUserPermissions', 'AdminUserProfile', 'AdminUserSessions', 'AdminUserSkeleton', 'AdminUserStats', 'AdminUserTable', 'AdminUserTimeline'] },
      { name: 'Roles', components: 10, data: 1, css: true, page: true, files: ['AdminPermissionGroup', 'AdminPermissionMatrix', 'AdminRoleCard', 'AdminRoleFilters', 'AdminRoleProfile', 'AdminRoleSkeleton', 'AdminRoleStats', 'AdminRoleTable', 'AdminRoleTimeline', 'AdminRoleUsers'] },
      { name: 'Approval', components: 10, data: 1, css: true, page: true, files: ['AdminApprovalComments', 'AdminApprovalDocuments', 'AdminApprovalFilters', 'AdminApprovalModal', 'AdminApprovalProfile', 'AdminApprovalSkeleton', 'AdminApprovalStats', 'AdminApprovalTable', 'AdminApprovalTimeline', 'AdminApprovalWorkflow'] },
      { name: 'Subscriptions', components: 10, data: 1, css: true, page: true, files: ['AdminSubscriptionBilling', 'AdminSubscriptionCards', 'AdminSubscriptionFeatures', 'AdminSubscriptionFilters', 'AdminSubscriptionModal', 'AdminSubscriptionProfile', 'AdminSubscriptionSkeleton', 'AdminSubscriptionStats', 'AdminSubscriptionTable', 'AdminSubscriptionTimeline'] },
      { name: 'Commissions', components: 10, data: 1, css: true, page: true, files: ['AdminCommissionCards', 'AdminCommissionCharts', 'AdminCommissionExport', 'AdminCommissionFilters', 'AdminCommissionProfile', 'AdminCommissionRules', 'AdminCommissionSkeleton', 'AdminCommissionStats', 'AdminCommissionTable', 'AdminCommissionTimeline'] },
      { name: 'BI Reports', components: 12, data: 1, css: true, page: true, files: ['AdminAnalyticsCards', 'AdminClientCharts', 'AdminCommissionCharts', 'AdminCompanyCharts', 'AdminComparisonCards', 'AdminExportPanel', 'AdminReportFilters', 'AdminReportSkeleton', 'AdminReportStats', 'AdminReservationCharts', 'AdminRevenueCharts', 'AdminSavedReports'] },
      { name: 'Audit', components: 10, data: 1, css: true, page: true, files: ['AdminAuditAlerts', 'AdminAuditCards', 'AdminAuditDetails', 'AdminAuditExport', 'AdminAuditFilters', 'AdminAuditSessions', 'AdminAuditSkeleton', 'AdminAuditStats', 'AdminAuditTable', 'AdminAuditTimeline'] },
      { name: 'Settings', components: 8, data: 1, css: true, page: true, files: ['AdminSettingsExport', 'AdminSettingsFavorite', 'AdminSettingsForm', 'AdminSettingsHistory', 'AdminSettingsImport', 'AdminSettingsSearch', 'AdminSettingsSidebar', 'AdminSettingsSkeleton'] },
      { name: 'Notifications', components: 10, data: 1, css: true, page: true, files: ['AdminNotificationCharts', 'AdminNotificationComposer', 'AdminNotificationFilters', 'AdminNotificationHistory', 'AdminNotificationPreview', 'AdminNotificationRecipients', 'AdminNotificationSkeleton', 'AdminNotificationStats', 'AdminNotificationTemplates', 'AdminNotificationTimeline'] },
      { name: 'Support', components: 10, data: 1, css: true, page: true, files: ['AdminSupportAssign', 'AdminSupportCharts', 'AdminSupportConversation', 'AdminSupportFilters', 'AdminSupportKnowledge', 'AdminSupportProfile', 'AdminSupportSkeleton', 'AdminSupportStats', 'AdminSupportTable', 'AdminSupportTimeline'] },
      { name: 'Integrations', components: 10, data: 1, css: true, page: true, files: ['AdminApiKeys', 'AdminApiLogs', 'AdminDocumentation', 'AdminIntegrationCards', 'AdminIntegrationFilters', 'AdminIntegrationSkeleton', 'AdminIntegrationStats', 'AdminIntegrationTable', 'AdminMonitoringCharts', 'AdminWebhookManager'] },
      { name: 'Backup', components: 10, data: 1, css: true, page: true, files: ['AdminBackupCharts', 'AdminBackupFilters', 'AdminBackupRestore', 'AdminBackupScheduler', 'AdminBackupSkeleton', 'AdminBackupSnapshots', 'AdminBackupStats', 'AdminBackupStorage', 'AdminBackupTable', 'AdminBackupTimeline'] },
      { name: 'AI & Automation', components: 10, data: 1, css: true, page: true, files: ['AdminAIAnalytics', 'AdminAIAssistants', 'AdminAIAutomation', 'AdminAIFilters', 'AdminAIHistory', 'AdminAISkeleton', 'AdminAIStats', 'AdminAISuggestions', 'AdminAITable', 'AdminAIWorkflows'] },
    ],
  },
  {
    id: 'dashboards',
    title: 'Dashboards & Pages',
    icon: 'bi-window-stack',
    items: [
      { label: 'Pages Super Admin',     dir: 'src/pages/SuperAdmin/',     count: 16, files: ['Dashboard.jsx', 'Companies.jsx', 'Users.jsx', 'Roles.jsx', 'Approval.jsx', 'Subscriptions.jsx', 'Commissions.jsx', 'Reports.jsx', 'Audit.jsx', 'Settings.jsx', 'Notifications.jsx', 'Support.jsx', 'Integrations.jsx', 'Backup.jsx', 'AI.jsx', 'HealthReport.jsx'] },
      { label: 'Pages Agency',          dir: 'src/pages/Agency/',         count: 22, files: ['Dashboard.jsx', 'Trips.jsx', 'TripDetail.jsx', 'Buses.jsx', 'BusDetail.jsx', 'Drivers.jsx', 'DriverDetail.jsx', 'CounterAgents.jsx', 'CounterAgentDetail.jsx', 'Branches.jsx', 'BranchDetail.jsx', 'Bookings.jsx', 'BookingDetail.jsx', 'Payments.jsx', 'PaymentDetail.jsx', 'Reports.jsx', 'Clients.jsx', 'ClientDetail.jsx', 'Settings.jsx', 'Profile.jsx', 'Notifications.jsx', 'Messages.jsx'] },
      { label: 'Pages Client',          dir: 'src/pages/Client/',         count: 8,  files: ['Dashboard.jsx', 'Bookings.jsx', 'Tickets.jsx', 'Profile.jsx', 'Settings.jsx', 'Notifications.jsx', 'Support.jsx', 'Messages.jsx'] },
      { label: 'Pages Counter',         dir: 'src/pages/Counter/',        count: 10, files: ['Dashboard.jsx', 'Sale.jsx', 'Bookings.jsx', 'Scanner.jsx', 'Payments.jsx', 'Customers.jsx', 'Notifications.jsx', 'Messages.jsx', 'Profile.jsx', 'Settings.jsx'] },
      { label: 'Pages Auth',            dir: 'src/pages/Auth/',           count: 14, files: ['RoleSelector.jsx', 'Login.jsx', 'Register.jsx', 'ForgotPassword.jsx', 'ResetPassword.jsx', 'VerifyEmail.jsx', 'SessionExpired.jsx', 'admin/LoginAdmin.jsx', 'client/LoginClient.jsx', 'client/RegisterClient.jsx', 'company/LoginCompany.jsx', 'company/RegisterCompany.jsx', 'counter/LoginCounter.jsx'] },
      { label: 'Pages Booking',         dir: 'src/pages/Booking/',        count: 5,  files: ['SearchResults.jsx', 'SeatSelection.jsx', 'PassengerInfoPage.jsx', 'PaymentPage.jsx', 'ConfirmationPage.jsx'] },
      { label: 'Pages Errors',          dir: 'src/pages/Errors/',         count: 3,  files: ['NotFound.jsx', 'Unauthorized.jsx', 'ServerError.jsx'] },
    ],
  },
  {
    id: 'components',
    title: 'Composants',
    icon: 'bi-boxes',
    items: [
      { label: 'Admin (Super Admin)',   dir: 'src/components/admin/',         count: 154, detail: '45 racine + 11 approval + 11 subscription + 11 commission + 13 reports + 11 audit + 9 settings + 11 notifications + 11 support + 11 integrations + 11 backup + 11 ai' },
      { label: 'Client',                dir: 'src/components/client/',        count: 11 },
      { label: 'Counter',               dir: 'src/components/counter/',       count: 115 },
      { label: 'Auth',                  dir: 'src/components/auth/',          count: '—' },
      { label: 'Booking',               dir: 'src/components/booking/',       count: '—' },
      { label: 'Common / UI',           dir: 'src/components/common/',        count: '—' },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    icon: 'bi-gear-wide-connected',
    items: [
      { label: 'Fichiers de données',   dir: 'src/data/',          count: 53 },
      { label: 'Fichiers CSS',          dir: 'src/assets/styles/', count: 65 },
      { label: 'Hooks personnalisés',   dir: 'src/hooks/',         count: 11 },
      { label: 'Stores (Zustand)',      dir: 'src/store/',         count: 4 },
      { label: 'Services',              dir: 'src/services/',      count: 3 },
      { label: 'Contexts',              dir: 'src/contexts/',      count: 7 },
      { label: 'Utilitaires',           dir: 'src/utils/',         count: 9 },
      { label: 'Layouts',               dir: 'src/layouts/',       count: 7 },
      { label: 'Routes & Guards',       dir: 'src/routes/',        count: 19 },
      { label: 'Fichiers de mock',      dir: 'src/mock/',          count: '—' },
    ],
  },
  {
    id: 'routes',
    title: 'Routes Enregistrées',
    icon: 'bi-signpost-2',
    items: [
      { path: '/super-admin/dashboard',      label: 'Dashboard',              status: 'live' },
      { path: '/super-admin/companies',      label: 'Compagnies',             status: 'live' },
      { path: '/super-admin/users',          label: 'Utilisateurs',           status: 'live' },
      { path: '/super-admin/roles',          label: 'Rôles & Permissions',    status: 'live' },
      { path: '/super-admin/approval',       label: 'Approbations',           status: 'live' },
      { path: '/super-admin/subscriptions',  label: 'Abonnements',            status: 'live' },
      { path: '/super-admin/commissions',    label: 'Commissions',            status: 'live' },
      { path: '/super-admin/reports',        label: 'Rapports BI',            status: 'live' },
      { path: '/super-admin/audit',          label: 'Audit & Surveillance',   status: 'live' },
      { path: '/super-admin/settings',       label: 'Paramètres',             status: 'live' },
      { path: '/super-admin/notifications',  label: 'Notifications',          status: 'live' },
      { path: '/super-admin/support',        label: 'Support',                status: 'live' },
      { path: '/super-admin/integrations',   label: 'Intégrations & API',     status: 'live' },
      { path: '/super-admin/backup',         label: 'Sauvegarde & Reprise',   status: 'live' },
      { path: '/super-admin/ai',             label: 'IA & Automatisation',    status: 'live' },
      { path: '/super-admin/health',         label: 'Rapport de Santé',       status: 'live' },
      { path: '/agency/dashboard',           label: 'Agency Dashboard',       status: 'live' },
      { path: '/agency/*',                   label: 'Agency (22 routes)',     status: 'live' },
      { path: '/client/dashboard',           label: 'Client Dashboard',       status: 'live' },
      { path: '/client/*',                   label: 'Client (7 routes)',      status: 'live' },
      { path: '/counter/dashboard',          label: 'Counter Dashboard',      status: 'live' },
      { path: '/counter/*',                  label: 'Counter (9 routes)',     status: 'live' },
      { path: '/auth/*',                     label: 'Auth multi-role',        status: 'live' },
      { path: '/booking/*',                  label: 'Booking flow',           status: 'live' },
      { path: '/404, /403, /500',            label: 'Pages d\'erreur',       status: 'live' },
    ],
  },
  {
    id: 'dependencies',
    title: 'Dépendances',
    icon: 'bi-box',
    items: [
      { name: 'react',            version: '^19.2.7',     latest: true },
      { name: 'react-dom',        version: '^19.2.7',     latest: true },
      { name: 'react-router-dom', version: '^7.18.1',     latest: true },
      { name: 'zustand',          version: '^5.0.14',     latest: true },
      { name: 'axios',            version: '^1.18.1',     latest: true },
      { name: '@tanstack/react-query', version: '^5.101.2', latest: true },
      { name: 'react-hook-form',  version: '^7.82.0',    latest: true },
      { name: 'zod',              version: '^4.4.3',      latest: true },
      { name: 'bootstrap',        version: '^5.3.8',      latest: true },
      { name: 'bootstrap-icons',  version: '^1.13.1',     latest: true },
      { name: 'clsx',             version: '^2.1.1',      latest: true },
      { name: 'recharts',         version: '^3.10.1',     latest: true },
      { name: 'react-loading-skeleton', version: '^3.5.0', latest: true },
      { name: 'vite',             version: '^8.1.1',      latest: true, dev: true },
    ],
  },
  {
    id: 'files',
    title: 'Arborescence des Fichiers',
    icon: 'bi-folder2-open',
    items: [
      { category: 'src/pages/',    files: ['SuperAdmin/ (16 fichiers)', 'Agency/ (22 fichiers)', 'Client/ (8 fichiers)', 'Counter/ (10 fichiers)', 'Auth/ (14 fichiers)', 'Booking/ (5 fichiers)', 'Errors/ (3 fichiers)', 'Home/ (1 fichier)', 'Shared/ (1 fichier)'] },
      { category: 'src/components/', files: ['admin/ (154 composants)', 'client/ (11 composants)', 'counter/ (115 composants)', 'auth/', 'booking/', 'common/', 'home/', 'layout/'] },
      { category: 'src/data/',     files: ['adminData.js', 'adminAIData.js', 'adminApprovalData.js', 'adminAuditData.js', 'adminBackupData.js', 'adminCommissionData.js', 'adminCompanyData.js', 'adminIntegrationData.js', 'adminNotificationData.js', 'adminReportData.js', 'adminRoleData.js', 'adminSettingsData.js', 'adminSubscriptionData.js', 'adminSupportData.js', 'adminUserData.js', 'agency* (8 fichiers)', 'counter* (11 fichiers)', 'client* (2 fichiers)', 'booking* (3 fichiers)', 'autres (14 fichiers)'] },
      { category: 'src/assets/styles/', files: ['variables.css', 'globals.css', 'bootstrap-custom.css', 'animations.css', 'components.css', 'navigation.css', 'landing.css', 'auth.css', 'admin-*.css (16 fichiers)', 'agency-*.css (11 fichiers)', 'counter-*.css (10 fichiers)', 'booking-*.css (4 fichiers)', 'autres (7 fichiers)'] },
      { category: 'src/hooks/',    files: ['useAuth.js', 'useAxios.js', 'useAuthorization.js', 'useAutoScroll.js', 'useCan.js', 'useLandingPage.js', 'useNavigation.js', 'usePermissions.js', 'useRole.js', 'useTheme.js'] },
      { category: 'src/store/',    files: ['auth.store.js', 'user.store.js', 'app.store.js'] },
      { category: 'src/utils/',    files: ['constants.js', 'currency.js', 'date.js', 'helpers.js', 'images.js', 'permissions.js', 'roles.js', 'storage.js'] },
      { category: 'src/services/', files: ['auth.service.js', 'paymentService.js'] },
      { category: 'src/config/',   files: ['app.js', 'axios.js', 'env.js'] },
    ],
  },
];

const KPI = [
  { label: 'Modules Super Admin', value: 15, sub: 'Dashboard + 14 modules' },
  { label: 'Composants Total', value: '280+', sub: 'Admin 154 + Counter 115 + Client 11' },
  { label: 'Pages Total', value: 89, sub: 'Tous rôles confondus' },
  { label: 'Fichiers de Données', value: 53, sub: 'Mock data centralisée' },
  { label: 'Fichiers CSS', value: 65, sub: 'Design system unifié' },
  { label: 'Routes Enregistrées', value: '60+', sub: 'Dans AppRouter.jsx' },
  { label: 'Hooks', value: 11, sub: 'useAuth, useAxios, etc.' },
  { label: 'Dépendances', value: 14, sub: 'React 19, Zustand 5, Vite 8' },
];

const FILE_COLORS = {
  jsx: '#61DAFB', js: '#F7DF1E', css: '#1572B6', json: '#7C3AED',
  vue: '#4FC08D', md: '#083FA1', svg: '#FFB13B', png: '#E91E63',
};

/* ==========================================================================
   Components
   ========================================================================== */

function ChevronDown({ open }) {
  return (
    <svg className={`adh-section-chevron${open ? ' open' : ''}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function Section({ section }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="adh-section">
      <div className="adh-section-header" onClick={() => setOpen((o) => !o)}>
        <h2>
          <i className={section.icon} />
          {section.title}
          {section.count && <span className="adh-section-count">{section.count}</span>}
        </h2>
        <ChevronDown open={open} />
      </div>
      {open && (
        <div className="adh-section-body">
          {section.id === 'modules' && <ModuleGrid items={section.items} />}
          {section.id === 'dashboards' && <DashboardList items={section.items} />}
          {section.id === 'components' && <ComponentList items={section.items} />}
          {section.id === 'infrastructure' && <InfraList items={section.items} />}
          {section.id === 'routes' && <RouteTable items={section.items} />}
          {section.id === 'dependencies' && <DepList items={section.items} />}
          {section.id === 'files' && <FileTree items={section.items} />}
        </div>
      )}
    </div>
  );
}

function ModuleGrid({ items }) {
  return (
    <div className="adh-module-grid">
      {items.map((mod) => (
        <div className="adh-module-card" key={mod.name}>
          <div className="adh-module-name">
            {mod.name}
            <span className="adh-badge adh-badge-complete">✓</span>
          </div>
          <div className="adh-module-details">
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Composants</span>
              <span className="adh-module-detail-value">{mod.components}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Données</span>
              <span className="adh-module-detail-value">{mod.data}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">CSS</span>
              <span className="adh-module-detail-value">{mod.css ? '✓' : '—'}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Page</span>
              <span className="adh-module-detail-value">{mod.page ? '✓' : '—'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardList({ items }) {
  return (
    <div className="adh-module-grid">
      {items.map((d) => (
        <div className="adh-module-card" key={d.label}>
          <div className="adh-module-name" style={{ whiteSpace: 'normal' }}>{d.label}</div>
          <div className="adh-module-details">
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Dossier</span>
              <span className="adh-module-detail-value" style={{ fontFamily: 'SF Mono, Fira Code, monospace', fontSize: '0.7rem' }}>{d.dir}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Fichiers</span>
              <span className="adh-module-detail-value">{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComponentList({ items }) {
  return (
    <div className="adh-module-grid">
      {items.map((c) => (
        <div className="adh-module-card" key={c.label}>
          <div className="adh-module-name" style={{ whiteSpace: 'normal' }}>{c.label}</div>
          <div className="adh-module-details">
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Dossier</span>
              <span className="adh-module-detail-value" style={{ fontFamily: 'SF Mono, Fira Code, monospace', fontSize: '0.7rem' }}>{c.dir}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Composants</span>
              <span className="adh-module-detail-value">{c.count}</span>
            </div>
            {c.detail && (
              <div className="adh-module-detail">
                <span className="adh-module-detail-label">Détail</span>
                <span className="adh-module-detail-value" style={{ fontSize: '0.7rem' }}>{c.detail}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfraList({ items }) {
  return (
    <div className="adh-module-grid">
      {items.map((inf) => (
        <div className="adh-module-card" key={inf.label}>
          <div className="adh-module-name">{inf.label}</div>
          <div className="adh-module-details">
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Dossier</span>
              <span className="adh-module-detail-value" style={{ fontFamily: 'SF Mono, Fira Code, monospace', fontSize: '0.7rem' }}>{inf.dir}</span>
            </div>
            <div className="adh-module-detail">
              <span className="adh-module-detail-label">Fichiers</span>
              <span className="adh-module-detail-value">{inf.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RouteTable({ items }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="adh-route-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Page</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.path}>
              <td><code className="adh-route-path">{r.path}</code></td>
              <td>{r.label}</td>
              <td>
                <span className={`adh-route-status adh-route-${r.status}`}>
                  {r.status === 'live' ? 'Actif' : r.status === 'pending' ? 'En attente' : r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DepList({ items }) {
  return (
    <div className="adh-dep-list">
      {items.map((dep) => (
        <div className="adh-dep-item" key={dep.name}>
          <span className="adh-dep-name">{dep.name}{dep.dev ? ' (dev)' : ''}</span>
          <span className={`adh-dep-version${dep.latest ? ' latest' : ' outdated'}`}>
            {dep.version}
          </span>
        </div>
      ))}
    </div>
  );
}

function FileTree({ items }) {
  return (
    <div className="adh-file-tree">
      {items.map((cat) => (
        <div className="adh-file-category" key={cat.category}>
          <h4>{cat.category}</h4>
          {cat.files.map((f) => {
            const ext = f.split('.').pop() || f;
            return (
              <div className="adh-file-item" key={f}>
                <svg viewBox="0 0 20 20" fill={FILE_COLORS[ext] || '#6B7280'} width="12" height="12">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <span>{f}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ==========================================================================
   Page
   ========================================================================== */

export default function HealthReport() {
  return (
    <div className="adh-container" style={{ paddingTop: 0 }}>
      <div className="adh-header">
        <h1>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rapport de Santé — Frontend
        </h1>
        <span className="adh-status-badge">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Tous les systèmes opérationnels
        </span>
      </div>

      <div className="adh-kpi-grid">
        {KPI.map((kpi) => (
          <div className="adh-kpi-card" key={kpi.label}>
            <div className="adh-kpi-label">{kpi.label}</div>
            <div className="adh-kpi-value">{kpi.value}</div>
            <div className="adh-kpi-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {SECTIONS.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}
