import React from 'react';

const actionStyles = {
  created: { icon: 'fa-plus-circle', color: '#3B82F6' },
  assigned: { icon: 'fa-user-check', color: '#8B5CF6' },
  priority_changed: { icon: 'fa-arrow-up', color: '#EF4444' },
  status_changed: { icon: 'fa-spinner', color: '#F59E0B' },
  replied: { icon: 'fa-reply', color: '#10B981' },
  note_added: { icon: 'fa-sticky-note', color: '#F59E0B' },
  closed: { icon: 'fa-circle-check', color: '#6B7280' },
  reopened: { icon: 'fa-rotate-left', color: '#8B5CF6' },
};

const AdminSupportTimeline = ({ events }) => (
  <div className="ads-timeline">
    {events?.length === 0 ? (
      <div className="ads-empty"><i className="fas fa-clock" /><p>Aucune activité</p></div>
    ) : events?.map((ev, i) => {
      const st = actionStyles[ev.action] || { icon: 'fa-circle', color: 'rgba(255,255,255,0.2)' };
      return (
        <div key={ev.id || i} className="ads-timeline-item" style={{ animation: `ads-toast-in 0.3s ease-out ${i * 0.04}s both` }}>
          <div className="ads-timeline-icon" style={{ background: `${st.color}15`, color: st.color }}><i className={`fas ${st.icon}`} /></div>
          <div className="ads-timeline-content">
            <div className="ads-timeline-title">{ev.label}</div>
            <div className="ads-timeline-meta">{ev.user} · {ev.date}</div>
          </div>
        </div>
      );
    })}
  </div>
);
export default AdminSupportTimeline;
