import clsx from 'clsx';

const CounterNotificationStats = ({ stats = [] }) => (
  <div className="acn-stats">
    {stats.map((stat, i) => (
      <div
        key={stat.id}
        className="acn-stat-card"
        style={{ animationDelay: `${i * 0.08}s` }}
      >
        <div className="acn-stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
          <i className={clsx('bi', stat.icon)} />
        </div>
        <div className="acn-stat-content">
          <div className="acn-stat-label">{stat.label}</div>
          <div className="acn-stat-value">{stat.value}</div>
          {stat.subtext && <div className="acn-stat-subtext">{stat.subtext}</div>}
        </div>
      </div>
    ))}
  </div>
);

export default CounterNotificationStats;
