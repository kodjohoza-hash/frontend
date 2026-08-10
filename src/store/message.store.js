import { create } from 'zustand';
import messageService from '../services/message.service';
import useAuthStore from './auth.store';

const POLL_INTERVAL = 30000;

/** Type de contact attendu par les composants UI (support / company / agent / client). */
const contactType = (op) => {
  if (op?.type === 'company') return 'company';
  if (op?.role === 'super_admin') return 'support';
  if (op?.type === 'client') return 'client';
  return 'agent';
};

/** Normalise une conversation API vers la forme des composants. */
const normalizeConversation = (c) => {
  const otherParty = c.otherParty || null;
  return {
    id: c.id,
    subject: c.subject,
    contactId: otherParty?.id || null,
    contact: otherParty
      ? { ...otherParty, type: contactType(otherParty) }
      : null,
    company: c.company || null,
    context: c.context || null,
    participants: c.participants || [],
    lastMessage: c.lastMessage?.content || null,
    lastMessageTime: c.lastMessageAt || c.updatedAt || null,
    unreadCount: c.unreadCount ?? 0,
    pinned: false,
  };
};

/** Normalise un message API vers la forme des composants. */
const normalizeMessage = (m) => ({
  id: m.id,
  conversationId: m.conversationId,
  senderId: m.senderId,
  text: m.content,
  timestamp: m.createdAt || null,
  status: m.read ? 'read' : m.status || 'sent',
  read: Boolean(m.read),
});

/** Contacts uniques dérivés des conversations (pour la barre latérale). */
const deriveContacts = (conversations) => {
  const map = new Map();
  conversations.forEach((c) => {
    if (!c.contact) return;
    if (!map.has(c.contactId)) {
      map.set(c.contactId, {
        id: c.contactId,
        name: c.contact.name || 'Interlocuteur',
        initials: c.contact.initials || '…',
        type: c.contact.type,
        online: false,
      });
    }
  });
  return [...map.values()];
};

const useMessageStore = create((set, get) => ({
  conversations: [],
  contacts: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  unread: 0,
  activeId: null,
  messages: [],
  messagesHasMore: false,
  messagesLoading: false,
  loading: false,
  error: null,
  pollId: null,
  initialized: false,

  init: () => {
    const { isAuthenticated, token } = useAuthStore.getState();
    if (!isAuthenticated || !token) return;
    if (get().initialized) return;
    set({ initialized: true });
    get().fetchConversations(1, { quiet: true });
    get().refreshUnread();
    get().startPolling();
  },

  startPolling: () => {
    if (get().pollId) return;
    const pollId = setInterval(() => {
      get().refreshUnread();
      get().fetchConversations(get().page, { quiet: true });
      if (get().activeId) get().fetchMessages(get().activeId, { quiet: true });
    }, POLL_INTERVAL);
    set({ pollId });
  },

  stopPolling: () => {
    const { pollId } = get();
    if (pollId) {
      clearInterval(pollId);
      set({ pollId: null });
    }
  },

  reset: () => {
    get().stopPolling();
    set({
      conversations: [],
      contacts: [],
      total: 0,
      page: 1,
      totalPages: 1,
      unread: 0,
      activeId: null,
      messages: [],
      messagesHasMore: false,
      messagesLoading: false,
      loading: false,
      error: null,
      initialized: false,
    });
  },

  fetchConversations: async (page = 1, opts = {}) => {
    if (!opts.quiet) set({ loading: true });
    set({ error: null });
    try {
      const data = await messageService.getConversations({ page, limit: get().limit });
      const conversations = (data.items || []).map(normalizeConversation);
      const totalPages = Math.max(1, Math.ceil((data.total ?? 0) / get().limit));
      set((s) => {
        const merged = page === 1 ? conversations : [...s.conversations, ...conversations];
        return {
          conversations: merged,
          contacts: deriveContacts(merged),
          total: data.total ?? 0,
          page: data.page ?? page,
          totalPages,
          unread: data.unread ?? s.unread,
          loading: false,
        };
      });
    } catch (err) {
      set({ loading: false, error: err.message || 'Erreur de chargement.' });
    }
  },

  refreshUnread: async () => {
    try {
      const data = await messageService.getUnreadCount();
      set({ unread: data.unread ?? 0 });
    } catch {
      /* Rafraîchissement silencieux. */
    }
  },

  setPage: (page) => get().fetchConversations(page),

  createConversation: async (payload) => {
    const data = await messageService.createConversation(payload);
    await get().fetchConversations(1, { quiet: true });
    get().selectConversation(data.conversationId);
    return data;
  },

  selectConversation: async (id) => {
    set({ activeId: id });
    get().markConversationRead(id);
    await get().fetchMessages(id);
  },

  fetchMessages: async (conversationId, opts = {}) => {
    if (!opts.quiet) set({ messagesLoading: true });
    try {
      const data = await messageService.getMessages(conversationId, { limit: 50 });
      set({
        messages: (data.items || []).map(normalizeMessage),
        messagesHasMore: Boolean(data.hasMore),
        messagesLoading: false,
      });
      if (!opts.quiet) get().refreshUnread();
    } catch {
      set({ messagesLoading: false });
    }
  },

  sendMessage: async (content) => {
    const { activeId } = get();
    if (!activeId) return null;
    const message = await messageService.sendMessage(activeId, content);
    const normalized = normalizeMessage(message);
    set((s) => ({
      messages: [...s.messages, normalized],
      conversations: s.conversations.map((c) =>
        c.id === activeId
          ? { ...c, lastMessage: normalized.text, lastMessageTime: normalized.timestamp }
          : c
      ),
    }));
    get().refreshUnread();
    return normalized;
  },

  markConversationRead: async (id) => {
    try {
      await messageService.markConversationRead(id);
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, unreadCount: 0 } : c
        ),
      }));
      get().refreshUnread();
    } catch {
      /* Silencieux. */
    }
  },

  markMessageRead: async (message) => {
    if (message.read) return;
    try {
      await messageService.markMessageRead(message.id);
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === message.id ? { ...m, read: true, status: 'read' } : m
        ),
      }));
    } catch {
      /* Silencieux. */
    }
  },

  deleteMessage: async (id) => {
    await messageService.deleteMessage(id);
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
  },
}));

/* Synchronisation avec la session : init au login, reset au logout. */
let prevAuthenticated = useAuthStore.getState().isAuthenticated;
useAuthStore.subscribe((state) => {
  const authenticated = state.isAuthenticated;
  if (authenticated && !prevAuthenticated) useMessageStore.getState().init();
  if (!authenticated && prevAuthenticated) useMessageStore.getState().reset();
  prevAuthenticated = authenticated;
});

/* Démarre immédiatement si une session persistée existe déjà. */
if (useAuthStore.getState().isAuthenticated) {
  useMessageStore.getState().init();
}

export default useMessageStore;
