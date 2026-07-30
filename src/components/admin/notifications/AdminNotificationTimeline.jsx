import React from 'react';

const typeIcons = { sent: { icon: 'fa-paper-plane', bg: 'rgba(16,185,129,0.15)', color: '#10B981' }, scheduled: { icon: 'fa-clock', bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' }, draft: { icon: 'fa-pen', bg: 'rgba(251,191,36,0.15)', color: '#FBBF24' }, failed: { icon: 'fa-circle-exclamation', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' }, created: { icon: 'fa-plus-circle', bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' } };

const AdminNotificationTimeline = ({ events }) => (
  <div className="adn-timeline">
    {events.map((e, i) => {
      const t = typeIcons[e.type] || typeIcons.created;
      return (
        <div key={i} className="adn-timeline-item">
          <div className="adn-timeline-icon" style={{ background: t.bg, color: t.color }}><i className={`fas ${t.icon}`} /></div>
          <div className="adn-timeline-content"><div className="adn-timeline-title">{e.title}</div><div className="adn-timeline-meta">{e.description} · {e.time}</div></div>
        </div>
      );
    })}
  </div>
);
export default AdminNotificationTimeline;
