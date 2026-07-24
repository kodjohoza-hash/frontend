import React from 'react';
import { branchStats } from '../../data/agencyBranchData';

function formatMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M FCFA';
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export default function AgencyBranchStats() {
  const s = branchStats;

  const cards = [
    { label: 'Total agences', value: s.total, icon: 'bi-building', color: '#0B1D51', gradient: 'linear-gradient(135deg, #0B1D51 0%, #1a3a8a 100%)' },
    { label: 'Agences ouvertes', value: s.ouvert, icon: 'bi-shop', color: '#10b981', gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
    { label: 'Agences fermées', value: s.ferme, icon: 'bi-lock', color: '#6b7280', gradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)' },
    { label: 'Total agents', value: s.totalAgents, icon: 'bi-people', color: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
    { label: 'Réservations/jour', value: s.todayBookings, icon: 'bi-ticket-perforated', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' },
    { label: 'CA du jour', value: formatMoney(s.todayRevenue), icon: 'bi-cash-stack', color: '#FF6B35', gradient: 'linear-gradient(135deg, #e55a2b 0%, #FF6B35 100%)' },
  ];

  return (
    <div className="abr-stats-grid">
      {cards.map((card) => (
        <div key={card.label} className="abr-stats-card" style={{ '--card-gradient': card.gradient }}>
          <div className="abr-stats-card__icon"><i className={`bi ${card.icon}`} /></div>
          <div className="abr-stats-card__content">
            <span className="abr-stats-card__value">{card.value}</span>
            <span className="abr-stats-card__label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
