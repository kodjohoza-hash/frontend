import React, { useState, useCallback } from 'react';
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

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
    setToast({ show: true, type: 'info', message: 'Données actualisées' });
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ period: 'year', dateFrom: '', dateTo: '', company: '', city: '', status: '' });
    setToast({ show: true, type: 'info', message: 'Filtres réinitialisés' });
  }, []);

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
            <span>Dernière synchro : il y a 2 min</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AdminReportFilters
        filters={filters}
        setFilters={setFilters}
        companies={companyNames}
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

      {loading ? (
        <AdminReportSkeleton type="dashboard" />
      ) : (
        <>
          {/* KPI */}
          <AdminReportStats period={filters.period} loading={false} animate />

          {/* Revenue Charts */}
          <div className="adbi-chart-grid">
            <AdminRevenueCharts filters={filters} />
          </div>

          {/* Reservation Charts */}
          <AdminReservationCharts filters={filters} />

          {/* Ticket Summary + Company Charts */}
          <div className="adbi-chart-grid">
            <div className="adbi-chart-card full">
              <div className="adbi-chart-header">
                <h3><i className="fas fa-receipt" style={{ color: '#F59E0B', marginRight: 8 }} /> Billets</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Vendus', value: 34120, color: '#10B981' },
                  { label: 'Annulés', value: 1250, color: '#EF4444' },
                  { label: 'Remboursés', value: 380, color: '#F59E0B' },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '1.5rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: item.color }}>
                      {item.value.toLocaleString('fr-FR')}
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
                {[
                  { method: 'Mobile Money', amount: 24500000, share: 54, color: '#10B981' },
                  { method: 'Carte bancaire', amount: 11500000, share: 25, color: '#3B82F6' },
                  { method: 'Espèces', amount: 7200000, share: 16, color: '#F59E0B' },
                  { method: 'Autres', amount: 2000000, share: 5, color: '#8B5CF6' },
                ].map((p, i) => (
                  <div key={i} className="adbi-hbar-item">
                    <div className="adbi-hbar-label" style={{ minWidth: 120, textAlign: 'left' }}>{p.method}</div>
                    <div className="adbi-hbar-track">
                      <div className="adbi-hbar-fill" style={{ width: `${p.share}%`, background: p.color }}>
                        {p.share > 10 ? `${p.share}%` : ''}
                      </div>
                    </div>
                    <div className="adbi-hbar-value">{`${(p.amount / 1000000).toFixed(1)}M FCFA`}</div>
                  </div>
                ))}
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
                      strokeDasharray={`${(78 / 100) * 2 * Math.PI * 60} ${2 * Math.PI * 60}`}
                      strokeLinecap="round" transform="rotate(-90 70 70)" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>78%</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Moyen</div>
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
