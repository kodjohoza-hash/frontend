import { useState } from 'react';
import {
  KPI_DATA,
  REVENUE_CHART_DATA,
  BOOKING_CHART_DATA,
  PAYMENT_CHART_DATA,
  OCCUPANCY_DATA,
  CITY_CHART_DATA,
  TOP_ROUTES_DATA,
  TOP_BRANCHES_DATA,
  TOP_AGENTS_DATA,
  TOP_DRIVERS_DATA,
  TOP_CLIENTS_DATA,
  MONTHLY_REVENUE_DATA,
  CLIENT_GROWTH_DATA,
  INSIGHTS_DATA,
  ALERTS_DATA,
} from '@data/analyticsData';
import AgencyAnalyticsStats from '@components/agency/AgencyAnalyticsStats';
import AgencyAnalyticsFilters from '@components/agency/AgencyAnalyticsFilters';
import AgencyRevenueChart from '@components/agency/AgencyRevenueChart';
import AgencyBookingChart from '@components/agency/AgencyBookingChart';
import AgencyPaymentChart from '@components/agency/AgencyPaymentChart';
import AgencyOccupancyChart from '@components/agency/AgencyOccupancyChart';
import AgencyCityChart from '@components/agency/AgencyCityChart';
import AgencyRevenueChartMonthly from '@components/agency/AgencyRevenueChartMonthly';
import AgencyClientGrowthChart from '@components/agency/AgencyClientGrowthChart';
import AgencyTopRoutes from '@components/agency/AgencyTopRoutes';
import AgencyTopBranches from '@components/agency/AgencyTopBranches';
import AgencyTopAgents from '@components/agency/AgencyTopAgents';
import AgencyInsights from '@components/agency/AgencyInsights';
import AgencyAlerts from '@components/agency/AgencyAlerts';
import AgencyExport from '@components/agency/AgencyExport';
import AgencyAnalyticsSkeleton from '@components/agency/AgencyAnalyticsSkeleton';

const DEFAULT_FILTERS = {
  period: 'month',
  city: '',
  method: '',
  status: '',
  outlet: '',
  agent: '',
};

export default function AgencyReports() {
  const [loading] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  if (loading) {
    return <AgencyAnalyticsSkeleton />;
  }

  return (
    <div className="aa-page">
      <div className="aa-page__header">
        <div className="aa-page__title-group">
          <h1 className="aa-page__title">
            <i className="bi bi-bar-chart-line" />
            Rapports & Statistiques
          </h1>
          <span className="aa-page__subtitle">
            Centre décisionnel — Vue d'ensemble de votre activité
          </span>
        </div>
        <div className="aa-page__actions">
          <button className="aa-btn aa-btn--outline aa-btn--sm" type="button">
            <i className="bi bi-arrow-clockwise" />
            Actualiser
          </button>
        </div>
      </div>

      <AgencyAnalyticsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AgencyAnalyticsStats kpis={KPI_DATA} />

      <AgencyExport />

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-graph-up" />
            Évolution des performances
          </h2>
        </div>
        <div className="aa-charts-grid">
          <AgencyRevenueChart data={REVENUE_CHART_DATA} />
          <AgencyBookingChart data={BOOKING_CHART_DATA} />
        </div>
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-pie-chart" />
            Analyse des paiements & occupation
          </h2>
        </div>
        <div className="aa-charts-grid">
          <AgencyPaymentChart data={PAYMENT_CHART_DATA} />
          <AgencyOccupancyChart data={OCCUPANCY_DATA} />
        </div>
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-geo-alt" />
            Répartition géographique
          </h2>
        </div>
        <div className="aa-charts-grid">
          <AgencyCityChart data={CITY_CHART_DATA} />
          <AgencyRevenueChartMonthly data={MONTHLY_REVENUE_DATA} />
        </div>
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-people" />
            Évolution des clients
          </h2>
        </div>
        <div className="aa-charts-grid">
          <AgencyClientGrowthChart data={CLIENT_GROWTH_DATA} />
          <div />
        </div>
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-trophy" />
            Classements
          </h2>
        </div>
        <div className="aa-top-grid">
          <AgencyTopRoutes data={TOP_ROUTES_DATA} />
          <AgencyTopBranches data={TOP_BRANCHES_DATA} />
          <AgencyTopAgents data={TOP_AGENTS_DATA} />
          <AgencyTopRoutes data={TOP_DRIVERS_DATA.map((d) => ({ ...d, name: d.name, reservations: d.trips, revenue: 0, percentage: Math.round((d.trips / 156) * 100), trend: `${d.onTime}% ponctualité` }))} />
        </div>
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-lightbulb" />
            Analyse automatique
          </h2>
        </div>
        <AgencyInsights insights={INSIGHTS_DATA} />
      </div>

      <div className="aa-page__section">
        <div className="aa-page__section-header">
          <h2 className="aa-page__section-title">
            <i className="bi bi-exclamation-triangle" />
            Alertes Business
          </h2>
        </div>
        <AgencyAlerts alerts={ALERTS_DATA} />
      </div>
    </div>
  );
}
