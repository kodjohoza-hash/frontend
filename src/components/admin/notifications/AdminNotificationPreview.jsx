import React from 'react';

const AdminNotificationPreview = ({ notification, onClose }) => {
  if (!notification) return <div className="adn-empty"><i className="fas fa-eye-slash" /><p>Sélectionnez une notification pour voir l'aperçu</p></div>;
  return (
    <div className="adn-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div className="adn-preview-header">
          <div className="adn-preview-avatar" style={{ background: `linear-gradient(135deg, #8B5CF6, #6D28D9)` }}><i className="fas fa-bell" /></div>
          <div><div className="adn-preview-title">{notification.title}</div><div className="adn-preview-time">{notification.category} · {notification.channel}</div></div>
        </div>
        {onClose && <button className="adn-table-action" onClick={onClose}><i className="fas fa-times" /></button>}
      </div>
      <div className="adn-preview-content">{notification.body || 'Contenu non disponible'}</div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="adn-status-badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}><i className="fas fa-users" /> {notification.recipients?.toLocaleString('fr-FR') || '—'} destinataires</span>
        {notification.scheduledAt && <span className="adn-status-badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}><i className="fas fa-clock" /> {notification.scheduledAt}</span>}
      </div>
    </div>
  );
};
export default AdminNotificationPreview;
