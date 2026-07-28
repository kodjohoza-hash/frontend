const formatDate = (d) => {
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'À l\'instant';
  if (hours < 24) return `Il y a ${hours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export default function AgencyProfileTimeline({ events }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-activity" /> Activité récente</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-timeline">
          {events.map((event) => (
            <div key={event.id} className="apro-timeline__item">
              <div className="apro-timeline__dot">
                <i className={`bi ${event.icon}`} />
              </div>
              <div className="apro-timeline__title">{event.title}</div>
              <div className="apro-timeline__desc">{event.description}</div>
              <div className="apro-timeline__date">
                <i className="bi bi-clock" /> {formatDate(event.date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
