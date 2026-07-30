import { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import CounterMessageBubble from '@components/counter/CounterMessageBubble';
import CounterComposer from '@components/counter/CounterComposer';
import CounterConversationInfo from '@components/counter/CounterConversationInfo';

const STATUS_LABEL = {
  online: 'En ligne',
  offline: 'Hors ligne',
  busy: 'Occupé',
};

const CounterChatWindow = ({ conversation, currentUserId, onSendMessage, onMessageAction, hideHeader, hideInfo }) => {
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef(null);

  const messages = conversation?.messages || [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  if (!conversation) {
    return (
      <div className="acm-chat">
        <div className="acm-chat__empty">
          <i className="bi bi-chat-square-dots acm-chat__empty-icon" />
          <p className="acm-chat__empty-text">Sélectionnez une conversation</p>
          <span className="acm-chat__empty-sub">
            Choisissez une conversation dans la liste pour commencer à discuter
          </span>
        </div>
      </div>
    );
  }

  const { id: convId, name, status = 'offline', participant } = conversation;
  const initials = (participant?.name || name || '')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="acm-chat">
      {!hideHeader && (
        <div className="acm-chat__header">
          <div className="acm-chat__header-left">
            <div className="acm-chat__header-avatar">{initials}</div>
            <div className="acm-chat__header-info">
              <span className="acm-chat__header-name">{participant?.name || name}</span>
              <span className="acm-chat__header-status">
                <span
                  className={clsx('acm-chat__header-dot', `acm-chat__header-dot--${status}`)}
                />
                {STATUS_LABEL[status] || 'Hors ligne'}
              </span>
            </div>
          </div>
          <div className="acm-chat__header-actions">
            <button type="button" className="acm-chat__action-btn" title="Appeler">
              <i className="bi bi-telephone" />
            </button>
            <button type="button" className="acm-chat__action-btn" title="Vidéo">
              <i className="bi bi-camera-video" />
            </button>
            <button
              type="button"
              className={clsx('acm-chat__action-btn', showInfo && 'acm-chat__action-btn--active')}
              onClick={() => setShowInfo((s) => !s)}
              title="Informations"
            >
              <i className="bi bi-info-circle" />
            </button>
          </div>
        </div>
      )}
      <div className="acm-chat__messages">
        {messages.map((msg) => (
          <CounterMessageBubble
            key={msg.id}
            message={msg}
            isOutgoing={msg.senderId === currentUserId}
            onAction={(action) => onMessageAction?.(convId, msg.id, action)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <CounterComposer
        onSend={(text, attachments) => onSendMessage?.(convId, text, attachments)}
        disabled={false}
      />
      {!hideInfo && showInfo && (
        <CounterConversationInfo
          conversation={conversation}
          onClose={() => setShowInfo(false)}
        />
      )}
    </div>
  );
};

export default CounterChatWindow;
