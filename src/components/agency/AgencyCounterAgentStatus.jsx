import React from 'react';

const statusConfig = {
  actif: { label: 'Actif', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: 'bi-check-circle-fill' },
  hors_ligne: { label: 'Hors ligne', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: 'bi-moon-fill' },
  en_service: { label: 'En service', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: 'bi-play-circle-fill' },
  conge: { label: 'En congé', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'bi-calendar-check' },
  suspendu: { label: 'Suspendu', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: 'bi-shield-x' },
  desactive: { label: 'Désactivé', color: '#dc2626', bg: 'rgba(220,38,38,0.1)', icon: 'bi-person-x' },
};

export default function AgencyCounterAgentStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.actif;
  return (
    <span
      className={`ac-status-badge ac-status-badge--${size}`}
      style={{ '--ac-status-color': config.color, '--ac-status-bg': config.bg }}
    >
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
