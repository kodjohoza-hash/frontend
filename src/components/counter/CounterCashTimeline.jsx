import clsx from 'clsx';

const CounterCashTimeline = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return <div className="acp-empty" style={{ padding: 20 }}><div className="acp-empty-text">Aucun événement.</div></div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} à ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="acp-timeline">
      {items.map((item, i) => (
        <div key={i} className={clsx('acp-timeline-item', { completed: item.completed, active: item.active })}>
          <div className="acp-timeline-icon">
            <i className={clsx('bi', item.icon || 'bi-circle')} />
          </div>
          <div className="acp-timeline-content">
            <div className="acp-timeline-action">{item.action}</div>
            <div className="acp-timeline-meta">
              {item.user && <span><i className="bi bi-person" /> {item.user}</span>}
              {item.timestamp && <span><i className="bi bi-clock" /> {formatDate(item.timestamp)}</span>}
              {item.amount && <span><i className="bi bi-currency-dollar" /> {item.amount}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CounterCashTimeline;
