import React from 'react';

const AdminSettingsSkeleton = () => {
  return (
    <div>
      <div className="adst-skeleton" style={{ height: 60, marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="adst-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="adst-form-grid">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="adst-skeleton" style={{ height: 120, position: 'relative', overflow: 'hidden' }}>
            <div className="adst-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettingsSkeleton;
