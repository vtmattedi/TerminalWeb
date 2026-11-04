import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import AssetPreload from '../AssetPreload/AssetPreload'
import LanguageSelector from '../../MattediWorks/Components/LanguageSelector'
import MattediWorksLogo from '../../MattediWorks/Components/MattediWorksLogo'
import MWLoading from '../../MattediWorks/MWLoading'
import ThemeSelector from '../../MattediWorks/Components/ThemeSelector'
import { useI18n } from '../../MattediWorks/hooks/useI18n'
import './AppShell.css'

const bootOverlayMs = 720

const navItems = [
  {
    to: '/',
    labelKey: 'home',
    icon: 'bi bi-house-fill',
    end: true,
  },
  {
    to: '/console-adventure',
    labelKey: 'consoleAdventure',
    icon: 'bi bi-play-fill',
  },
  {
    to: '/rtsim',
    labelKey: 'rtsim',
    icon: 'bi bi-pc-display-horizontal',
  },
]

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()
  const isHome = location.pathname === '/'
  const [isBooting, setIsBooting] = useState(true)
  const getNavLabel = (labelKey) => {
    const label = t.shell.nav[labelKey]

    if (!label) {
      throw new Error(`Missing navigation translation: ${labelKey}`)
    }

    return label
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsBooting(false), bootOverlayMs)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <div className="app-shell">
      <AssetPreload loadingLabel={t.common.loading} />
      <MWLoading show={isBooting} label={t.common.loading} />
      <header className="app-shell-header">
        <button
          type="button"
          className="app-shell-brand"
          onClick={() => navigate('/')}
          aria-label={t.shell.homeAria}
        >
          <span className="app-shell-logo-stack" aria-hidden="true">
            <MattediWorksLogo className="app-shell-logo" decorative />
          </span>
          <span className="app-shell-title">{t.shell.productName}</span>
        </button>

        <nav className="app-shell-nav" aria-label={t.shell.primaryNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (
                isActive ? 'app-shell-link active' : 'app-shell-link'
              )}
            >
              <span className={item.icon} aria-hidden="true" />
              <span className="app-shell-link-label">{getNavLabel(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-shell-actions">
          {!isHome && (
            <button
              type="button"
              className="app-shell-icon-button"
              onClick={() => navigate(-1)}
              aria-label={t.shell.back}
              title={t.shell.back}
            >
              <span className="bi bi-arrow-left" aria-hidden="true" />
            </button>
          )}
          <ThemeSelector />
          <LanguageSelector locale={locale} setLocale={setLocale} t={t} />
        </div>
      </header>

      <main className="app-shell-main">
        <Outlet />
      </main>
    </div>
  )
}
