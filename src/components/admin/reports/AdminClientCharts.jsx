import React from 'react';
import { clientReportData } from '../../../data/adminReportData';

const ClientCharts = ({ filters }) => {
  const { total, active, inactive, loyal, newThisMonth, byStatus } = clientReportData;
  const total_ = byStatus.reduce((s, st) => s + st.value, 0);

  const conicGradient = byStatus.map((s, i) => {
    const pct = (s.value / total_) * 100;
    const offset = byStatus.slice(0, i).reduce((sum, st) => sum + (st.value / total_) * 100, 0);
    return `${s.color} ${offset}% ${offset + pct}%`;
  }).join(', ');

  return (
    <>
      <div className="adbi-chart-card">
        <div className="adbi-chart-header">
          <h3><i className="fas fa-users" style={{ color: '#3B82F6', marginRight: 8 }} /> Clients</h3>
        </div>
        <div className="adbi-donut-container">
          <div className="adbi-donut" style={{ background: `conic-gradient(${conicGradient})` }}>
            <div className="adbi-donut-center">
              <span>{total.toLocaleString('fr-FR')}</span>
              <small>Total</small>
            </div>
          </div>
          <div className="adbi-donut-legend">
            {byStatus.map((s, i) => (
              <div key={i} className="adbi-donut-legend-item">
                <div className="adbi-donut-legend-dot" style={{ background: s.color }} />
                <span>{s.label}</span>
                <strong>{s.value.toLocaleString('fr-FR')}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adbi-chart-card">
        <div className="adbi-chart-header">
          <h3><i className="fas fa-user-plus" style={{ color: '#10B981', marginRight: 8 }} /> Nouveaux clients</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981' }}>
            {newThisMonth.toLocaleString('fr-FR')}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Ce mois
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Actifs', value: active, color: '#10B981' },
            { label: 'Fidèles', value: loyal, color: '#8B5CF6' },
            { label: 'Inactifs', value: inactive, color: '#94A3B8' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: item.color }}>{item.value.toLocaleString('fr-FR')}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientCharts;
