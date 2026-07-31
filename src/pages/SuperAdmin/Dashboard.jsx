import { Suspense } from 'react';
import {
  AdminWelcome, AdminStats, AdminCharts, AdminActivityTimeline,
  AdminAlerts, AdminQuickActions, AdminTopCompanies, AdminTransactions,
  AdminSubscriptionRevenue, AdminSkeleton,
} from '@components/admin/';

const AdminDashboardContent = () => (
  <>
    <AdminWelcome />
    <AdminQuickActions />
    <AdminStats />
    <AdminCharts />
    <div className="adm-bottom-grid">
      <AdminActivityTimeline />
      <AdminAlerts />
    </div>
    <AdminSubscriptionRevenue />
    <AdminTopCompanies />
    <AdminTransactions />
  </>
);

const SuperAdminDashboard = () => (
  <Suspense fallback={<AdminSkeleton />}>
    <AdminDashboardContent />
  </Suspense>
);

export default SuperAdminDashboard;
