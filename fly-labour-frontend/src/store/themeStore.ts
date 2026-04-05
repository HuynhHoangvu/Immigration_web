import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggle: () => void
  setTheme: (theme: Theme) => void
  hydrate: () => void
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      hydrate: () => {
        // Restore theme from localStorage and apply to DOM
        const stored = localStorage.getItem('fly-labour-theme')
        if (stored) {
          try {
            const { state } = JSON.parse(stored)
            if (state?.theme) {
              applyTheme(state.theme)
              set({ theme: state.theme })
            }
          } catch (e) {
            console.error('Failed to hydrate theme:', e)
          }
        }
      },
    }),
    {
      name: 'fly-labour-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    }
  )
)
