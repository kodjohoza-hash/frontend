import { useState, useRef } from 'react';

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="msg-input" onSubmit={handleSubmit}>
      <div className="msg-input__actions-left">
        <button type="button" className="msg-input__action-btn" title="Insérer un emoji">
          <i className="bi bi-emoji-smile" />
        </button>
        <button type="button" className="msg-input__action-btn" title="Joindre un fichier">
          <i className="bi bi-paperclip" />
        </button>
      </div>

      <div className="msg-input__field-wrap">
        <textarea
          ref={inputRef}
          className="msg-input__field"
          placeholder="Écrivez votre message..."
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        type="submit"
        className="msg-input__send"
        disabled={!text.trim()}
        title="Envoyer"
      >
        <i className="bi bi-send-fill" />
      </button>
    </form>
  );
};

export default MessageInput;
