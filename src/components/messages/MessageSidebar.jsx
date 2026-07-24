import { useState, useMemo } from 'react';
import ConversationItem from './ConversationItem';

const MessageSidebar = ({ conversations, contacts, activeId, onSelect }) => {
  const [search, setSearch] = useState('');

  const contactMap = useMemo(() => {
    const map = {};
    contacts.forEach((c) => { map[c.id] = c; });
    return map;
  }, [contacts]);

  const sorted = useMemo(() => {
    const filtered = conversations.filter((conv) => {
      if (!search.trim()) return true;
      const contact = contactMap[conv.contactId];
      const q = search.toLowerCase();
      return (
        contact?.name.toLowerCase().includes(q) ||
        conv.lastMessage.toLowerCase().includes(q)
      );
    });
    return [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
  }, [conversations, search, contactMap]);

  return (
    <div className="msg-sidebar">
      <div className="msg-sidebar__header">
        <h2 className="msg-sidebar__title">Messagerie</h2>
        <span className="msg-sidebar__count">
          {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        </span>
      </div>

      <div className="msg-sidebar__search">
        <i className="bi bi-search msg-sidebar__search-icon" />
        <input
          type="text"
          className="msg-sidebar__search-input"
          placeholder="Rechercher une conversation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="msg-sidebar__search-clear"
            onClick={() => setSearch('')}
          >
            <i className="bi bi-x-lg" />
          </button>
        )}
      </div>

      <div className="msg-sidebar__list">
        {sorted.length === 0 && (
          <div className="msg-sidebar__empty">
            <i className="bi bi-chat-left-dots" />
            <span>Aucune conversation trouvée</span>
          </div>
        )}
        {sorted.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            contact={contactMap[conv.contactId]}
            isActive={activeId === conv.id}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar;
