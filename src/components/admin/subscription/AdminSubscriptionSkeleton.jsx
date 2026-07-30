import React from 'react';

export default function AdminSubscriptionSkeleton() {
  return (
    <div style={{ animation: 'admsFadeIn 0.3s ease' }}>
      <div className="adms-skeleton adms-skeleton-title" />
      <div className="adms-stats-grid" style={{ marginBottom: '1rem' }}>
        {[...Array(8)].map((_, i) => (
          <div className="adms-skeleton adms-skeleton-card" key={i} />
        ))}
      </div>
      <div className="adms-skeleton" style={{ height: 52, borderRadius: 14, marginBottom: '1rem' }} />
      <div className="adms-skeleton" style={{ height: 400, borderRadius: 14 }} />
    </div>
  );
}
