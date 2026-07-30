import { monitoringData } from '../../../data/adminIntegrationData';

/* ─── Vertical Bar ─── */
const BarChart = ({ data, dataKey, labelKey, color, format }) => (
  <div className="adi-bar-chart">
    {data.map((d, i) => {
      const maxVal = Math.max(...data.map(x => x[dataKey]));
      const pct = (d[dataKey] / maxVal) * 100;
      return (
        <div key={i} className="adi-bar" style={{ height: '100%', justifyContent: 'flex-end' }}>
          <div className="adi-bar-value">{format ? format(d[dataKey]) : d[dataKey]}</div>
          <div style={{ width: '100%', height: `${pct}%`, background: color, borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height .3s' }}></div>
          <div className="adi-bar-label">{d[labelKey]}</div>
        </div>
      );
    })}
  </div>
);

/* ─── Horizontal Bar ─── */
const HBarChart = ({ data, labelKey, dataKey, valueKey, color, format, maxKey }) => (
  <div className="adi-hbar-list">
    {data.map((d, i) => {
      const maxVal = maxKey ? Math.max(...data.map(x => x[maxKey])) : Math.max(...data.map(x => x[dataKey]));
      const pct = (d[dataKey] / maxVal) * 100;
      return (
        <div key={i} className="adi-hbar-item">
          <div className="adi-hbar-header">
            <span className="adi-hbar-label">{d[labelKey]}</span>
            <span className="adi-hbar-value">{format ? format(d[dataKey]) : d[dataKey]} {d[valueKey] ? `/ ${format ? format(d[valueKey]) : d[valueKey]}` : ''}</span>
          </div>
          <div className="adi-hbar-track">
            <div className="adi-hbar-fill" style={{ width: `${pct}%`, background: color || '#8B5CF6' }}></div>
          </div>
        </div>
      );
    })}
  </div>
);

const AdminMonitoringCharts = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div className="adi-charts-grid">
      <div className="adi-chart-card">
        <div className="adi-chart-title">Disponibilité API <span>Derniers 7 mois</span></div>
        <BarChart data={monitoringData.availability} dataKey="uptime" labelKey="month" color="#10B981" format={v => `${v}%`} />
      </div>
      <div className="adi-chart-card">
        <div className="adi-chart-title">Temps de réponse moyen <span>Derniers 7 mois</span></div>
        <BarChart data={monitoringData.responseTime} dataKey="avg" labelKey="month" color="#8B5CF6" format={v => `${v}ms`} />
      </div>
      <div className="adi-chart-card">
        <div className="adi-chart-title">Appels API <span>Derniers 7 mois</span></div>
        <BarChart data={monitoringData.apiCalls} dataKey="calls" labelKey="month" color="#3B82F6" format={v => `${(v / 1000).toFixed(0)}k`} />
      </div>
      <div className="adi-chart-card">
        <div className="adi-chart-title">Erreurs API <span>Derniers 7 mois</span></div>
        <BarChart data={monitoringData.errors} dataKey="errors" labelKey="month" color="#EF4444" />
      </div>
    </div>
    <div className="adi-chart-card">
      <div className="adi-chart-title">Performance par endpoint <span>7 derniers jours</span></div>
      <HBarChart data={monitoringData.byEndpoint} labelKey="endpoint" dataKey="calls" color="#3B82F6" format={v => `${(v / 1000).toFixed(0)}k`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16, marginTop: 16 }}>
        <div>
          <div className="adi-chart-title" style={{ marginBottom: 8, fontSize: 12 }}>Temps de réponse</div>
          <HBarChart data={monitoringData.byEndpoint} labelKey="endpoint" dataKey="avgMs" color="#8B5CF6" format={v => `${v}ms`} />
        </div>
        <div>
          <div className="adi-chart-title" style={{ marginBottom: 8, fontSize: 12 }}>Taux d'erreur</div>
          <HBarChart data={monitoringData.byEndpoint} labelKey="endpoint" dataKey="errors" valueKey="calls" color="#EF4444" />
        </div>
      </div>
    </div>
  </div>
);
export default AdminMonitoringCharts;
export { BarChart, HBarChart };
