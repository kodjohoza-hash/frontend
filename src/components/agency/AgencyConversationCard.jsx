import { useMemo } from 'react';
import clsx from 'clsx';

const avatarColors = ['#8b5cf6', '#22c55e', '#06b6d4', '#f59e0b', '#ec4899', '#FF6B35', '#64748b', '#ef4444', '#14b8a6', '#d946ef', '#6366f1', '#84cc16', '#0ea5e9', '#a855f7', '#f97316'];

const getAvatarColor = (id) => {
  const num = id.split('_')[1] || 1;
  return avatarColors[parseInt(num, 10) % avatarColors.length];
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export default function AgencyConversationCard({ conversation, isActive, onClick, contact }) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const hasUnread = conversation.unread > 0;

  const statusMod = useMemo(() => {
    if (!contact) return '';
    if (contact.online) return '--online';
    return '--offline';
  }, [contact]);

  return (
    <button
      type="button"
      className={clsx('amsg-card', {
        'amsg-card--active': isActive,
        'amsg-card--unread': hasUnread,
      })}
      onClick={onClick}
    >
      <div className={clsx('amsg-card__avatar', `amsg-card__avatar${statusMod}`)}>
        {contact && <span>{contact.initials}</span>}
      </div>
      <div className="amsg-card__content">
        <div className="amsg-card__top">
          <span className={clsx('amsg-card__name', { 'amsg-card__name--unread': hasUnread })}>
            {contact ? contact.name : 'Inconnu'}
          </span>
          <span className="amsg-card__time">{formatDate(conversation.lastActivity)} {formatTime(conversation.lastActivity)}</span>
        </div>
        <div className="amsg-card__bottom">
          <span className={clsx('amsg-card__message', { 'amsg-card__message--unread': hasUnread })}>
            {lastMessage ? (lastMessage.text.length > 80 ? lastMessage.text.slice(0, 80) + '...' : lastMessage.text) : 'Aucun message'}
          </span>
          {hasUnread && <span className="amsg-card__unread-badge">{conversation.unread > 99 ? '99+' : conversation.unread}</span>}
          {conversation.pinned && <i className="bi bi-pin-fill amsg-card__pin" />}
        </div>
      </div>
    </button>
  );
}
