import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getLocalizedProject, projectIds } from '../../content/projects'
import { translations } from '../../MattediWorks/translation/i18n'
import TerminalProjectPage from './TerminalProjectPage'

function setViewportWidth(width) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  })
}

describe('TerminalProjectPage', () => {
  it('defaults to the play tab and gives the terminal the main viewport above the threshold', () => {
    const project = getLocalizedProject(projectIds.consoleAdventure, translations.en)
    setViewportWidth(1200)

    render(
      <TerminalProjectPage project={project}>
        <div>Console Adventure live terminal</div>
      </TerminalProjectPage>,
    )

    expect(screen.getByRole('heading', { name: 'Console Adventure' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: /console adventure view/i }).closest('header')).toHaveClass(
      'terminal-project-page__header',
    )
    expect(screen.getByRole('tab', { name: 'Play' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Console Adventure live terminal')).toBeInTheDocument()
    expect(screen.queryByText(project.summary)).not.toBeInTheDocument()
    expect(screen.queryByText(project.widthWarning)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open console adventure source/i })).toHaveAttribute(
      'href',
      'https://github.com/vtmattedi/ConsoleAdventure',
    )
  })

  it('switches to the overview tab with project details and fallback screenshots', () => {
    const project = getLocalizedProject(projectIds.consoleAdventure, translations.en)
    setViewportWidth(1200)

    render(
      <TerminalProjectPage project={project}>
        <div>Console Adventure live terminal</div>
      </TerminalProjectPage>,
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(project.summary)).toBeInTheDocument()
    expect(screen.getByText('Fantasy RPG')).toBeInTheDocument()
    expect(screen.getByText(project.widthWarning)).toBeInTheDocument()
    expect(screen.queryByText('Console Adventure live terminal')).not.toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /Console Adventure screenshot/i }).length).toBeGreaterThan(0)
  })

  it('toggles theatre mode on live play pages and clears it outside play', () => {
    const project = getLocalizedProject(projectIds.consoleAdventure, translations.en)
    setViewportWidth(1200)

    render(
      <TerminalProjectPage project={project}>
        <div>Console Adventure live terminal</div>
      </TerminalProjectPage>,
    )

    const page = screen.getByRole('heading', { name: 'Console Adventure' }).closest('.terminal-project-page')
    const theatreToggle = screen.getByRole('button', { name: /dim everything but the terminal/i })

    expect(theatreToggle).toHaveAttribute('aria-pressed', 'false')
    expect(page).not.toHaveClass('terminal-project-page--theatre')

    fireEvent.click(theatreToggle)

    expect(screen.getByRole('button', { name: /restore page lighting/i })).toHaveAttribute('aria-pressed', 'true')
    expect(page).toHaveClass('terminal-project-page--theatre')

    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }))

    expect(page).not.toHaveClass('terminal-project-page--theatre')
    expect(screen.queryByRole('button', { name: /restore page lighting/i })).not.toBeInTheDocument()
  })

  it('defaults to overview and does not mount the terminal stage below the threshold', () => {
    const project = getLocalizedProject(projectIds.rtsim, translations.en)
    setViewportWidth(500)

    render(
      <TerminalProjectPage project={project}>
        <div>RTSim live terminal</div>
      </TerminalProjectPage>,
    )

    expect(screen.getByRole('heading', { name: 'RTSim' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(project.widthWarning).closest('.info-panel')).not.toHaveClass('info-panel--hidden')
    expect(screen.getByText(/60-column terminal scene/i)).toBeInTheDocument()
    expect(screen.queryByText('RTSim live terminal')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /dim everything but the terminal/i })).not.toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /RTSim scheduler screenshot/i }).length).toBeGreaterThan(0)
  })
})
