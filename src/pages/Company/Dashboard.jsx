import { useEffect } from 'react';
import '../../assets/styles/statistics.css';
import useStatisticsStore from '../../store/statistics.store';
import { formatCurrency } from '../../utils/currency';
import PeriodFilter from '../../components/statistics/PeriodFilter';
import StatisticsKpiCard from '../../components/statistics/StatisticsKpiCard';
import { StatisticsLoading, StatisticsError, StatisticsEmpty } from '../../components/statistics/StatisticsStates';
import { MonthlyRevenueChart, BookingsStatusChart, PaymentMethodsChart } from '../../components/statistics/StatisticsCharts';

const CompanyDashboard = () => {
  const data = useStatisticsStore((s) => s.data);
  const loading = useStatisticsStore((s) => s.loading);
  const error = useStatisticsStore((s) => s.error);
  const fetchOverview = useStatisticsStore((s) => s.fetchOverview);
  const fetch = useStatisticsStore((s) => s.fetch);
  const buildParams = useStatisticsStore((s) => s.buildParams);

  const isLoading = loading.dashboard || loading.revenue || loading.bookings;

  useEffect(() => {
    fetchOverview().catch(() => {});
  }, [fetchOverview]);

  const refresh = () => {
    fetchOverview(buildParams()).catch(() => {});
    fetch('trips', buildParams()).catch(() => {});
  };

  const dash = data.dashboard?.data;
  const rev = data.revenue?.data;
  const bk = data.bookings?.data;

  const loadingBlock = isLoading && !dash ? <StatisticsLoading label="Chargement du tableau de bord…" /> : null;
  const errorBlock = error && !dash ? <StatisticsError message={error} /> : null;

  return (
    <div className="company-dashboard-page">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h1 className="h4 mb-0">Tableau de bord — Compagnie</h1>
          <p className="text-muted small mb-0">Vue consolidée de vos agences · {data.dashboard?.devise || 'XAF'}</p>
        </div>
        <PeriodFilter />
        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={refresh}>
          <i className="bi bi-arrow-clockwise" /> Actualiser
        </button>
      </div>

      {loadingBlock}
      {errorBlock}
      {!isLoading && !dash && <StatisticsEmpty message="Aucune donnée disponible." />}

      {dash && (
        <>
          <div className="stats-kpi-grid">
            <StatisticsKpiCard label="Revenu net" value={dash.paiements?.net} format={formatCurrency} icon="bi-coin" color="#10B981" />
            <StatisticsKpiCard label="Réservations" value={dash.reservations?.total} icon="bi-ticket-perforated" color="#3B82F6" />
            <StatisticsKpiCard label="Billets émis" value={dash.billets?.total} icon="bi-receipt" color="#8B5CF6" />
            <StatisticsKpiCard label="Taux de remplissage" value={dash.voyages?.tauxRemplissage ? `${Math.round(dash.voyages.tauxRemplissage * 100)}` : '0'} suffix="%" icon="bi-people-fill" color="#F59E0B" />
            <StatisticsKpiCard label="Voyages" value={dash.voyages?.total} icon="bi-bus-front" color="#0d6efd" />
            <StatisticsKpiCard label="Agences actives" value={dash.agences?.total ?? 0} icon="bi-building" color="#EC4899" />
          </div>

          <div className="stats-chart-grid">
            <div className="stats-card">
              <div className="stats-card__header">
                <h3 className="stats-card__title"><i className="bi bi-graph-up" /> Revenus mensuels</h3>
                <span className="badge text-bg-success">{formatCurrency(rev?.encaisse)} encaissé</span>
              </div>
              {rev?.parMois?.length ? <MonthlyRevenueChart data={rev.parMois} /> : <StatisticsEmpty />}
            </div>
            <div className="stats-card">
              <div className="stats-card__header">
                <h3 className="stats-card__title"><i className="bi bi-pie-chart" /> Réservations par statut</h3>
                <span className="badge text-bg-secondary">{bk?.total ?? 0} total</span>
              </div>
              <BookingsStatusChart data={bk?.parStatut} />
            </div>
          </div>

          <div className="stats-chart-grid">
            <div className="stats-card">
              <div className="stats-card__header">
                <h3 className="stats-card__title"><i className="bi bi-credit-card" /> Paiements par méthode</h3>
              </div>
              <PaymentMethodsChart data={rev?.parMethode} />
            </div>
            <div className="stats-card">
              <div className="stats-card__header">
                <h3 className="stats-card__title"><i className="bi bi-shield-check" /> Synthèse</h3>
              </div>
              <ul className="list-unstyled small mb-0 d-grid gap-2">
                <li><i className="bi bi-check-circle text-success" /> Confirées : <strong>{bk?.confirmees ?? 0}</strong></li>
                <li><i className="bi bi-x-circle text-danger" /> Annulées : <strong>{bk?.annulees ?? 0}</strong></li>
                <li><i className="bi bi-clock text-warning" /> En attente : <strong>{bk?.enAttente ?? 0}</strong></li>
                <li><i className="bi bi-arrow-left-right text-danger" /> Remboursements : <strong>{formatCurrency(dash.paiements?.remboursements?.montant)}</strong></li>
                <li><i className="bi bi-geo-alt text-primary" /> Guichets : <strong>{dash.guichets?.total ?? 0}</strong></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanyDashboard;
