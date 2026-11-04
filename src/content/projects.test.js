import { describe, expect, it } from 'vitest'
import {
  getLocalizedProject,
  getProject,
  homeProjectIds,
  projectIds,
  schedulerAlgorithms,
  terminalProjectIds,
} from './projects'
import { translations } from '../MattediWorks/translation/i18n'

describe('project content model', () => {
  it('promotes Terminal Engine on home without creating a route', () => {
    const project = getProject(projectIds.terminalEngine)
    const localized = getLocalizedProject(projectIds.terminalEngine, translations.en)

    expect(project.isPromoted).toBe(true)
    expect(project.routePath).toBeNull()
    expect(project.sourceUrl).toBeNull()
    expect(homeProjectIds).toContain(projectIds.terminalEngine)
    expect(terminalProjectIds).not.toContain(projectIds.terminalEngine)
    expect(localized.highlights.join(' ')).toMatch(/virtual terminal API/i)
    expect(localized.highlights.join(' ')).toMatch(/swapping the host hooks/i)
  })

  it('models Console Adventure as a routed xterm.js terminal app with source and screenshots', () => {
    const project = getLocalizedProject(projectIds.consoleAdventure, translations.en)

    expect(project.routePath).toBe('/console-adventure')
    expect(project.legacyRoutePath).toBe('/game')
    expect(project.minimumViewportWidth).toBe(1040)
    expect(project.sourceUrl).toBe('https://github.com/vtmattedi/ConsoleAdventure')
    expect(project.summary).toMatch(/Terminal fantasy RPG/i)
    expect(project.tags).toEqual(expect.arrayContaining(['Node.js runtime', 'xterm.js web port']))
    expect(project.screenshots.length).toBeGreaterThan(0)
  })

  it('models RTSim algorithms, route, source, and screenshots from the readme facts', () => {
    const project = getLocalizedProject(projectIds.rtsim, translations.en)

    expect(project.routePath).toBe('/rtsim')
    expect(project.minimumViewportWidth).toBe(720)
    expect(project.sourceUrl).toBe('https://github.com/vtmattedi/rtsim')
    expect(project.algorithms).toEqual(schedulerAlgorithms)
    expect(project.algorithms).toEqual(['EDF', 'FCFS', 'HRRN', 'Priority', 'Round Robin', 'SJF'])
    expect(project.description).toMatch(/EDF, FCFS, HRRN, Priority, Round Robin, and SJF/i)
    expect(project.screenshots.length).toBeGreaterThan(0)
  })
})
