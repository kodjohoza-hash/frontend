import React from 'react';
import { supportChartData } from '../../../data/adminSupportData';

const barColors = ['#8B5CF6','#3B82F6','#10B981','#FBBF24','#EF4444','#EC4899','#14B8A6','#F59E0B','#6366F1','#F97316'];

const AdminSupportCharts = () => {
  const { ticketsOverTime, ticketsByCategory, ticketsByPriority, satisfactionTrend } = supportChartData;
  const maxTickets = Math.max(...ticketsOverTime.map(d => Math.max(d.ouverts, d.résolus)), 1);
  const maxCat = Math.max(...ticketsByCategory.map(d => d.value), 1);
  const maxPrio = Math.max(...ticketsByPriority.map(d => d.value), 1);
  return (
    <div className="ads-chart-grid">
      <div className="ads-chart-card full">
        <div className="ads-chart-title"><i className="fas fa-chart-line" style={{ color: '#8B5CF6' }} />Évolution des tickets (7 mois)</div>
        <div className="ads-bar-chart" style={{ height: 200 }}>
          {ticketsOverTime.map((d, i) => (
            <div key={i} className="ads-bar-item">
              <div className="ads-bar" style={{ height: `${(d.ouverts / maxTickets) * 80}%`, background: 'linear-gradient(to top, #8B5CF6, #A78BFA)', maxWidth: 20, marginBottom: 2 }}><div className="ads-bar-tooltip">Ouverts: {d.ouverts}</div></div>
              <div className="ads-bar" style={{ height: `${(d.résolus / maxTickets) * 80}%`, background: 'linear-gradient(to top, #10B981, #34D399)', maxWidth: 20 }}><div className="ads-bar-tooltip">Résolus: {d.résolus}</div></div>
              <div className="ads-bar-label" style={{ marginTop: '0.5rem' }}>{d.month}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="ads-chart-card">
        <div className="ads-chart-title"><i className="fas fa-chart-pie" style={{ color: '#3B82F6' }} />Par catégorie</div>
        <div className="ads-hbar-list">
          {ticketsByCategory.map((d, i) => (
            <div key={i} className="ads-hbar-item">
              <span className="ads-hbar-label">{d.name}</span>
              <div className="ads-hbar-track"><div className="ads-hbar-fill" style={{ width: `${(d.value / maxCat) * 100}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }}>{((d.value / maxCat) * 100).toFixed(0)}%</div></div>
              <span className="ads-hbar-value">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ads-chart-card">
        <div className="ads-chart-title"><i className="fas fa-chart-bar" style={{ color: '#10B981' }} />Satisfaction client</div>
        <div className="ads-hbar-list">
          {satisfactionTrend.map((d, i) => (
            <div key={i} className="ads-hbar-item">
              <span className="ads-hbar-label">{d.month}</span>
              <div className="ads-hbar-track"><div className="ads-hbar-fill" style={{ width: `${d.rate}%`, background: `linear-gradient(90deg, ${barColors[i % barColors.length]}, ${barColors[i % barColors.length]}88)` }}>{d.rate}%</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminSupportCharts;
