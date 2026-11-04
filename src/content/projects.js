import { terminalAssets } from '../assets/terminalAssets'

export const projectIds = Object.freeze({
  terminalEngine: 'terminal-engine',
  consoleAdventure: 'console-adventure',
  rtsim: 'rtsim',
})

export const schedulerAlgorithms = Object.freeze([
  'EDF',
  'FCFS',
  'HRRN',
  'Priority',
  'Round Robin',
  'SJF',
])

export const projectContent = Object.freeze([
  {
    id: projectIds.terminalEngine,
    copyKey: 'terminalEngine',
    kind: 'engine',
    routePath: null,
    sourceUrl: null,
    docsPath: 'docs/terminal-engine.md',
    iconClass: 'bi bi-cpu',
    isPromoted: true,
    appearsOnHome: true,
    appearsInNav: false,
    primaryImage: null,
    screenshots: [],
    tagKeys: ['ansiOutput', 'xtermBridge', 'runtimeBoundary', 'resizeContract'],
  },
  {
    id: projectIds.consoleAdventure,
    copyKey: 'consoleAdventure',
    kind: 'terminal-app',
    routePath: '/console-adventure',
    legacyRoutePath: '/game',
    sourceUrl: 'https://github.com/vtmattedi/ConsoleAdventure',
    minimumViewportWidth: 1040,
    iconClass: 'bi bi-play',
    isPromoted: false,
    appearsOnHome: true,
    appearsInNav: true,
    primaryImage: terminalAssets.consoleAdventure.logo,
    screenshots: terminalAssets.consoleAdventure.fallbackScreenshots,
    tagKeys: ['fantasyRpg', 'nodeRuntime', 'xtermWebPort', 'turnBasedCombat'],
  },
  {
    id: projectIds.rtsim,
    copyKey: 'rtsim',
    kind: 'terminal-app',
    routePath: '/rtsim',
    sourceUrl: 'https://github.com/vtmattedi/rtsim',
    minimumViewportWidth: 720,
    iconClass: 'bi bi-pc-display-horizontal',
    isPromoted: false,
    appearsOnHome: true,
    appearsInNav: true,
    primaryImage: terminalAssets.rtsim.readmeScreenshots[1],
    screenshots: terminalAssets.rtsim.readmeScreenshots,
    algorithms: schedulerAlgorithms,
    tagKeys: ['schedulerSimulator', 'nodeRuntime', 'xtermWebPort', 'preemptiveScheduling'],
  },
])

export const projectsById = Object.freeze(
  Object.fromEntries(projectContent.map((project) => [project.id, project])),
)

export const homeProjectIds = Object.freeze([
  projectIds.terminalEngine,
  projectIds.consoleAdventure,
  projectIds.rtsim,
])

export const terminalProjectIds = Object.freeze([
  projectIds.consoleAdventure,
  projectIds.rtsim,
])

export function getProject(projectId) {
  const project = projectsById[projectId]

  if (!project) {
    throw new Error(`Unknown project content id: ${projectId}`)
  }

  return project
}

export function getLocalizedProject(projectId, translations) {
  const project = getProject(projectId)
  const copy = translations.projects[project.copyKey]

  if (!copy) {
    throw new Error(`Missing project translation: ${project.copyKey}`)
  }

  return {
    ...project,
    ...copy,
    tags: project.tagKeys.map((tagKey) => copy.tags[tagKey] ?? tagKey),
    highlights: copy.highlights ?? [],
    ctaLabel: copy.ctaLabel ?? copy.name,
    sourceLabel: copy.sourceLabel ?? '',
    sourceAria: copy.sourceAria ?? '',
    screenshotAlt: copy.screenshotAlt ?? `${copy.name} screenshot`,
    widthWarning: copy.widthWarning ?? '',
  }
}

export function getLocalizedProjects(projectIdsToLocalize, translations) {
  return projectIdsToLocalize.map((projectId) => getLocalizedProject(projectId, translations))
}
