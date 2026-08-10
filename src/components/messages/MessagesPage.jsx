import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import useMessageStore from '@store/message.store';
import useAuth from '@hooks/useAuth';
import messageService from '@services/message.service';
import {
  MessageSidebar,
  ChatHeader,
  MessageBubble,
  MessageDateDivider,
  MessageInput,
  EmptyConversation,
  ChatSkeleton,
} from './index';
import '@assets/styles/messages.css';

/**
 * MessagesPage — Page de messagerie réutilisable (branche l'API réelle).
 * Prop `basePath` : chemin du menu Messagerie (client/agency/counter/super-admin).
 * Le recipient picker du « Nouveau message » s'adapte au rôle :
 *  - super_admin : compagnies actives → clients d'une compagnie (ou la compagnie) ;
 *  - company_admin : clients de sa compagnie ;
 *  - client / counter_agent : contacts existants.
 */
const NewConversationModal = ({ onClose, onCreated, onError }) => {
  const { user, role } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [clients, setClients] = useState([]);
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      await Promise.resolve();
      setExisting(useMessageStore.getState().contacts);
      if (role === 'super_admin') {
        const data = await messageService.getCompanies();
        setCompanies(data || []);
      } else if (role === 'company_admin' && user?.compagnieId) {
        const data = await messageService.getCompanyClients(user.compagnieId);
        setClients(data || []);
      }
      setLoading(false);
    };
    load();
  }, [role, user]);

  const loadClients = async (companyId) => {
    setLoading(true);
    try {
      const data = await messageService.getCompanyClients(companyId);
      setClients(data || []);
    } catch (err) {
      onError?.(err.message || 'Impossible de charger les clients.');
    } finally {
      setLoading(false);
    }
  };

  const create = async ({ recipientType, recipientId, contextType, contextId, subject }) => {
    setCreating(true);
    try {
      await useMessageStore.getState().createConversation({
        recipientType,
        recipientId,
        contextType,
        contextId,
        subject,
      });
      onCreated?.();
      onClose();
    } catch (err) {
      onError?.(err.message || 'Impossible de créer la conversation.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="msg-modal-overlay" onClick={onClose}>
      <div className="msg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="msg-modal__header">
          <h3 className="msg-modal__title">Nouvelle conversation</h3>
          <button type="button" className="msg-modal__close" onClick={onClose} aria-label="Fermer">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="msg-modal__body">
          {role === 'super_admin' && (
            <>
              <div className="msg-modal__section">
                <span className="msg-modal__label">Compagnie</span>
                <select
                  className="msg-modal__select"
                  value={selectedCompany?.id || ''}
                  onChange={(e) => {
                    const company = companies.find((c) => c.id === e.target.value) || null;
                    setSelectedCompany(company);
                    if (company) loadClients(company.id);
                  }}
                >
                  <option value="">Choisir une compagnie...</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedCompany && (
                <div className="msg-modal__section">
                  <span className="msg-modal__label">Client de {selectedCompany.name}</span>
                  {loading ? (
                    <div className="msg-modal__hint">Chargement des clients...</div>
                  ) : (
                    <div className="msg-modal__list">
                      {clients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          className="msg-modal__contact"
                          onClick={() => create({ recipientType: 'client', recipientId: client.id, subject: `Support ${selectedCompany.name}` })}
                          disabled={creating}
                        >
                          <span className="msg-modal__contact-avatar">{client.initials}</span>
                          <span className="msg-modal__contact-name">{client.name}</span>
                          <i className="bi bi-chevron-right" />
                        </button>
                      ))}
                      {clients.length === 0 && (
                        <div className="msg-modal__hint">Aucun client avec réservation sur cette compagnie.</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="msg-modal__section">
                <button
                  type="button"
                  className="msg-modal__primary"
                  disabled={!selectedCompany || creating}
                  onClick={() => create({ recipientType: 'company', recipientId: selectedCompany?.id, contextType: 'company', contextId: selectedCompany?.id, subject: `Contact ${selectedCompany?.name || ''}` })}
                >
                  <i className="bi bi-building" /> Contacter la compagnie {selectedCompany?.name || ''}
                </button>
              </div>
            </>
          )}

          {role === 'company_admin' && (
            <div className="msg-modal__section">
              <span className="msg-modal__label">Clients de votre compagnie</span>
              {loading ? (
                <div className="msg-modal__hint">Chargement des clients...</div>
              ) : (
                <div className="msg-modal__list">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      className="msg-modal__contact"
                      onClick={() => create({ recipientType: 'client', recipientId: client.id, subject: `Client ${client.name}` })}
                      disabled={creating}
                    >
                      <span className="msg-modal__contact-avatar">{client.initials}</span>
                      <span className="msg-modal__contact-name">{client.name}</span>
                      <i className="bi bi-chevron-right" />
                    </button>
                  ))}
                  {clients.length === 0 && (
                    <div className="msg-modal__hint">Aucun client avec réservation trouvé.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {(role === 'client' || role === 'counter_agent') && (
            <div className="msg-modal__section">
              <span className="msg-modal__label">Conversations existantes</span>
              {existing.length === 0 ? (
                <div className="msg-modal__hint">Aucun contact disponible pour le moment.</div>
              ) : (
                <div className="msg-modal__list">
                  {existing.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      className="msg-modal__contact"
                      onClick={() => create({ recipientType: contact.type === 'company' ? 'company' : contact.type === 'support' ? 'agent' : contact.type, recipientId: contact.id })}
                      disabled={creating}
                    >
                      <span className="msg-modal__contact-avatar">{contact.initials}</span>
                      <span className="msg-modal__contact-name">{contact.name}</span>
                      <i className="bi bi-chevron-right" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="msg-modal__footer">
          <button type="button" className="msg-modal__cancel" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

const MessagesPage = ({ basePath }) => {
  const {
    conversations,
    contacts,
    unread,
    loading,
    messages,
    messagesLoading,
    activeId,
    selectConversation,
    sendMessage,
    markMessageRead,
  } = useMessageStore();
  const { user } = useAuth();
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [composerError, setComposerError] = useState(null);
  const messagesEndRef = useRef(null);

  const myId = user?.id || null;
  const myRole = user?.role || null;

  const contactMap = useMemo(() => {
    const map = {};
    contacts.forEach((c) => { map[c.id] = c; });
    return map;
  }, [contacts]);

  const activeConversation = useMemo(() => {
    if (!activeId) return null;
    return conversations.find((c) => c.id === activeId) || null;
  }, [activeId, conversations]);

  const activeContact = useMemo(() => {
    if (!activeConversation) return null;
    const c = contactMap[activeConversation.contactId];
    return c || activeConversation.contact;
  }, [activeConversation, contactMap]);

  const activeMessages = useMemo(() => messages, [messages]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  useEffect(() => {
    if (activeMessages.length > 0) scrollToBottom();
  }, [activeMessages.length, scrollToBottom]);

  /* Marque comme lus les messages reçus affichés. */
  useEffect(() => {
    if (!myId || !activeId) return;
    activeMessages
      .filter((m) => m.senderId !== myId && !m.read)
      .slice(0, 20)
      .forEach((m) => markMessageRead(m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, activeMessages.length, myId]);

  const handleSelect = useCallback((convId) => {
    selectConversation(convId);
    setMobileShowChat(true);
  }, [selectConversation]);

  const handleBack = useCallback(() => { setMobileShowChat(false); }, []);

  const handleSend = useCallback(async (text) => {
    if (!activeId) return;
    try {
      await sendMessage(text);
    } catch {
      /* L'erreur est silencieuse : le polling rappellera l'état serveur. */
    }
  }, [activeId, sendMessage]);

  const handleNew = useCallback(() => {
    setComposerError(null);
    setShowNew(true);
  }, []);

  const groupedMessages = useMemo(() => {
    const groups = [];
    let lastDate = '';
    activeMessages.forEach((msg) => {
      const msgDate = msg.timestamp ? new Date(msg.timestamp).toLocaleDateString('fr-FR') : '';
      if (msgDate !== lastDate) { groups.push({ type: 'date', date: msg.timestamp, key: `date-${msgDate}` }); lastDate = msgDate; }
      groups.push({ type: 'message', message: msg, key: msg.id });
    });
    return groups;
  }, [activeMessages]);

  if (loading && conversations.length === 0) {
    return <ChatSkeleton />;
  }

  return (
    <div className="msg-layout">
      <div className={`msg-layout__sidebar ${mobileShowChat ? 'msg-layout__sidebar--hidden' : ''}`}>
        <div className="msg-toolbar">
          <button type="button" className="msg-toolbar__new" onClick={handleNew}>
            <i className="bi bi-plus-lg" /> Nouvelle conversation
          </button>
          {unread > 0 && <span className="msg-toolbar__unread">{unread} non lu(s)</span>}
        </div>
        <MessageSidebar conversations={conversations} contacts={contacts} activeId={activeId} onSelect={handleSelect} />
      </div>
      <div className={`msg-layout__chat ${!mobileShowChat && !activeId ? 'msg-layout__chat--empty' : ''} ${mobileShowChat ? 'msg-layout__chat--visible' : ''}`}>
        {activeContact && activeConversation ? (
          <>
            <ChatHeader contact={activeContact} onBack={handleBack} />
            <div className="msg-chat__body">
              {activeConversation.context && (
                <div className="msg-context">
                  <i className="bi bi-link-45deg" />
                  <span>{activeConversation.context.label}</span>
                </div>
              )}
              {groupedMessages.map((item) => {
                if (item.type === 'date') return <MessageDateDivider key={item.key} date={item.date} />;
                const msg = item.message;
                const isOwn = msg.senderId === myId;
                const prevItem = groupedMessages[groupedMessages.indexOf(item) - 1];
                const showAvatar = !isOwn && (!prevItem || prevItem.type === 'date' || prevItem.message?.senderId !== msg.senderId);
                return <MessageBubble key={item.key} message={msg} isOwn={isOwn} showAvatar={showAvatar} contactInitials={activeContact.initials} />;
              })}
              {messagesLoading && <div className="msg-chat__loading"><i className="bi bi-arrow-clockwise msg-chat__loading-spin" /></div>}
              <div ref={messagesEndRef} />
            </div>
            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <EmptyConversation />
        )}
      </div>

      {showNew && (
        <NewConversationModal
          onClose={() => setShowNew(false)}
          onCreated={() => setMobileShowChat(true)}
          onError={(msg) => setComposerError(msg)}
        />
      )}
      {composerError && (
        <div className="msg-toast" onClick={() => setComposerError(null)}>
          <i className="bi bi-exclamation-circle" /> {composerError}
        </div>
      )}
      {/* basePath est conservé pour les futures actions (redirections contextuelles). */}
      <span hidden>{basePath || myRole}</span>
    </div>
  );
};

export default MessagesPage;
