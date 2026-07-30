import React from 'react';
import { activeSessions, formatDateTime } from '../../../data/adminAuditData';

const AdminAuditSessions = ({ loading }) => {
  if (loading) {
    return (
      <div className="ada-sessions-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="ada-skeleton" style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
            <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ada-sessions-grid">
      {activeSessions.map(s => (
        <div key={s.id} className="ada-session-card">
          <div className="ada-session-header">
            <div className="ada-session-avatar">{s.user.charAt(0)}</div>
            <div>
              <div className="ada-session-name">{s.user}</div>
              <div className="ada-session-role">{s.role}</div>
            </div>
            <span className={`ada-session-status ${s.status}`} style={{ marginLeft: 'auto' }}>
              <i className={`fas ${s.status === 'active' ? 'fa-circle' : 'fa-clock'}`} />
              {s.status === 'active' ? ' Actif' : ' Inactif'}
            </span>
          </div>
          <div className="ada-session-details">
            <div className="ada-session-detail">
              <span className="ada-session-detail-label">IP</span>
              <span className="ada-session-detail-value" style={{ fontFamily: 'monospace' }}>{s.ip}</span>
            </div>
            <div className="ada-session-detail">
              <span className="ada-session-detail-label">Appareil</span>
              <span className="ada-session-detail-value">{s.device}</span>
            </div>
            <div className="ada-session-detail">
              <span className="ada-session-detail-label">Navigateur</span>
              <span className="ada-session-detail-value">{s.browser}</span>
            </div>
            <div className="ada-session-detail">
              <span className="ada-session-detail-label">Connexion</span>
              <span className="ada-session-detail-value">{s.login}</span>
            </div>
            <div className="ada-session-detail">
              <span className="ada-session-detail-label">Dernière activité</span>
              <span className="ada-session-detail-value">{s.lastActive}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminAuditSessions;
