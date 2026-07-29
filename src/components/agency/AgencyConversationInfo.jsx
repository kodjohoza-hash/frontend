import { useMemo } from 'react';
import clsx from 'clsx';

const sharedFiles = [
  { name: 'Facture_juillet.pdf', icon: 'bi-file-earmark-pdf', size: '2.4 Mo' },
  { name: 'Photo_bus.jpg', icon: 'bi-file-earmark-image', size: '1.8 Mo' },
  { name: 'Contrat.docx', icon: 'bi-file-earmark-word', size: '856 Ko' },
  { name: 'Horaires_mars.xlsx', icon: 'bi-file-earmark-excel', size: '124 Ko' },
  { name: 'Plan_trajet.pdf', icon: 'bi-file-earmark-pdf', size: '3.1 Mo' },
];

function formatLastActivity(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "À l'instant";
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function AgencyConversationInfo({ conversation, contact, onClose }) {
  const lastMessages = useMemo(() => {
    if (!conversation?.messages) return [];
    return conversation.messages.slice(-3);
  }, [conversation]);

  if (!conversation || !contact) return null;

  return (
    <div className="amsg-info">
      <div className="amsg-info__header">
        <button type="button" className="amsg-info__close" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, border: 'none', background: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: 16 }}>
          <i className="bi bi-x-lg" />
        </button>
        <div className={clsx('amsg-info__avatar', contact.id === 'co_002' && 'amsg-info__avatar--support')}>
          {contact.avatar ? <img src={contact.avatar} alt={contact.name} /> : <span>{contact.initials}</span>}
        </div>
        <div className="amsg-info__name">{contact.name}</div>
        <div className="amsg-info__role">{contact.role}</div>
        <span className={clsx('amsg-info__status', contact.online && 'amsg-info__status--online', !contact.online && 'amsg-info__status--offline')}>
          <i className={clsx('bi', contact.online ? 'bi-circle-fill' : 'bi-circle')} style={{ fontSize: 8 }} /> {contact.online ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>

      <div className="amsg-info__section">
        <div className="amsg-info__section-title">Contact</div>
        <div className="amsg-info__row"><i className="bi bi-telephone" /><span>{contact.phone}</span></div>
        <div className="amsg-info__row"><i className="bi bi-envelope" /><span>{contact.email}</span></div>
        {contact.company && <div className="amsg-info__row"><i className="bi bi-building" /><span>{contact.company}</span></div>}
      </div>

      <div className="amsg-info__section">
        <div className="amsg-info__section-title">Fichiers partagés</div>
        {sharedFiles.map((file, i) => (
          <div key={i} className="amsg-info__shared-file">
            <i className={clsx('bi', file.icon)} />
            <div>
              <div style={{ fontWeight: 500, fontSize: 12, color: '#111827' }}>{file.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{file.size}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="amsg-info__section">
        <div className="amsg-info__section-title">Statistiques</div>
        <div className="amsg-info__row"><i className="bi bi-chat-dots" /><span>{conversation.messages?.length || 0} messages</span></div>
        <div className="amsg-info__row"><i className="bi bi-clock" /><span>Dernière activité : {formatLastActivity(conversation.lastActivity)}</span></div>
      </div>

      {lastMessages.length > 0 && (
        <div className="amsg-info__section">
          <div className="amsg-info__section-title">Historique</div>
          {lastMessages.map((msg) => (
            <div key={msg.id} className="amsg-info__row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <span style={{ fontSize: 12, color: '#111827' }}>{msg.text.length > 60 ? msg.text.slice(0, 60) + '...' : msg.text}</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{formatTime(msg.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
