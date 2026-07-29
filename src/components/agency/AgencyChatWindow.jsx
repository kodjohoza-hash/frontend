import { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { typingUsers, getContact } from '@data/messageData';
import AgencyMessageBubble from './AgencyMessageBubble';
import AgencyComposer from './AgencyComposer';

const formatDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

export default function AgencyChatWindow({ conversation, onSendMessage, onBack, showInfo, onToggleInfo }) {
  const messagesRef = useRef(null);
  const [replyTo] = useState(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  const handleSendMessage = useCallback((text) => {
    const msg = { id: `msg_temp_${Date.now()}`, senderId: 'ag_001', text, type: 'text', timestamp: new Date().toISOString(), status: 'sent', edited: false, replyTo: replyTo || null };
    if (onSendMessage) onSendMessage(msg);
  }, [replyTo, onSendMessage]);

  if (!conversation) {
    return (
      <div className="amsg-chat">
        <div className="amsg-empty">
          <i className="bi bi-chat-dots amsg-empty__icon" />
          <h3 className="amsg-empty__title">Sélectionnez une conversation</h3>
          <p className="amsg-empty__desc">Choisissez une conversation dans la liste pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  const contact = getContact(conversation.contactId);
  const isTyping = typingUsers[conversation.id];

  let lastDate = null;
  const renderedItems = [];
  (conversation.messages || []).forEach((msg) => {
    const msgDate = new Date(msg.timestamp).toDateString();
    if (msgDate !== lastDate) {
      renderedItems.push({ type: 'date', date: msg.timestamp });
      lastDate = msgDate;
    }
    renderedItems.push({ type: 'message', message: msg });
  });

  return (
    <div className="amsg-chat">
      <div className="amsg-chat__header">
        <div className="amsg-chat__header-left">
          <button type="button" className="amsg-mobile-back" onClick={onBack}><i className="bi bi-arrow-left" /></button>
          <div className={clsx('amsg-chat__header-avatar', contact?.online && 'amsg-chat__header-avatar--online')}>
            {contact ? contact.initials : '?'}
          </div>
          <div className="amsg-chat__header-info">
            <div className="amsg-chat__header-name">{contact ? contact.name : 'Inconnu'}</div>
            <div className={clsx('amsg-chat__header-status', !contact?.online && 'amsg-chat__header-status--offline')}>
              {contact?.online ? 'En ligne' : 'Hors ligne'}
            </div>
          </div>
        </div>
        <div className="amsg-chat__header-right">
          <button type="button" className="amsg-chat__header-btn" title="Appel"><i className="bi bi-telephone" /></button>
          <button type="button" className="amsg-chat__header-btn" title="Vidéo"><i className="bi bi-camera-video" /></button>
          <button type="button" className={clsx('amsg-chat__header-btn', { 'amsg-chat__header-btn--active': showInfo })} onClick={onToggleInfo} title="Informations"><i className="bi bi-info-circle" /></button>
          <button type="button" className="amsg-chat__header-btn" title="Plus"><i className="bi bi-three-dots-vertical" /></button>
        </div>
      </div>

      <div className="amsg-messages" ref={messagesRef}>
        {renderedItems.map((item, idx) => {
          if (item.type === 'date') {
            return <div key={`date_${idx}`} className="amsg-messages__date-label"><span>{formatDate(item.date)}</span></div>;
          }
          return <AgencyMessageBubble key={item.message.id} message={item.message} isSent={item.message.senderId === 'ag_001'} sender={contact} />;
        })}
        {isTyping && (
          <div className="amsg-typing">
            <div className="amsg-typing__dots">
              <span className="amsg-typing__dot" />
              <span className="amsg-typing__dot" />
              <span className="amsg-typing__dot" />
            </div>
          </div>
        )}
      </div>

      <AgencyComposer onSendMessage={handleSendMessage} replyTo={replyTo} onCancelReply={() => {}} draft={null} />
    </div>
  );
}
