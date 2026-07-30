import { formatDate, formatTime } from '@data/counterNotificationData';

const CounterNotificationTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="acn-empty" style={{ padding: '20px 0' }}>
        <div className="acn-empty-text">Aucun événement.</div>
      </div>
    );
  }

  return (
    <div className="acn-timeline">
      {events.map((event, i) => (
        <div key={i} className="acn-timeline-item">
          <div className="acn-timeline-dot" />
          {i < events.length - 1 && <div className="acn-timeline-line" />}
          <div className="acn-timeline-content">
            <div className="acn-timeline-action">{event.action}</div>
            <div className="acn-timeline-date">
              {formatDate(event.date)} à {formatTime(event.date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterNotificationTimeline;
