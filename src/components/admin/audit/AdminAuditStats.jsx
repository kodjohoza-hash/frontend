import React from 'react';
import { auditKPI, getSeverityBadge } from '../../../data/adminAuditData';

const iconColors = {
  faList: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  faRightToBracket: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faLock: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faBolt: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faPlusCircle: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faPen: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  faTrash: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  faCheckCircle: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  faBan: { bg: 'rgba(249,115,22,0.12)', color: '#F97316' },
  faShield: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
};

const iconMap = {
  'fa-list': 'faList', 'fa-right-to-bracket': 'faRightToBracket', 'fa-lock': 'faLock',
  'fa-bolt': 'faBolt', 'fa-plus-circle': 'faPlusCircle', 'fa-pen': 'faPen',
  'fa-trash': 'faTrash', 'fa-check-circle': 'faCheckCircle', 'fa-ban': 'faBan',
  'fa-shield': 'faShield',
};

/* KPIs réels (GET /admin/audit-logs/stats) ou valeurs mock par défaut. */
const AdminAuditStats = ({ loading, stats = null }) => {
  const items = Object.entries(stats || auditKPI);
  if (loading) {
    return (
      <div className="ada-kpi-grid">
        {items.slice(0, 6).map((_, i) => (
          <div key={i} className="ada-skeleton" style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
            <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="ada-kpi-grid">
      {items.map(([key, kpi], idx) => {
        const iconKey = iconMap[kpi.icon] || 'faList';
        const colors = iconColors[iconKey] || { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' };
        const isUp = (kpi.trend ?? 0) >= 0;
        return (
          <div key={key} className="ada-kpi-card" style={{
            animation: `ada-fade-in 0.3s ease-out ${idx * 0.04}s both`,
          }}>
            <div className="ada-kpi-icon" style={{ background: colors.bg, color: colors.color }}>
              <i className={`fas ${kpi.icon}`} />
            </div>
            <div className="ada-kpi-label">{kpi.label}</div>
            <div className="ada-kpi-value">{(kpi.value ?? 0).toLocaleString('fr-FR')}</div>
            <div className={`ada-kpi-trend ${isUp ? 'up' : 'down'}`}>
              <i className={`fas ${isUp ? 'fa-arrow-up' : 'fa-arrow-down'}`} />
              {Math.abs(kpi.trend ?? 0)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminAuditStats;
