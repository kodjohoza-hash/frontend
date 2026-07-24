import { Suspense } from 'react';
import DashboardLayout from '@components/client/DashboardLayout';
import DbWelcomeCard from '@components/client/DbWelcomeCard';
import DbStatsCard from '@components/client/DbStatsCard';
import DbUpcomingTrips from '@components/client/DbUpcomingTrips';
import DbRecentBookings from '@components/client/DbRecentBookings';
import DbQuickActions from '@components/client/DbQuickActions';
import DbNotifications from '@components/client/DbNotifications';
import DbActivityTimeline from '@components/client/DbActivityTimeline';
import DbSkeleton from '@components/client/DbSkeleton';
import { stats } from '@data/clientDashboard';
import '@assets/styles/dashboard.css';

const ClientDashboard = () => (
  <DashboardLayout>
    <DbWelcomeCard />

    <div className="db-stats-row">
      {stats.map((s) => (
        <DbStatsCard key={s.id} {...s} />
      ))}
    </div>

    <div className="db-grid">
      <div className="db-grid__left">
        <DbUpcomingTrips />
        <DbRecentBookings />
      </div>
      <div className="db-grid__right">
        <DbQuickActions />
        <DbNotifications />
        <DbActivityTimeline />
      </div>
    </div>
  </DashboardLayout>
);

const DashboardPage = () => (
  <Suspense fallback={<DbSkeleton />}>
    <ClientDashboard />
  </Suspense>
);

export default DashboardPage;
