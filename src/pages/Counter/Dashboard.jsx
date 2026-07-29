import { Suspense } from 'react';
import CounterWelcome from '@components/counter/CounterWelcome';
import CounterStats from '@components/counter/CounterStats';
import CounterActivityTimeline from '@components/counter/CounterActivityTimeline';
import CounterUpcomingTrips from '@components/counter/CounterUpcomingTrips';
import CounterAlerts from '@components/counter/CounterAlerts';
import CounterQuickActions from '@components/counter/CounterQuickActions';
import CounterNotificationsPreview from '@components/counter/CounterNotificationsPreview';
import CounterMessagesPreview from '@components/counter/CounterMessagesPreview';
import CounterDashboardSkeleton from '@components/counter/CounterDashboardSkeleton';
import {
  dashboardStats,
  activityTimeline,
  upcomingTrips,
  alerts,
  quickActions,
  recentNotifications,
  recentConversations,
} from '@data/counterData';

const CounterDashboard = () => (
  <>
    <CounterWelcome />

    <CounterStats stats={dashboardStats} />

    <div className="act-grid">
      <div className="act-grid__left">
        <CounterActivityTimeline activities={activityTimeline} />
        <CounterUpcomingTrips trips={upcomingTrips} />
        <CounterQuickActions actions={quickActions} />
      </div>

      <div className="act-grid__right">
        <CounterAlerts alerts={alerts} />
        <CounterNotificationsPreview notifications={recentNotifications} />
        <CounterMessagesPreview conversations={recentConversations} />
      </div>
    </div>
  </>
);

const DashboardPage = () => (
  <Suspense fallback={<CounterDashboardSkeleton />}>
    <CounterDashboard />
  </Suspense>
);

export default DashboardPage;
