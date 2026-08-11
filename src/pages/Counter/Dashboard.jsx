import { Suspense, useEffect } from 'react';
import CounterWelcome from '@components/counter/CounterWelcome';
import CounterStats from '@components/counter/CounterStats';
import CounterActivityTimeline from '@components/counter/CounterActivityTimeline';
import CounterUpcomingTrips from '@components/counter/CounterUpcomingTrips';
import CounterAlerts from '@components/counter/CounterAlerts';
import CounterQuickActions from '@components/counter/CounterQuickActions';
import CounterNotificationsPreview from '@components/counter/CounterNotificationsPreview';
import CounterMessagesPreview from '@components/counter/CounterMessagesPreview';
import CounterDashboardSkeleton from '@components/counter/CounterDashboardSkeleton';
import { StatisticsLoading, StatisticsError } from '@components/statistics/StatisticsStates';
import useStatisticsStore from '../../store/statistics.store';
import {
  activityTimeline,
  upcomingTrips,
  alerts,
  quickActions,
  recentNotifications,
  recentConversations,
} from '@data/counterData';

const CounterDashboard = () => {
  const data = useStatisticsStore((s) => s.data);
  const loading = useStatisticsStore((s) => s.loading);
  const error = useStatisticsStore((s) => s.error);
  const fetch = useStatisticsStore((s) => s.fetch);

  const isLoading = loading.dashboard;
  const dash = data.dashboard?.data;

  useEffect(() => {
    fetch('dashboard').catch(() => {});
  }, [fetch]);

  const dashboardStats = dash
    ? [
        {
          id: 'bookings', label: 'Réservations (période)', value: dash.reservations?.total ?? 0,
          icon: 'bi-calendar-check', color: 'primary',
        },
        {
          id: 'today', label: "Réservations aujourd'hui", value: dash.reservations?.aujourdhui ?? 0,
          icon: 'bi-calendar-day', color: 'accent',
        },
        {
          id: 'tickets', label: 'Billets émis', value: dash.billets?.total ?? 0,
          icon: 'bi-ticket-perforated', color: 'info',
        },
        {
          id: 'payments', label: "Encaissé aujourd'hui", value: (dash.paiements?.montantAujourdhui ?? 0).toLocaleString('fr-FR'),
          suffix: ' XAF', icon: 'bi-cash-coin', color: 'success',
        },
        {
          id: 'clients', label: 'Clients servis', value: dash.clientsServis ?? 0,
          icon: 'bi-people', color: 'purple',
        },
        {
          id: 'cancellations', label: 'Annulations', value: dash.reservations?.annulees ?? 0,
          icon: 'bi-x-circle', color: 'danger',
        },
      ]
    : [];

  return (
    <>
      <CounterWelcome />

      {isLoading && !dash ? <StatisticsLoading label="Chargement des statistiques…" /> : null}
      {error && !dash ? <StatisticsError message={error} /> : null}
      {!isLoading && !dash && !error ? (
        <StatisticsError message="Impossible de charger le tableau de bord." />
      ) : null}

      {dash && <CounterStats stats={dashboardStats} />}

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
};

const DashboardPage = () => (
  <Suspense fallback={<CounterDashboardSkeleton />}>
    <CounterDashboard />
  </Suspense>
);

export default DashboardPage;
