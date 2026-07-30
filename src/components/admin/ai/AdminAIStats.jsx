import { aiKPI } from '../../../data/adminAIData';

const AdminAIStats = () => (
  <div className="adai-kpi-grid">
    {Object.values(aiKPI).map((kpi, i) => (
      <div key={i} className="adai-kpi-card">
        <div className="adai-kpi-icon" style={{ background: `${kpi.color}12`, color: kpi.color }}>
          <i className={`fa-solid ${kpi.icon}`}></i>
        </div>
        <div className="adai-kpi-info">
          <div className="adai-kpi-value">
            {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            {kpi.suffix && <span className="adai-kpi-suffix">{kpi.suffix}</span>}
          </div>
          <div className="adai-kpi-label">{kpi.label}</div>
          {typeof kpi.trend === 'number' && (
            <div className={`adai-kpi-trend ${kpi.trend >= 0 ? 'up' : 'down'}`}>
              <i className={`fa-solid fa-arrow-${kpi.trend >= 0 ? 'up' : 'down'}`}></i>
              {Math.abs(kpi.trend)}%
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
export default AdminAIStats;
