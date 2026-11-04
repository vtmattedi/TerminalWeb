# Modernization Audit

Project: Terminal Engine / Terminal Applications  
Audit date: 2026-07-22  
Workspace: `D:\Console\ConsoleAdventureReact`

## Purpose

This audit records the current repository shape before behavior-changing modernization work begins. Later tasks should use it as the baseline for route compatibility, terminal app behavior, source ownership, asset handling, build risks, and deployment assumptions.

No app behavior was changed for this task.

## Current Repository Snapshot

The root project was migrated from Create React App to Vite in task 4:

- Root package name was renamed to `terminal-applications` in task 3.
- Runtime script is `npm run dev`, backed by `vite`.
- `npm start` is kept as an alias for `vite`.
- Production script is `npm run build`, backed by `vite build`.
- Production preview script is `npm run preview`, backed by `vite preview`.
- `test`, `lint`, and `typecheck` are real quality gates added during dependency hygiene.
- At audit time, root `prebuild` ran `git submodule update --recursive --remote`. Task 2 removed that floating build hook and added `npm run sync:submodules` for explicit pinned submodule initialization.
- The lockfile is `package-lock.json`.

The repository currently contains two terminal app source trees as git submodules:

- `src/ConsoleAdventure`
  - URL: `https://github.com/vtmattedi/ConsoleAdventure`
  - Checked out at `f7e977f` during this audit.
  - `package.json` declares `"type": "module"` and version `0.2.2`.
- `src/RTSim`
  - URL: `https://github.com/vtmattedi/rtsim.git`
  - Checked out at `3e5c571` during this audit.
  - `package.json` declares `"type": "module"` and version `0.2.2`.

Root git status at the start of the audit showed `src/MattediWorks/` as untracked. Task 4 brought those files into the Vite app state, and task 5 added the runtime dependencies needed for the loading asset component to compile when imported.

Task 2 source ownership decision is recorded in `docs/source-ownership.md`: keep the submodules as developer provenance, do not update them during `npm run build`, and require the later Docker build to fetch exact public commits for Stackport-style non-recursive checkouts.

## Current Routes

Routes are defined in `src/index.jsx` with `createBrowserRouter`.

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `src/home.jsx` | Home/catalog page with buttons for Console Adventure and RTSim. |
| `/console-adventure` | `src/game.jsx` | Canonical Console Adventure route. |
| `/game` | redirect | Legacy alias that redirects to `/console-adventure`. |
| `/rtsim` | `src/rtsim.jsx` | RTSim route. |
| `*` | `src/Components/AppShell/NotFound.jsx` | Simple not-found page with home navigation. |

The current modernization route map is:

- `/`: Terminal Applications home/catalog.
- `/console-adventure`: canonical Console Adventure page.
- `/game`: legacy alias or redirect to `/console-adventure`.
- `/rtsim`: RTSim page.
- `*`: not-found page that returns users to `/`.

## Current App Shell

`src/index.jsx` renders:

- `React.StrictMode`
- `RouterProvider`

The router renders `App` as the root layout route.

Task 6 replaced the old pass-through `src/App.jsx` branches with a single shell:

- It imports Bootstrap Icons globally.
- It wraps routes in `<div className="bgDiv">`.
- It renders `src/Components/AppShell/AppShell.jsx`, which owns shared brand, primary route navigation, back control, theme selector, language selector, asset preloading, and the route outlet.
- Terminal-specific responsive behavior remains in terminal pages.

This is the main path for branding, theme, i18n, and loading integration.

## Current Pages And Shared Components

### Home

`src/home.jsx` currently:

- Renders the MattediWorks-branded Terminal Applications catalog from the shared project content model.
- Makes the first viewport identify the product and show actionable app choices.
- Presents Terminal Engine as the core project with tags and boundary highlights, but no route or source link.
- Shows Console Adventure and RTSim cards with descriptions, tags, preview images, route buttons, and canonical source links.
- Navigates to `/console-adventure` for Console Adventure.
- Navigates to `/rtsim` for the scheduler simulator.
- Uses shared home catalog classes and Bootstrap icon classes.
- Task 9 moved visible catalog copy into the i18n baseline and removed the old `developped` typo from the active page.
- Task 10 removed the old active mobile personal photo/profile block from the home page.
- Task 11 removed the active home inline layout styles and moved the old hover-button layout onto stable CSS classes.
- Task 14 replaced the hover-button home page with the responsive catalog card layout.

### Console Adventure Page

`src/game.jsx` currently:

- Imports `TerminalProjectPage` and `ConsoleAdventure`.
- Gets the localized Console Adventure project from the shared project content model.
- Mounts the live terminal through the shared shell when the viewport is at least 1040 px wide.
- Shows the shared screenshot fallback below that threshold.
- Shows title, description, tags, and GitHub source link from the shared project content model.
- Uses `/console-adventure` as the canonical route while `/game` redirects to it.

### RTSim Page

`src/rtsim.jsx` currently:

- Imports `TerminalProjectPage` and the RTSim terminal wrapper.
- Gets the localized RTSim project from the shared project content model.
- Mounts the live terminal through the shared shell when the viewport is at least 720 px wide.
- Shows the shared screenshot fallback below that threshold. RTSim needs this because `Simulator` sets the engine minimum size to 60x21 terminal cells.
- Shows title, description, tags, and GitHub source link from the shared project content model.

### Header

`src/Components/Header/Header.jsx` currently:

- Uses the shared asset registry for the MattediWorks logo.
- Tracks width with a local `resize` listener.
- Uses hover state to reveal a compact MattediWorks brand card.
- Uses fixed positioning for title layout in CSS.

### Info

`src/Components/Info/Info.jsx` currently:

- Provides the reusable narrow-width fallback used by `TerminalProjectPage`.
- Renders localized project fallback text and screenshots from the localized project object passed by the shared shell.
- Uses class-driven panel and screenshot sizing.

### Terminal Project Page

`src/Components/TerminalProjectPage/TerminalProjectPage.jsx` currently:

- Provides the shared terminal app page shell for Console Adventure and RTSim.
- Renders project title, summary, tags, source link, terminal stage, and fallback from the content model.
- Tracks viewport width with a scoped `resize` listener and removes it on unmount.
- Mounts the xterm wrapper only when the viewport is at or above `project.minimumViewportWidth`.
- Leaves theme/language/home/back controls to the surrounding `AppShell`.

### App Shell Navigation

`src/Components/AppShell/AppShell.jsx` and `src/Components/AppShell/AppShell.css` currently:

- Provide the shared brand/home control, route navigation, back control, theme selector, and language selector.
- Navigate to `/`, `/console-adventure`, and `/rtsim`.
- Keep `/game` as a redirect-only legacy alias.
- Use Bootstrap icon class names already loaded by the app shell.
- Integrate the MattediWorks `ThemeSelector` for light, dark, and system theme preferences.

### I18n Baseline

Task 9 added `src/MattediWorks/translation/i18n.ts` and `src/MattediWorks/hooks/useI18n.tsx`. Supported locales are `en` and `pt-BR`; the selected locale persists in `localStorage` under `terminal-applications-locale`.

When no saved preference exists, the provider uses the browser language list to choose `pt-BR` for Portuguese users and `en` otherwise. `index.html` sets `document.documentElement.lang` before the React bundle loads, and the provider keeps it synchronized after UI language changes.

The app shell, home/catalog page, Console Adventure page and narrow-width fallback, RTSim page, loading label, not-found route, theme control labels, language control labels, and source-link labels now read visible copy from the translation table. Source project names remain untranslated.

The translation table is typed as `Record<Locale, Translation>` so missing fields fail TypeScript checking when new keys are added.

## Theme System

Task 8 added `src/MattediWorks/hooks/useTheme.tsx` with `ThemeProvider`, `useTheme`, and document-theme application helpers. Supported preferences are `light`, `dark`, and `system`; resolved themes are `light` and `dark`.

The selected preference persists in `localStorage` under `terminal-applications-theme`. `index.html` includes an early inline theme bootstrap that reads that key, resolves `system` through `prefers-color-scheme`, and applies `data-theme`, `data-theme-preference`, a `light`/`dark` class, and `color-scheme` on `document.documentElement` before the React app loads.

Theme CSS variables live in `src/index.css` and cover page background/text, muted text, surfaces, borders, focus ring, MattediWorks brand orange, terminal frame/shadow, and link color.

The app shell, current home/catalog styles, Console Adventure fallback, header legacy component, and terminal frames now read from those variables. Xterm foreground/background colors remain explicitly set inside each terminal wrapper so theme work does not change terminal app readability before the later terminal hardening tasks.

## Branding Assets

Task 10 added local Sansation `@font-face` declarations in `src/index.css` and shared `--font-brand`, `--font-body`, and `--font-mono` tokens. The app no longer relies on Google Fonts for active brand typography.

The app shell uses the MattediWorks mark from `src/MattediWorks/assets/images/logo.svg`, and the home catalog now includes the MattediWorks wordmark from `logoWithName.svg`. Active home copy remains localized through the i18n baseline.

`public/mattediworks-icon.svg` is the public browser/app icon source. `index.html`, `public/manifest.json`, and `public/site.webmanifest` now reference it for favicon and manifest icon metadata.

`MWLoading` is rendered as a short first-boot overlay by the app shell and remains preloaded through `AssetPreload`. The component now watches `prefers-reduced-motion`; reduced-motion users receive a static logo treatment rather than the GSAP path-drawing animation.

## Terminal Wrappers

### Console Adventure Wrapper

`src/Components/ConsoleAdVentureWeb/ConsoleAdventureWeb.jsx` currently:

- Uses `react-xtermjs`, `@xterm/xterm`, and `@xterm/addon-fit`.
- Creates `new FitAddon()` on every React render.
- Uses `setupOnce` to run setup only once after xterm instance creation.
- Overrides `ConsoleAdventure/Game/Base/ConsoleHelp.BasicConsole` methods:
  - `getWidth`
  - `write`
  - `clear_screen`
- Creates `new Game()`.
- Sets `GameStates.setSlowRunning(20)`.
- Mutates `DefaultColors` and reloads `GameColors`.
- Handles Ctrl+B as Dev Mode toggle.
- Normalizes space to `space`; other keys use `key.domEvent.key.toLowerCase()`.
- Overrides `game.current.exitTheGame` with a goodbye screen and `Press F5 key to restart.`
- Assigns `window.onresize` globally.
- Does not dispose the xterm `onKey` subscription on unmount.
- Does not restore or remove the global `window.onresize` assignment on unmount.

The wrapper depends on singleton game/console state, so route changes and React StrictMode need careful lifecycle handling in later tasks.

### RTSim Wrapper

`src/Components/RTSimWeb/rtsim.jsx` currently:

- Uses `react-xtermjs`, `@xterm/xterm`, and `@xterm/addon-fit`.
- Creates `new FitAddon()` on every React render.
- Overrides `RTSim/Simulator/Engine/ConsoleHelp.BasicConsole` methods:
  - `getWidth`
  - `getHeight`
  - `write`
  - `clear_screen`
- Creates `new Simulator()`.
- Calls `sim.current.setupExit(...)` to reset simulator state.
- Normalizes escape, enter, space, uppercase/shift, Ctrl+C, Ctrl+D, arrows, and shifted arrows.
- Logs every normalized input and modifier object with `console.log(input, modifiers)`.
- Assigns `window.onresize` globally.
- Does not dispose the xterm `onKey` subscription on unmount.
- Does not restore or remove the global `window.onresize` assignment on unmount.

The exit reset currently mutates engine internals directly and should be reviewed against the actual `ConsoleEngine` properties before hardening.

## Terminal Engine Findings

RTSim contains the current engine implementation under `src/RTSim/Simulator/Engine/`.

Task 12 added `docs/terminal-engine.md` as the durable boundary document for the engine narrative, current implementation facts, browser/xterm port contract, and home-page copy guidance.

Key engine files:

- `ConsoleHelp.js`
  - ANSI control sequences, color helpers, text formatting, centering, sprite merging, cursor control, width/height access, and console write/clear abstractions.
  - `BasicConsole` is a singleton designed to be ported by overriding methods for non-Node terminals such as xterm.js.
- `Engine.js`
  - `ConsoleEngine` singleton.
  - Maintains scenes, scene history, camera position, target FPS render interval, debug state, resize lock, and message box overlay.
  - Draws the current scene into the terminal using the console helper.
- `Scenes.js`
  - Base `Scene` class with objects, lifecycle hooks, input handling, finished/navigation state, and default drawing.
- `SceneObject.js`
  - `SceneObject` position/value abstraction plus basic square object helper.
- `messageBox.js`
  - Singleton message box handler with options, selection, open/close animation, and overlay text composition.
- `Symbols.js`
  - Arrow/delta/enter symbols with an ASCII-safe switch, but the current file displays mojibake characters in this environment.
- `Assets/Assets.js` and `Assets/Fonts.js`
  - ASCII/ANSI logo assets, custom small figlet data, and text rendering helpers.

Important boundary: the current site should not claim both terminal apps use the same RTSim `ConsoleEngine`. RTSim does. Console Adventure uses its own `src/ConsoleAdventure/Game/Base/ConsoleHelp.js` and `GameStates` model. Both apps share a similar porting contract through a singleton `BasicConsole`, but they are not yet one shared engine.

The home page now promotes Terminal Engine as the console abstraction centered on a `BasicConsole`-style API for write, clear, cursor, width, color, and layout helpers. No engine route was added.

## Project Content Model

Task 13 added `src/content/projects.js` as the reusable content source for Terminal Engine, Console Adventure, and RTSim.

The model currently stores:

- Stable ids and localization copy keys.
- Route paths and legacy route paths where applicable.
- Canonical GitHub source URLs for Console Adventure and RTSim.
- Screenshot assets from the Vite asset registry.
- Tags/capability keys.
- Minimum viewport widths for live terminal mounting: 1040 px for Console Adventure and 720 px for RTSim.
- RTSim scheduler algorithms: EDF, FCFS, HRRN, Priority, Round Robin, and SJF.
- Terminal Engine as a promoted home item with no route and no source link.

Localized project names, summaries, descriptions, CTA labels, source labels, screenshot alt text, fallback warnings, highlights, and tag labels live under `projects` in `src/MattediWorks/translation/i18n.ts`.

Current consumers:

- `src/home.jsx` renders Terminal Engine highlights and terminal app actions from the model.
- `src/game.jsx` passes Console Adventure content from the model into `TerminalProjectPage`.
- `src/rtsim.jsx` passes RTSim content from the model into `TerminalProjectPage`.
- `src/Components/TerminalProjectPage/TerminalProjectPage.jsx` renders terminal page headers, source links, responsive stage visibility, and fallbacks from the model.
- `src/Components/Info/Info.jsx` renders fallback text and screenshots from the localized project object.
- `src/Components/AssetPreload/AssetPreload.jsx` preloads project images from the model.

## Assets And Styling

Current tracked/public assets:

- Root `index.html`, public MattediWorks SVG icon `mattediworks-icon.svg`, legacy public favicons/PNGs, `manifest.json`, `site.webmanifest`, and `robots.txt`.
- Root `Assets/` contains React, xterm, Vercel, responsive, and width-warning assets used by old docs/copy.
- `src/Frontphoto.png` and `src/Components/Header/Frontphoto.png` remain legacy personal photo assets but are no longer imported by the active shared asset registry.
- Console Adventure image assets live in the `src/ConsoleAdventure` submodule.
- RTSim readme images live in the `src/RTSim` submodule.
- MattediWorks assets exist under `src/MattediWorks/`.
- `src/assets/terminalAssets.js` is the shared browser asset registry for current/future route assets: Console Adventure screenshots and logo art, RTSim readme screenshots, MattediWorks logos/fonts/loading assets, and public favicon/manifest URLs.

Current styling:

- `src/index.css` owns global theme tokens plus shared home/catalog classes.
- `src/Components/TerminalProjectPage/TerminalProjectPage.css` owns the shared terminal page shell and terminal stage sizing.
- Terminal wrappers have duplicated `Terminal.css` files, now normalized to fill the shared terminal stage.
- `Header` and `Info` have separate CSS/module files; the old floating `H` component is no longer part of the active shell.
- The current palette uses neutral light/dark surfaces, MattediWorks orange, and a secondary cyan accent.
- Active home, Console Adventure, RTSim, Info, and legacy Header layout styles are class-driven rather than inline layout blocks.
- Cards/buttons/panels use 8px radii or smaller.

## MattediWorks Local Assets

The `src/MattediWorks/` folder currently includes:

- `assets/fonts/Sansation_*.ttf`
- `assets/images/logo.svg`
- `assets/images/logoWithName.svg`
- `assets/images/logo_white.png`
- `Components/ThemeSelector.tsx`
- `Components/LanguageSelector.tsx`
- `MWLoading/`
- `VM.jpg`

Integration risks:

- `ThemeSelector.tsx` imports `lucide-react` and the task 8 `../hooks/useTheme` provider/hook module.
- `LanguageSelector.tsx` imports the task 9 `../translation/i18n` module and receives locale state from `useI18n`.
- `MWLoading.tsx` imports `gsap`, `@gsap/react`, `lucide-react`, and `logoWithName.svg?raw`; task 5 installed those packages and added `src/vite-env.d.ts` so Vite raw/static asset imports have project-level type support.
- Theme, language, and loading assets are now wired into the app shell/runtime.
- Task 10 wired Sansation fonts into global CSS tokens, added the MattediWorks wordmark to the home catalog, and moved public favicon/manifest metadata to a MattediWorks SVG icon.

## Dependency And Script Inventory

Current root dependencies:

- React: `react`, `react-dom`
- Routing: `react-router-dom`
- Terminal: `@xterm/xterm`, `@xterm/addon-fit`, `react-xtermjs`
- Styling/icons: `bootstrap-icons`
- Vite: `vite`, `@vitejs/plugin-react`
- MattediWorks loading/icons: `lucide-react`, `gsap`, `@gsap/react`
- Testing/tooling: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `eslint`, `typescript`, `typescript-eslint`

Task 7 dependency decisions:

- Removed unused CRA-era/testing placeholder package `@testing-library/user-event`.
- Removed old hosting-specific Vercel Analytics and Speed Insights packages because the app shell no longer imports them and Stackport hosting will choose analytics later.
- Removed unused Bootstrap CSS, React Icons, Framer Motion, and unused xterm attach/webgl addons.
- Updated React and React DOM to the current stable major.
- Updated React Router, `react-xtermjs`, and the xterm Fit addon within compatible ranges.
- Kept `@xterm/xterm` on the `5.5.x` line because `react-xtermjs` currently peers on `@xterm/xterm ^5.5.0`.
- Pinned TypeScript to the newest compiler range currently accepted by `typescript-eslint`; npm latest TypeScript is newer than that peer range.
- `npm outdated` intentionally reports only `@xterm/xterm` and `typescript` after task 7 because both are held for those compatibility reasons.

Current scripts after task 4:

- `sync:submodules`: explicitly initializes pinned submodules for local development.
- `dev`: starts the Vite dev server.
- `start`: aliases the Vite dev server.
- `build`: builds with Vite.
- `preview`: previews the Vite production bundle.
- `test`: runs Vitest route/shell smoke tests.
- `lint`: runs ESLint against the root Vite app and local integration files.
- `typecheck`: runs TypeScript against the active MattediWorks loading, theme, and i18n TypeScript entries.

TypeScript checking is intentionally scoped to active local TypeScript integration files. ESLint ignores the Console Adventure and RTSim submodule source trees because those are separately-owned upstream packages.

`npm run lint` exits with two warnings about `FitAddon` objects changing the dependencies of terminal wrapper effects. Those warnings align with the later Console Adventure and RTSim port-hardening tasks and were not fixed during dependency hygiene to avoid behavior changes.

## Hosting And Publication Assumptions

Task 3 updated the root project identity baseline:

- Root README now presents `Terminal Applications`.
- Root README states that the repo publishes to `https://terminal.mattediworks.com/`.
- Root `package.json` and `package-lock.json` use package name `terminal-applications`.
- Root `index.html` title, description, theme color, and canonical URL target `Terminal Applications`.
- `public/manifest.json` and `public/site.webmanifest` use `Terminal Applications` / `Terminal Apps` and point their icons at the MattediWorks SVG mark.
- Source submodule readmes may still contain their own historical web links until those upstream projects are updated.
- README no longer presents Vercel as the host; task 7 removed the unused Vercel Analytics and Speed Insight packages/imports.

New WOI direction:

- Public site/product name should be `Terminal Applications`.
- WOI project and underlying engine narrative remain `Terminal Engine`.
- Production domain should be `terminal.mattediworks.com`.
- Deployment target later is Stackport.

Stackport risk:

- Stackport will not initialize/install git submodules when it pulls the repository.
- Task 2 removed the root build hook that fetched submodule remote branches during `npm run build`.
- A Stackport build context can still lack initialized submodule contents, so the later Docker task must fetch exact public commits in its build stage or revise the deterministic source strategy.

## Known Modernization Risks

- The app now builds with Vite, and task 7 added real lint/typecheck/test commands.
- Task 7 added real lint, typecheck, and test commands. Lint currently exits successfully with two known terminal-wrapper lifecycle warnings that are scheduled for later hardening.
- Root `index.html` is now the Vite entry point; `public/index.html` was removed.
- The old root `prebuild` could change submodule code unexpectedly during production builds; task 2 removed it, and future tasks should not reintroduce floating source fetches.
- Submodule source may be missing in non-recursive clones and Stackport checkouts.
- Task 6 removed the unreachable/dead `src/App.jsx` branches and unused shell imports.
- Task 5 removed the invalid unused `{ use }` import from `src/game.jsx`.
- Task 5 added `src/assets/terminalAssets.js` to centralize browser image/font/SVG paths and keep Vite resolution explicit.
- Vite migration replaced runtime `require(...)` image usage in active React components; remaining `require(...)` calls are in legacy/source files not imported by the site.
- Both terminal wrappers assign `window.onresize` globally.
- Both terminal wrappers add xterm key handlers without disposing them on unmount.
- `new FitAddon()` is created during render in both terminal wrappers.
- RTSim wrapper logs every input to the browser console.
- Terminal apps rely on singleton console/game/engine state, so remounts can leak state if not reset carefully.
- `/game` is now a legacy redirect to `/console-adventure`.
- `/console-adventure` is the canonical Console Adventure route.
- A `*` not-found route now exists under the app shell.
- App tests now run Vitest route/shell/theme/i18n smoke tests.
- MattediWorks theme/language/loading files are present. Loading dependencies are installed, task 8 wired the theme provider, and task 9 wired the language provider.
- Task 10 wired local MattediWorks fonts, public SVG icon metadata, visible shell/home logos, and the initial `MWLoading` boot overlay.
- Task 11 moved active page layout styles out of inline JSX, normalized terminal/fallback frames, and replaced the old gradient-heavy page background with neutral theme surfaces plus orange/cyan accents.
- Task 12 documented the Terminal Engine boundary and added a truthful no-route home presentation for the engine.
- Task 13 added the shared project content model and moved home/terminal/source/screenshot project details onto it.
- Task 14 rebuilt `/` as a MattediWorks-branded project catalog with Terminal Engine promoted and Console Adventure/RTSim project cards.
- Task 15 added the shared terminal project page shell and reusable narrow-width fallbacks for Console Adventure and RTSim.
- `src/RTSim/Simulator/Engine/Symbols.js` displays mojibake in this environment, so text encoding should be checked before release.
- Source submodule readmes still contain their own historical web links; root metadata has been moved to Terminal Applications at `terminal.mattediworks.com`.

## Proposed Migration Order Notes

Task order should stay sequential:

1. Keep this audit as the baseline.
2. Resolve source ownership before Docker/Stackport work.
3. Update product identity before broad UI changes.
4. Keep the Vite migration focused on build/runtime compatibility without redesigning routes/pages.
5. Fix imports/assets after Vite is in place.
6. Build the app shell and canonical route map.
7. Clean dependencies and developer scripts.
8. Add theme infrastructure.
9. Add i18n infrastructure.
10. Integrate MattediWorks branding assets.
11. Clean up the visual system.
12. Clarify engine content before the home page claims are rewritten.
13. Add a shared project content model.
14. Revamp the home page.
15. Add the shared terminal page shell.
16. Harden the Console Adventure port.
17. Harden the RTSim port.
18. Finish metadata, SEO, and PWA assets.
19. Refresh the README.
20. Prepare Docker/Stackport deployment.
21. Write the Stackport handoff.
22. Run release QA.

## Must-Still-Work Checklist

Every later task should preserve or intentionally replace the following behavior:

- `/` renders the responsive MattediWorks-branded home/catalog.
- `/console-adventure` reaches Console Adventure.
- `/game` still reaches Console Adventure through the legacy redirect.
- `/rtsim` renders RTSim.
- `/console-adventure` and `/rtsim` share `TerminalProjectPage` for project header, tags, source link, terminal stage, and fallback.
- Console Adventure starts in xterm, renders the main menu, accepts keyboard input, supports arrow/WASD-style navigation, accepts space/enter, and keeps Ctrl+B Dev Mode behavior.
- Console Adventure narrow-width fallback appears below 1040 px.
- Console Adventure exit/goodbye path remains understandable.
- RTSim starts in xterm, renders simulator UI, accepts arrows, shifted arrows, escape, enter, space, Ctrl+C, and Ctrl+D/current debug behavior.
- RTSim narrow-width fallback appears below 720 px; the live terminal can resize above that threshold without becoming unreadable.
- Terminal wrapper unmount/remount does not accumulate key handlers, resize handlers, render intervals, or stale singleton state.
- Console Adventure screenshots/assets still render in fallback/content areas.
- RTSim readme screenshots/assets remain available through the project content model.
- MattediWorks logo/font/loading assets continue to resolve through the Vite asset registry.
- Theme switching persists and keeps the app readable in light/dark/system modes.
- Language switching persists, updates `document.documentElement.lang`, and keeps current shell/home/terminal/not-found copy localized in `en` and `pt-BR`.
- Initial MattediWorks loading treatment respects reduced-motion preferences and does not reappear on normal route navigation.
- Shared page, home action, fallback panel, external-link, and terminal-frame classes keep controls and text inside their containers across mobile and desktop widths.
- Terminal Engine appears on the home page as a core project narrative, but no standalone engine route exists.
- Shared project metadata remains in `src/content/projects.js` and should stay the source for app routes, source links, screenshots, tags, and scheduler algorithm facts.
- Root install/build scripts are deterministic and do not pull floating source during production builds.
- Stackport-style non-recursive checkouts either contain required source or fetch exact pinned source during Docker build.
- Public metadata names Terminal Applications at `terminal.mattediworks.com`.
