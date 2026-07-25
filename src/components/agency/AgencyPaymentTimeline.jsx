function formatDateTime(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AgencyPaymentTimeline({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="ap-timeline">
      {events.map((ev) => (
        <div key={ev.id} className="ap-timeline__item">
          <div className={`ap-timeline__marker ap-timeline__marker--${ev.color || 'info'}`}>
            <i className={`bi ${ev.icon}`} />
          </div>
          <div className="ap-timeline__content">
            <div className="ap-timeline__label">{ev.label}</div>
            <div className="ap-timeline__time">{formatDateTime(ev.time)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
