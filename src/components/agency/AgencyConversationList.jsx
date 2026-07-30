import { useState, useMemo, useCallback, useEffect } from 'react';
import { searchConversations, getContact } from '@data/messageData';
import AgencyMessageSearch from '@components/agency/AgencyMessageSearch';
import AgencyConversationCard from '@components/agency/AgencyConversationCard';
import AgencyMessageSkeleton from '@components/agency/AgencyMessageSkeleton';

export default function AgencyConversationList({ conversations, activeConversationId, onSelectConversation, loading, pinnedConversations, searchQuery: externalSearch, onSearchChange }) {
  const [internalSearch, setInternalSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchQuery = onSearchChange !== undefined ? externalSearch : internalSearch;
  const setSearchQuery = onSearchChange || setInternalSearch;

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const results = searchConversations(query);
    setSearchResults(results);
  }, [setSearchQuery]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
    } else {
      const results = searchConversations(searchQuery);
      setSearchResults(results);
    }
  }, [searchQuery]);

  const handleSelectResult = useCallback((conversationId) => {
    setSearchQuery('');
    setSearchResults([]);
    onSelectConversation(conversationId);
  }, [setSearchQuery, onSelectConversation]);

  const displayConversations = useMemo(() => {
    if (searchQuery.trim().length > 0) return searchResults;
    return conversations;
  }, [conversations, searchResults, searchQuery]);

  const pinned = useMemo(() => {
    if (searchQuery.trim().length > 0) return [];
    return pinnedConversations || [];
  }, [pinnedConversations, searchQuery]);

  if (loading) {
    return (
      <div className="amsg-list__content">
        <div className="amsg-list__search">
          <AgencyMessageSearch
            onSearch={() => {}}
            searchQuery=""
            setSearchQuery={() => {}}
            results={[]}
            onSelectResult={() => {}}
            isSearching={false}
          />
        </div>
        <div className="amsg-list__items">
          <AgencyMessageSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="amsg-list__content">
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
        {pinned.length > 0 && (
          <div className="amsg-list__section">
            <div className="amsg-list__section-title">
              <i className="bi bi-pin-fill" /> Épinglés
            </div>
            {pinned.map((conv) => (
              <AgencyConversationCard
                key={conv.id}
                conversation={conv}
                contact={getContact(conv.contactId)}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))}
            <div className="amsg-list__divider" />
          </div>
        )}

        {displayConversations.length === 0 ? (
          <div className="amsg-list__empty">
            <div className="amsg-list__empty-icon"><i className="bi bi-chat-dots" /></div>
            <span className="amsg-list__empty-text">
              {searchQuery ? 'Aucun résultat pour cette recherche' : 'Aucune conversation'}
            </span>
            {searchQuery && (
              <button className="amsg-list__empty-reset" onClick={() => setSearchQuery('')}>
                <i className="bi bi-x" /> Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <>
            {pinned.length > 0 && <div className="amsg-list__section-label">Toutes les conversations</div>}
            {displayConversations.map((conv) => (
              <AgencyConversationCard
                key={conv.id}
                conversation={conv}
                contact={getContact(conv.contactId)}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
