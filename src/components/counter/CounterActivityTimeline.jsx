import clsx from 'clsx';

const CounterActivityTimeline = ({ activities }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-activity" />
        Activité du jour
      </h3>
      <span className="act-card__badge">{activities.length}</span>
    </div>
    <div className="act-timeline__list">
      {activities.map((item) => (
        <div key={item.id} className="act-timeline__item">
          <div className={clsx('act-timeline__node', `act-timeline__node--${item.color}`)}>
            <i className={`bi ${item.icon}`} />
          </div>
          <div className="act-timeline__line" />
          <div className="act-timeline__content">
            <span className="act-timeline__action">{item.action}</span>
            <span className="act-timeline__detail">{item.detail}</span>
            <span className="act-timeline__time">{item.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CounterActivityTimeline;
