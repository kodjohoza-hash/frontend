import clsx from 'clsx';

const ReservationStats = ({ stats }) => {
  return (
    <div className="rv-stats">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          className={clsx('rv-stat', `rv-stat--${stat.color}`)}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className={clsx('rv-stat__icon', `rv-stat__icon--${stat.color}`)}>
            <i className={clsx('bi', stat.icon)} />
          </div>
          <div className="rv-stat__content">
            <span className="rv-stat__value">{stat.value}</span>
            <span className="rv-stat__label">{stat.label}</span>
          </div>
          {stat.delta && stat.delta !== '0' && (
            <span className={clsx('rv-stat__delta', `rv-stat__delta--${stat.deltaDir}`)}>
              <i className={clsx('bi', stat.deltaDir === 'up' ? 'bi-arrow-up' : 'bi-arrow-down')} />
              {stat.delta}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReservationStats;
