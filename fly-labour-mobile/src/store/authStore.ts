import { create } from 'zustand'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { authApi } from '@/services/api'
import type { User, RegisterData } from '@/types'

// Web fallback — expo-secure-store không hỗ trợ web
const storage = {
  getItem: (key: string) =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.getItem(key))
      : SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.setItem(key, value))
      : SecureStore.setItemAsync(key, value),
  deleteItem: (key: string) =>
    Platform.OS === 'web'
      ? Promise.resolve(localStorage.removeItem(key))
      : SecureStore.deleteItemAsync(key),
}

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
      const token = await storage.getItem('fly-labour-token')
      if (token) {
        try {
          const res = await authApi.getMe()
          set({ user: res.data, token, isAuthenticated: true })
        } catch (err: any) {
          // Chỉ xóa token khi backend trả 401 (token thật sự hết hạn)
          // Không xóa khi lỗi mạng / server timeout
          if (err?.response?.status === 401) {
            await storage.deleteItem('fly-labour-token')
          } else {
            // Lỗi mạng — giữ token, để user vào app bình thường
            set({ token, isAuthenticated: false })
          }
        }
      }
    } catch {
      // Lỗi đọc SecureStore — bỏ qua
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (email, password) => {
    const res = await authApi.login(email, password)
    const { user, token } = res.data
    await storage.setItem('fly-labour-token', token)
    set({ user, token, isAuthenticated: true })
  },

  register: async (data) => {
    const res = await authApi.register(data)
    const { user, token } = res.data
    await storage.setItem('fly-labour-token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: async () => {
    await storage.deleteItem('fly-labour-token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))
