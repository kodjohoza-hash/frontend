import React from 'react';
import { formatDate, formatTime, getSeverityBadge } from '../../../data/adminAuditData';

const AdminAuditTable = ({ events, loading, onSelect, selectedId }) => {
  if (loading) {
    return (
      <div className="ada-table-wrapper">
        <div className="ada-skeleton" style={{ height: 400, position: 'relative', overflow: 'hidden' }}>
          <div className="ada-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="ada-table-wrapper">
        <div className="ada-empty">
          <i className="fas fa-search" />
          <p>Aucun événement trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ada-table-wrapper">
      <table className="ada-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Utilisateur</th>
            <th>Module</th>
            <th>Action</th>
            <th>IP</th>
            <th>Statut</th>
            <th>Gravité</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => {
            const sev = getSeverityBadge(e.severity);
            return (
              <tr key={e.id} style={{ cursor: 'pointer', background: selectedId === e.id ? 'rgba(59,130,246,0.05)' : undefined }}
                onClick={() => onSelect(e)}>
                <td>{formatDate(e.datetime)}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{formatTime(e.datetime)}</td>
                <td>
                  <div className="ada-user-cell">
                    <div className="ada-user-avatar">{e.user.name.charAt(0)}</div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '0.85rem' }}>{e.user.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{e.user.role}</div>
                    </div>
                  </div>
                </td>
                <td>{e.module}</td>
                <td>
                  <div style={{ color: '#fff' }}>{e.actionLabel}</div>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{e.ip}</td>
                <td>
                  <span className="ada-status-badge" style={{
                    background: e.status === 'Succès' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: e.status === 'Succès' ? '#10B981' : '#EF4444',
                  }}>
                    <i className={`fas ${e.status === 'Succès' ? 'fa-check' : 'fa-xmark'}`} />
                    {e.status}
                  </span>
                </td>
                <td>
                  <span className="ada-severity-badge" style={{ background: sev.bg, color: sev.color }}>
                    <i className={`fas ${sev.icon}`} />
                    {sev.label}
                  </span>
                </td>
                <td>
                  <button className="ada-table-action" onClick={(ev) => { ev.stopPropagation(); onSelect(e); }}>
                    <i className="fas fa-chevron-right" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAuditTable;
