import React from 'react';
import { formatCurrency } from '../../../data/adminCommissionData';

const icons = {
  total: 'fa-sack-dollar', today: 'fa-calendar-day', month: 'fa-calendar',
  year: 'fa-calendar-year', companies: 'fa-building', transactions: 'fa-arrow-right-arrow-left',
  paid: 'fa-circle-check', pending: 'fa-clock',
};

const themes = [
  { bg: 'rgba(5,150,105,0.08)', color: '#059669' },
  { bg: 'rgba(59,130,246,0.08)', color: '#3B82F6' },
  { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B' },
  { bg: 'rgba(139,92,246,0.08)', color: '#8B5CF6' },
  { bg: 'rgba(16,185,129,0.08)', color: '#10B981' },
  { bg: 'rgba(15,23,42,0.08)', color: '#0F172A' },
  { bg: 'rgba(5,150,105,0.08)', color: '#059669' },
  { bg: 'rgba(239,68,68,0.08)', color: '#EF4444' },
];

export default function AdminCommissionStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="adcm-stats-grid">
      {Object.entries(stats).map(([key, val], i) => (
        <div className="adcm-stat-card" key={key}>
          <div className="adcm-stat-icon" style={{ background: themes[i].bg, color: themes[i].color }}>
            <i className={`fa-solid ${icons[key] || 'fa-coins'}`} />
          </div>
          <div className="adcm-stat-value">
            {val.isCurrency ? formatCurrency(val.value ?? val) : (val.value ?? val)}
            {val.trend != null && val.trend !== 0 && (
              <span className={`adcm-stat-trend adcm-stat-trend--${val.trend >= 0 ? 'up' : 'down'}`}>
                <i className={`fa-solid fa-arrow-${val.trend >= 0 ? 'up' : 'down'}`} />{Math.abs(val.trend)}%
              </span>
            )}
          </div>
          <div className="adcm-stat-label">{val.label || key}</div>
        </div>
      ))}
    </div>
  );
}
