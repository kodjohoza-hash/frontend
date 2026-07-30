import React, { useState } from 'react';
import { revenueData, formatCurrency } from '../../../data/adminReportData';

const RevenueCharts = ({ filters }) => {
  const [activeView, setActiveView] = useState('daily');
  const [fullscreen, setFullscreen] = useState(null);

  const data = activeView === 'daily' ? revenueData.daily :
              activeView === 'monthly' ? revenueData.monthly :
              revenueData.yearly;

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const labelKey = activeView === 'daily' ? 'date' : activeView === 'monthly' ? 'month' : 'year';
  const valueKey = 'revenue';

  const toggleFullscreen = (id) => setFullscreen(fullscreen === id ? null : id);

  const renderBarChart = (chartData, labelKey, valueKey, color = '#8B5CF6') => (
    <div className="adbi-bar-chart">
      {chartData.map((d, i) => {
        const pct = (d[valueKey] / maxRevenue) * 100;
        const shortLabel = activeView === 'daily'
          ? d[labelKey].slice(5)
          : activeView === 'monthly'
            ? d[labelKey].slice(0, 3)
            : String(d[labelKey]);
        return (
          <div key={i} className="adbi-bar-item">
            <div className="adbi-bar" style={{ height: `${Math.max(pct, 2)}%`, background: color }}>
              <span className="adbi-bar-tooltip">{formatCurrency(d[valueKey])}</span>
            </div>
            <div className="adbi-bar-label">{shortLabel}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className={`adbi-chart-card ${fullscreen === 'revenue' ? 'full' : ''}`}>
        <div className="adbi-chart-header">
          <h3><i className="fas fa-chart-line" style={{ color: '#8B5CF6', marginRight: 8 }} /> Évolution des revenus</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['daily', 'monthly', 'yearly'].map(v => (
                <button key={v} className="adbi-control-btn" style={{
                  background: activeView === v ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: activeView === v ? '#A78BFA' : 'rgba(255,255,255,0.5)',
                  borderColor: activeView === v ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)',
                  padding: '0.3rem 0.7rem', fontSize: '0.75rem',
                }} onClick={() => setActiveView(v)}>
                  {v === 'daily' ? 'Journalier' : v === 'monthly' ? 'Mensuel' : 'Annuel'}
                </button>
              ))}
            </div>
            <button className="adbi-chart-action-btn" onClick={() => toggleFullscreen('revenue')} title="Plein écran">
              <i className={`fas ${fullscreen === 'revenue' ? 'fa-compress' : 'fa-expand'}`} />
            </button>
          </div>
        </div>
        {renderBarChart(data, labelKey, valueKey, '#10B981')}
      </div>

      <div className={`adbi-chart-card ${fullscreen === 'commissions2' ? 'full' : ''}`}>
        <div className="adbi-chart-header">
          <h3><i className="fas fa-percent" style={{ color: '#10B981', marginRight: 8 }} /> Revenus vs Commissions</h3>
          <button className="adbi-chart-action-btn" onClick={() => toggleFullscreen('commissions2')} title="Plein écran">
            <i className={`fas ${fullscreen === 'commissions2' ? 'fa-compress' : 'fa-expand'}`} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Revenus</div>
            {renderBarChart(data, labelKey, 'revenue', '#8B5CF6')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Commissions</div>
            {renderBarChart(data, labelKey, 'commissions' in data[0] ? 'commissions' : 'revenue', '#10B981')}
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenueCharts;
