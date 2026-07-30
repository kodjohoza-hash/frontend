import { adminStats } from '@data/adminData';

const AdminStats = () => (
  <div className="adm-stats-grid">
    {adminStats.map((stat, i) => (
      <div key={stat.id} className="adm-stat" style={{ animationDelay: `${i * 0.04}s` }}>
        <div className="adm-stat__top">
          <div className={`adm-stat__icon adm-stat__icon--${stat.color}`}>
            <i className={`bi ${stat.icon}`} />
          </div>
          {stat.trend !== 0 && (
            <span className={`adm-stat__trend ${stat.trendUp ? 'adm-stat__trend--up' : 'adm-stat__trend--down'}`}>
              <i className={`bi ${stat.trendUp ? 'bi-arrow-up' : 'bi-arrow-down'}`} />
              {Math.abs(stat.trend)}%
            </span>
          )}
        </div>
        <div className="adm-stat__value">
          {stat.value}
          {stat.suffix && <span className="adm-stat__suffix">{stat.suffix}</span>}
        </div>
        <div className="adm-stat__label">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default AdminStats;
