import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * BUS TIX CONNECT — Auth Store (Zustand + Persist)
 * Handles: user, token, refreshToken, role, permissions, loading, isAuthenticated
 * Persists: token + refreshToken to localStorage (key: btc-auth)
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      /* ================================================
         STATE
         ================================================ */
      user: null,
      token: null,
      refreshToken: null,
      role: null,
      permissions: [],
      loading: false,
      isAuthenticated: false,
      sessionExpiresAt: null,

      /* ================================================
         COMPUTED
         ================================================ */
      get isSessionExpired() {
        const expires = get().sessionExpiresAt;
        if (!expires) return false;
        return Date.now() > expires;
      },

      /* ================================================
         ACTIONS
         ================================================ */
      setToken: (token) => set({ token, isAuthenticated: !!token }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      setUser: (user) => set({
        user,
        role: user?.role || null,
        permissions: user?.permissions || [],
      }),

      setLoading: (loading) => set({ loading }),

      setSessionExpiry: (expiresAt) => set({ sessionExpiresAt: expiresAt }),

      login: (data) => set({
        user: data.user,
        token: data.token,
        refreshToken: data.refreshToken || null,
        role: data.user?.role || null,
        permissions: data.user?.permissions || [],
        isAuthenticated: true,
        loading: false,
        sessionExpiresAt: data.expiresAt || null,
      }),

      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
        loading: false,
        sessionExpiresAt: null,
      }),

      refreshSession: (data) => set({
        token: data.token,
        refreshToken: data.refreshToken || get().refreshToken,
        sessionExpiresAt: data.expiresAt || null,
      }),

      updateProfile: (userData) => set((state) => ({
        user: { ...state.user, ...userData },
      })),

      clearSession: () => set({
        token: null,
        refreshToken: null,
        user: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
        sessionExpiresAt: null,
      }),

      hasRole: (role) => get().role === role,

      hasPermission: (permission) => get().permissions.includes(permission),

      hasAnyRole: (roles) => roles.includes(get().role),
    }),
    {
      name: 'btc-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    }
  )
);

export default useAuthStore;
