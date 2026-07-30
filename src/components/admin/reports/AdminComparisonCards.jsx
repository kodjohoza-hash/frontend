import React from 'react';
import { comparisonData, formatCurrency } from '../../../data/adminReportData';

const ComparisonCards = ({ filters, loading }) => {
  const comparisons = [
    { key: 'todayVsYesterday', title: "Aujourd'hui vs Hier", period1: "Aujourd'hui", period2: 'Hier' },
    { key: 'weekVsLastWeek', title: 'Cette semaine vs Semaine passée', period1: 'Cette semaine', period2: 'Semaine passée' },
    { key: 'monthVsLastMonth', title: 'Ce mois vs Mois précédent', period1: 'Ce mois', period2: 'Mois précédent' },
    { key: 'yearVsLastYear', title: 'Cette année vs Année précédente', period1: 'Cette année', period2: 'Année précédente' },
  ];

  if (loading) {
    return (
      <div className="adbi-comparison-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="adbi-skeleton" style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
            <div className="adbi-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="adbi-comparison-grid">
      {comparisons.map((comp) => {
        const data = comparisonData[comp.key];
        if (!data) return null;
        const metrics = [
          { label: 'Revenus', key: 'revenue', isCurrency: true },
          { label: 'Réservations', key: 'bookings' },
          { label: 'Commissions', key: 'commissions', isCurrency: true },
        ];
        return (
          <div key={comp.key} className="adbi-comparison-card">
            <div className="adbi-comparison-title">{comp.title}</div>
            <div className="adbi-comparison-metrics">
              {metrics.map(m => {
                const metric = data[m.key];
                if (!metric) return null;
                const isUp = metric.change >= 0;
                return (
                  <div key={m.key} className="adbi-comparison-metric">
                    <div className="adbi-comparison-metric-label">{m.label}</div>
                    <div className="adbi-comparison-metric-values">
                      <span className="adbi-comparison-current">
                        {m.isCurrency ? formatCurrency(metric.current) : metric.current.toLocaleString('fr-FR')}
                      </span>
                      <span className="adbi-comparison-previous">
                        {m.isCurrency ? formatCurrency(metric.previous) : metric.previous.toLocaleString('fr-FR')}
                      </span>
                      <span className={`adbi-comparison-change ${isUp ? 'up' : 'down'}`}>
                        <i className={`fas ${isUp ? 'fa-arrow-up' : 'fa-arrow-down'}`} /> {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ComparisonCards;
