import { useThemeStore } from '@/store/themeStore'

/**
 * Hook để access theme state dễ dàng
 *
 * Usage:
 * const { theme, toggle, isDark } = useTheme()
 *
 * Trong template:
 * <div className="bg-white dark:bg-slate-900 text-black dark:text-white">
 *   {isDark ? 'Dark' : 'Light'}
 * </div>
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const setTheme = useThemeStore((s) => s.setTheme)

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggle,
    setTheme,
  }
}
