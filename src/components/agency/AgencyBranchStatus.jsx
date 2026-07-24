import React from 'react';

const statusConfig = {
  ouvert: { label: 'Ouvert', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: 'bi-check-circle-fill' },
  ferme: { label: 'Fermé', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: 'bi-x-circle-fill' },
  maintenance: { label: 'Maintenance', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: 'bi-wrench' },
  temporairement_ferme: { label: 'Temp. fermé', color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: 'bi-pause-circle-fill' },
  en_construction: { label: 'En construction', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: 'bi-hammer' },
};

export default function AgencyBranchStatus({ status, size = 'sm' }) {
  const config = statusConfig[status] || statusConfig.ouvert;
  return (
    <span
      className={`abr-status-badge abr-status-badge--${size}`}
      style={{ '--abr-status-color': config.color, '--abr-status-bg': config.bg }}
    >
      <i className={`bi ${config.icon}`} />
      <span>{config.label}</span>
    </span>
  );
}
