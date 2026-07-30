import React from 'react';

const channelStyles = {
  inapp: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  email: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  sms: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  push: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  whatsapp: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  telegram: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  webhook: { bg: 'rgba(236,72,153,0.12)', color: '#EC4899' },
};
const channelIcons = { inapp: 'fa-bell', email: 'fa-envelope', sms: 'fa-message', push: 'fa-mobile-screen', whatsapp: 'fa-whatsapp', telegram: 'fa-telegram', webhook: 'fa-code' };
const statusStyles = {
  sent: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  scheduled: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
  draft: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
  failed: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
};

const AdminNotificationHistory = ({ notifications, onView, onDelete }) => (
  <div className="adn-table-wrapper">
    <table className="adn-table">
      <thead><tr><th>Notification</th><th>Canal</th><th>Statut</th><th>Destinataires</th><th>Programmé</th><th>Actions</th></tr></thead>
      <tbody>
        {notifications.length === 0 ? (
          <tr><td colSpan={6}><div className="adn-empty"><i className="fas fa-inbox" /><p>Aucune notification</p></div></td></tr>
        ) : notifications.map((n, i) => {
          const cs = channelStyles[n.channel] || channelStyles.inapp;
          const ss = statusStyles[n.status] || statusStyles.draft;
          return (
            <tr key={n.id} style={{ animation: `adn-toast-in 0.3s ease-out ${i * 0.03}s both` }}>
              <td><div style={{ fontWeight: 500, color: '#fff', marginBottom: 2 }}>{n.title}</div><div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{n.category}</div></td>
              <td><span className="adn-channel-badge" style={{ background: cs.bg, color: cs.color }}><i className={`fas ${channelIcons[n.channel] || 'fa-bell'}`} />{n.channel}</span></td>
              <td><span className="adn-status-badge" style={{ background: ss.bg, color: ss.color }}>{n.status}</span></td>
              <td style={{ fontSize: '0.78rem' }}>{n.recipients?.toLocaleString('fr-FR') || '—'}</td>
              <td style={{ fontSize: '0.78rem' }}>{n.scheduledAt || '—'}</td>
              <td><button className="adn-table-action" onClick={() => onView?.(n)} title="Détails"><i className="fas fa-eye" /></button><button className="adn-table-action" onClick={() => onDelete?.(n.id)} title="Supprimer"><i className="fas fa-trash" /></button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
export default AdminNotificationHistory;
