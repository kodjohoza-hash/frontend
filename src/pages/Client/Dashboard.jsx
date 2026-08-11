import { useState, useCallback, useEffect, Suspense } from 'react';
import DbWelcomeCard from '@components/client/DbWelcomeCard';
import DbStatsCard from '@components/client/DbStatsCard';
import DbUpcomingTrips from '@components/client/DbUpcomingTrips';
import DbRecentBookings from '@components/client/DbRecentBookings';
import DbQuickActions from '@components/client/DbQuickActions';
import DbNotifications from '@components/client/DbNotifications';
import DbActivityTimeline from '@components/client/DbActivityTimeline';
import DbSkeleton from '@components/client/DbSkeleton';
import { StatisticsLoading, StatisticsError } from '@components/statistics/StatisticsStates';
import useStatisticsStore from '../../store/statistics.store';

const formatProchain = (prochain) => {
  if (!prochain) return '—';
  const d = new Date(`${prochain}T00:00:00`);
  if (Number.isNaN(d.getTime())) return prochain;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const DashboardPage = () => {
  const [toasts, setToasts] = useState([]);
  const [visible, setVisible] = useState(false);
  const data = useStatisticsStore((s) => s.data);
  const loading = useStatisticsStore((s) => s.loading);
  const error = useStatisticsStore((s) => s.error);
  const fetch = useStatisticsStore((s) => s.fetch);

  const dash = data.dashboard?.data;
  const isLoading = loading.dashboard;

  useEffect(() => {
    fetch('dashboard').catch(() => {});
  }, [fetch]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const stats = dash
    ? [
        {
          id: 'bookings',
          label: 'Réservations',
          value: dash.reservations?.total ?? 0,
          change: `${dash.reservations?.aVenir ?? 0} à venir`,
          trend: 'up',
          icon: 'bi-ticket-perforated',
          color: 'primary',
        },
        {
          id: 'trips',
          label: 'Voyages à venir',
          value: dash.voyages?.aVenir ?? 0,
          change: `${dash.billets?.effectues ?? 0} effectués`,
          trend: 'up',
          icon: 'bi-bus-front-fill',
          color: 'accent',
        },
        {
          id: 'spent',
          label: 'Dépensé',
          value: (dash.depenses ?? 0).toLocaleString('fr-FR'),
          suffix: 'XAF',
          change: 'Montant cumulé',
          trend: 'up',
          icon: 'bi-wallet2',
          color: 'success',
        },
        {
          id: 'next',
          label: 'Prochain voyage',
          value: formatProchain(dash.voyages?.prochain),
          change: dash.voyages?.prochain ? 'Programmé' : '',
          trend: 'up',
          icon: 'bi-calendar2-check',
          color: 'info',
        },
      ]
    : [];

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      <DbWelcomeCard />
      {isLoading && !dash ? <StatisticsLoading label="Chargement de vos statistiques…" /> : null}
      {error && !dash ? <StatisticsError message={error} /> : null}
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
