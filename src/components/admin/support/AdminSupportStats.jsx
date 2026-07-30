import React from 'react';
import { supportKPI } from '../../../data/adminSupportData';

const iconMap = {
  faInbox: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faCheckCircle: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faHourglass: { bg: 'rgba(251,191,36,0.12)', color: '#F59E0B' },
  faExclamationTriangle: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faClock: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  faHourglassEnd: { bg: 'rgba(236,72,153,0.12)', color: '#EC4899' },
  faStar: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  faCalendarDay: { bg: 'rgba(20,184,166,0.12)', color: '#14B8A6' },
};
const iconRef = { 'fa-inbox': 'faInbox', 'fa-check-circle': 'faCheckCircle', 'fa-hourglass': 'faHourglass', 'fa-exclamation-triangle': 'faExclamationTriangle', 'fa-clock': 'faClock', 'fa-hourglass-end': 'faHourglassEnd', 'fa-star': 'faStar', 'fa-calendar-day': 'faCalendarDay' };

const AdminSupportStats = ({ loading }) => {
  const items = Object.entries(supportKPI);
  if (loading) return <div className="ads-kpi-grid">{items.slice(0, 6).map((_, i) => <div key={i} className="ads-skeleton" style={{ height: 95, position: 'relative', overflow: 'hidden' }}><div className="ads-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} /></div>)}</div>;
  return (
    <div className="ads-kpi-grid">
      {items.map(([key, kpi], idx) => {
        const ik = iconRef[kpi.icon] || 'faInbox';
        const c = iconMap[ik] || { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' };
        const isUp = kpi.trend >= 0;
        return (
          <div key={key} className="ads-kpi-card" style={{ animation: `ads-toast-in 0.3s ease-out ${idx * 0.04}s both` }}>
            <div className="ads-kpi-icon" style={{ background: c.bg, color: c.color }}><i className={`fas ${kpi.icon}`} /></div>
            <div className="ads-kpi-label">{kpi.label}</div>
            <div className="ads-kpi-value">{typeof kpi.value === 'number' ? kpi.value.toLocaleString('fr-FR') : kpi.value}{kpi.suffix || ''}</div>
            <div className={`ads-kpi-trend ${isUp ? 'up' : 'down'}`}><i className={`fas ${isUp ? 'fa-arrow-up' : 'fa-arrow-down'}`} />{Math.abs(kpi.trend)}%</div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminSupportStats;
