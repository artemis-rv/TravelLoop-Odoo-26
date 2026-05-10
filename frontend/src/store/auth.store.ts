import { create } from 'zustand'
import { User, AuthResponse } from '@/types'
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY } from '@/utils/constants'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (auth: AuthResponse) => void
  setUser: (user: User) => void
  logout: () => void
  hydrateFromStorage: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (auth: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, auth.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(auth.user))
    set({
      user: auth.user,
      token: auth.token,
      isAuthenticated: true,
    })
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  hydrateFromStorage: () => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY)
    const userStr = localStorage.getItem(USER_STORAGE_KEY)

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        set({
          token,
          user,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('Failed to hydrate auth store:', error)
      }
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))
