import { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { conversations, folders, getConversationsByFolder, getContact, conversationsMap } from '@data/messageData';
import AgencyMessageSidebar from '@components/agency/AgencyMessageSidebar';
import AgencyConversationList from '@components/agency/AgencyConversationList';
import AgencyChatWindow from '@components/agency/AgencyChatWindow';
import AgencyConversationInfo from '@components/agency/AgencyConversationInfo';
import AgencySupportPanel from '@components/agency/AgencySupportPanel';

export default function Messages() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState(null);

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

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversationsMap[activeConversationId] || null;
  }, [activeConversationId]);

  const handleSelectFolder = useCallback((folder) => {
    setActiveFolder(folder);
    setActiveConversationId(null);
    setShowInfo(false);
    setShowSupport(folder === 'support');
    if (isMobile) setMobileView(folder === 'support' ? 'chat' : 'list');
  }, [isMobile]);

  const handleSelectConversation = useCallback((convId) => {
    setActiveConversationId(convId);
    setShowInfo(false);
    setShowSupport(false);
    if (isMobile) setMobileView('chat');
  }, [isMobile]);

  const handleBackToList = useCallback(() => { setMobileView('list'); setShowInfo(false); }, []);
  const handleToggleInfo = useCallback(() => { setShowInfo((p) => !p); if (isMobile) setMobileView('info'); }, [isMobile]);

  return (
    <div className="amsg-container">
      {toast && <div className="amsg-toast"><i className="bi bi-check-circle" /> {toast}</div>}

      {/* TOPBAR */}
      <div className="amsg-topbar" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div className="amsg-topbar__left">
          {isMobile && (mobileView === 'chat' || mobileView === 'info') && (
            <button className="amsg-topbar__btn" onClick={handleBackToList}><i className="bi bi-arrow-left" /></button>
          )}
          <h2 className="amsg-topbar__title">Messagerie</h2>
        </div>
        <div className="amsg-topbar__right">
          <select className="amsg-topbar__filter" value={activeFolder} onChange={(e) => handleSelectFolder(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, background: 'white', color: '#374151' }}>
            {folders.map((f) => (<option key={f.id} value={f.id}>{f.label}</option>))}
          </select>
          <button className="amsg-topbar__btn amsg-topbar__btn--primary" onClick={() => setShowNewModal(true)}>
            <i className="bi bi-plus-lg" /> Nouvelle conversation
          </button>
          <button className="amsg-topbar__btn" onClick={() => showToast('Messages actualisés')}><i className="bi bi-arrow-clockwise" /></button>
        </div>
      </div>

      {/* LAYOUT BODY */}
      <div style={{ display: 'flex', flex: 1, paddingTop: 56, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        {(!isMobile || mobileView === 'list') && (
          <div style={{ display: isMobile && mobileView !== 'list' ? 'none' : 'flex' }}>
            <AgencyMessageSidebar activeFolder={activeFolder} onSelectFolder={handleSelectFolder} />
          </div>
        )}

        {/* CONVERSATION LIST */}
        {(!isMobile || mobileView === 'list') && (
          <div style={{ display: isMobile && mobileView !== 'list' ? 'none' : 'flex' }}>
            <AgencyConversationList
              conversations={filteredConvs}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              loading={false}
            />
          </div>
        )}

        {/* CHAT / CONTENT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {(!isMobile || mobileView !== 'list') && (
            <>
              {activeConversation ? (
                <AgencyChatWindow
                  conversation={activeConversation}
                  onSendMessage={(msg) => showToast('Message envoyé')}
                  onBack={handleBackToList}
                  showInfo={showInfo}
                  onToggleInfo={handleToggleInfo}
                />
              ) : showSupport ? (
                <div className="amsg-chat">
                  <AgencySupportPanel onSelectTicket={(id) => showToast(`Ticket ${id} sélectionné`)} />
                </div>
              ) : (
                <div className="amsg-chat">
                  <div className="amsg-empty">
                    <i className="bi bi-chat-dots amsg-empty__icon" />
                    <h3 className="amsg-empty__title">Sélectionnez une conversation</h3>
                    <p className="amsg-empty__desc">Choisissez une conversation dans la liste pour commencer à discuter</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT INFO PANEL */}
        {showInfo && activeConversation && (!isMobile || mobileView === 'info') && (
          <div style={isMobile ? { position: 'fixed', right: 0, top: 56, bottom: 0, width: 300, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } : {}}>
            <AgencyConversationInfo
              conversation={activeConversation}
              contact={getContact(activeConversation.contactId)}
              onClose={handleToggleInfo}
            />
          </div>
        )}
      </div>

      {/* NEW CONVERSATION MODAL */}
      {showNewModal && (
        <div className="amsg-modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="amsg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="amsg-modal__header">
              <h3 className="amsg-modal__title">Nouvelle conversation</h3>
              <button type="button" className="amsg-modal__close" onClick={() => setShowNewModal(false)}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="amsg-modal__body">
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Recherchez un contact pour démarrer une nouvelle conversation.</p>
              <input type="text" placeholder="Nom du contact..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }} />
            </div>
            <div className="amsg-modal__footer">
              <button type="button" style={{ padding: '8px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', color: '#374151', cursor: 'pointer', fontSize: 13 }} onClick={() => setShowNewModal(false)}>Annuler</button>
              <button type="button" style={{ padding: '8px 20px', border: 'none', borderRadius: 8, background: '#FF6B35', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }} onClick={() => { showToast('Conversation créée'); setShowNewModal(false); }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
