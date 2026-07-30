import React from 'react';

const icons = {
  total: 'fa-file-circle-check',
  pending: 'fa-clock',
  review: 'fa-magnifying-glass',
  approved: 'fa-check-circle',
  refused: 'fa-xmark-circle',
  urgent: 'fa-bell',
  flagged: 'fa-flag',
};

const statThemes = [
  'primary', 'warning', 'info', 'success', 'danger', 'danger-light', 'accent',
];

export default function AdminApprovalStats({ stats }) {
  if (!stats) return null;
  const entries = Object.entries(stats);
  return (
    <div className="adma-stats-grid">
      {entries.map(([key, val], i) => (
        <div className="adma-stat-card" key={key}>
          <div className={`adma-stat-icon adma-stat-icon--${statThemes[i % statThemes.length]}`}>
            <i className={`fa-solid ${icons[key] || 'fa-file'}`} />
          </div>
          <div className="adma-stat-value">
            {val.value ?? val}
            {val.trend != null && (
              <span className={`adma-stat-trend adma-stat-trend--${val.trend >= 0 ? 'up' : 'down'}`}>
                <i className={`fa-solid fa-arrow-${val.trend >= 0 ? 'up' : 'down'}`} />
                {Math.abs(val.trend)}%
              </span>
            )}
          </div>
          <div className="adma-stat-label">{val.label || key}</div>
        </div>
      ))}
    </div>
  );
}
