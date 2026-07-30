const AdminCompanyStats = ({ stats }) => {
  if (!stats?.length) return null;
  const colorMap = { primary: 'primary', success: 'success', warning: 'warning', danger: 'danger', info: 'info', accent: 'accent', purple: 'purple' };
  return (
    <div className="admc-stats-grid">
      {stats.map((s, i) => (
        <div key={s.id} className="admc-stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className={`admc-stat-icon admc-stat-icon--${colorMap[s.color] || 'primary'}`}>
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="admc-stat-value">{s.value.toLocaleString()}</div>
          <div className="admc-stat-label">{s.label}</div>
          <div className={`admc-stat-trend ${s.trend > 0 ? 'admc-stat-trend--up' : 'admc-stat-trend--down'}`}>
            <i className={`bi bi-arrow-${s.trend > 0 ? 'up' : 'down'}`} />
            {Math.abs(s.trend)}%
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminCompanyStats;
