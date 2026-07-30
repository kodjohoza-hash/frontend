import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

const STORAGE_KEY_PREFIX = 'acm_draft_';

const CounterComposer = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState('');
  const [hasAttachments, setHasAttachments] = useState(false);
  const textareaRef = useRef(null);
  const typingTimer = useRef(null);

  const draftKey = STORAGE_KEY_PREFIX + 'current';

  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      setText(saved);
    }
  }, [draftKey]);

  useEffect(() => {
    localStorage.setItem(draftKey, text);
  }, [text, draftKey]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [text, autoResize]);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping?.();
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      onTyping?.();
    }, 1500);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend?.(trimmed, hasAttachments ? [] : undefined);
    setText('');
    setHasAttachments(false);
    localStorage.removeItem(draftKey);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={clsx('acm-composer', disabled && 'acm-composer--disabled')}>
      <div className="acm-composer__input-wrap">
        <button
          type="button"
          className="acm-composer__action"
          onClick={() => {}}
          title="Émojis"
          disabled={disabled}
        >
          <i className="bi bi-emoji-smile" />
        </button>
        <textarea
          ref={textareaRef}
          className="acm-composer__textarea"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Votre message..."
          rows={1}
          disabled={disabled}
        />
        <button
          type="button"
          className={clsx('acm-composer__action', hasAttachments && 'acm-composer__action--active')}
          onClick={() => setHasAttachments((a) => !a)}
          title="Joindre un fichier"
          disabled={disabled}
        >
          <i className="bi bi-paperclip" />
        </button>
      </div>
      <button
        type="button"
        className="acm-composer__send"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        title="Envoyer"
      >
        <i className="bi bi-send" />
      </button>
    </div>
  );
};

export default CounterComposer;
