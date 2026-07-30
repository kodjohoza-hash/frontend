const colorMap = { primary: 'primary', success: 'success', warning: 'warning', danger: 'danger', info: 'info', accent: 'accent' };
const AdminRoleStats = ({ stats }) => {
  if (!stats?.length) return null;
  return (
    <div className="admr-stats-grid">
      {stats.map((s, i) => (
        <div key={s.id} className="admr-stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className={`admr-stat-icon admr-stat-icon--${colorMap[s.color] || 'primary'}`}>
            <i className={`bi ${s.icon}`} />
          </div>
          <div className="admr-stat-value">{s.value.toLocaleString()}</div>
          <div className="admr-stat-label">{s.label}</div>
          <div className={`admr-stat-trend ${s.trend > 0 ? 'admr-stat-trend--up' : 'admr-stat-trend--down'}`}>
            <i className={`bi bi-arrow-${s.trend > 0 ? 'up' : 'down'}`} /> {Math.abs(s.trend)}%
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminRoleStats;
