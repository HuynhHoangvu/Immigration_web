import { useThemeStore } from '@core/store/themeStore'

/**
 * Hook để access theme state dễ dàng
 *
 * Usage:
 * const { theme, toggle, isDark } = useTheme()
 *
 * Trong template (app chỉ dùng giao diện sáng):
 * <div className="bg-white text-slate-900">...</div>
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const setTheme = useThemeStore((s) => s.setTheme)

  return {
    theme,
    /** App is light-theme only — always false. Kept for call sites still branching on theme. */
    isDark: false,
    isLight: true,
    toggle,
    setTheme,
  }
}
