import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  users: [],
  isLoading: false,

  setUser: (user) => set({ user }),

  setUsers: (users) => set({ users }),

  setLoading: (isLoading) => set({ isLoading }),

  clearUser: () => set({ user: null, users: [] }),
}));

export default useUserStore;
