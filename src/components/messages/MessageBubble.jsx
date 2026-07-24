import clsx from 'clsx';

const MessageBubble = ({ message, isOwn, showAvatar, contactInitials }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today - msgDate) / 86400000);

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const statusIcon = () => {
    if (!isOwn) return null;
    switch (message.status) {
      case 'sent':
        return <i className="bi bi-check msg-bubble__status" />;
      case 'delivered':
        return <i className="bi bi-check-all msg-bubble__status" />;
      case 'read':
        return <i className="bi bi-check-all msg-bubble__status msg-bubble__status--read" />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx('msg-bubble-row', isOwn && 'msg-bubble-row--own')}>
      {!isOwn && showAvatar && (
        <div className="msg-bubble-row__avatar">
          <span>{contactInitials}</span>
        </div>
      )}
      {!isOwn && !showAvatar && <div className="msg-bubble-row__avatar msg-bubble-row__avatar--spacer" />}

      <div className={clsx('msg-bubble', isOwn && 'msg-bubble--own')}>
        <p className="msg-bubble__text">{message.text}</p>
        <div className="msg-bubble__footer">
          <span className="msg-bubble__time">{formatTime(message.timestamp)}</span>
          {statusIcon()}
        </div>
      </div>
    </div>
  );
};

export const MessageDateDivider = ({ date }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((today - msgDate) / 86400000);

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="msg-date-divider">
      <span className="msg-date-divider__text">{formatDate(date)}</span>
    </div>
  );
};

export default MessageBubble;
