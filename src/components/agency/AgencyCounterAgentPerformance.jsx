import React from 'react';

const metrics = [
  { label: 'Revenu total', key: 'totalRevenue', format: (v) => (v || 0).toLocaleString('fr-FR') + ' FCFA', color: '#FF6B35', icon: 'bi-cash-stack' },
  { label: 'Ventes totales', key: 'totalSales', format: (v) => v || 0, color: '#10b981', icon: 'bi-graph-up' },
  { label: 'Billets imprimés', key: 'ticketsPrinted', format: (v) => v || 0, color: '#3b82f6', icon: 'bi-printer' },
  { label: 'Réservations', key: 'bookingsCreated', format: (v) => v || 0, color: '#8b5cf6', icon: 'bi-bookmark-plus' },
  { label: 'Annulations', key: 'cancellations', format: (v) => v || 0, color: '#ef4444', icon: 'bi-x-circle' },
  { label: 'Ventes/jour moy.', key: 'avgDailySales', format: (v) => v || 0, color: '#0B1D51', icon: 'bi-calendar-check' },
];

export default function AgencyCounterAgentPerformance({ stats = {} }) {
  const maxVal = Math.max(...metrics.map((m) => stats[m.key] || 0), 1);

  return (
    <div className="add-perf">
      <h4><i className="bi bi-speedometer2" /> Tableau de bord de performance</h4>
      <div className="add-perf__grid">
        {metrics.map((m) => {
          const val = stats[m.key] || 0;
          const pct = Math.min((val / maxVal) * 100, 100);
          return (
            <div key={m.key} className="add-perf__item">
              <div className="add-perf__item-header">
                <span className="add-perf__icon" style={{ color: m.color }}><i className={`bi ${m.icon}`} /></span>
                <span className="add-perf__label">{m.label}</span>
              </div>
              <span className="add-perf__value">{m.format(val)}</span>
              <div className="add-perf__bar-track">
                <div className="add-perf__bar-fill" style={{ width: `${pct}%`, background: m.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
