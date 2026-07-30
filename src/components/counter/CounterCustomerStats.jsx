import clsx from 'clsx';

const CounterCustomerStats = ({ stats = [] }) => (
  <div className="acc-stats">
    {stats.map((card, i) => (
      <div
        key={card.id}
        className="acc-stat-card"
        style={{ '--i': i, '--card-color': card.color }}
      >
        <div className="acc-stat-bg" style={{ background: `${card.color}0D` }} />
        <div className="acc-stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
          <i className={clsx('bi', card.icon)} />
        </div>
        <div className="acc-stat-content">
          <div className="acc-stat-label">{card.label}</div>
          <div className="acc-stat-value">{card.value}</div>
          {card.subtext && <div className="acc-stat-subtext">{card.subtext}</div>}
        </div>
      </div>
    ))}
  </div>
);

export default CounterCustomerStats;
