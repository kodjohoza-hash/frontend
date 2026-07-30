import { activityTimeline } from '@data/adminData';

const AdminActivityTimeline = () => (
  <div className="adm-timeline-card">
    <div className="adm-timeline-card__header">
      <span className="adm-timeline-card__title">Activité globale</span>
      <a href="/super-admin/reports" className="adm-timeline-card__link">
        Voir tout <i className="bi bi-arrow-right" />
      </a>
    </div>
    <div className="adm-timeline">
      {activityTimeline.map((event) => (
        <div key={event.id} className="adm-timeline__item">
          <div className={`adm-timeline__node adm-timeline__node--${event.color}`}>
            <i className={`bi ${event.icon}`} />
          </div>
          <div className="adm-timeline__body">
            <div className="adm-timeline__action">{event.action}</div>
            <div className="adm-timeline__detail">{event.detail}</div>
          </div>
          <span className="adm-timeline__time">{event.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminActivityTimeline;
