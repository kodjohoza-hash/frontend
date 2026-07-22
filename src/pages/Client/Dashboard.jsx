import { useState, Suspense } from 'react';
import DbSidebar from '@components/client/DbSidebar';
import DbHeader from '@components/client/DbHeader';
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

const ClientDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="db-layout">
      <DbSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      {sidebarOpen && (
        <div className="db-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className={`db-layout__main ${sidebarCollapsed ? 'db-layout__main--collapsed' : ''}`}>
        <DbHeader onToggleSidebar={toggleSidebar} />
        <main className="db-layout__content">
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
        </main>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <Suspense fallback={<DbSkeleton />}>
    <ClientDashboard />
  </Suspense>
);

export default DashboardPage;
