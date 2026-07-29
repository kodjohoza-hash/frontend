import { useState, useMemo, useCallback } from 'react';
import { searchConversations, getContact } from '@data/messageData';
import AgencyMessageSearch from '@components/agency/AgencyMessageSearch';
import AgencyConversationCard from '@components/agency/AgencyConversationCard';
import AgencyMessageSkeleton from '@components/agency/AgencyMessageSkeleton';

export default function AgencyConversationList({ conversations, activeConversationId, onSelectConversation, loading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = useCallback((query) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const results = searchConversations(query);
    setSearchResults(results);
  }, []);

  const handleSelectResult = useCallback((conversationId) => {
    setSearchQuery('');
    setSearchResults([]);
    onSelectConversation(conversationId);
  }, [onSelectConversation]);

  const displayConversations = useMemo(() => {
    if (searchQuery.trim().length > 0) return searchResults;
    return conversations;
  }, [conversations, searchResults, searchQuery]);

  if (loading) {
    return (
      <div className="amsg-list">
        <div className="amsg-list__search">
          <AgencyMessageSearch
            onSearch={handleSearch}
            searchQuery=""
            setSearchQuery={() => {}}
            results={[]}
            onSelectResult={() => {}}
            isSearching={false}
          />
        </div>
        <div className="amsg-list__items">
          <AgencyMessageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="amsg-list">
      <div className="amsg-list__search">
        <AgencyMessageSearch
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          results={searchResults}
          onSelectResult={handleSelectResult}
          isSearching={false}
        />
      </div>
      <div className="amsg-list__items">
        {displayConversations.length === 0 ? (
          <div className="amsg-list__empty">
            <i className="bi bi-chat-dots amsg-list__empty-icon" />
            <span className="amsg-list__empty-text">Aucune conversation</span>
          </div>
        ) : (
          displayConversations.map((conv) => (
            <AgencyConversationCard
              key={conv.id}
              conversation={conv}
              contact={getContact(conv.contactId)}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
