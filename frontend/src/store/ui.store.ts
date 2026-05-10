import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  darkMode: boolean
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setDarkMode: (dark: boolean) => void
  toggleDarkMode: () => void
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  darkMode: false,
  notifications: [],

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setDarkMode: (dark) => set({ darkMode: dark }),

  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `${Date.now()}`,
          message,
          type,
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
