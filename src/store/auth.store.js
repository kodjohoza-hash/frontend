import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES } from '@utils/roles';
import { PERMISSIONS, hasAllPermissions as checkAllPermissions, hasAnyPermission as checkAnyPermission } from '@utils/permissions';

/**
 * BUS TIX CONNECT — Auth Store (Zustand + Persist)
 * Complete RBAC-aware auth state management
 * Persists: token + refreshToken + sessionExpiresAt to localStorage (key: btc-auth)
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
         SESSION COMPUTED
         ================================================ */
      get isSessionExpired() {
        const expires = get().sessionExpiresAt;
        if (!expires) return false;
        return Date.now() > expires;
      },

      /* ================================================
         AUTH ACTIONS
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

      setPermissions: (permissions) => set({ permissions }),

      clearSession: () => set({
        token: null,
        refreshToken: null,
        user: null,
        role: null,
        permissions: [],
        isAuthenticated: false,
        sessionExpiresAt: null,
      }),

      /* ================================================
         RBAC HELPERS
         ================================================ */

      /** Check if user has a specific role */
      hasRole: (role) => get().role === role,

      /** Check if user has any of the given roles */
      hasAnyRole: (roles) => roles.includes(get().role),

      /** Check if user has all given roles */
      hasAllRoles: (roles) => roles.every((r) => get().role === r),

      /** Check if user has a specific permission */
      hasPermission: (permission) => get().permissions.includes(permission),

      /** Check if user has ALL of the given permissions */
      hasAllPermissions: (required) => checkAllPermissions(get().permissions, required),

      /** Check if user has ANY of the given permissions */
      hasAnyPermission: (required) => checkAnyPermission(get().permissions, required),

      /** Check if user can access a route (role + permissions) */
      canAccess: ({ roles = [], permissions = [] }) => {
        const state = get();
        if (!state.isAuthenticated) return false;

        /* Super admin bypasses all checks */
        if (state.role === ROLES.SUPER_ADMIN) return true;

        /* Check role */
        if (roles.length > 0 && !roles.includes(state.role)) return false;

        /* Check permissions */
        if (permissions.length > 0) {
          const hasAll = permissions.every((p) => state.permissions.includes(p));
          if (!hasAll) return false;
        }

        return true;
      },

      /** Convenience: is the user a super admin? */
      isSuperAdmin: () => get().role === ROLES.SUPER_ADMIN,

      /** Convenience: is the user a client? */
      isClient: () => get().role === ROLES.CLIENT,

      /** Convenience: is the user a company admin? */
      isCompanyAdmin: () => get().role === ROLES.COMPANY_ADMIN,

      /** Convenience: is the user a counter agent? */
      isCounterAgent: () => get().role === ROLES.COUNTER_AGENT,
    }),
    {
      name: 'btc-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        sessionExpiresAt: state.sessionExpiresAt,
        user: state.user,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
