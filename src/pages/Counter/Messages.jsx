import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import {
  CounterMessageSidebar,
  CounterConversationList,
  CounterChatWindow,
  CounterConversationInfo,
  CounterSupportPanel,
  CounterMessageSearch,
  CounterMessageSkeleton,
} from '@components/counter/';
import {
  conversations as allConversations,
  folders,
  currentUser,
  tickets,
  getPinnedConversations,
  getConversationsByFolder,
  filterConversations,
  sortConversations,
  formatDate,
  formatTime,
} from '@data/counterMessageData';

import '@assets/styles/counter-messaging.css';

const AGT_ID = currentUser.id;

function adaptConversation(conv) {
  const p = conv.participant || {};
  return {
    id: conv.id,
    name: p.name || '',
    role: p.role || '',
    avatar: p.avatar || null,
    status: p.status || 'offline',
    lastMessage: conv.lastMessage?.text || '',
    lastMessageTime: conv.lastMessage?.date ? formatDate(conv.lastMessage.date) : '',
    unread: conv.unreadCount || 0,
    important: conv.isImportant || false,
    pinned: conv.pinned || false,
    participant: p,
    messages: conv.messages || [],
    sharedFiles: conv.sharedFiles || [],
    folder: conv.folder || 'inbox',
  };
}

function Messages() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [search, setSearch] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [mobileView, setMobileView] = useState('list');
  const [showNewModal, setShowNewModal] = useState(false);

  const chatEndRef = useRef(null);

  const rawActiveConv = useMemo(() => {
    if (!activeConversationId) return null;
    return allConversations.find((c) => c.id === activeConversationId) || null;
  }, [activeConversationId]);

  const pinnedConvs = useMemo(() => {
    const raw = getPinnedConversations();
    return raw.map(adaptConversation);
  }, []);

  const activeConv = useMemo(() => {
    if (!rawActiveConv) return null;
    return adaptConversation(rawActiveConv);
  }, [rawActiveConv]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
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

  const filtered = useMemo(() => {
    if (!conversations.length) return [];
    const raw = getConversationsByFolder(activeFolder);
    let result = filterConversations(raw, { search, folder: activeFolder });
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          (c.participant?.name || '').toLowerCase().includes(q) ||
          (c.lastMessage?.text || '').toLowerCase().includes(q)
      );
    }
    result = sortConversations(result, 'newest');
    return result.map(adaptConversation);
  }, [conversations, activeFolder, search]);

  useEffect(() => {
    if (activeConversationId && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversationId]);

  const handleFolderChange = useCallback((folder) => {
    setActiveFolder(folder);
    setActiveConversationId(null);
    setShowInfoPanel(false);
    setShowSupport(false);
    setMobileView('list');
  }, []);

  const handleSelectConversation = useCallback((conversationId) => {
    setActiveConversationId(conversationId);
    setShowSupport(false);
    setMobileView('chat');
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const handleSendMessage = useCallback(
    (convId, text, attachments) => {
      if (!convId || !text?.trim()) return;

      const newMessage = {
        id: `msg-${Date.now()}`,
        text: text.trim(),
        senderId: AGT_ID,
        date: new Date().toISOString(),
        status: 'sent',
        reactions: [],
        attachments: attachments || [],
      };

      const idx = allConversations.findIndex((c) => c.id === convId);
      if (idx >= 0) {
        allConversations[idx].messages.push(newMessage);
        allConversations[idx].lastMessage = { text: text.trim(), date: new Date().toISOString(), senderId: AGT_ID, status: 'sent' };
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
            lastMessage: { text: text.trim(), date: new Date().toISOString(), senderId: AGT_ID, status: 'sent' },
          };
        })
      );

      addToast('Message envoyé', 'success');
    },
    [addToast]
  );

  const handleMessageAction = useCallback(
    (convId, msgId, action) => {
      if (!convId || !msgId) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: (c.messages || []).map((m) => {
              if (m.id !== msgId) return m;
              switch (action) {
                case 'delete':
                  return { ...m, deleted: true, text: 'Message supprimé' };
                case 'pin':
                  return { ...m, pinned: !m.pinned };
                default:
                  return m;
              }
            }),
          };
        })
      );

      const labels = {
        delete: 'Message supprimé',
        pin: 'Message épinglé/désépinglé',
        copy: 'Copié dans le presse-papier',
        reply: 'Réponse',
      };
      if (labels[action]) {
        addToast(labels[action], action === 'delete' ? 'error' : 'info');
      }
    },
    [addToast]
  );

  const handleNewConversation = useCallback(() => {
    setShowNewModal(true);
  }, []);

  const handleNewTicket = useCallback(() => {
    setShowSupport(true);
    setActiveConversationId(null);
    setMobileView('chat');
  }, []);

  const handleBackToList = useCallback(() => {
    setMobileView('list');
    setShowInfoPanel(false);
  }, []);

  const handleInfoToggle = useCallback(() => {
    setShowInfoPanel((s) => !s);
  }, []);

  const unreadCounts = useMemo(() => {
    const counts = {};
    folders.forEach((f) => { counts[f.id] = 0; });
    conversations.forEach((c) => {
      counts[c.folder] = (counts[c.folder] || 0) + (c.unreadCount || 0);
      if (c.isImportant) counts.important = (counts.important || 0) + (c.unreadCount || 0);
    });
    counts.unread = conversations.reduce((s, c) => s + (c.unreadCount || 0), 0);
    return counts;
  }, [conversations]);

  if (loading) {
    return (
      <div className="acm-wrapper">
        <CounterMessageSkeleton />
      </div>
    );
  }

  return (
    <div className="acm-wrapper">
      <div className="acm-topbar">
        <div className="acm-topbar__left">
          <div className="acm-topbar__brand">
            <div className="acm-topbar__brand-icon">
              <i className="bi bi-chat-square-dots" />
            </div>
            <h2 className="acm-topbar__title">Messagerie</h2>
          </div>
          <div className="acm-topbar__folder-info">
            <span className="acm-topbar__folder-label">
              {folders.find((f) => f.id === activeFolder)?.label || 'Boîte de réception'}
            </span>
            <span className="acm-topbar__folder-count">
              {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="acm-topbar__right">
          <button
            type="button"
            className="acm-topbar__btn acm-topbar__btn--support"
            onClick={handleNewTicket}
            title="Support technique"
          >
            <i className="bi bi-headset" />
            <span className="acm-topbar__btn-label">Support</span>
          </button>
          <button
            type="button"
            className="acm-topbar__btn acm-topbar__btn--primary"
            onClick={handleNewConversation}
          >
            <i className="bi bi-pencil-square" />
            <span className="acm-topbar__btn-label">Nouveau</span>
          </button>
        </div>
      </div>

      <div className="acm-body">
        <CounterMessageSidebar
          folders={folders}
          activeFolder={activeFolder}
          onFolderChange={handleFolderChange}
          unreadCounts={unreadCounts}
        />

        <div className={clsx('acm-middle', mobileView === 'chat' && 'acm-middle--hidden')}>
          <div className="acm-middle__header">
            <CounterMessageSearch
              search={search}
              onSearchChange={setSearch}
              placeholder="Rechercher une conversation..."
            />
          </div>

          <div className="acm-middle__list">
            {pinnedConvs.length > 0 && !search && (
              <div className="acm-middle__section">
                <div className="acm-middle__section-title">
                  <i className="bi bi-pin-fill" /> Épinglés
                </div>
                {pinnedConvs.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    className={clsx('acm-conv-card', activeConversationId === conv.id && 'acm-conv-card--active')}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <div className="acm-conv-card__avatar">
                      <span className="acm-conv-card__initials">
                        {conv.name.split(' ').map((s) => s.charAt(0)).join('').toUpperCase().slice(0, 2)}
                      </span>
                      <span className={clsx('acm-conv-card__dot', `acm-conv-card__dot--${conv.status}`)} />
                    </div>
                    <div className="acm-conv-card__body">
                      <div className="acm-conv-card__top">
                        <span className="acm-conv-card__name">{conv.name}</span>
                        <span className="acm-conv-card__time">{conv.lastMessageTime}</span>
                      </div>
                      <span className="acm-conv-card__role">{conv.role}</span>
                      <div className="acm-conv-card__preview">
                        {conv.lastMessage?.length > 60 ? conv.lastMessage.slice(0, 60) + '...' : conv.lastMessage}
                      </div>
                    </div>
                    <div className="acm-conv-card__right">
                      {conv.unread > 0 && (
                        <span className="acm-conv-card__badge">{conv.unread > 99 ? '99+' : conv.unread}</span>
                      )}
                    </div>
                  </button>
                ))}
                <div className="acm-middle__divider" />
              </div>
            )}

            <CounterConversationList
              conversations={filtered.filter((c) => !c.pinned || search)}
              activeId={activeConversationId}
              onSelect={handleSelectConversation}
              loading={false}
            />
          </div>
        </div>

        <div className={clsx('acm-main', mobileView === 'chat' && 'acm-main--visible')}>
          {showSupport ? (
            <CounterSupportPanel
              tickets={tickets}
              onNewTicket={() => addToast('Nouveau ticket — mock', 'info')}
              onTicketSelect={() => {}}
              onStatusChange={() => addToast('Statut mis à jour', 'info')}
            />
          ) : activeConv ? (
            <>
              <div className="acm-chat__header">
                <div className="acm-chat__header-left">
                  <button className="acm-mobile-back" onClick={handleBackToList}>
                    <i className="bi bi-arrow-left" />
                  </button>
                  <div className="acm-chat__header-avatar">
                    {activeConv.name.split(' ').map((s) => s.charAt(0)).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="acm-chat__header-info">
                    <div className="acm-chat__header-name">{activeConv.name}</div>
                    <div className={clsx('acm-chat__header-status', `acm-chat__header-status--${activeConv.status}`)}>
                      {activeConv.status === 'online' ? 'En ligne' : activeConv.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                    </div>
                  </div>
                </div>
                <div className="acm-chat__header-actions">
                  <button type="button" className="acm-chat__action-btn" onClick={handleInfoToggle} title="Informations">
                    <i className={clsx('bi', showInfoPanel ? 'bi-info-circle-fill' : 'bi-info-circle')} />
                  </button>
                  <button type="button" className="acm-chat__action-btn" title="Appel vocal">
                    <i className="bi bi-telephone" />
                  </button>
                  <button type="button" className="acm-chat__action-btn" title="Appel vidéo">
                    <i className="bi bi-camera-video" />
                  </button>
                </div>
              </div>

              <CounterChatWindow
                conversation={activeConv}
                currentUserId={AGT_ID}
                onSendMessage={handleSendMessage}
                onMessageAction={handleMessageAction}
                hideHeader
                hideInfo
              />

              {showInfoPanel && (
                <div className={clsx('acm-info-panel', showInfoPanel && 'acm-info-panel--open')}>
                  <CounterConversationInfo
                    conversation={activeConv}
                    onClose={() => setShowInfoPanel(false)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="acm-empty">
              <div className="acm-empty__illustration">
                <i className="bi bi-chat-square-dots" />
              </div>
              <h3 className="acm-empty__title">Bienvenue dans la messagerie</h3>
              <p className="acm-empty__text">
                Sélectionnez une conversation dans la liste ou commencez une nouvelle discussion.
              </p>
              <div className="acm-empty__actions">
                <button className="acm-empty__cta" onClick={handleNewConversation}>
                  <i className="bi bi-pencil-square" /> Nouveau message
                </button>
                <button className="acm-empty__cta acm-empty__cta--secondary" onClick={handleNewTicket}>
                  <i className="bi bi-headset" /> Support technique
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="acm-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={clsx('acm-toast', `acm-toast--${toast.type}`)}>
            <span className="acm-toast__icon">
              {toast.type === 'success' && <i className="bi bi-check-circle-fill" />}
              {toast.type === 'error' && <i className="bi bi-exclamation-circle-fill" />}
              {toast.type === 'warning' && <i className="bi bi-exclamation-triangle-fill" />}
              {toast.type === 'info' && <i className="bi bi-info-circle-fill" />}
            </span>
            <span className="acm-toast__message">{toast.message}</span>
            <button className="acm-toast__close" onClick={() => removeToast(toast.id)}>
              <i className="bi bi-x" />
            </button>
          </div>
        ))}
      </div>

      {showNewModal && (
        <div className="acm-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="acm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acm-modal__header">
              <h3 className="acm-modal__title">Nouvelle conversation</h3>
              <button className="acm-modal__close" onClick={() => setShowNewModal(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="acm-modal__body">
              <p className="acm-modal__hint">
                Sélectionnez un contact pour démarrer une nouvelle conversation.
              </p>
              <div className="acm-modal__search">
                <i className="bi bi-search" />
                <input type="text" placeholder="Rechercher un contact..." />
              </div>
              <div className="acm-modal__recent">
                <div className="acm-modal__recent-title">Contacts récents</div>
                {[
                  { name: 'Léa Mengue', role: 'Superviseur', color: '#0B1D51' },
                  { name: 'Paul Bello', role: 'Support technique', color: '#FF6B35' },
                  { name: 'Jean-Pierre Mvogo', role: 'Agent de guichet', color: '#10B981' },
                ].map((contact, i) => (
                  <button
                    key={i}
                    type="button"
                    className="acm-modal__contact"
                    onClick={() => {
                      setShowNewModal(false);
                      addToast(`Nouvelle conversation avec ${contact.name} — mock`, 'info');
                    }}
                  >
                    <div className="acm-modal__contact-avatar" style={{ background: contact.color }}>
                      {contact.name.split(' ').map((s) => s.charAt(0)).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="acm-modal__contact-info">
                      <div className="acm-modal__contact-name">{contact.name}</div>
                      <div className="acm-modal__contact-role">{contact.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
