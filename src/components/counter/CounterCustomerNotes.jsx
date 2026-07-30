import { useState } from 'react';
import clsx from 'clsx';
import { formatDate } from '@data/counterCustomerData';

const CounterCustomerNotes = ({ customer, onAddNote }) => {
  const [text, setText] = useState('');

  const notes = customer?.notes || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddNote?.({ text: text.trim(), customerId: customer.id });
    setText('');
  };

  return (
    <div className="acc-notes">
      {notes.length === 0 ? (
        <div className="acc-notes-empty">
          <i className="bi bi-chat-square-text" />
          <span>Aucune note pour ce client.</span>
        </div>
      ) : (
        <div className="acc-notes-list">
          {notes.map((note, i) => (
            <div key={note.id || i} className="acc-note-item" style={{ '--i': i }}>
              <div className="acc-note-avatar">
                {(note.author || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="acc-note-body">
                <div className="acc-note-header">
                  <span className="acc-note-author">{note.author || 'Agent'}</span>
                  <span className="acc-note-date">
                    <i className="bi bi-clock" /> {formatDate(note.date)}
                  </span>
                </div>
                <div className="acc-note-text">{note.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="acc-notes-form" onSubmit={handleSubmit}>
        <div className="acc-notes-input-wrap">
          <input
            type="text"
            className="acc-notes-input"
            placeholder="Ajouter une note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="acc-notes-submit"
            disabled={!text.trim()}
          >
            <i className="bi bi-send" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CounterCustomerNotes;
