import { Suspense } from 'react';
import AgencyLayout from '@layouts/AgencyLayout';
import AgencyWelcome from '@components/agency/AgencyWelcome';
import AgencyStatCard from '@components/agency/AgencyStatCard';
import AgencyActivity from '@components/agency/AgencyActivity';
import AgencyTripCard from '@components/agency/AgencyTripCard';
import AgencyAlerts from '@components/agency/AgencyAlerts';
import AgencySkeleton from '@components/agency/AgencySkeleton';
import { statCards, todayTrips } from '@data/agencyData';
import '@assets/styles/agency.css';

const AgencyDashboard = () => (
  <AgencyLayout>
    <AgencyWelcome />

    <div className="ag-stats-row">
      {statCards.map((s) => (
        <AgencyStatCard key={s.id} {...s} />
      ))}
    </div>

    <div className="ag-grid">
      <div className="ag-grid__left">
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
      </div>

      <div className="ag-grid__right">
        <AgencyAlerts />
        <AgencyActivity />
      </div>
    </div>
  </AgencyLayout>
);

const DashboardPage = () => (
  <Suspense fallback={<AgencySkeleton />}>
    <AgencyDashboard />
  </Suspense>
);

export default DashboardPage;
