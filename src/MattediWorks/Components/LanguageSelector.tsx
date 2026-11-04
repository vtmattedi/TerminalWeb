import { Info } from 'lucide-react'
import { localeLabels, locales, type Locale, type Translation } from '../translation/i18n'
import './LanguageSelector.css'

type LanguageSelectorProps = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translation
}

export default function LanguageSelector({ locale, setLocale, t }: LanguageSelectorProps) {
  return (
    <div className="language-switcher" aria-label={t.languageLabel} role="group">
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={locale === option}
          onClick={() => setLocale(option)}
        >
          {localeLabels[option]}
        </button>
      ))}
      <span
        className="language-switcher__info"
        tabIndex={0}
        aria-label={t.languageAppNotice}
        data-tooltip={t.languageAppNotice}
        title={t.languageAppNotice}
      >
        <Info size={15} strokeWidth={2.5} aria-hidden="true" />
      </span>
    </div>
  )
}
