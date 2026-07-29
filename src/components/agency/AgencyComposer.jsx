import { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { quickReplies } from '@data/messageData';

export default function AgencyComposer({ onSendMessage, onStartTyping, replyTo, onCancelReply, draft }) {
  const [text, setText] = useState(draft || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (draft && !text) setText(draft);
  }, [draft]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [text]);

  const handleChange = useCallback((e) => {
    setText(e.target.value);
    if (onStartTyping) onStartTyping();
  }, [onStartTyping]);

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    if (onSendMessage) onSendMessage(text.trim());
    setText('');
  }, [text, onSendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="amsg-composer">
      {replyTo && (
        <div className="amsg-composer__reply-preview">
          <i className="bi bi-reply-fill" />
          <span>Répondre à {replyTo.senderName}: {replyTo.text}</span>
          <button type="button" className="amsg-composer__reply-close" onClick={onCancelReply}><i className="bi bi-x" /></button>
        </div>
      )}
      {draft && <div className="amsg-composer__draft-indicator"><i className="bi bi-pencil" /> Brouillon enregistré</div>}
      <div className="amsg-composer__actions">
        <button type="button" className="amsg-composer__action-btn" title="Émoji"><i className="bi bi-emoji-smile" /></button>
        <button type="button" className="amsg-composer__action-btn" title="Joindre un fichier"><i className="bi bi-paperclip" /></button>
        <button type="button" className="amsg-composer__action-btn" title="Image"><i className="bi bi-image" /></button>
        <button type="button" className="amsg-composer__action-btn" title="GIF"><i className="bi bi-camera-reels" /></button>
      </div>
      <div className="amsg-composer__input-wrapper">
        <textarea
          ref={textareaRef}
          className="amsg-composer__input"
          placeholder="Écrivez votre message..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button type="button" className="amsg-composer__send-btn" onClick={handleSend} disabled={!text.trim()}>
          <i className="bi bi-send-fill" />
        </button>
      </div>
      <div className="amsg-quick-reply">
        {quickReplies.map((qr) => (
          <button key={qr.id} type="button" className="amsg-quick-reply__btn" onClick={() => { setText(qr.text); textareaRef.current?.focus(); }}>{qr.text}</button>
        ))}
      </div>
    </div>
  );
}
