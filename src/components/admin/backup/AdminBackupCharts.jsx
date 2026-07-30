import { backupChartData, storageData } from '../../../data/adminBackupData';

const BarChart = ({ data, dataKey, labelKey, color }) => {
  const maxVal = Math.max(...data.map(d => (typeof d[dataKey] === 'object' ? Object.values(d[dataKey]).reduce((a, b) => a + b, 0) : d[dataKey])));
  return (
    <div className="adb-bar-chart">
      {data.map((d, i) => {
        const val = typeof d[dataKey] === 'object' ? Object.values(d[dataKey]).reduce((a, b) => a + b, 0) : d[dataKey];
        const pct = (val / maxVal) * 100;
        return (
          <div key={i} className="adb-bar" style={{ height: '100%', justifyContent: 'flex-end' }}>
            <div className="adb-bar-value">{val}</div>
            <div style={{ width: '100%', height: `${pct}%`, background: color, borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height .3s' }}></div>
            <div className="adb-bar-label">{d[labelKey]}</div>
          </div>
        );
      })}
    </div>
  );
};

const StackedBarChart = ({ data, keys, colors, labelKey }) => {
  const maxVal = Math.max(...data.map(d => keys.reduce((s, k) => s + d[k], 0)));
  return (
    <div className="adb-stacked-bar">
      {data.map((d, i) => {
        const total = keys.reduce((s, k) => s + d[k], 0);
        const pct = (total / maxVal) * 100;
        let cum = 0;
        return (
          <div key={i} className="adb-stack-group">
            <div className="adb-bar-value">{total}</div>
            <div style={{ width: '100%', height: `${pct}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
              {keys.map((k, ki) => {
                const h = (d[k] / total) * 100;
                const seg = <div key={k} className="adb-stack" style={{ height: `${h}%`, background: colors[ki] }}></div>;
                return seg;
              })}
            </div>
            <div className="adb-bar-label">{d[labelKey]}</div>
          </div>
        );
      })}
    </div>
  );
};

const AdminBackupCharts = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div className="adb-charts-grid">
      <div className="adb-chart-card">
        <div className="adb-chart-title">Activité hebdomadaire <span>Succès / Échecs</span></div>
        <StackedBarChart data={backupChartData.weeklyActivity} keys={['success', 'failed']} colors={['#10B981', '#EF4444']} labelKey="day" />
      </div>
      <div className="adb-chart-card">
        <div className="adb-chart-title">Taille des sauvegardes <span>7 jours</span></div>
        <BarChart data={backupChartData.weeklyActivity} dataKey="size" labelKey="day" color="#3B82F6" />
      </div>
      <div className="adb-chart-card">
        <div className="adb-chart-title">Résumé mensuel <span>7 mois</span></div>
        <StackedBarChart data={backupChartData.monthlySummary} keys={['success', 'failed']} colors={['#10B981', '#EF4444']} labelKey="month" />
      </div>
      <div className="adb-chart-card">
        <div className="adb-chart-title">Évolution du stockage <span>7 mois</span></div>
        <BarChart data={storageData.evolution} dataKey="used" labelKey="month" color="#8B5CF6" />
      </div>
    </div>
  </div>
);
export default AdminBackupCharts;
export { BarChart, StackedBarChart };
