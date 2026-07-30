import clsx from 'clsx';
import { formatDate, formatTime } from '@data/counterProfileData';

const TYPE_CONFIG = {
  sale: { color: '#FF6B35', icon: 'bi-cart-check' },
  booking: { color: '#3B82F6', icon: 'bi-calendar-check' },
  payment: { color: '#10B981', icon: 'bi-credit-card' },
  login: { color: '#8B5CF6', icon: 'bi-box-arrow-in-right' },
  logout: { color: '#6B7280', icon: 'bi-box-arrow-right' },
  profile_update: { color: '#F59E0B', icon: 'bi-pencil-square' },
};

const CounterProfileTimeline = ({ events = [] }) => {
  if (!events.length) {
    return (
      <div className="acpr-card">
        <div className="acpr-card-header">
          <i className="bi bi-clock-history" />
          <span>Activité récente</span>
        </div>
        <div className="acpr-timeline-empty">
          <i className="bi bi-inbox" />
          <span>Aucune activité récente.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-clock-history" />
        <span>Activité récente</span>
      </div>
      <div className="acpr-timeline">
        {events.map((event, i) => {
          const config = TYPE_CONFIG[event.type] || { color: '#6B7280', icon: 'bi-circle' };
          return (
            <div
              key={event.id}
              className="acpr-timeline-item"
              style={{ '--acpr-i': i }}
            >
              <div className="acpr-timeline-dot-wrapper">
                <div className="acpr-timeline-dot" style={{ background: config.color }}>
                  <i className={clsx('bi', config.icon)} />
                </div>
                {i < events.length - 1 && (
                  <div className="acpr-timeline-line" style={{ background: '#E5E7EB' }} />
                )}
              </div>
              <div className="acpr-timeline-content">
                <div className="acpr-timeline-title">{event.title}</div>
                {event.description && (
                  <div className="acpr-timeline-desc">{event.description}</div>
                )}
                <div className="acpr-timeline-date">
                  <i className="bi bi-clock" /> {formatDate(event.date)} à {formatTime(event.date)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounterProfileTimeline;
