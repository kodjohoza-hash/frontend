import React from 'react';

const actionIcons = {
  created: 'fa-plus',
  modified: 'fa-pen',
  renewed: 'fa-arrows-rotate',
  expired: 'fa-hourglass-end',
  payment: 'fa-credit-card',
  cancelled: 'fa-ban',
  suspended: 'fa-pause',
  reactivated: 'fa-play',
  trial: 'fa-flask',
  upgraded: 'fa-arrow-up',
  downgraded: 'fa-arrow-down',
};

const actionColors = {
  created: '#3B82F6', modified: '#8B5CF6', renewed: '#10B981',
  expired: '#EF4444', payment: '#059669', cancelled: '#6B7280',
  suspended: '#F59E0B', reactivated: '#10B981', trial: '#3B82F6',
  upgraded: '#8B5CF6', downgraded: '#F59E0B',
};

export default function AdminSubscriptionTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="adms-empty" style={{ padding: '2rem 0' }}>
        <i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '2rem' }} />
        <h3 style={{ fontSize: '0.95rem' }}>No Timeline Events</h3>
      </div>
    );
  }
  return (
    <div className="adms-timeline">
      {events.map((evt, i) => (
        <div className="adms-timeline-item" key={evt.id || i}>
          <div className="adms-timeline-icon" style={{ background: actionColors[evt.action] || '#6B7280' }}>
            <i className={`fa-solid ${actionIcons[evt.action] || 'fa-circle'}`} />
          </div>
          <div className="adms-timeline-content">
            <h4>{evt.title}</h4>
            {evt.description && <p>{evt.description}</p>}
            <div className="adms-timeline-time">
              {evt.time}
              {evt.user && ` — ${evt.user}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
