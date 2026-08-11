import { Suspense, useEffect } from 'react';
import {
  AdminWelcome, AdminStats, AdminCharts, AdminActivityTimeline,
  AdminAlerts, AdminQuickActions, AdminTopCompanies, AdminTransactions,
  AdminSubscriptionRevenue, AdminSkeleton,
} from '@components/admin/';
import { StatisticsLoading, StatisticsError } from '@components/statistics/StatisticsStates';
import useStatisticsStore from '../../store/statistics.store';
import { formatCurrency } from '../../utils/currency';

const AdminDashboardContent = () => {
  const data = useStatisticsStore((s) => s.data);
  const loading = useStatisticsStore((s) => s.loading);
  const error = useStatisticsStore((s) => s.error);
  const fetch = useStatisticsStore((s) => s.fetch);

  const isLoading = loading.dashboard;
  const dash = data.dashboard?.data;

  useEffect(() => {
    fetch('dashboard').catch(() => {});
  }, [fetch]);

  const stats = dash
    ? [
        {
          id: 'companies', label: 'Compagnies', value: dash.compagnies?.total ?? 0,
          icon: 'bi-building', color: 'primary',
        },
        {
          id: 'active_companies', label: 'Compagnies actives', value: dash.compagnies?.actives ?? 0,
          icon: 'bi-building-check', color: 'success',
        },
        {
          id: 'agencies', label: 'Agences', value: dash.agences?.total ?? 0,
          icon: 'bi-shop', color: 'info',
        },
        {
          id: 'clients', label: 'Clients', value: dash.clients?.total ?? 0,
          icon: 'bi-person-badge', color: 'primary',
        },
        {
          id: 'trips', label: 'Voyages (periode)', value: dash.voyages?.total ?? 0,
          icon: 'bi-bus-front', color: 'info',
        },
        {
          id: 'bookings', label: 'Reservations', value: dash.reservations?.total ?? 0,
          icon: 'bi-calendar-check', color: 'success',
        },
        {
          id: 'tickets', label: 'Billets emis', value: dash.billets?.total ?? 0,
          icon: 'bi-ticket-perforated', color: 'accent',
        },
        {
          id: 'revenue', label: 'Revenu net', value: formatCurrency(dash.revenu?.net),
          icon: 'bi-graph-up-arrow', color: 'success',
        },
      ]
    : [];

  return (
    <>
      <AdminWelcome />
      <AdminQuickActions />
      {isLoading && !dash ? <StatisticsLoading label="Chargement du tableau de bord..." /> : null}
      {error && !dash ? <StatisticsError message={error} /> : null}
      <AdminStats stats={stats} />
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
};

const SuperAdminDashboard = () => (
  <Suspense fallback={<AdminSkeleton />}>
    <AdminDashboardContent />
  </Suspense>
);

export default SuperAdminDashboard;
