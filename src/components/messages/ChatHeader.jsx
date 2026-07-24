import clsx from 'clsx';

const ChatHeader = ({ contact, onBack }) => {
  if (!contact) return null;

  const roleLabel = contact.type === 'support'
    ? 'Support client'
    : contact.type === 'company'
      ? 'Compagnie de transport'
      : 'Agent';

  return (
    <div className="msg-chat-header">
      <button type="button" className="msg-chat-header__back" onClick={onBack}>
        <i className="bi bi-arrow-left" />
      </button>

      <div className="msg-chat-header__avatar">
        <span>{contact.initials}</span>
      </div>

      <div className="msg-chat-header__info">
        <h3 className="msg-chat-header__name">{contact.name}</h3>
        <div className="msg-chat-header__status-row">
          {contact.online ? (
            <>
              <span className="msg-chat-header__online-dot" />
              <span className="msg-chat-header__status msg-chat-header__status--online">En ligne</span>
            </>
          ) : (
            <span className="msg-chat-header__status">Hors ligne</span>
          )}
          <span className="msg-chat-header__role">{roleLabel}</span>
        </div>
      </div>

      <div className="msg-chat-header__actions">
        <button type="button" className="msg-chat-header__action-btn" title="Appel audio">
          <i className="bi bi-telephone" />
        </button>
        <button type="button" className="msg-chat-header__action-btn" title="Appel vidéo">
          <i className="bi bi-camera-video" />
        </button>
        <button type="button" className="msg-chat-header__action-btn" title="Plus d'options">
          <i className="bi bi-three-dots-vertical" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
