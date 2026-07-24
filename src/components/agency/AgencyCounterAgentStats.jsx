import React from 'react';
import { counterAgentStats } from '../../data/agencyCounterAgentData';

export default function AgencyCounterAgentStats() {
  const stats = counterAgentStats;

  const cards = [
    { label: 'Total agents', value: stats.total, icon: 'bi-people-fill', color: '#0B1D51', gradient: 'linear-gradient(135deg, #0B1D51 0%, #1a3a8a 100%)' },
    { label: 'Agents actifs', value: stats.actif, icon: 'bi-person-check-fill', color: '#10b981', gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
    { label: 'Hors ligne', value: stats.hors_ligne, icon: 'bi-moon-fill', color: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' },
    { label: 'En service', value: stats.en_service, icon: 'bi-play-circle-fill', color: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
    { label: 'En congé', value: stats.conge, icon: 'bi-calendar-check-fill', color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' },
    { label: 'Guichets ouverts', value: stats.guichetsOuverts, icon: 'bi-shop', color: '#FF6B35', gradient: 'linear-gradient(135deg, #e55a2b 0%, #FF6B35 100%)' },
  ];

  return (
    <div className="ac-stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="ac-stats-card" style={{ '--card-gradient': card.gradient }}>
          <div className="ac-stats-card__icon">
            <i className={`bi ${card.icon}`} />
          </div>
          <div className="ac-stats-card__content">
            <span className="ac-stats-card__value">{card.value}</span>
            <span className="ac-stats-card__label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
