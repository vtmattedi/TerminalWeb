import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  changeTheme: (theme: Theme) => void
}

const THEME_STORAGE_KEY = 'terminal-applications-theme'
const THEMES = ['light', 'dark', 'system'] satisfies Theme[]
const RESOLVED_THEMES = ['light', 'dark'] satisfies ResolvedTheme[]

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return THEMES.includes(value as Theme)
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    return isTheme(storedTheme) ? storedTheme : 'system'
  } catch {
    return 'system'
  }
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyDocumentTheme(theme: Theme, resolvedTheme: ResolvedTheme) {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement

  root.dataset.theme = resolvedTheme
  root.dataset.themePreference = theme
  root.classList.remove(...RESOLVED_THEMES)
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (event: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    updateSystemTheme(mediaQuery)
    mediaQuery.addEventListener('change', updateSystemTheme)

    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  useEffect(() => {
    applyDocumentTheme(theme, resolvedTheme)
  }, [resolvedTheme, theme])

  const changeTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // The in-memory theme still updates when storage is unavailable.
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      changeTheme,
    }),
    [changeTheme, resolvedTheme, theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}
