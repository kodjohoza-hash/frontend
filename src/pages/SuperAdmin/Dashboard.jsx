import { Suspense } from 'react';
import {
  AdminWelcome, AdminStats, AdminCharts, AdminActivityTimeline,
  AdminAlerts, AdminQuickActions, AdminTopCompanies, AdminTransactions,
  AdminSkeleton,
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
