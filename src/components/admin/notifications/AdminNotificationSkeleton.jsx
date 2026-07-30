import React from 'react';

const AdminNotificationSkeleton = ({ rows = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="adn-skeleton" style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
        <div className="adn-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
    ))}
  </div>
);
export default AdminNotificationSkeleton;
