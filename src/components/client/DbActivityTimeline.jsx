import clsx from 'clsx';
import { activityTimeline } from '@data/clientDashboard';

const DbActivityTimeline = () => {
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="db-card db-timeline">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-clock-history" />
          Activité récente
        </h3>
      </div>
      <div className="db-timeline__list">
        {activityTimeline.map((item, idx) => (
          <div key={item.id} className="db-timeline__item">
            <div className={clsx('db-timeline__node', `db-timeline__node--${item.color}`)}>
              <i className={clsx('bi', item.icon)} />
            </div>
            {idx < activityTimeline.length - 1 && <div className="db-timeline__line" />}
            <div className="db-timeline__content">
              <span className="db-timeline__action">{item.action}</span>
              <span className="db-timeline__detail">{item.detail}</span>
              <span className="db-timeline__time">{formatTime(item.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DbActivityTimeline;
