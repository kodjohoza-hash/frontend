import { useCallback } from 'react';
import { getContact } from '@data/messageData';

export default function AgencyMessageSearch({ searchQuery, setSearchQuery, results, onSelectResult }) {
  const handleChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const showResults = results && results.length > 0 && searchQuery.trim().length > 0;

  return (
    <div className="amsg-list__search-input-wrapper">
      <i className="bi bi-search amsg-list__search-icon" />
      <input
        type="text"
        className="amsg-list__search-input"
        placeholder="Rechercher une conversation..."
        value={searchQuery}
        onChange={handleChange}
      />
      {showResults && (
        <div className="amsg-search-results">
          {results.map((conv) => {
            const contact = getContact(conv.contactId);
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <button
                key={conv.id}
                type="button"
                className="amsg-search-result"
                onClick={() => onSelectResult(conv.id)}
              >
                <i className="bi bi-chat-dots amsg-search-result__icon" />
                <span>{contact ? contact.name : conv.contactId}</span>
                {lastMsg && <span className="amsg-card__time"> — {lastMsg.text.length > 50 ? lastMsg.text.slice(0, 50) + '...' : lastMsg.text}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
