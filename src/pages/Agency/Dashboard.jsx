import { Suspense, useEffect } from 'react';
import AgencyWelcome from '@components/agency/AgencyWelcome';
import AgencyStatCard from '@components/agency/AgencyStatCard';
import AgencyActivity from '@components/agency/AgencyActivity';
import AgencyTripCard from '@components/agency/AgencyTripCard';
import AgencyAlerts from '@components/agency/AgencyAlerts';
import AgencySkeleton from '@components/agency/AgencySkeleton';
import { StatisticsLoading, StatisticsError } from '@components/statistics/StatisticsStates';
import useStatisticsStore from '../../store/statistics.store';
import { todayTrips, alerts } from '@data/agencyData';

const AgencyDashboard = () => {
  const data = useStatisticsStore((s) => s.data);
  const loading = useStatisticsStore((s) => s.loading);
  const error = useStatisticsStore((s) => s.error);
  const fetchOverview = useStatisticsStore((s) => s.fetchOverview);

  const isLoading = loading.dashboard || loading.revenue;
  const dash = data.dashboard?.data;
  const rev = data.revenue?.data;

  useEffect(() => {
    fetchOverview().catch(() => {});
  }, [fetchOverview]);

  const statCards = dash
    ? [
        {
          id: 'voyages', label: 'Voyages (période)', value: dash.voyages?.total ?? 0,
          icon: 'bi-signpost-2', color: 'primary',
        },
        {
          id: 'reservations', label: 'Réservations', value: dash.reservations?.total ?? 0,
          icon: 'bi-ticket-perforated', color: 'accent',
        },
        {
          id: 'revenue', label: 'Chiffre d’affaires (net)', value: (dash.paiements?.net ?? 0).toLocaleString('fr-FR'),
          suffix: ' XAF', icon: 'bi-cash-stack', color: 'success',
        },
        {
          id: 'occupancy', label: 'Taux de remplissage',
          value: Math.round((dash.voyages?.tauxRemplissage ?? 0) * 100), suffix: '%',
          icon: 'bi-people-fill', color: 'info',
        },
        {
          id: 'billets', label: 'Billets émis', value: dash.billets?.total ?? 0,
          icon: 'bi-receipt', color: 'warning',
        },
        {
          id: 'guichets', label: 'Guichets', value: dash.guichets?.total ?? 0,
          icon: 'bi-shop', color: 'muted',
        },
      ]
    : [];

  return (
    <>
      <AgencyWelcome />

      {isLoading && !dash ? <StatisticsLoading label="Chargement du tableau de bord…" /> : null}
      {error && !dash ? <StatisticsError message={error} /> : null}

      <div className="ag-stats-row">
        {dash
          ? statCards.map((s) => (
              <AgencyStatCard
                key={s.id}
                label={s.label}
                value={s.value}
                suffix={s.suffix}
                icon={s.icon}
                color={s.color}
              />
            ))
          : null}
      </div>

      {!isLoading && !dash && !error ? (
        <StatisticsError message="Impossible de charger le tableau de bord." />
      ) : null}

      {dash && rev && (
        <div className="ag-grid" style={{ marginTop: '1.25rem' }}>
          <div className="ag-card ag-trips">
            <div className="ag-card__header">
              <h3 className="ag-card__title">
                <i className="bi bi-signpost-2" />
                Voyages du jour
              </h3>
              <span className="ag-card__badge">{todayTrips.length}</span>
            </div>
            <div className="ag-trips__list">
              {todayTrips.map((trip) => (
                <AgencyTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>

          <div className="ag-grid__right">
            <AgencyAlerts alerts={alerts} />
            <AgencyActivity />
          </div>
        </div>
      )}
    </>
  );
};

const DashboardPage = () => (
  <Suspense fallback={<AgencySkeleton />}>
    <AgencyDashboard />
  </Suspense>
);

export default DashboardPage;
