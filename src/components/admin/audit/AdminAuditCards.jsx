import React from 'react';
import { activeSessions, auditAlerts } from '../../../data/adminAuditData';

const AdminAuditCards = ({ loading }) => {
  const cards = [
    { label: 'Connexions simultanées', value: activeSessions.filter(s => s.status === 'active').length, icon: 'fa-users', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Tentatives suspectes', value: auditAlerts.filter(a => a.type === 'multi_login').reduce((s, a) => s + a.count, 0), icon: 'fa-people-arrows', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    { label: 'Sessions actives', value: activeSessions.filter(s => s.status === 'active').length, icon: 'fa-circle', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Blocages', value: auditAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length, icon: 'fa-ban', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
    { label: 'Alertes actives', value: auditAlerts.filter(a => a.status === 'active').length, icon: 'fa-bell', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    { label: 'Erreurs système', value: auditAlerts.filter(a => a.type === 'access_denied').length, icon: 'fa-bug', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Événements critiques', value: auditAlerts.filter(a => a.severity === 'critical').length, icon: 'fa-bolt', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    { label: 'Sessions inactives', value: activeSessions.filter(s => s.status === 'idle').length, icon: 'fa-clock', color: '#F59E0B', bg: 'rgba(251,191,36,0.12)' },
  ];

  if (loading) {
    return (
      <div className="ada-kpi-grid">
        {cards.map((_, i) => (
          <div key={i} className="ada-skeleton" style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
            <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ada-kpi-grid">
      {cards.map((c, i) => (
        <div key={i} className="ada-kpi-card">
          <div className="ada-kpi-icon" style={{ background: c.bg, color: c.color }}>
            <i className={`fas ${c.icon}`} />
          </div>
          <div className="ada-kpi-label">{c.label}</div>
          <div className="ada-kpi-value">{c.value}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminAuditCards;
