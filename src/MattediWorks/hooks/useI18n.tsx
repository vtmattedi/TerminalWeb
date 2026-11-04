import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { locales, translations, type Locale, type Translation } from '../translation/i18n'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translation
}

const LOCALE_STORAGE_KEY = 'terminal-applications-locale'
const I18nContext = createContext<I18nContextValue | null>(null)

function isLocale(value: string | null): value is Locale {
  return locales.includes(value as Locale)
}

function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const languageList = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language]

  return languageList.some((language) => language?.toLowerCase().startsWith('pt'))
    ? 'pt-BR'
    : 'en'
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  try {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)

    return isLocale(storedLocale) ? storedLocale : getBrowserLocale()
  } catch {
    return getBrowserLocale()
  }
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.lang = locale
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)
  const t = translations[locale]

  if (!t) {
    throw new Error(`Missing translations for locale: ${locale}`)
  }

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)

    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
    } catch {
      // The in-memory locale still updates when storage is unavailable.
    }
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }

  return context
}
