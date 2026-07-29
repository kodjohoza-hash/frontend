import clsx from 'clsx';

const CounterBookingTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="acb-empty" style={{ padding: '20px 0' }}>
        <div className="acb-empty-text">Aucun historique disponible.</div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} à ${hh}:${min}`;
  };

  return (
    <div className="acb-timeline">
      {history.map((item, i) => (
        <div key={i} className={clsx('acb-timeline-item', { completed: true })}>
          <div className="acb-timeline-icon">
            <i className={clsx('bi', item.icon || 'bi-circle')} />
          </div>
          <div className="acb-timeline-content">
            <div className="acb-timeline-action">{item.action}</div>
            <div className="acb-timeline-meta">
              <span><i className="bi bi-person" /> {item.user}</span>
              <span><i className="bi bi-clock" /> {formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterBookingTimeline;
