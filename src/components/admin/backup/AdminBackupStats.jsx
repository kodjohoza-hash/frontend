import { backupKPI } from '../../../data/adminBackupData';

const AdminBackupStats = () => (
  <div className="adb-kpi-grid">
    {Object.values(backupKPI).map((kpi, i) => (
      <div key={i} className="adb-kpi-card">
        <div className="adb-kpi-icon" style={{ background: `${kpi.color}12`, color: kpi.color }}>
          <i className={`fa-solid ${kpi.icon}`}></i>
        </div>
        <div className="adb-kpi-info">
          <div className="adb-kpi-value">
            {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            {kpi.suffix && <span className="adb-kpi-suffix">{kpi.suffix}</span>}
          </div>
          <div className="adb-kpi-label">{kpi.label}</div>
          {!kpi.noTrend && typeof kpi.trend === 'number' && (
            <div className={`adb-kpi-trend ${kpi.trend >= 0 ? 'up' : 'down'}`}>
              <i className={`fa-solid fa-arrow-${kpi.trend >= 0 ? 'up' : 'down'}`}></i>
              {Math.abs(kpi.trend)}%
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
export default AdminBackupStats;
