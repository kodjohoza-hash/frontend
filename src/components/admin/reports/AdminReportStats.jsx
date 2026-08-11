import { useState, useEffect } from 'react';
import { reportKPI, formatValue, getTrendIcon } from '../../../data/adminReportData';

const iconColors = {
  faTicket: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faReceipt: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faBus: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  faBan: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faBuilding: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  faUsers: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faUserGear: { bg: 'rgba(236,72,153,0.12)', color: '#EC4899' },
  faSackDollar: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faPercent: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  faBox: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  faChartLine: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faGaugeHigh: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faStar: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
};

const iconMap = {
  'fa-ticket': 'faTicket', 'fa-receipt': 'faReceipt', 'fa-bus': 'faBus',
  'fa-ban': 'faBan', 'fa-building': 'faBuilding', 'fa-users': 'faUsers',
  'fa-user-gear': 'faUserGear', 'fa-sack-dollar': 'faSackDollar',
  'fa-percent': 'faPercent', 'fa-box': 'faBox', 'fa-chart-line': 'faChartLine',
  'fa-gauge-high': 'faGaugeHigh', 'fa-star': 'faStar',
};

const AdminReportStats = ({ period, loading, stats }) => {
  const [visible, setVisible] = useState(false);
  const items = stats && stats.length > 0 ? stats.map((s) => [s.id, s]) : Object.entries(reportKPI);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [period]);

  if (loading) {
    return (
      <div className="adbi-kpi-grid">
        {items.slice(0, 8).map((_, i) => (
          <div key={i} className="adbi-skeleton adbi-skeleton-kpi" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="adbi-kpi-grid">
      {items.map(([key, kpi]) => {
        const trend = getTrendIcon(kpi.trend);
        const iconKey = iconMap[kpi.icon] || 'faChartLine';
        const colors = iconColors[iconKey] || { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' };
        return (
          <div
            key={key}
            className="adbi-kpi-card"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.4s cubic-bezier(0.4,0,0.2,1) ${items.indexOf([key, kpi]) * 0.05}s`,
            }}
          >
            <div className="adbi-kpi-icon" style={{ background: colors.bg, color: colors.color }}>
              <i className={`fas ${kpi.icon}`} />
            </div>
            <div className="adbi-kpi-label">{kpi.label}</div>
            <div className="adbi-kpi-value">
              {formatValue(kpi.value, kpi.isCurrency, kpi.suffix)}
            </div>
            <div className={`adbi-kpi-trend ${trend.icon === 'fa-minus' ? 'neutral' : trend.icon === 'fa-arrow-up' ? 'up' : 'down'}`}>
              <i className={`fas ${trend.icon}`} />
              <span>{Math.abs(kpi.trend)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminReportStats;
