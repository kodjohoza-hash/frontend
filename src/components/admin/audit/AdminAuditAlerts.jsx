import React from 'react';
import { auditAlerts, getSeverityBadge, formatDateTime } from '../../../data/adminAuditData';

const AdminAuditAlerts = ({ loading, setToast }) => {
  if (loading) {
    return (
      <div className="ada-alerts-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="ada-skeleton" style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
            <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  const handleResolve = (id) => {
    if (setToast) setToast({ show: true, type: 'success', message: 'Alerte résolue (simulation)' });
  };

  return (
    <div className="ada-alerts-grid">
      {auditAlerts.map(alert => {
        const sev = getSeverityBadge(alert.severity);
        return (
          <div key={alert.id} className="ada-alert-card">
            <div className="ada-alert-header">
              <div className="ada-alert-icon" style={{ background: sev.bg, color: sev.color }}>
                <i className={`fas ${alert.type === 'multi_login' ? 'fa-people-arrows' : alert.type === 'access_denied' ? 'fa-ban' : alert.type === 'mass_delete' ? 'fa-trash' : alert.type === 'role_change' ? 'fa-user-tag' : alert.type === 'unusual_validation' ? 'fa-clock' : alert.type === 'new_country' ? 'fa-globe' : 'fa-moon'}`} />
              </div>
              <div className="ada-alert-info">
                <div className="ada-alert-label">{alert.label}</div>
                <div className="ada-alert-user">{alert.user}</div>
              </div>
              <span className="ada-severity-badge" style={{ background: sev.bg, color: sev.color, fontSize: '0.65rem' }}>
                {sev.label}
              </span>
            </div>
            <div className="ada-alert-desc">{alert.description}</div>
            <div className="ada-alert-footer">
              <div className="ada-alert-time">
                <i className="fas fa-clock" style={{ marginRight: 4 }} />
                {alert.time}
                <span style={{ marginLeft: 8 }}>
                  <i className="fas fa-exclamation-triangle" style={{ marginRight: 4 }} />
                  {alert.count} tentatives
                </span>
              </div>
              <span className={`ada-alert-status ${alert.status}`}>
                {alert.status === 'active' ? 'Active' : 'Résolue'}
              </span>
            </div>
            {alert.status === 'active' && (
              <div style={{ marginTop: 10, textAlign: 'right' }}>
                <button className="ada-control-btn" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => handleResolve(alert.id)}>
                  <i className="fas fa-check" /> Résoudre
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminAuditAlerts;
