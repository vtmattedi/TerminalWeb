import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import Info from '../Info/Info'
import './TerminalProjectPage.css'

const defaultLabels = {
  overview: 'Overview',
  play: 'Play',
  viewLabel: 'view',
  theatreOn: 'Dim everything but the terminal',
  theatreOff: 'Restore page lighting',
}

const getViewportWidth = () => {
  if (typeof window === 'undefined') {
    return Number.POSITIVE_INFINITY
  }

  return window.innerWidth
}

export default function TerminalProjectPage({ project, children, labels = defaultLabels }) {
  const minimumViewportWidth = project.minimumViewportWidth ?? 0
  const [viewportWidth, setViewportWidth] = useState(getViewportWidth)
  const [activeTab, setActiveTab] = useState(() => (
    getViewportWidth() >= minimumViewportWidth ? 'play' : 'overview'
  ))
  const [isTheatreMode, setIsTheatreMode] = useState(false)
  const showTerminal = viewportWidth >= minimumViewportWidth
  const isOverview = activeTab === 'overview'
  const isPlay = activeTab === 'play'
  const tabLabels = {
    ...defaultLabels,
    ...labels,
  }
  const overviewPanelId = `${project.id}-overview-panel`
  const playPanelId = `${project.id}-play-panel`
  const showTheatreToggle = isPlay && showTerminal
  const theatreMode = showTheatreToggle && isTheatreMode
  const theatreLabel = isTheatreMode ? tabLabels.theatreOff : tabLabels.theatreOn
  const pageClassName = [
    'terminal-project-page',
    isPlay && 'terminal-project-page--play',
    theatreMode && 'terminal-project-page--theatre',
  ].filter(Boolean).join(' ')

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(getViewportWidth())
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if ((!isPlay || !showTerminal) && isTheatreMode) {
      setIsTheatreMode(false)
    }
  }, [isPlay, isTheatreMode, showTerminal])

  return (
    <section
      className={pageClassName}
      aria-labelledby={`${project.id}-page-title`}
    >
      <header className="terminal-project-page__header">
        <div className="terminal-project-page__summary">
          <span className="terminal-project-page__kicker">{project.label}</span>
          <h1 id={`${project.id}-page-title`}>{project.name}</h1>
          {isOverview && (
            <>
              <p>{project.summary}</p>
              <ul className="terminal-project-page__tags" aria-label={`${project.name} capabilities`}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="terminal-project-page__tabs" role="tablist" aria-label={`${project.name} ${tabLabels.viewLabel}`}>
          <button
            type="button"
            role="tab"
            aria-selected={isOverview}
            aria-controls={overviewPanelId}
            id={`${project.id}-overview-tab`}
            onClick={() => setActiveTab('overview')}
          >
            {tabLabels.overview}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isPlay}
            aria-controls={playPanelId}
            id={`${project.id}-play-tab`}
            onClick={() => setActiveTab('play')}
          >
            {tabLabels.play}
          </button>
        </div>

        <div className="terminal-project-page__actions">
          {showTheatreToggle && (
            <button
              type="button"
              className="terminal-project-page__theatre-toggle"
              aria-label={theatreLabel}
              aria-pressed={isTheatreMode}
              title={theatreLabel}
              onClick={() => setIsTheatreMode((current) => !current)}
            >
              {isTheatreMode ? (
                <Sun size={18} strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <Moon size={18} strokeWidth={2.5} aria-hidden="true" />
              )}
            </button>
          )}
          <a
            className="terminal-project-page__source"
            href={project.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={project.sourceAria}
          >
            <span className="bi bi-github" aria-hidden="true"></span>
            {project.sourceLabel}
          </a>
        </div>
      </header>

      {isOverview && (
        <section
          className="terminal-project-page__overview"
          role="tabpanel"
          id={overviewPanelId}
          aria-labelledby={`${project.id}-overview-tab`}
        >
          <Info project={project} />
        </section>
      )}

      {isPlay && (
        <section
          className="terminal-project-page__play"
          role="tabpanel"
          id={playPanelId}
          aria-labelledby={`${project.id}-play-tab`}
        >
          {showTerminal ? (
            <div className="terminal-project-page__stage">
              {children}
            </div>
          ) : (
            <Info project={project} />
          )}
        </section>
      )}
    </section>
  )
}
