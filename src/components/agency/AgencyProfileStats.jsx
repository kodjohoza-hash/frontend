export default function AgencyProfileStats({ stats }) {
  return (
    <div className="apro-stats">
      {stats.map((stat) => (
        <div key={stat.id} className="apro-stat-card">
          <div className="apro-stat-card__header">
            <div className="apro-stat-card__icon" style={{ background: stat.color }}>
              <i className={`bi ${stat.icon}`} />
            </div>
            {stat.change && (
              <span className="apro-stat-card__change">{stat.change}</span>
            )}
          </div>
          <div className="apro-stat-card__value">{stat.value}</div>
          <div className="apro-stat-card__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
