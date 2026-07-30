import clsx from 'clsx';

const TYPE_CONFIG = {
  inscription: { color: '#10B981', icon: 'bi-person-plus' },
  reservation: { color: '#3B82F6', icon: 'bi-calendar-check' },
  billet: { color: '#8B5CF6', icon: 'bi-ticket-perforated' },
  paiement: { color: '#F59E0B', icon: 'bi-credit-card' },
  visite: { color: '#FF6B35', icon: 'bi-eye' },
};

const formatEventDate = (dateStr) => {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} à ${hh}:${min}`;
};

const CounterCustomerTimeline = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <div className="acc-timeline-empty">
        <i className="bi bi-clock-history" />
        <span>Aucun événement récent.</span>
      </div>
    );
  }

  return (
    <div className="acc-timeline">
      {events.map((event, i) => {
        const config = TYPE_CONFIG[event.type] || { color: '#6B7280', icon: 'bi-circle' };
        return (
          <div key={event.id} className="acc-timeline-item" style={{ '--i': i }}>
            <div className="acc-timeline-dot" style={{ background: config.color }}>
              <i className={clsx('bi', config.icon)} />
            </div>
            <div className="acc-timeline-line" style={{ background: '#E5E7EB' }} />
            <div className="acc-timeline-content">
              <div className="acc-timeline-title">{event.title}</div>
              {event.description && (
                <div className="acc-timeline-desc">{event.description}</div>
              )}
              <div className="acc-timeline-date">
                <i className="bi bi-clock" /> {formatEventDate(event.date)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CounterCustomerTimeline;
