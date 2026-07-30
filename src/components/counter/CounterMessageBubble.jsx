import { useState } from 'react';
import clsx from 'clsx';
import { formatTime } from '@data/counterMessageData';

const STATUS_ICON = {
  sent: 'bi-check',
  delivered: 'bi-check-all',
  read: 'bi-check-all text-primary',
};

const REACTIONS_LIST = ['👍', '❤️', '😄', '😮', '😢', '🙏'];

const CounterMessageBubble = ({ message, isOutgoing, onAction, showInfo }) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);

  const handleReaction = (emoji) => {
    const idx = reactions.findIndex((r) => r.emoji === emoji);
    if (idx >= 0) {
      const updated = [...reactions];
      if (updated[idx].count > 1) {
        updated[idx] = { ...updated[idx], count: updated[idx].count - 1 };
      } else {
        updated.splice(idx, 1);
      }
      setReactions(updated);
    } else {
      setReactions([...reactions, { emoji, count: 1 }]);
    }
    setShowReactionPicker(false);
  };

  if (message.deleted) {
    return (
      <div className={clsx('acm-msg', isOutgoing && 'acm-msg--outgoing')}>
        <div className="acm-msg__deleted">
          <i className="bi bi-trash3" />
          Message supprimé
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx('acm-msg', isOutgoing && 'acm-msg--outgoing')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowReactionPicker(false); }}
    >
      {message.pinned && (
        <div className="acm-msg__pinned">
          <i className="bi bi-pin-angle-fill" />
          Épinglé
        </div>
      )}

      {message.replyTo && (
        <div className="acm-msg__reply">
          <div className="acm-msg__reply-bar" />
          <div className="acm-msg__reply-content">
            <span className="acm-msg__reply-sender">{message.replyTo.senderName}</span>
            <span className="acm-msg__reply-text">
              {message.replyTo.text?.length > 50
                ? message.replyTo.text.slice(0, 50) + '...'
                : message.replyTo.text}
            </span>
          </div>
        </div>
      )}

      <div className={clsx('acm-msg__bubble', isOutgoing ? 'acm-msg__bubble--out' : 'acm-msg__bubble--in')}>
        <div className="acm-msg__text">{message.text}</div>
        <div className="acm-msg__meta">
          {message.isEdited && <span className="acm-msg__edited">Modifié</span>}
          <span className="acm-msg__time">{formatTime(message.timestamp)}</span>
          {isOutgoing && message.status && (
            <i className={clsx('bi acm-msg__status', STATUS_ICON[message.status] || 'bi-check')} />
          )}
        </div>
      </div>

      {reactions.length > 0 && (
        <div className="acm-msg__reactions">
          {reactions.map((r) => (
            <span key={r.emoji} className="acm-msg__reaction" onClick={() => handleReaction(r.emoji)}>
              {r.emoji} {r.count > 1 && <span className="acm-msg__reaction-count">{r.count}</span>}
            </span>
          ))}
          <button
            type="button"
            className="acm-msg__reaction-add"
            onClick={() => setShowReactionPicker((s) => !s)}
          >
            <i className="bi bi-emoji-smile" />
          </button>
          {showReactionPicker && (
            <div className="acm-msg__reaction-picker">
              {REACTIONS_LIST.map((emoji) => (
                <button key={emoji} type="button" className="acm-msg__reaction-option" onClick={() => handleReaction(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showActions && (
        <div className="acm-msg__actions">
          <button type="button" className="acm-msg__action" onClick={() => onAction?.('reply')} title="Répondre">
            <i className="bi bi-reply" />
          </button>
          <button type="button" className="acm-msg__action" onClick={() => onAction?.('copy')} title="Copier">
            <i className="bi bi-clipboard" />
          </button>
          <button type="button" className="acm-msg__action" onClick={() => onAction?.('pin')} title="Épingler">
            <i className="bi bi-pin-angle" />
          </button>
          <button type="button" className="acm-msg__action acm-msg__action--danger" onClick={() => onAction?.('delete')} title="Supprimer">
            <i className="bi bi-trash3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CounterMessageBubble;
