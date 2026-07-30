import React, { useState } from 'react';
import { commissionReportData, formatCurrency, revenueData } from '../../../data/adminReportData';

const CommissionCharts = ({ filters }) => {
  const [view, setView] = useState('company');
  const [fullscreen, setFullscreen] = useState(null);

  const toggleFS = () => setFullscreen(fullscreen === 'commissions' ? null : 'commissions');

  return (
    <div className={`adbi-chart-card full`}>
      <div className="adbi-chart-header">
        <h3><i className="fas fa-percent" style={{ color: '#10B981', marginRight: 8 }} /> Commissions</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="adbi-control-btn" style={{
            background: view === 'company' ? 'rgba(16,185,129,0.2)' : 'transparent',
            color: view === 'company' ? '#10B981' : 'rgba(255,255,255,0.5)',
            borderColor: view === 'company' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
            padding: '0.3rem 0.7rem', fontSize: '0.75rem',
          }} onClick={() => setView('company')}>Par compagnie</button>
          <button className="adbi-control-btn" style={{
            background: view === 'month' ? 'rgba(16,185,129,0.2)' : 'transparent',
            color: view === 'month' ? '#10B981' : 'rgba(255,255,255,0.5)',
            borderColor: view === 'month' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
            padding: '0.3rem 0.7rem', fontSize: '0.75rem',
          }} onClick={() => setView('month')}>Par mois</button>
          <button className="adbi-chart-action-btn" onClick={toggleFS} title="Plein écran">
            <i className={`fas ${fullscreen ? 'fa-compress' : 'fa-expand'}`} />
          </button>
        </div>
      </div>

      {view === 'company' ? (
        <div className="adbi-hbar-list">
          {commissionReportData.byCompany.map((c, i) => (
            <div key={i} className="adbi-hbar-item">
              <div className="adbi-hbar-label" style={{ minWidth: 160, textAlign: 'left' }}>{c.company}</div>
              <div className="adbi-hbar-track">
                <div className="adbi-hbar-fill" style={{
                  width: `${c.share}%`,
                  background: `linear-gradient(90deg, #10B981, #059669)`,
                }}>
                  {c.share > 10 ? `${c.share}%` : ''}
                </div>
              </div>
              <div className="adbi-hbar-value">{formatCurrency(c.amount)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adbi-bar-chart">
          {commissionReportData.byMonth.map((m, i) => {
            const maxAmount = Math.max(...commissionReportData.byMonth.map(x => x.amount));
            const pct = (m.amount / maxAmount) * 100;
            return (
              <div key={i} className="adbi-bar-item">
                <div className="adbi-bar" style={{ height: `${Math.max(pct, 2)}%`, background: '#10B981' }}>
                  <span className="adbi-bar-tooltip">{formatCurrency(m.amount)}</span>
                </div>
                <div className="adbi-bar-label">{m.month.slice(0, 3)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommissionCharts;
