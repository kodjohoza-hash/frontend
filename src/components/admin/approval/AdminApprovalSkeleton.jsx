import React from 'react';

export default function AdminApprovalSkeleton() {
  return (
    <div style={{ animation: 'admaFadeIn 0.3s ease' }}>
      <div className="adma-skeleton adma-skeleton-title" />
      <div className="adma-stats-grid" style={{ marginBottom: '1rem' }}>
        {[...Array(7)].map((_, i) => (
          <div className="adma-skeleton adma-skeleton-card" key={i} />
        ))}
      </div>
      <div className="adma-skeleton" style={{ height: 48, borderRadius: 12, marginBottom: '1rem' }} />
      <div className="adma-skeleton" style={{ height: 400, borderRadius: 12 }} />
    </div>
  );
}
