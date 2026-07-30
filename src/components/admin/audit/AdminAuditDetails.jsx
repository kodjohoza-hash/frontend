import React from 'react';
import { formatDateTime, getSeverityBadge, actionTypes } from '../../../data/adminAuditData';

const AdminAuditDetails = ({ event, onClose }) => {
  if (!event) return null;

  const sev = getSeverityBadge(event.severity);
  const actionMeta = actionTypes.find(a => a.id === event.action);

  return (
    <>
      <div className="ada-drawer-overlay" onClick={onClose} />
      <div className="ada-drawer">
        <div className="ada-drawer-header">
          <div>
            <h3><i className="fas fa-file-lines" style={{ color: '#3B82F6', marginRight: 8 }} /> Détail de l'événement</h3>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{event.details?.ref || event.id}</span>
          </div>
          <button className="ada-drawer-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        <div className="ada-drawer-body">
          <div className="ada-detail-field" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="ada-user-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>{event.user.name.charAt(0)}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600 }}>{event.user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{event.user.role}</div>
            </div>
          </div>

          <div className="ada-detail-grid">
            <div className="ada-detail-field">
              <div className="ada-detail-label">Module</div>
              <div className="ada-detail-value">{event.module}</div>
            </div>
            <div className="ada-detail-field">
              <div className="ada-detail-label">Action</div>
              <div className="ada-detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {actionMeta && <i className={`fas ${actionMeta.icon}`} style={{ color: '#3B82F6' }} />}
                {event.actionLabel}
              </div>
            </div>
            <div className="ada-detail-field">
              <div className="ada-detail-label">Date</div>
              <div className="ada-detail-value">{formatDateTime(event.datetime)}</div>
            </div>
            <div className="ada-detail-field">
              <div className="ada-detail-label">Gravité</div>
              <div className="ada-detail-value">
                <span className="ada-severity-badge" style={{ background: sev.bg, color: sev.color }}>
                  <i className={`fas ${sev.icon}`} /> {sev.label}
                </span>
              </div>
            </div>
            <div className="ada-detail-field">
              <div className="ada-detail-label">Statut</div>
              <div className="ada-detail-value">
                <span className="ada-status-badge" style={{
                  background: event.status === 'Succès' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: event.status === 'Succès' ? '#10B981' : '#EF4444',
                }}>
                  <i className={`fas ${event.status === 'Succès' ? 'fa-check' : 'fa-xmark'}`} /> {event.status}
                </span>
              </div>
            </div>
            <div className="ada-detail-field">
              <div className="ada-detail-label">Compagnie</div>
              <div className="ada-detail-value">{event.user.company || '-'}</div>
            </div>
          </div>

          <div className="ada-detail-section">
            <div className="ada-detail-section-title"><i className="fas fa-globe" style={{ color: '#3B82F6', marginRight: 6 }} /> Contexte</div>
            <div className="ada-detail-grid">
              <div className="ada-detail-field">
                <div className="ada-detail-label">Adresse IP</div>
                <div className="ada-detail-value" style={{ fontFamily: 'monospace' }}>{event.ip}</div>
              </div>
              <div className="ada-detail-field">
                <div className="ada-detail-label">Ville</div>
                <div className="ada-detail-value">{event.details?.city || 'N/A'}</div>
              </div>
              <div className="ada-detail-field">
                <div className="ada-detail-label">Pays</div>
                <div className="ada-detail-value">{event.details?.country || 'N/A'}</div>
              </div>
              <div className="ada-detail-field">
                <div className="ada-detail-label">Navigateur</div>
                <div className="ada-detail-value">{event.browser}</div>
              </div>
              <div className="ada-detail-field">
                <div className="ada-detail-label">OS</div>
                <div className="ada-detail-value">{event.os}</div>
              </div>
              <div className="ada-detail-field">
                <div className="ada-detail-label">Appareil</div>
                <div className="ada-detail-value">{event.device}</div>
              </div>
            </div>
          </div>

          <div className="ada-detail-section">
            <div className="ada-detail-section-title"><i className="fas fa-align-left" style={{ color: '#3B82F6', marginRight: 6 }} /> Description</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{event.description}</p>
          </div>

          <div className="ada-detail-section">
            <div className="ada-detail-section-title"><i className="fas fa-check-circle" style={{ color: '#10B981', marginRight: 6 }} /> Résultat</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{event.details?.result || 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAuditDetails;
