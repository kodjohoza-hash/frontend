import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      language: 'fr',

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useAppStore;
