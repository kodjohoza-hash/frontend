import React from 'react';

const urgencyStyles = {
  urgent: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: '🔴 Urgent' },
  high: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: '🟡 High' },
  normal: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', label: '🔵 Normal' },
  low: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', label: '⚪ Low' },
};

export default function AdminApprovalProfile({ request }) {
  if (!request) return null;
  const u = urgencyStyles[request.urgency] || urgencyStyles.normal;
  return (
    <>
      <div className="adma-profile-header">
        <div className="adma-profile-logo" style={{ background: request.logoColor || '#1E1B4B' }}>
          {request.company?.charAt(0) || '?'}
        </div>
        <div className="adma-profile-meta">
          <h4>{request.company}</h4>
          <p>
            <span>#{request.id}</span>
            <span style={{ ...u, padding: '0.15rem 0.5rem', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600 }}>{u.label}</span>
          </p>
        </div>
      </div>
      <div className="adma-profile-grid">
        <div className="adma-profile-field">
          <label>Owner</label>
          <span>{request.owner}</span>
        </div>
        <div className="adma-profile-field">
          <label>Email</label>
          <span>{request.email}</span>
        </div>
        <div className="adma-profile-field">
          <label>Phone</label>
          <span>{request.phone}</span>
        </div>
        <div className="adma-profile-field">
          <label>Submitted</label>
          <span>{request.submitted}</span>
        </div>
        <div className="adma-profile-field">
          <label>Type</label>
          <span>{request.type}</span>
        </div>
        <div className="adma-profile-field">
          <label>Category</label>
          <span>{request.category}</span>
        </div>
        {request.reviewer && (
          <div className="adma-profile-field">
            <label>Reviewer</label>
            <span>{request.reviewer}</span>
          </div>
        )}
        {request.businessModel && (
          <div className="adma-profile-field">
            <label>Business Model</label>
            <span>{request.businessModel}</span>
          </div>
        )}
      </div>
      {request.description && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#F9FAFB', borderRadius: 8, fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
          {request.description}
        </div>
      )}
    </>
  );
}
