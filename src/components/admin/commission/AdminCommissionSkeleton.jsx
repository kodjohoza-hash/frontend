import React from 'react';

export default function AdminCommissionSkeleton() {
  return (
    <div style={{ animation: 'adcmFadeIn 0.3s ease' }}>
      <div className="adcm-skeleton adcm-skeleton-title" />
      <div className="adcm-stats-grid" style={{ marginBottom: '1rem' }}>
        {[...Array(8)].map((_, i) => <div className="adcm-skeleton adcm-skeleton-card" key={i} />)}
      </div>
      <div className="adcm-skeleton" style={{ height: 52, borderRadius: 14, marginBottom: '1rem' }} />
      <div className="adcm-skeleton" style={{ height: 400, borderRadius: 14 }} />
    </div>
  );
}
