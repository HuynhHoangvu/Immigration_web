import { create } from 'zustand'

/** App is light-only; `dark` class is never applied */
function applyLightRoot() {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('dark')
}

export type Theme = 'light'

interface ThemeState {
  theme: Theme
  /** No-op — dark mode removed */
  toggle: () => void
  setTheme: (_t: 'light' | 'dark') => void
  hydrate: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggle: () => {},
  setTheme: () => {
    applyLightRoot()
    set({ theme: 'light' })
  },
  hydrate: () => {
    applyLightRoot()
    set({ theme: 'light' })
  },
}))
