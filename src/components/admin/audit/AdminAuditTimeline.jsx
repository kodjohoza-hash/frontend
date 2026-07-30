import React from 'react';
import { auditEvents, getSeverityBadge, formatDateTime, actionTypes } from '../../../data/adminAuditData';

const AdminAuditTimeline = ({ events, loading, onSelect }) => {
  const items = events || auditEvents.slice(0, 20);

  if (loading) {
    return (
      <div className="ada-skeleton" style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
        <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
      </div>
    );
  }

  return (
    <div className="ada-timeline">
      {items.map((e, i) => {
        const sev = getSeverityBadge(e.severity);
        const actionMeta = actionTypes.find(a => a.id === e.action);
        return (
          <div key={e.id} className="ada-timeline-item" style={{ cursor: 'pointer' }} onClick={() => onSelect && onSelect(e)}>
            <div className="ada-timeline-icon" style={{ background: sev.bg, color: sev.color }}>
              {actionMeta ? <i className={`fas ${actionMeta.icon}`} /> : <i className={`fas ${sev.icon}`} />}
            </div>
            <div className="ada-timeline-content">
              <div className="ada-timeline-header">
                <span className="ada-timeline-title">{e.actionLabel}</span>
                <span className="ada-severity-badge" style={{ background: sev.bg, color: sev.color, fontSize: '0.65rem' }}>
                  {sev.label}
                </span>
                <span className="ada-status-badge" style={{
                  background: e.status === 'Succès' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: e.status === 'Succès' ? '#10B981' : '#EF4444',
                  fontSize: '0.65rem',
                }}>
                  {e.status}
                </span>
              </div>
              <div className="ada-timeline-desc">{e.description}</div>
              <div className="ada-timeline-meta">
                <span><i className="fas fa-user" style={{ marginRight: 4 }} />{e.user.name}</span>
                <span><i className="fas fa-clock" style={{ marginRight: 4 }} />{formatDateTime(e.datetime)}</span>
                <span><i className="fas fa-folder" style={{ marginRight: 4 }} />{e.module}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminAuditTimeline;
