import { predictiveAnalytics } from '../../../data/adminAIData';

const BarPair = ({ data, key1, key2, labelKey, color1, color2, format }) => {
  const maxVal = Math.max(...data.map(d => Math.max(d[key1] || 0, d[key2] || 0)));
  return (
    <div className="adai-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="adai-bar-group">
          {format && <div className="adai-bar-value">{format(d[key2] || d[key1])}</div>}
          {!format && <div className="adai-bar-value">{d[key2] || d[key1]}</div>}
          <div className="adai-bar-pair">
            {d[key1] != null && <div className="adai-bar" style={{ height: `${(d[key1] / maxVal) * 100}%`, background: color1 }}></div>}
            {d[key2] != null && <div className="adai-bar" style={{ height: `${(d[key2] / maxVal) * 100}%`, background: color2 }}></div>}
          </div>
          <div className="adai-bar-label">{d[labelKey]} {d[key1] != null && d[key2] != null ? '' : '(prévision)'}</div>
        </div>
      ))}
    </div>
  );
};

const formatXAF = (v) => `${(v / 1000000).toFixed(1)}M`;
const formatK = (v) => `${(v / 1000).toFixed(0)}k`;

const AdminAIAnalytics = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div className="adai-section-header">
      <div className="adai-section-title"><i className="fa-solid fa-chart-line" style={{ color: '#EC4899' }}></i> Analyses Prédictives</div>
    </div>
    <div className="adai-charts-grid">
      <div className="adai-chart-card">
        <div className="adai-chart-title">Prévision des réservations <span>Réel vs Prédit</span></div>
        <BarPair data={predictiveAnalytics.bookings} key1="actual" key2="predicted" labelKey="month" color1="#3B82F6" color2="#8B5CF6" format={formatK} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 11 }}>
          <span><i className="fa-solid fa-circle" style={{ color: '#3B82F6' }}></i> Réel</span>
          <span><i className="fa-solid fa-circle" style={{ color: '#8B5CF6' }}></i> Prévu</span>
        </div>
      </div>
      <div className="adai-chart-card">
        <div className="adai-chart-title">Prévision des revenus <span>Réel vs Prédit</span></div>
        <BarPair data={predictiveAnalytics.revenue} key1="actual" key2="predicted" labelKey="month" color1="#10B981" color2="#059669" format={formatXAF} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 11 }}>
          <span><i className="fa-solid fa-circle" style={{ color: '#10B981' }}></i> Réel</span>
          <span><i className="fa-solid fa-circle" style={{ color: '#059669' }}></i> Prévu</span>
        </div>
      </div>
      <div className="adai-chart-card">
        <div className="adai-chart-title">Prévision des commissions <span>Réel vs Prédit</span></div>
        <BarPair data={predictiveAnalytics.commissions} key1="actual" key2="predicted" labelKey="month" color1="#F59E0B" color2="#D97706" format={formatXAF} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 11 }}>
          <span><i className="fa-solid fa-circle" style={{ color: '#F59E0B' }}></i> Réel</span>
          <span><i className="fa-solid fa-circle" style={{ color: '#D97706' }}></i> Prévu</span>
        </div>
      </div>
      <div className="adai-chart-card">
        <div className="adai-chart-title">Prévision du trafic <span>Visites vs API</span></div>
        <BarPair data={predictiveAnalytics.traffic} key1="visits" key2="api" labelKey="month" color1="#EC4899" color2="#8B5CF6" format={formatK} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 11 }}>
          <span><i className="fa-solid fa-circle" style={{ color: '#EC4899' }}></i> Visites</span>
          <span><i className="fa-solid fa-circle" style={{ color: '#8B5CF6' }}></i> Appels API</span>
        </div>
      </div>
      <div className="adai-chart-card">
        <div className="adai-chart-title">Prévision de croissance <span>Utilisateurs / Compagnies / Agents</span></div>
        <BarPair data={predictiveAnalytics.growth} key1="users" key2="companies" labelKey="month" color1="#3B82F6" color2="#10B981" format={formatK} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 12, fontSize: 11 }}>
          <span><i className="fa-solid fa-circle" style={{ color: '#3B82F6' }}></i> Utilisateurs</span>
          <span><i className="fa-solid fa-circle" style={{ color: '#10B981' }}></i> Compagnies</span>
        </div>
      </div>
      <div className="adai-chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <i className="fa-solid fa-robot" style={{ fontSize: 40, color: '#8B5CF6', marginBottom: 12 }}></i>
        <h4 style={{ margin: 0, color: '#1E1B4B', fontSize: 15 }}>Assistant IA prédictif</h4>
        <p style={{ fontSize: 12, color: '#6B7280', margin: '8px 0 16px', maxWidth: 240 }}>L'analyse prédictive s'améliore avec chaque nouvelle donnée.</p>
        <button className="adai-btn-sm primary"><i className="fa-solid fa-rotate"></i> Générer les prévisions</button>
      </div>
    </div>
  </div>
);
export default AdminAIAnalytics;
