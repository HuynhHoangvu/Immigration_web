import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authApi } from '@/services/api'
import type { User, RegisterData } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('fly-labour-token')
      if (token) {
        const res = await authApi.getMe()
        set({ user: res.data, token, isAuthenticated: true })
      }
    } catch {
      await SecureStore.deleteItemAsync('fly-labour-token')
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    const res = await authApi.login(email, password)
    const { user, token } = res.data
    await SecureStore.setItemAsync('fly-labour-token', token)
    set({ user, token, isAuthenticated: true })
  },

  register: async (data) => {
    const res = await authApi.register(data)
    const { user, token } = res.data
    await SecureStore.setItemAsync('fly-labour-token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('fly-labour-token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))
