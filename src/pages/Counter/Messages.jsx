import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CounterMessageSidebar,
  CounterConversationList,
  CounterConversationCard,
  CounterChatWindow,
  CounterMessageBubble,
  CounterComposer,
  CounterConversationInfo,
  CounterSupportPanel,
  CounterAttachmentPreview,
  CounterMessageSearch,
  CounterMessageSkeleton
} from '@components/counter/';
import {
  conversations as allConversations,
  folders,
  currentUser,
  tickets,
  filterConversations,
  sortConversations,
  formatDate,
  formatTime
} from '@data/counterMessageData';

import '@assets/styles/counter-messaging.css';

const STORAGE_DRAFT_KEY = 'acm_drafts';

function Messages() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [drafts, setDrafts] = useState({});
  const [toasts, setToasts] = useState([]);
  const [mobileView, setMobileView] = useState('list');

  const chatEndRef = useRef(null);
  const draftTimer = useRef(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(allConversations);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!conversations.length) return;
    let result = filterConversations
      ? filterConversations(conversations, activeFolder, search)
      : conversations;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
      );
    }

    result = result.filter((c) => {
      if (activeFolder === 'inbox') return !c.archived;
      if (activeFolder === 'unread') return c.unread > 0;
      if (activeFolder === 'archived') return c.archived;
      return true;
    });

    result = sortConversations
      ? sortConversations(result, sortBy)
      : result;

    setFiltered(result);
  }, [conversations, activeFolder, search, sortBy]);

  useEffect(() => {
    if (activeConversationId && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId, conversations]);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(drafts));
      } catch {
        /* storage full */
      }
    }, 500);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [drafts]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDrafts((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleFolderChange = useCallback((folder) => {
    setActiveFolder(folder);
    setActiveConversationId(null);
    setShowInfoPanel(false);
    setShowSupport(false);
  }, []);

  const handleSelectConversation = useCallback(
    (conversationId) => {
      setActiveConversationId(conversationId);
      setShowSupport(false);
      setMobileView('chat');

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unread: 0 } : c
        )
      );
    },
    []
  );

  const handleSendMessage = useCallback(
    (text, attachments) => {
      if (!activeConversationId || !text.trim()) return;

      const newMessage = {
        id: `msg-${Date.now()}`,
        content: text.trim(),
        sender: 'me',
        timestamp: new Date().toISOString(),
        status: 'sending',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
            lastMessage: text.trim(),
            lastTime: new Date().toISOString(),
          };
        })
      );

      setDrafts((prev) => {
        const next = { ...prev };
        delete next[activeConversationId];
        return next;
      });

      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeConversationId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'sent' } : m
              ),
            };
          })
        );
      }, 800);

      addToast('Message envoyé', 'success');
    },
    [activeConversationId, addToast]
  );

  const handleMessageAction = useCallback(
    (action, messageId, conversationId) => {
      const cId = conversationId || activeConversationId;
      if (!cId) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== cId) return c;
          const updatedMessages = (c.messages || []).map((m) => {
            if (m.id !== messageId) return m;
            switch (action) {
              case 'delete':
                return { ...m, deleted: true, content: 'Message supprimé' };
              case 'pin':
                return { ...m, pinned: !m.pinned };
              case 'reply':
                return { ...m, replying: true };
              default:
                return m;
            }
          });
          return { ...c, messages: updatedMessages };
        })
      );

      const labels = {
        delete: 'Message supprimé',
        pin: 'Message épinglé',
        copy: 'Copié dans le presse-papier',
        reply: 'Réponse',
      };
      if (labels[action]) {
        addToast(labels[action], action === 'delete' ? 'error' : 'info');
      }
    },
    [activeConversationId, addToast]
  );

  const handleNewConversation = useCallback(() => {
    addToast('Nouvelle conversation — à implémenter', 'info');
  }, [addToast]);

  const handleNewTicket = useCallback(() => {
    setShowSupport(true);
    setActiveConversationId(null);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleDraftChange = useCallback((conversationId, text) => {
    setDrafts((prev) => ({ ...prev, [conversationId]: text }));
  }, []);

  const handleBackToList = useCallback(() => {
    setMobileView('list');
    setShowInfoPanel(false);
  }, []);

  if (loading) {
    return (
      <div className="acm-wrapper">
        <CounterMessageSkeleton />
      </div>
    );
  }

  return (
    <div className="acm-wrapper">
      <CounterMessageSidebar
        folders={folders}
        activeFolder={activeFolder}
        onFolderChange={handleFolderChange}
        currentUser={currentUser}
      />

      <div
        className={`acm-middle ${
          mobileView === 'chat' ? 'acm-middle-hidden' : ''
        }`}
      >
        <div className="acm-middle-header">
          <CounterMessageSearch
            value={search}
            onSearch={handleSearch}
          />
          <div className="acm-middle-actions">
            <button onClick={handleNewConversation}>
              <i className="bi bi-plus-lg" />
              Nouveau
            </button>
            <button
              className="acm-btn-support"
              onClick={handleNewTicket}
            >
              <i className="bi bi-headset" />
              Support
            </button>
          </div>
        </div>

        <CounterConversationList
          conversations={filtered}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          formatDate={formatDate}
        >
          {(conv) => (
            <CounterConversationCard
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => handleSelectConversation(conv.id)}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}
        </CounterConversationList>
      </div>

      <div
        className={`acm-main ${
          mobileView === 'chat' ? 'acm-main-visible' : ''
        }`}
      >
        {activeConversation ? (
          <>
            <div className="acm-chat-header">
              <div className="acm-chat-header-left">
                <button
                  className="acm-mobile-back"
                  onClick={handleBackToList}
                >
                  <i className="bi bi-arrow-left" />
                </button>
                <div className="acm-chat-avatar">
                  {activeConversation.name
                    ? activeConversation.name.charAt(0).toUpperCase()
                    : '?'}
                </div>
                <div className="acm-chat-info">
                  <div className="acm-chat-name">
                    {activeConversation.name}
                  </div>
                  <div
                    className={`acm-chat-status ${
                      activeConversation.status || 'offline'
                    }`}
                  >
                    {activeConversation.status === 'online'
                      ? 'En ligne'
                      : activeConversation.status === 'busy'
                      ? 'Occupé'
                      : 'Hors ligne'}
                  </div>
                </div>
              </div>
              <div className="acm-chat-actions">
                <button
                  onClick={() => setShowInfoPanel(!showInfoPanel)}
                  title="Informations"
                >
                  <i className="bi bi-info-circle" />
                </button>
                <button
                  onClick={() => {
                    handleMessageAction(
                      'copy',
                      null,
                      activeConversationId
                    );
                  }}
                  title="Copier la conversation"
                >
                  <i className="bi bi-link-45deg" />
                </button>
              </div>
            </div>

            <div className="acm-chat-messages">
              {activeConversation.messages &&
              activeConversation.messages.length > 0 ? (
                <>
                  {activeConversation.messages.map((msg, idx) => (
                    <CounterMessageBubble
                      key={msg.id || idx}
                      message={msg}
                      isOutgoing={msg.sender === 'me'}
                      onAction={(action) =>
                        handleMessageAction(
                          action,
                          msg.id,
                          activeConversationId
                        )
                      }
                      formatTime={formatTime}
                    />
                  ))}
                  <div ref={chatEndRef} />
                </>
              ) : (
                <div className="acm-chat-empty">
                  <i className="bi bi-chat-dots" />
                  <p>
                    Aucun message dans cette conversation.
                    <br />
                    Écrivez votre premier message ci-dessous.
                  </p>
                </div>
              )}
            </div>

            <CounterComposer
              draft={drafts[activeConversationId] || ''}
              onSend={handleSendMessage}
              onDraftChange={(text) =>
                handleDraftChange(activeConversationId, text)
              }
              attachments={[]}
            />

            {showInfoPanel && (
              <CounterConversationInfo
                conversation={activeConversation}
                onClose={() => setShowInfoPanel(false)}
                formatDate={formatDate}
              />
            )}
          </>
        ) : showSupport ? (
          <CounterSupportPanel
            tickets={tickets}
            onClose={() => setShowSupport(false)}
            formatDate={formatDate}
          />
        ) : (
          <div className="acm-chat-empty">
            <i className="bi bi-chat-dots" />
            <p>Sélectionnez une conversation</p>
            <span style={{ fontSize: '12px', color: '#D1D5DB' }}>
              Choisissez une conversation dans la liste pour commencer
            </span>
          </div>
        )}
      </div>

      <div className="acm-toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`acm-toast ${toast.type}`}
          >
            <span className="acm-toast-icon">
              {toast.type === 'success' && <i className="bi bi-check-circle" />}
              {toast.type === 'error' && <i className="bi bi-exclamation-circle" />}
              {toast.type === 'warning' && <i className="bi bi-exclamation-triangle" />}
              {toast.type === 'info' && <i className="bi bi-info-circle" />}
            </span>
            <span className="acm-toast-message">{toast.message}</span>
            <button
              className="acm-toast-close"
              onClick={() => removeToast(toast.id)}
            >
              <i className="bi bi-x" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
