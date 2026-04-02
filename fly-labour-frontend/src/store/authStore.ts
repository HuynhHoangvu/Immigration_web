import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState, RegisterData } from '@/types'
import { authApi } from '@/services/api'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const res = await authApi.login(email, password)
        const { user, token } = res.data
        set({ user, token, isAuthenticated: true })
      },

      register: async (data: RegisterData) => {
        const res = await authApi.register(data)
        const { user, token } = res.data
        set({ user, token, isAuthenticated: true })
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'fly-labour-auth',
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
