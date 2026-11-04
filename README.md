# Terminal Applications

**Terminal Applications** is the MattediWorks browser catalog for console applications ported to React and xterm.js.

Production domain: [https://terminal.mattediworks.com/](https://terminal.mattediworks.com/)

The current public terminal apps are:

- **Console Adventure**: a fantasy terminal RPG hosted through an xterm.js web port.
- **RTSim**: a discrete-time preemptive scheduler simulator with an xterm.js scene renderer.

The underlying console abstraction work is tracked as the **Terminal Engine** project. See [docs/terminal-engine.md](docs/terminal-engine.md) for the current boundary: a `BasicConsole`-style class owns write, clear, cursor, width, color, and layout helpers while host adapters bind that surface to Node, xterm.js, or tests.

## Terminal Engine Architecture

The browser host uses React and xterm.js to display and interact with terminal applications. The shared console abstraction is centered on a `BasicConsole`-style API for writing output, clearing screens, controlling the cursor, measuring terminal dimensions, and applying ANSI-aware color and text-layout helpers. Host-specific adapters can connect that interface to Node.js terminals, xterm.js, or test harnesses without requiring the rendering code to depend on the host.

Browser keyboard events are normalized at the input boundary into application-level commands instead of being interpreted directly by the renderers. ANSI-aware formatting allows terminal text to be aligned, wrapped, and cropped without counting escape sequences as visible characters.

Terminal Engine is not yet an independently published package; its implementation remains coupled to the application source trees. The underlying applications are maintained separately in [Console Adventure](https://github.com/vtmattedi/ConsoleAdventure) and [RTSim](https://github.com/vtmattedi/RTSim). This repository owns their browser integration rather than their game or simulation logic. For additional architectural context, see the [Terminal Engine entry in the personal-site source](https://github.com/vtmattedi/personal-site/blob/main/src/content/briefs.ts).

## Routes

- `/`: MattediWorks-branded app catalog.
- `/console-adventure`: canonical Console Adventure route.
- `/game`: legacy alias that redirects to `/console-adventure`.
- `/rtsim`: RTSim route.

## Quick Start

Install root dependencies and initialize the pinned terminal app source submodules:

```sh
npm install
npm run sync:submodules
```

Run the local Vite dev server:

```sh
npm run dev
```

Build the production bundle:

```sh
npm run build
```

Preview the production bundle locally:

```sh
npm run preview
```

## Verification

Use these checks before committing app changes:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The root checks cover the active Vite app, MattediWorks integration, route/content tests, and terminal page shell tests. ESLint intentionally ignores the separately owned `src/ConsoleAdventure` and `src/RTSim` submodule source trees plus the Docker vendor snapshots copied from them.

## Source Ownership

`src/ConsoleAdventure` and `src/RTSim` are git submodules pinned by the root repository gitlinks. `npm run build` uses whatever source is already present at those paths; it does not fetch remote branches or move submodules.

For local development, use:

```sh
npm run sync:submodules
```

That command runs `git submodule update --init --recursive` and checks out the exact commits pinned by the root repository.

See [docs/source-ownership.md](docs/source-ownership.md) for the deterministic source strategy that Docker/Stackport work must follow.

Current Docker/Stackport builds use committed source snapshots under `docker/vendor/`, copied into the app's existing `src/ConsoleAdventure` and `src/RTSim` import paths during the container build. This lets Stackport build from a non-recursive checkout without fetching submodules.

## App Structure

The root React app is a Vite application using React Router. `src/index.jsx` defines the route map and wraps the app with the MattediWorks i18n and theme providers.

Reusable project metadata lives in `src/content/projects.js`. It defines Terminal Engine, Console Adventure, and RTSim IDs, localized copy keys, routes, source URLs, screenshots, tags, and minimum viewport widths for live terminal mounting.

The shared terminal page shell lives at `src/Components/TerminalProjectPage/TerminalProjectPage.jsx`. It renders project headers, tags, source links, bounded terminal stages, and screenshot fallbacks. Console Adventure mounts at 1040 px and wider; RTSim mounts at 720 px and wider.

## Theme And I18n

The app supports `light`, `dark`, and `system` theme preferences through `ThemeSelector`. The selected preference is stored in `localStorage` under `terminal-applications-theme`; `index.html` applies the resolved theme before the React bundle runs to avoid a mismatched first paint.

The app supports `en` and `pt-BR` locales through `LanguageSelector`. The selected locale is stored under `terminal-applications-locale`; when no preference exists, Portuguese browser languages resolve to `pt-BR` and all others resolve to `en`.

Visible shell, home/catalog, terminal page, loading, source-link, fallback, and not-found copy reads from `src/MattediWorks/translation/i18n.ts`.

## Branding And Metadata

MattediWorks branding is served from local repository assets. Sansation font files live under `src/MattediWorks/assets/fonts/` and are wired through `src/index.css`.

Browser, install, and social metadata is maintained in:

- `index.html`
- `public/manifest.json`
- `public/site.webmanifest`
- `public/robots.txt`
- `public/sitemap.xml`
- [docs/metadata-seo.md](docs/metadata-seo.md)

The active browser/app icon set uses MattediWorks assets from `public/mattediworks-icon.svg`, `public/favicon-*`, `public/apple-touch-icon.png`, `public/logo192.png`, and `public/logo512.png`.

No analytics or speed-insight provider is bundled in the app. Any future analytics provider must be documented with its Stackport configuration and environment needs before deployment.

## Deployment

The intended production host is Stackport at `terminal.mattediworks.com`.

This repository builds a static Vite bundle and ships a production Docker/Compose setup for Stackport. Stackport does not initialize git submodules on pull, so the Dockerfile follows the source strategy in [docs/source-ownership.md](docs/source-ownership.md): committed vendor snapshots are copied into the submodule import paths before `npm run build`.

Expected deployment direction:

- Serve the built `dist/` output from Nginx.
- Expose one HTTP entrypoint from Compose: host port `3001` to container port `80`.
- Let Stackport/Nginx handle HTTPS and certificates.
- Keep runtime secrets unnecessary unless a documented analytics/config provider is added later.

Docker prep details live in [docs/docker-stackport.md](docs/docker-stackport.md). The Stackport onboarding handoff lives in [docs/stackport.md](docs/stackport.md).
