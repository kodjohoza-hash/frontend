import clsx from 'clsx';

const ConversationItem = ({ conversation, contact, isActive, onClick }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'maintenant';
    if (diffMin < 60) return `${diffMin}min`;
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD === 1) return 'Hier';
    if (diffD < 7) return `${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const roleLabel = contact.type === 'support'
    ? 'Support'
    : contact.type === 'company'
      ? 'Compagnie'
      : 'Agent';

  return (
    <button
      type="button"
      className={clsx('msg-conv', isActive && 'msg-conv--active')}
      onClick={onClick}
    >
      <div className="msg-conv__avatar-wrap">
        <div className={clsx('msg-conv__avatar', contact.online && 'msg-conv__avatar--online')}>
          <span>{contact.initials}</span>
        </div>
        {contact.online && <span className="msg-conv__online-dot" />}
      </div>

      <div className="msg-conv__body">
        <div className="msg-conv__top">
          <span className="msg-conv__name">{contact.name}</span>
          <span className="msg-conv__time">{formatTime(conversation.lastMessageTime)}</span>
        </div>
        <div className="msg-conv__bottom">
          <span className="msg-conv__preview">{conversation.lastMessage}</span>
          <div className="msg-conv__meta">
            {contact.type !== 'client' && (
              <span className="msg-conv__role">{roleLabel}</span>
            )}
            {conversation.unreadCount > 0 && (
              <span className="msg-conv__badge">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
