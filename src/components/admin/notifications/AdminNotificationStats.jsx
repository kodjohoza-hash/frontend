import React from 'react';
import { notifKPI } from '../../../data/adminNotificationData';

const iconColors = {
  faPaperPlane: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  faClock: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faHourglass: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  faCircleExclamation: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faEnvelope: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faMessage: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faBell: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  faEye: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faMousePointer: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
};
const iconMap = { 'fa-paper-plane': 'faPaperPlane', 'fa-clock': 'faClock', 'fa-hourglass': 'faHourglass', 'fa-circle-exclamation': 'faCircleExclamation', 'fa-envelope': 'faEnvelope', 'fa-message': 'faMessage', 'fa-bell': 'faBell', 'fa-eye': 'faEye', 'fa-mouse-pointer': 'faMousePointer' };

const AdminNotificationStats = ({ loading }) => {
  const items = Object.entries(notifKPI);
  if (loading) return <div className="adn-kpi-grid">{items.slice(0, 6).map((_, i) => <div key={i} className="adn-skeleton" style={{ height: 95, position: 'relative', overflow: 'hidden' }}><div className="adn-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} /></div>)}</div>;
  return (
    <div className="adn-kpi-grid">
      {items.map(([key, kpi], idx) => {
        const ik = iconMap[kpi.icon] || 'faPaperPlane';
        const c = iconColors[ik] || { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' };
        const isUp = kpi.trend >= 0;
        return (
          <div key={key} className="adn-kpi-card" style={{ animation: `adn-toast-in 0.3s ease-out ${idx * 0.04}s both` }}>
            <div className="adn-kpi-icon" style={{ background: c.bg, color: c.color }}><i className={`fas ${kpi.icon}`} /></div>
            <div className="adn-kpi-label">{kpi.label}</div>
            <div className="adn-kpi-value">{kpi.value.toLocaleString('fr-FR')}{kpi.suffix || ''}</div>
            <div className={`adn-kpi-trend ${isUp ? 'up' : 'down'}`}><i className={`fas ${isUp ? 'fa-arrow-up' : 'fa-arrow-down'}`} />{Math.abs(kpi.trend)}%</div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminNotificationStats;
