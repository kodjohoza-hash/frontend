import React, { useState } from 'react';
import { companyReportData, formatCurrency } from '../../../data/adminReportData';

const CompanyCharts = ({ filters }) => {
  const [view, setView] = useState('top');
  const [fullscreen, setFullscreen] = useState(null);

  const toggleFS = () => setFullscreen(fullscreen === 'companies' ? null : 'companies');

  const topData = companyReportData.topData || companyReportData.top10;
  const maxRevenue = Math.max(...topData.map(c => c.revenue));

  return (
    <div className={`adbi-chart-card full`}>
      <div className="adbi-chart-header">
        <h3><i className="fas fa-building" style={{ color: '#FBBF24', marginRight: 8 }} /> Compagnies</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="adbi-control-btn" style={{
            background: view === 'top' ? 'rgba(251,191,36,0.2)' : 'transparent',
            color: view === 'top' ? '#FBBF24' : 'rgba(255,255,255,0.5)',
            borderColor: view === 'top' ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)',
            padding: '0.3rem 0.7rem', fontSize: '0.75rem',
          }} onClick={() => setView('top')}>Top 10</button>
          <button className="adbi-control-btn" style={{
            background: view === 'activity' ? 'rgba(251,191,36,0.2)' : 'transparent',
            color: view === 'activity' ? '#FBBF24' : 'rgba(255,255,255,0.5)',
            borderColor: view === 'activity' ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)',
            padding: '0.3rem 0.7rem', fontSize: '0.75rem',
          }} onClick={() => setView('activity')}>Activité</button>
          <button className="adbi-chart-action-btn" onClick={toggleFS} title="Plein écran">
            <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'}`} />
          </button>
        </div>
      </div>

      {view === 'top' ? (
        <div className="adbi-hbar-list">
          {topData.map((c, i) => (
            <div key={i} className="adbi-hbar-item">
              <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, background: i < 3 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)', color: i < 3 ? '#FBBF24' : 'rgba(255,255,255,0.4)' }}>
                {i + 1}
              </div>
              <div className="adbi-hbar-label" style={{ minWidth: 150, textAlign: 'left' }}>{c.name}</div>
              <div className="adbi-hbar-track">
                <div className="adbi-hbar-fill" style={{
                  width: `${(c.revenue / maxRevenue) * 100}%`,
                  background: i === 0 ? 'linear-gradient(90deg, #FBBF24, #F59E0B)' :
                              i === 1 ? 'linear-gradient(90deg, #94A3B8, #64748B)' :
                              i === 2 ? 'linear-gradient(90deg, #FB923C, #F97316)' :
                              'linear-gradient(90deg, rgba(139,92,246,0.4), rgba(139,92,246,0.6))',
                }}>
                  {c.revenue / maxRevenue > 0.15 ? `${Math.round((c.revenue / maxRevenue) * 100)}%` : ''}
                </div>
              </div>
              <div className="adbi-hbar-value" style={{ minWidth: 100, textAlign: 'right' }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(c.revenue)}</div>
                <div style={{ fontSize: '0.7rem', color: c.growth >= 0 ? '#10B981' : '#EF4444' }}>
                  <i className={`fas ${c.growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`} /> {Math.abs(c.growth)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adbi-bar-chart">
          {companyReportData.activity.map((d, i) => {
            const maxActive = Math.max(...companyReportData.activity.map(a => a.active));
            const pct = (d.active / maxActive) * 100;
            return (
              <div key={i} className="adbi-bar-item">
                <div className="adbi-bar" style={{ height: `${Math.max(pct, 2)}%`, background: '#FBBF24' }}>
                  <span className="adbi-bar-tooltip">{d.active} actives</span>
                </div>
                <div className="adbi-bar-label">{d.month}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyCharts;
