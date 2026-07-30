import { memo } from 'react';
import clsx from 'clsx';

const STATUS_DOT = {
  online: '#10B981',
  offline: '#9CA3AF',
  busy: '#EF4444',
};

const CounterConversationCard = memo(({ conversation, isActive, onSelect }) => {
  const {
    id,
    name,
    role,
    avatar,
    status = 'offline',
    lastMessage,
    lastMessageTime,
    unread = 0,
    important,
  } = conversation;

  const initials = (name || '')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const preview =
    lastMessage?.length > 60 ? lastMessage.slice(0, 60) + '...' : lastMessage;

  return (
    <button
      type="button"
      className={clsx('acm-conv-card', isActive && 'acm-conv-card--active')}
      onClick={() => onSelect?.(id)}
    >
      <div className="acm-conv-card__avatar">
        <span className="acm-conv-card__initials">{initials}</span>
        <span
          className="acm-conv-card__dot"
          style={{ backgroundColor: STATUS_DOT[status] || STATUS_DOT.offline }}
        />
      </div>
      <div className="acm-conv-card__body">
        <div className="acm-conv-card__top">
          <span className="acm-conv-card__name">{name}</span>
          <span className="acm-conv-card__time">{lastMessageTime}</span>
        </div>
        <span className="acm-conv-card__role">{role}</span>
        <div className="acm-conv-card__preview">{preview}</div>
      </div>
      <div className="acm-conv-card__right">
        {important && <i className="bi bi-star-fill acm-conv-card__star" />}
        {unread > 0 && (
          <span className="acm-conv-card__badge">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </div>
    </button>
  );
});

CounterConversationCard.displayName = 'CounterConversationCard';

export default CounterConversationCard;
