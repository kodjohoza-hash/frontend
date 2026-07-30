import React from 'react';

const actionIcons = {
  payment: 'fa-credit-card', created: 'fa-plus', modified: 'fa-pen',
  suspension: 'fa-pause', reactivation: 'fa-play', revision: 'fa-scale-balanced',
};

const actionColors = {
  payment: '#059669', created: '#3B82F6', modified: '#8B5CF6',
  suspension: '#F59E0B', reactivation: '#10B981', revision: '#0F172A',
};

export default function AdminCommissionTimeline({ events }) {
  if (!events || events.length === 0) {
    return <div className="adcm-empty" style={{ padding: '2rem 0' }}><i className="fa-solid fa-clock-rotate-left" style={{ fontSize: '2rem' }} /><h3 style={{ fontSize: '0.95rem' }}>No Events</h3></div>;
  }
  return (
    <div className="adcm-timeline">
      {events.map((e, i) => (
        <div className="adcm-timeline-item" key={e.id || i}>
          <div className="adcm-timeline-icon" style={{ background: actionColors[e.action] || '#6B7280' }}>
            <i className={`fa-solid ${actionIcons[e.action] || 'fa-circle'}`} />
          </div>
          <div className="adcm-timeline-content">
            <h4>{e.title}</h4>
            <p>{e.description}</p>
            <div className="adcm-timeline-time">{e.time}{e.user ? ` — ${e.user}` : ''}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
