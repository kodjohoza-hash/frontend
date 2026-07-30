const colorMap = { primary: 'primary', success: 'success', warning: 'warning', danger: 'danger', info: 'info', accent: 'accent' };

const AdminUserStats = ({ stats }) => {
  if (!stats?.length) return null;
  return (
    <div className="admu-stats-grid">
      {stats.map((s, i) => (
        <div key={s.id} className="admu-stat-card" style={{ animationDelay: `${i * 0.04}s` }}>
          <div className={`admu-stat-icon admu-stat-icon--${colorMap[s.color] || 'primary'}`}>
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="admu-stat-value">{s.value.toLocaleString()}</div>
          <div className="admu-stat-label">{s.label}</div>
          <div className={`admu-stat-trend ${s.trend > 0 ? 'admu-stat-trend--up' : 'admu-stat-trend--down'}`}>
            <i className={`bi bi-arrow-${s.trend > 0 ? 'up' : 'down'}`} />
            {Math.abs(s.trend)}%
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminUserStats;
