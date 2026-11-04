# Metadata, SEO, And Install Metadata

Project: Terminal Applications
Decision date: 2026-07-23

## Canonical Site

The production canonical URL is `https://terminal.mattediworks.com/`.

Public route metadata and sitemap entries cover:

- `/`
- `/console-adventure`
- `/rtsim`

The legacy `/game` route redirects to `/console-adventure`, so it is intentionally not listed as a canonical sitemap URL.

## PWA Decision

Terminal Applications keeps installable web app metadata through `public/site.webmanifest` and the legacy-compatible copy at `public/manifest.json`.

The site does not currently register a service worker and does not claim offline behavior. The manifest is limited to accurate install/display metadata, app identity, theme/background colors, and icons.

## Icon Sources

Browser and manifest icons are MattediWorks brand assets:

- `public/mattediworks-icon.svg`: primary vector favicon and maskable manifest icon.
- `public/favicon.ico`, `public/favicon-16x16.png`, and `public/favicon-32x32.png`: browser favicon fallbacks.
- `public/apple-touch-icon.png`: Apple touch icon.
- `public/logo192.png` and `public/logo512.png`: PNG install/share icons.
- `public/logo-no-abackground.png`: larger MattediWorks PNG source kept for future derivatives.

The active source brand artwork also lives under `src/MattediWorks/assets/images/`.

## Social Preview

`index.html` includes Open Graph and Twitter summary metadata for `Terminal Applications`, using `https://terminal.mattediworks.com/logo512.png` as the social image.

## Analytics

No analytics or speed-insight provider is bundled in this repository after the Stackport migration work. There are no Vercel Analytics or Speed Insights imports or dependencies in the active app.

If analytics are added later, the provider, data collected, runtime environment variables, and Stackport configuration must be documented before deployment.
