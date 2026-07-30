import React from 'react';

const actionIcons = {
  created: 'fa-plus',
  submitted: 'fa-paper-plane',
  assigned: 'fa-user-check',
  review_started: 'fa-magnifying-glass',
  more_info: 'fa-circle-exclamation',
  approved: 'fa-check',
  refused: 'fa-xmark',
  suspended: 'fa-pause',
  reactivated: 'fa-rotate',
  flagged: 'fa-flag',
  comment: 'fa-comment',
  document: 'fa-file',
};

const actionColors = {
  created: '#3B82F6',
  submitted: '#8B5CF6',
  assigned: '#10B981',
  review_started: '#F59E0B',
  more_info: '#EF4444',
  approved: '#10B981',
  refused: '#EF4444',
  suspended: '#6B7280',
  reactivated: '#10B981',
  flagged: '#F59E0B',
  comment: '#3B82F6',
  document: '#8B5CF6',
};

export default function AdminApprovalTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="adma-empty">
        <i className="fa-solid fa-clock-rotate-left" />
        <h3>No Timeline Events</h3>
        <p>There are no timeline events for this request.</p>
      </div>
    );
  }
  return (
    <div className="adma-timeline">
      {events.map((evt, i) => (
        <div className="adma-timeline-item" key={evt.id || i}>
          <div className={`adma-timeline-icon`} style={{ background: actionColors[evt.action] || '#6B7280' }}>
            <i className={`fa-solid ${actionIcons[evt.action] || 'fa-circle'}`} />
          </div>
          <div className="adma-timeline-content">
            <h4>{evt.title}</h4>
            {evt.description && <p>{evt.description}</p>}
            <div className="adma-timeline-time">
              {evt.time}
              {evt.user && ` — by ${evt.user}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
