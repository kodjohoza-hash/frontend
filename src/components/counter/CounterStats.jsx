import clsx from 'clsx';

const CounterStats = ({ stats }) => (
  <div className="act-stats-row">
    {stats.map((s) => (
      <div key={s.id} className="act-stat">
        <div className="act-stat__top">
          <div className={clsx('act-stat__icon', `act-stat__icon--${s.color}`)}>
            <i className={`bi ${s.icon}`} />
          </div>
          {s.trend && (
            <span className={clsx('act-stat__trend', s.trendUp ? 'act-stat__trend--up' : 'act-stat__trend--down')}>
              <i className={`bi ${s.trendUp ? 'bi-arrow-up-short' : 'bi-arrow-down-short'}`} />
              {Math.abs(s.trend)}%
            </span>
          )}
        </div>
        <div className="act-stat__value">
          {s.value}<span className="act-stat__suffix">{s.suffix || ''}</span>
        </div>
        <div className="act-stat__label">{s.label}</div>
      </div>
    ))}
  </div>
);

export default CounterStats;
