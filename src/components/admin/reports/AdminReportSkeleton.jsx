import React from 'react';

const AdminReportSkeleton = ({ type = 'dashboard' }) => {
  if (type === 'stats') {
    return (
      <div className="adbi-skeleton-kpi-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="adbi-skeleton adbi-skeleton-kpi" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="adbi-chart-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="adbi-skeleton adbi-skeleton-chart" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="adbi-skeleton adbi-skeleton-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ height: 120, position: 'relative', overflow: 'hidden', borderRadius: 14, marginBottom: 0 }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
      <div className="adbi-skeleton adbi-skeleton-chart" style={{ position: 'relative', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="adbi-skeleton adbi-skeleton-table" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
    </div>
  );
};

export default AdminReportSkeleton;
