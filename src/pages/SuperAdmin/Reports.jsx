import { useState, useCallback, useEffect } from 'react';
import AdminReportStats from '../../components/admin/reports/AdminReportStats';
import AdminReportFilters from '../../components/admin/reports/AdminReportFilters';
import AdminRevenueCharts from '../../components/admin/reports/AdminRevenueCharts';
import AdminReservationCharts from '../../components/admin/reports/AdminReservationCharts';
import AdminCompanyCharts from '../../components/admin/reports/AdminCompanyCharts';
import AdminClientCharts from '../../components/admin/reports/AdminClientCharts';
import AdminCommissionCharts from '../../components/admin/reports/AdminCommissionCharts';
import AdminComparisonCards from '../../components/admin/reports/AdminComparisonCards';
import AdminAnalyticsCards from '../../components/admin/reports/AdminAnalyticsCards';
import AdminSavedReports from '../../components/admin/reports/AdminSavedReports';
import AdminExportPanel from '../../components/admin/reports/AdminExportPanel';
import AdminReportSkeleton from '../../components/admin/reports/AdminReportSkeleton';
import { StatisticsError } from '../../components/statistics/StatisticsStates';
import useStatisticsStore from '../../store/statistics.store';
import { monthLabel } from '../../services/statistics.service';

const fmt = (v) => Number(v || 0).toLocaleString('fr-FR');

const PERIOD_TO_PARAM = {
  today: 'today',
  week: '7d',
  month: 'this_month',
  year: 'this_year',
  custom: 'custom',
};

const Reports = () => {
  const [filters, setFilters] = useState({
    period: 'year',
    dateFrom: '',
    dateTo: '',
    company: '',
    city: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const companyNames = ['Express Bus Cameroun', 'Touristique Express', 'Finex Voyages', 'Buca Voyages', 'Transcam SAS', 'Voyages du Centre', 'Benny Travel', 'GT Travel', 'Royal Express'];

  const data = useStatisticsStore((s) => s.data);
  const error = useStatisticsStore((s) => s.error);
  const setPeriod = useStatisticsStore((s) => s.setPeriod);
  const setDateRange = useStatisticsStore((s) => s.setDateRange);
  const fetch = useStatisticsStore((s) => s.fetch);

  const isLoading = Object.keys(loading).some((k) => loading[k]);

  const refetch = useCallback(() => {
    const params = { periode: PERIOD_TO_PARAM[filters.period] || 'year' };
    if (filters.period === 'custom') {
      const { dateDebut, dateFin } = useStatisticsStore.getState();
      fetch('dashboard', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('revenue', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('bookings', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('tickets', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('trips', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('performances', { periode: 'custom', dateDebut, dateFin }).catch(() => {});
      fetch('subscriptions').catch(() => {});
      return;
    }
    fetch('dashboard', params).catch(() => {});
    fetch('revenue', params).catch(() => {});
    fetch('bookings', params).catch(() => {});
    fetch('tickets', params).catch(() => {});
    fetch('trips', params).catch(() => {});
    fetch('performances', params).catch(() => {});
    fetch('subscriptions').catch(() => {});
  }, [fetch, filters.period]);

  useEffect(() => {
    if (filters.period !== 'custom') {
      setPeriod(PERIOD_TO_PARAM[filters.period] || 'this_year');
    } else {
      setDateRange(filters.dateFrom, filters.dateTo);
    }
    refetch();
  }, [filters.period, filters.dateFrom, filters.dateTo, refetch, setPeriod, setDateRange]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    refetch();
    setTimeout(() => setLoading(false), 400);
    setToast({ show: true, type: 'info', message: 'Données actualisées' });
  }, [refetch]);

  const handleReset = useCallback(() => {
    setFilters({ period: 'year', dateFrom: '', dateTo: '', company: '', city: '', status: '' });
    setToast({ show: true, type: 'info', message: 'Filtres réinitialisés' });
  }, []);

  const dash = data.dashboard?.data;
  const rev = data.revenue?.data;
  const bk = data.bookings?.data;
  const tk = data.tickets?.data;
  const tp = data.trips?.data;
  const perf = data.performances?.data;
  const subs = data.subscriptions?.data;

  const kpis = [
    { id: 'reservations', label: 'Réservations', value: bk?.total ?? 0, trend: 0, icon: 'fa-ticket' },
    { id: 'tickets', label: 'Billets vendus', value: tk?.total ?? 0, trend: 0, icon: 'fa-receipt' },
    { id: 'tripsDone', label: 'Voyages réalisés', value: tp?.termines ?? 0, trend: 0, icon: 'fa-bus' },
    { id: 'tripsCancelled', label: 'Voyages annulés', value: tp?.annules ?? 0, trend: 0, icon: 'fa-ban' },
    { id: 'companies', label: 'Compagnies actives', value: subs?.parStatut?.actif ?? dash?.compagnies?.actives ?? 0, trend: 0, icon: 'fa-building' },
    { id: 'clients', label: 'Clients actifs', value: dash?.clients?.total ?? 0, trend: 0, icon: 'fa-users' },
    { id: 'revenue', label: 'Revenus encaissés', value: rev?.encaisse ?? 0, isCurrency: true, trend: 0, icon: 'fa-sack-dollar' },
    { id: 'net', label: 'Revenu net', value: rev?.net ?? 0, isCurrency: true, trend: 0, icon: 'fa-chart-line' },
    { id: 'subscriptions', label: 'Abonnements actifs', value: subs?.parStatut?.actif ?? 0, trend: 0, icon: 'fa-box' },
    { id: 'fillRate', label: 'Taux de remplissage', value: Math.round((tp?.tauxRemplissage ?? 0) * 100), suffix: '%', trend: 0, icon: 'fa-gauge-high' },
  ];

  const yearly = (rev?.parMois || []).reduce((acc, m) => {
    const y = String(m.mois).split('-')[0];
    if (!acc[y]) acc[y] = { year: Number(y), revenue: 0, commissions: 0, companies: 0 };
    acc[y].revenue += Number(m.total) || 0;
    return acc;
  }, {});
  const revenueChartData = {
    daily: (rev?.parJour || []).map((r) => ({ date: r.jour, revenue: Number(r.total) || 0, transactions: Number(r.nb) || 0, commissions: 0 })),
    monthly: (rev?.parMois || []).map((r) => ({ month: monthLabel(r.mois), revenue: Number(r.total) || 0, commissions: 0, bookings: Number(r.nb) || 0, tickets: 0 })),
    yearly: Object.values(yearly),
  };

  const totalReservations = Math.max(bk?.total || 0, (perf?.agences || []).reduce((s, a) => s + Number(a.reservations || 0), 0), 1);
  const bookingChartData = {
    byDay: (bk?.parJour || []).map((r) => ({ date: r.jour, bookings: Number(r.nb) || 0 })),
    byCompany: (perf?.agences || []).map((a) => ({
      company: a.nom || a.agenceId,
      bookings: Number(a.reservations || 0),
      share: Math.round((Number(a.reservations || 0) / totalReservations) * 100),
    })),
  };

  const payMethodRows = (rev?.parMethode || []).map((m) => ({
    method: m.methode,
    amount: Number(m.total) || 0,
    share: rev?.encaisse ? Math.round(((Number(m.total) || 0) / rev.encaisse) * 100) : 0,
    color: '#10B981',
  }));

  const realCompanies = subs?.compagnies?.map((c) => c.nom).filter(Boolean) || [];
  const companies = realCompanies.length > 0 ? [...new Set(realCompanies)] : companyNames;

  const notLoaded = isLoading && !dash && !rev && !bk;

  return (
    <div className="adbi-dashboard">
      {/* Hero */}
      <div className="adbi-hero">
        <div className="adbi-hero-content">
          <h1>
            <i className="fas fa-chart-pie" style={{ color: '#8B5CF6' }} />
            Centre Business Intelligence
          </h1>
          <p>Analysez les performances globales de la plateforme Bus Tix Connect</p>
          <div className="adbi-hero-badge">
            <i className="fas fa-database" />
            Données temps réel · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <i className="fas fa-circle" style={{ fontSize: 6, marginLeft: 4 }} />
            <span>Dernière synchro : {data.dashboard?.periode ? `période ${data.dashboard.periode}` : 'à l’instant'}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AdminReportFilters
        filters={filters}
        setFilters={setFilters}
        companies={companies}
        onRefresh={handleRefresh}
        onReset={handleReset}
      />

      {/* Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <AdminExportPanel setToast={setToast} />
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)' }}>
          <i className="fas fa-sync" style={{ marginRight: 4 }} />
          {loading ? 'Chargement...' : 'À jour'}
        </span>
      </div>

      {notLoaded ? (
        <AdminReportSkeleton type="dashboard" />
      ) : (
        <>
          {error && <StatisticsError message={error} />}

          {/* KPI */}
          <AdminReportStats period={filters.period} loading={false} animate stats={kpis} />

          {/* Revenue Charts */}
          <div className="adbi-chart-grid">
            <AdminRevenueCharts filters={filters} revenue={revenueChartData} />
          </div>

          {/* Reservation Charts */}
          <AdminReservationCharts filters={filters} bookings={bookingChartData} />

          {/* Ticket Summary + Company Charts */}
          <div className="adbi-chart-grid">
            <div className="adbi-chart-card full">
              <div className="adbi-chart-header">
                <h3><i className="fas fa-receipt" style={{ color: '#F59E0B', marginRight: 8 }} /> Billets</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Vendus', value: tk?.total ?? 0, color: '#10B981' },
                  { label: 'Annulés', value: tk?.annules ?? 0, color: '#EF4444' },
                  { label: 'Remboursés', value: tk?.rembourses ?? 0, color: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '1.5rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: item.color }}>
                      {fmt(item.value)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <AdminClientCharts filters={filters} />
          </div>

          <AdminCompanyCharts filters={filters} />

          {/* Commission Charts */}
          <AdminCommissionCharts filters={filters} />

          {/* Payment Summary */}
          <div className="adbi-chart-grid">
            <div className="adbi-chart-card">
              <div className="adbi-chart-header">
                <h3><i className="fas fa-credit-card" style={{ color: '#10B981', marginRight: 8 }} /> Paiements</h3>
              </div>
              <div className="adbi-hbar-list">
                {payMethodRows.length > 0 ? payMethodRows.map((p, i) => (
                  <div key={i} className="adbi-hbar-item">
                    <div className="adbi-hbar-label" style={{ minWidth: 120, textAlign: 'left' }}>{p.method}</div>
                    <div className="adbi-hbar-track">
                      <div className="adbi-hbar-fill" style={{ width: `${p.share}%`, background: p.color }}>
                        {p.share > 10 ? `${p.share}%` : ''}
                      </div>
                    </div>
                    <div className="adbi-hbar-value">{`${(p.amount / 1000000).toFixed(1)}M XAF`}</div>
                  </div>
                )) : <div className="adbi-empty" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>Aucun paiement.</div>}
              </div>
            </div>
            <div className="adbi-chart-card">
              <div className="adbi-chart-header">
                <h3><i className="fas fa-gauge-high" style={{ color: '#8B5CF6', marginRight: 8 }} /> Taux de remplissage</h3>
              </div>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="70" cy="70" r="60" fill="none" stroke="#8B5CF6" strokeWidth="10"
                      strokeDasharray={`${(Math.round((tp?.tauxRemplissage ?? 0) * 100) / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                      strokeLinecap="round" transform="rotate(-90 70 70)" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{Math.round((tp?.tauxRemplissage ?? 0) * 100)}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Période</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparisons */}
          <div className="adbi-section-header">
            <h2><i className="fas fa-not-equal" style={{ color: '#FBBF24' }} /> Comparaisons</h2>
          </div>
          <AdminComparisonCards filters={filters} loading={false} />

          {/* Analytics */}
          <div className="adbi-section-header">
            <h2><i className="fas fa-chart-simple" style={{ color: '#3B82F6' }} /> Analyses</h2>
          </div>
          <AdminAnalyticsCards filters={filters} loading={false} />

          {/* Saved Reports */}
          <AdminSavedReports filters={filters} setToast={setToast} />
        </>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`adbi-toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`} />
          {toast.message}
          <button onClick={() => setToast({ ...toast, show: false })}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginLeft: 8 }}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
