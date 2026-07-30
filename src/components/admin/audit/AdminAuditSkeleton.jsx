import React from 'react';

const AdminAuditSkeleton = ({ type = 'dashboard' }) => {
  if (type === 'table') {
    return (
      <div className="ada-table-wrapper">
        <div className="ada-skeleton" style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
          <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="ada-skeleton" style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
            <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
      <div className="ada-skeleton" style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
        <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
    </div>
  );
};

export default AdminAuditSkeleton;
