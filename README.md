# Terminal Engine — Browser Host

A browser host for terminal applications built around a shared console abstraction.
The goal is to let applications render through the same console interface in a
Node.js terminal, in the browser through [xterm.js](https://xtermjs.org/), or
in tests, without rewriting their screen-rendering logic.

**Live application:** https://terminal.mattediworks.com

This repository was originally built as a web interface for Console Adventure.
It now also serves RTSim, a CPU scheduling simulator. The terminal engine is the
shared abstraction; the games and simulations are applications using it.

## How it works

The console abstraction is centered on `BasicConsole`. Application code calls
its methods for output, input-related behavior, cursor control, clearing the
screen, and terminal dimensions. Host-specific adapters connect those operations
to Node.js, xterm.js, or a test environment.

The browser host uses React and xterm.js to display and interact with the
applications. Input is normalized at the browser boundary so application code
does not need to interpret DOM keyboard events. ANSI-aware text operations
support alignment, wrapping, and cropping without counting color escape codes
as visible characters.

The engine is **not yet a separately published package**: its implementation
remains coupled to the applications' source trees.

## Applications

- [Console Adventure](https://github.com/vtmattedi/ConsoleAdventure):
  a terminal fantasy RPG.
- [RTSim](https://github.com/vtmattedi/RTSim):
  a discrete-time CPU scheduling simulator.

The applications have their own repositories. This repository provides the
browser-facing integration rather than owning their game or simulation logic.

## Source and build trade-offs

The deployed browser host uses committed application source snapshots, rather
than fetching the latest application source during production builds. This
makes production builds independent of recursive Git clones and moving remote
branches, but snapshots need to be refreshed manually.

**Branch caveat:** the default branch has not yet been fully reconciled with
the production branch. Its `package.json` still contains a legacy
`prebuild` command that runs `git submodule update --recursive --remote`.
That command follows upstream changes and can make builds less reproducible;
do not assume it represents the current production build process.

## Current limitations

- The engine has not been extracted into a standalone reusable package.
- Production application snapshots require manual synchronization.
- The default branch needs review against the deployed version.
- Terminal layouts depend on available screen dimensions; not every application
  layout works on narrow displays.

For a project-level explanation of the architecture and design decisions, see
the [Terminal Engine entry in the personal-site source](https://github.com/vtmattedi/personal-site/blob/main/src/content/briefs.ts).
