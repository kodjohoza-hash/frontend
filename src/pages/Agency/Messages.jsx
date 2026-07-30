import { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { conversations, folders, getConversationsByFolder, getContact, conversationsMap, getPinnedConversations } from '@data/messageData';
import AgencyMessageSidebar from '@components/agency/AgencyMessageSidebar';
import AgencyConversationList from '@components/agency/AgencyConversationList';
import AgencyChatWindow from '@components/agency/AgencyChatWindow';
import AgencyConversationInfo from '@components/agency/AgencyConversationInfo';
import AgencySupportPanel from '@components/agency/AgencySupportPanel';
import AgencyMessageSkeleton from '@components/agency/AgencyMessageSkeleton';

export default function Messages() {
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showInfo, setShowInfo] = useState(true);
  const [showSupport, setShowSupport] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filteredConvs = useMemo(() => {
    let convs = getConversationsByFolder(activeFolder);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      convs = convs.filter((c) => {
        const contact = getContact(c.contactId);
        const last = c.messages[c.messages.length - 1];
        return (contact?.name || '').toLowerCase().includes(q) || (last?.text || '').toLowerCase().includes(q);
      });
    }
    return convs;
  }, [activeFolder, searchQuery]);

  const pinnedConvs = useMemo(() => {
    if (activeFolder === 'inbox') {
      const pinned = getPinnedConversations();
      return pinned.filter((c) => c.folder === 'inbox' || c.folder === 'internal' || c.folder === 'important' || c.folder === 'client');
    }
    return [];
  }, [activeFolder]);

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversationsMap[activeConversationId] || null;
  }, [activeConversationId]);

  const handleSelectFolder = useCallback((folder) => {
    setActiveFolder(folder);
    setActiveConversationId(null);
    setShowSupport(folder === 'support');
    setShowInfo(false);
    if (isMobile) setMobileView(folder === 'support' ? 'chat' : 'list');
  }, [isMobile]);

  const handleSelectConversation = useCallback((convId) => {
    setActiveConversationId(convId);
    setShowSupport(false);
    setShowInfo(true);
    if (isMobile) setMobileView('chat');
  }, [isMobile]);

  const handleBackToList = useCallback(() => {
    setMobileView('list');
    setShowInfo(false);
  }, []);

  const handleToggleInfo = useCallback(() => {
    setShowInfo((p) => !p);
    if (isMobile) setMobileView('info');
  }, [isMobile]);

  const showList = !isMobile || mobileView === 'list';
  const showChat = !isMobile || mobileView !== 'list';

  if (loading) {
    return (
      <div className="amsg-container">
        <div className="amsg-topbar">
          <div className="amsg-topbar__left">
            <h2 className="amsg-topbar__title">Messagerie</h2>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', paddingTop: 56 }}>
          <div className="amsg-sidebar"><AgencyMessageSkeleton count={6} /></div>
          <div className="amsg-list"><AgencyMessageSkeleton count={8} /></div>
          <div className="amsg-chat" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="amsg-empty">
              <div className="amsg-empty__spinner"><i className="bi bi-arrow-clockwise amsg-empty__spin" /></div>
              <p className="amsg-empty__desc">Chargement de la messagerie...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="amsg-container">
      {toast && <div className="amsg-toast"><i className="bi bi-check-circle" /> {toast}</div>}

      {/* TOPBAR */}
      <div className="amsg-topbar">
        <div className="amsg-topbar__left">
          {isMobile && (mobileView === 'chat' || mobileView === 'info') && (
            <button className="amsg-topbar__btn" onClick={handleBackToList}><i className="bi bi-arrow-left" /></button>
          )}
          <div className="amsg-topbar__brand">
            <div className="amsg-topbar__brand-icon"><i className="bi bi-chat-dots" /></div>
            <h2 className="amsg-topbar__title">Messagerie</h2>
          </div>
        </div>
        <div className="amsg-topbar__right">
          <div className="amsg-topbar__folder-select">
            <i className="bi bi-folder2" />
            <select value={activeFolder} onChange={(e) => handleSelectFolder(e.target.value)}>
              {folders.map((f) => (<option key={f.id} value={f.id}>{f.label}</option>))}
            </select>
          </div>
          <button className="amsg-topbar__btn amsg-topbar__btn--primary" onClick={() => setShowNewModal(true)}>
            <i className="bi bi-plus-lg" /> <span className="amsg-topbar__btn-text">Nouveau message</span>
          </button>
          <button className="amsg-topbar__btn" onClick={() => showToast('Messages actualisés')} title="Actualiser">
            <i className="bi bi-arrow-clockwise" />
          </button>
        </div>
      </div>

      {/* LAYOUT BODY */}
      <div className="amsg-body">
        {/* SIDEBAR — Column 0 */}
        <div className={clsx('amsg-sidebar', { 'amsg-sidebar--hidden': isMobile && mobileView !== 'list' })}>
          <AgencyMessageSidebar activeFolder={activeFolder} onSelectFolder={handleSelectFolder} />
        </div>

        {/* CONVERSATION LIST — Column 1 */}
        <div className={clsx('amsg-list', { 'amsg-list--hidden': isMobile && !showList })}>
          <AgencyConversationList
            conversations={filteredConvs}
            pinnedConversations={pinnedConvs}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            loading={false}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* CHAT + INFO — Column 2+3 */}
        <div className={clsx('amsg-main', { 'amsg-main--hidden': isMobile && !showChat })}>
          {activeConversation ? (
            <>
              <AgencyChatWindow
                conversation={activeConversation}
                onSendMessage={(msg) => showToast('Message envoyé')}
                onBack={handleBackToList}
                showInfo={showInfo}
                onToggleInfo={handleToggleInfo}
              />
              <div className={clsx('amsg-info-panel', { 'amsg-info-panel--open': showInfo })}>
                <AgencyConversationInfo
                  conversation={activeConversation}
                  contact={getContact(activeConversation.contactId)}
                  onClose={() => { setShowInfo(false); if (isMobile) setMobileView('chat'); }}
                />
              </div>
            </>
          ) : showSupport ? (
            <div className="amsg-chat amsg-chat--full">
              <AgencySupportPanel onSelectTicket={(id) => showToast(`Ticket ${id} sélectionné`)} />
            </div>
          ) : (
            <div className="amsg-chat amsg-chat--full">
              <div className="amsg-empty">
                <div className="amsg-empty__illustration">
                  <i className="bi bi-chat-dots" />
                  <i className="bi bi-chat-quote" />
                  <i className="bi bi-chat-square" />
                </div>
                <h3 className="amsg-empty__title">Bienvenue dans la Messagerie</h3>
                <p className="amsg-empty__desc">
                  Sélectionnez une conversation dans la liste ou créez un nouveau message pour commencer à discuter avec vos clients et collaborateurs.
                </p>
                <button className="amsg-empty__cta" onClick={() => setShowNewModal(true)}>
                  <i className="bi bi-plus-lg" /> Nouvelle conversation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW CONVERSATION MODAL */}
      {showNewModal && (
        <div className="amsg-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="amsg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="amsg-modal__header">
              <h3 className="amsg-modal__title">
                <i className="bi bi-pencil-square" /> Nouvelle conversation
              </h3>
              <button type="button" className="amsg-modal__close" onClick={() => setShowNewModal(false)}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="amsg-modal__body">
              <p className="amsg-modal__hint">
                Recherchez un contact pour démarrer une nouvelle conversation. Vous pouvez envoyer un message à un client, un agent ou un collaborateur.
              </p>
              <div className="amsg-modal__search">
                <i className="bi bi-search" />
                <input type="text" placeholder="Nom du contact, email ou téléphone..." autoFocus />
              </div>
              <div className="amsg-modal__recent">
                <div className="amsg-modal__recent-title">Contacts récents</div>
                {['co_001', 'co_003', 'co_010', 'co_007'].map((id) => {
                  const c = getContact(id);
                  if (!c) return null;
                  return (
                    <button key={id} className="amsg-modal__contact" onClick={() => { showToast(`Conversation avec ${c.name} créée`); setShowNewModal(false); }}>
                      <div className="amsg-modal__contact-avatar">{c.initials}</div>
                      <div className="amsg-modal__contact-info">
                        <div className="amsg-modal__contact-name">{c.name}</div>
                        <div className="amsg-modal__contact-role">{c.role}{c.company ? ` — ${c.company}` : ''}</div>
                      </div>
                      <i className="bi bi-chevron-right" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="amsg-modal__footer">
              <button type="button" className="amsg-btn amsg-btn--outline" onClick={() => setShowNewModal(false)}>Annuler</button>
              <button type="button" className="amsg-btn amsg-btn--primary" onClick={() => { showToast('Nouvelle conversation créée'); setShowNewModal(false); }}>
                <i className="bi bi-send" /> Créer la conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}