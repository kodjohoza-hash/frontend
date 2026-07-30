import { integrationKPI } from '../../../data/adminIntegrationData';

const AdminIntegrationStats = () => (
  <div className="adi-kpi-grid">
    {Object.values(integrationKPI).map((kpi, i) => (
      <div key={i} className="adi-kpi-card">
        <div className="adi-kpi-icon" style={{ background: `${kpi.color}15`, color: kpi.color }}>
          <i className={`fa-solid ${kpi.icon}`}></i>
        </div>
        <div className="adi-kpi-info">
          <div className="adi-kpi-value">
            {kpi.value.toLocaleString()}
            {kpi.suffix && <span className="adi-kpi-suffix">{kpi.suffix}</span>}
          </div>
          <div className="adi-kpi-label">{kpi.label}</div>
          {typeof kpi.trend === 'number' && (
            <div className={`adi-kpi-trend ${kpi.trend >= 0 ? 'up' : 'down'}`}>
              <i className={`fa-solid fa-arrow-${kpi.trend >= 0 ? 'up' : 'down'}`}></i>
              {Math.abs(kpi.trend)}%
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
export default AdminIntegrationStats;
