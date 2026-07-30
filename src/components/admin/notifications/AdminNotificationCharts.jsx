import React from 'react';

const barColors = ['#8B5CF6','#3B82F6','#10B981','#FBBF24','#EF4444','#EC4899','#14B8A6','#F59E0B','#6366F1','#F97316'];

const AdminNotificationCharts = ({ dailyData, byChannelData, byCategoryData }) => {
  const maxDaily = Math.max(...dailyData.map(d => d.value), 1);
  const maxChan = Math.max(...byChannelData.map(d => d.value), 1);
  const maxCat = Math.max(...byCategoryData.map(d => d.value), 1);
  return (
    <div className="adn-chart-grid">
      <div className="adn-chart-card full">
        <div className="adn-chart-title"><i className="fas fa-chart-line" style={{ color: '#8B5CF6' }} />Notifications envoyées (30 jours)</div>
        <div className="adn-bar-chart">
          {dailyData.map((d, i) => (
            <div key={i} className="adn-bar-item">
              <div className="adn-bar" style={{ height: `${(d.value / maxDaily) * 100}%`, background: `linear-gradient(to top, #8B5CF6, #A78BFA)`, maxWidth: 24 }}>
                <div className="adn-bar-tooltip">{d.value.toLocaleString('fr-FR')}</div>
              </div>
              <div className="adn-bar-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="adn-chart-card">
        <div className="adn-chart-title"><i className="fas fa-chart-bar" style={{ color: '#3B82F6' }} />Par canal</div>
        <div className="adn-hbar-list">
          {byChannelData.map((d, i) => (
            <div key={i} className="adn-hbar-item">
              <span className="adn-hbar-label">{d.name}</span>
              <div className="adn-hbar-track"><div className="adn-hbar-fill" style={{ width: `${(d.value / maxChan) * 100}%`, background: `linear-gradient(90deg, ${barColors[i % barColors.length]}, ${barColors[i % barColors.length]}88)` }}>{((d.value / maxChan) * 100).toFixed(0)}%</div></div>
              <span className="adn-hbar-value">{d.value.toLocaleString('fr-FR')}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="adn-chart-card">
        <div className="adn-chart-title"><i className="fas fa-chart-pie" style={{ color: '#10B981' }} />Par catégorie</div>
        <div className="adn-hbar-list">
          {byCategoryData.map((d, i) => (
            <div key={i} className="adn-hbar-item">
              <span className="adn-hbar-label">{d.name}</span>
              <div className="adn-hbar-track"><div className="adn-hbar-fill" style={{ width: `${(d.value / maxCat) * 100}%`, background: `linear-gradient(90deg, ${barColors[(i + 3) % barColors.length]}, ${barColors[(i + 3) % barColors.length]}88)` }}>{((d.value / maxCat) * 100).toFixed(0)}%</div></div>
              <span className="adn-hbar-value">{d.value.toLocaleString('fr-FR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminNotificationCharts;
