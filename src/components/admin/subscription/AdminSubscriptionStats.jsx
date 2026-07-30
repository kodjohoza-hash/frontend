import React from 'react';
import { formatCurrency } from '../../../data/adminSubscriptionData';

const icons = {
  total: 'fa-boxes-stacked',
  active: 'fa-circle-check',
  inactive: 'fa-box-archive',
  subscribed: 'fa-building',
  trials: 'fa-flask',
  expired: 'fa-hourglass-end',
  renewals: 'fa-arrows-rotate',
  revenue: 'fa-chart-line',
};

const themes = [
  { bg: 'rgba(30,27,75,0.08)', color: 'var(--adm-primary)' },
  { bg: 'rgba(16,185,129,0.08)', color: '#10B981' },
  { bg: 'rgba(107,114,128,0.08)', color: '#6B7280' },
  { bg: 'rgba(139,92,246,0.08)', color: '#8B5CF6' },
  { bg: 'rgba(59,130,246,0.08)', color: '#3B82F6' },
  { bg: 'rgba(239,68,68,0.08)', color: '#EF4444' },
  { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B' },
  { bg: 'rgba(16,185,129,0.08)', color: '#10B981' },
];

export default function AdminSubscriptionStats({ stats }) {
  if (!stats) return null;
  const entries = Object.entries(stats);
  return (
    <div className="adms-stats-grid">
      {entries.map(([key, val], i) => (
        <div className="adms-stat-card" key={key}>
          <div className="adms-stat-icon" style={{ background: themes[i % themes.length].bg, color: themes[i % themes.length].color }}>
            <i className={`fa-solid ${icons[key] || 'fa-receipt'}`} />
          </div>
          <div className="adms-stat-value">
            {val.isCurrency ? formatCurrency(val.value || val, 'XOF') : (val.value ?? val)}
            {val.trend != null && val.trend !== 0 && (
              <span className={`adms-stat-trend adms-stat-trend--${val.trend >= 0 ? 'up' : 'down'}`}>
                <i className={`fa-solid fa-arrow-${val.trend >= 0 ? 'up' : 'down'}`} />
                {Math.abs(val.trend)}%
              </span>
            )}
          </div>
          <div className="adms-stat-label">{val.label || key}</div>
        </div>
      ))}
    </div>
  );
}
