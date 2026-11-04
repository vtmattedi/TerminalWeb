# Release QA Results

Project: Terminal Applications
Prepared: 2026-07-23

## Summary

Release QA passed for the current `newVersion` branch after Stackport Docker prep and handoff work.

The app is ready for Stackport deployment after the external deployment checks are completed:

- Push or merge the task commits to the selected production branch.
- Confirm whether Stackport should auto-deploy `main` or `newVersion`.
- Confirm Stackport can clone `vtmattedi/ConsoleAdventureReact`; add a GitHub credential only if the repo is private.
- Confirm `terminal.mattediworks.com` DNS points to the Stackport host.
- Confirm host port `3001` is free on the Stackport machine.

No runtime `.env` file, source-fetch credential, or submodule credential is required by the current Docker build.

## Local Verification

`package.json` and `package-lock.json` were unchanged, so `npm install` was not required for this QA pass.

Commands run from the repository root:

| Check | Result |
| --- | --- |
| `npm run lint` | Passed. |
| `npm run typecheck` | Passed. |
| `npm test -- --run` | Passed, 3 test files and 14 tests. |
| `npm run build` | Passed. Vite reported the existing large chunk warning for the main bundle. |
| `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` | Passed. Preview served `http://127.0.0.1:4173/` with HTTP 200 and was stopped after browser QA. |

## Stackport-Like Source Validation

Validated with a fresh non-recursive clone from the current local repository:

```sh
git clone --no-recurse-submodules --branch newVersion D:\Console\ConsoleAdventureReact C:\Users\Vity1\AppData\Local\Temp\terminal-release-qa-20260723010152
```

The clone matched Stackport's submodule limitation:

| Evidence | Result |
| --- | --- |
| `git submodule status` | Showed `-ea33111... src/ConsoleAdventure` and `-eb5f190... src/RTSim`, meaning both submodules were uninitialized. |
| `src/ConsoleAdventure` | Empty, 0 files. |
| `src/RTSim` | Empty, 0 files. |
| `docker/vendor/ConsoleAdventure/Game/Game.js` | Present. |
| `docker/vendor/RTSim/Simulator/Simulator.js` | Present. |

Docker validation from that clone:

| Check | Result |
| --- | --- |
| `docker compose config` | Passed. |
| `docker compose build` | Passed. The build copied `docker/vendor/ConsoleAdventure` and `docker/vendor/RTSim` into the submodule import paths before `npm run build`. |
| `docker compose up -d` | Passed. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/health` | Returned `204`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/` | Returned `200`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/console-adventure` | Returned `200`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/game` | Returned `200`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/rtsim` | Returned `200`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/not-a-route` | Returned `200` through the SPA fallback. |
| `docker compose ps` | Reported the service healthy. |
| `docker compose down` | Passed and removed the container/network. |

This validates that Docker deployment does not require initialized submodule folders, floating submodule branches, uncommitted local source, or source-fetch credentials.

## Browser QA

Browser QA was run against the production preview on `http://127.0.0.1:4173` using headless Chrome through the DevTools protocol.

Viewports:

| Viewport | Size |
| --- | --- |
| Desktop | `1440x1000` |
| Mobile/narrow | `390x844` |

Routes checked:

| Route | Result |
| --- | --- |
| `/` | Rendered home/catalog content, no visible broken images, no horizontal overflow, visible focusable controls. |
| `/console-adventure` | Rendered project page; desktop showed xterm, mobile showed the info fallback. |
| `/game` | Redirected to `/console-adventure`; desktop showed xterm, mobile showed the info fallback. |
| `/rtsim` | Rendered project page; desktop showed xterm, mobile showed the info fallback. |
| `/not-a-route` | Rendered the not-found page through the app shell. |

Interaction checks:

| Check | Result |
| --- | --- |
| Language switch | `PT` persisted `terminal-applications-locale=pt-BR`, visible copy changed to Portuguese, and the setting survived reload. `EN` restored English. |
| Theme switch | `Light`, `Dark`, and `System` persisted to `terminal-applications-theme` and updated document theme attributes. |
| xterm readability | RTSim remained visible/readable after switching to dark theme and navigating. |
| Loading overlay | Appeared during boot, cleared after startup, and had no active animations under `prefers-reduced-motion: reduce`. |
| Keyboard focus | Tab navigation produced visible focus styles on focusable shell controls. |
| Console Adventure input | Space input changed the terminal buffer; revisiting the route and pressing Space again produced the same first-input result, with no duplicate/stale handler behavior observed. |
| RTSim input and resize | Space advanced through opening/welcome to the main menu, ArrowDown changed selection, Enter changed the screen, resize preserved the terminal buffer, and revisit input worked without duplicate/stale handler behavior observed. |

No browser console errors or warnings were observed during the final QA run.

## Visual QA

Automated visual checks passed in both desktop and mobile viewports:

- No visible broken images.
- No horizontal page overflow.
- No clipped text in visible buttons, links, headings, paragraphs, list items, or project action controls.
- Mobile terminal routes used the documented info fallback instead of squeezing xterm into a narrow viewport.
- Focusable controls were present and keyboard focus was visible.

## Follow-Ups

No release-blocking defects were found, so no follow-up WOI defect tasks were created.

Remaining work is operational, not code-level: push or merge the branch, confirm DNS, confirm Stackport GitHub clone access, and confirm host port `3001` availability.
