import { create } from 'zustand';
import notificationService from '../services/notification.service';
import useAuthStore from './auth.store';

const POLL_INTERVAL = 30000;

/** Mappe un item API vers la forme attendue par les composants UI. */
const normalize = (n) => ({
  ...n,
  date: n.createdAt || n.created_at || null,
  bookingRef: n.data?.reference || n.data?.bookingRef || null,
  company: n.data?.compagnieNom || n.data?.companyName || null,
  detail: n.data?.raison || null,
  actionLabel: n.data?.actionLabel || (n.actionPath ? 'Voir les détails' : null),
});

const useNotificationStore = create((set, get) => ({
  items: [],
  total: 0,
  unread: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
  pollId: null,
  initialized: false,

  init: () => {
    const { isAuthenticated, token } = useAuthStore.getState();
    if (!isAuthenticated || !token) return;
    if (get().initialized) return;
    set({ initialized: true });
    get().fetchPage(1, { quiet: true });
    get().refreshUnread();
    get().startPolling();
  },

  startPolling: () => {
    if (get().pollId) return;
    const pollId = setInterval(() => {
      get().refreshUnread();
      get().fetchPage(get().page, { quiet: true });
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
      items: [],
      total: 0,
      unread: 0,
      page: 1,
      totalPages: 1,
      loading: false,
      error: null,
      initialized: false,
    });
  },

  fetchPage: async (page = 1, opts = {}) => {
    if (!opts.quiet) set({ loading: true });
    set({ error: null });
    try {
      const data = await notificationService.getList({ page, limit: get().limit });
      set({
        items: (data.items || []).map(normalize),
        total: data.total ?? 0,
        unread: data.unread ?? get().unread,
        page: data.page ?? page,
        totalPages: data.totalPages ?? 1,
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message || 'Erreur de chargement.' });
    }
  },

  refreshUnread: async () => {
    try {
      const data = await notificationService.getUnreadCount();
      set({ unread: data.unread ?? 0 });
    } catch {
      /* Rafraîchissement silencieux : ne casse pas l'UI. */
    }
  },

  setPage: (page) => get().fetchPage(page),

  markRead: async (id) => {
    try {
      await notificationService.markRead(id);
      set((s) => ({
        items: s.items.map((n) => (n.id === id && !n.read ? { ...n, read: true, readAt: new Date().toISOString() } : n)),
        unread: s.unread > 0 ? s.unread - 1 : 0,
      }));
    } catch {
      /* Silencieux. */
    }
  },

  markAllRead: async () => {
    try {
      const data = await notificationService.markAllRead();
      set((s) => ({
        items: s.items.map((n) => ({ ...n, read: true, readAt: n.readAt || new Date().toISOString() })),
        unread: data.unread ?? 0,
      }));
    } catch {
      /* Silencieux. */
    }
  },

  remove: async (id) => {
    try {
      await notificationService.remove(id);
      set((s) => {
        const removed = s.items.find((n) => n.id === id);
        return {
          items: s.items.filter((n) => n.id !== id),
          unread: removed && !removed.read && s.unread > 0 ? s.unread - 1 : s.unread,
          total: Math.max(0, s.total - 1),
        };
      });
    } catch {
      /* Silencieux. */
    }
  },

  removeRead: async () => {
    const { items } = get();
    const read = items.filter((n) => n.read);
    await Promise.all(read.map((n) => notificationService.remove(n.id).catch(() => {})));    set((s) => ({
      items: s.items.filter((n) => !n.read),
      total: Math.max(0, s.total - read.length),
    }));
  },
}));

/* Synchronisation avec la session : init au login, reset au logout. */
let prevAuthenticated = useAuthStore.getState().isAuthenticated;
useAuthStore.subscribe((state) => {
  const authenticated = state.isAuthenticated;
  if (authenticated && !prevAuthenticated) useNotificationStore.getState().init();
  if (!authenticated && prevAuthenticated) useNotificationStore.getState().reset();
  prevAuthenticated = authenticated;
});

/* Démarre immédiatement si une session persistée existe déjà. */
if (useAuthStore.getState().isAuthenticated) {
  useNotificationStore.getState().init();
}

export default useNotificationStore;
