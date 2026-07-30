import { useState, useCallback, useEffect, Suspense } from 'react';
import DbWelcomeCard from '@components/client/DbWelcomeCard';
import DbStatsCard from '@components/client/DbStatsCard';
import DbUpcomingTrips from '@components/client/DbUpcomingTrips';
import DbRecentBookings from '@components/client/DbRecentBookings';
import DbQuickActions from '@components/client/DbQuickActions';
import DbNotifications from '@components/client/DbNotifications';
import DbActivityTimeline from '@components/client/DbActivityTimeline';
import DbSkeleton from '@components/client/DbSkeleton';
import { stats } from '@data/clientDashboard';

const TOAST_DURATION = 4000;

const DashboardPage = () => {
  const [toasts, setToasts] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      <DbWelcomeCard />
      <div className={`db-stats-row ${visible ? 'db-stats-row--visible' : ''}`}>
        {stats.map((s, i) => (
          <div key={s.id} className="db-stats-anim" style={{ animationDelay: `${i * 0.08}s` }}>
            <DbStatsCard {...s} />
          </div>
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

      {toasts.length > 0 && (
        <div className="db-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`db-toast db-toast--${toast.type}`}>
              <span className="db-toast-icon">
                {toast.type === 'success' && <i className="bi bi-check-circle-fill" />}
                {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill" />}
                {toast.type === 'warning' && <i className="bi bi-exclamation-triangle-fill" />}
                {toast.type === 'info' && <i className="bi bi-info-circle-fill" />}
              </span>
              <span className="db-toast-message">{toast.message}</span>
              <button className="db-toast-close" onClick={() => removeToast(toast.id)}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const ClientDashboard = () => (
  <Suspense fallback={<DbSkeleton />}>
    <DashboardPage />
  </Suspense>
);

export default ClientDashboard;
