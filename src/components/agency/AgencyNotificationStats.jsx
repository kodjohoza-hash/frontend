export default function AgencyNotificationStats({ stats }) {
  return (
    <div className="anot-stats">
      {stats.map((stat) => (
        <div key={stat.id} className="anot-stat">
          <div className="anot-stat__header">
            <div className="anot-stat__icon" style={{ background: stat.color }}>
              <i className={`bi ${stat.icon}`} />
            </div>
          </div>
          <div className="anot-stat__value">{stat.value}</div>
          <div className="anot-stat__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
