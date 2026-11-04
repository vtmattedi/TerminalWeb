# Source Ownership Strategy

Project: Terminal Engine / Terminal Applications
Decision date: 2026-07-22
Last updated: 2026-07-23

## Decision

Keep `src/ConsoleAdventure` and `src/RTSim` as git submodules for developer source provenance, pinned by the root repository gitlinks.

For Docker and Stackport, use committed source snapshots under `docker/vendor/` as the deterministic build input. The production Dockerfile ignores live submodule working trees, copies the vendor snapshots into the existing `src/ConsoleAdventure` and `src/RTSim` import paths inside the build container, and then runs the Vite build.

This strategy avoids relying on:

- Stackport initializing git submodules.
- A recursive host clone.
- The host checkout's `.git` directory.
- Floating branches or `git submodule update --remote`.
- Submodule commits being reachable from public GitHub during Docker build.

## Current Developer Source Pins

Both terminal app folders are real git submodules. The root tree records them as `160000` gitlinks:

| Path | Repository | Pinned commit | Notes |
| --- | --- | --- | --- |
| `src/ConsoleAdventure` | `https://github.com/vtmattedi/ConsoleAdventure` | `ea33111dea4fd0fd0d8a139280c8ebcd96350df6` | Local task 16 submodule commit. Not advertised by `origin` during verification on 2026-07-23. |
| `src/RTSim` | `https://github.com/vtmattedi/rtsim.git` | `eb5f1901c792074ecf0b44f0e6f3099d97c6ff5d` | Local task 17 submodule commit. Not advertised by `origin` during verification on 2026-07-23. |

The submodule URLs are declared in `.gitmodules`.

For a normal local checkout, initialize the pinned submodules explicitly:

```sh
npm run sync:submodules
```

This runs:

```sh
git submodule update --init --recursive
```

That command checks out the exact commits pinned by the root repository. It does not move to remote branch tips.

## Docker Source Snapshots

The Docker build uses these committed source snapshots:

| Vendor path | Copied to build path | Contents |
| --- | --- | --- |
| `docker/vendor/ConsoleAdventure` | `src/ConsoleAdventure` | Tracked `Game/` runtime and image assets imported by the React app. |
| `docker/vendor/RTSim` | `src/RTSim` | Tracked `Simulator/` runtime plus `image/Readme/` screenshots imported by the React app. |

The snapshots were copied from the current submodule working trees after tasks 16 and 17. They include the lifecycle fixes needed by the browser wrappers.

When intentionally updating terminal app source:

1. Update and test the submodule source.
2. Commit inside the submodule if needed.
3. Refresh the matching `docker/vendor/` snapshot from tracked submodule files.
4. Run root checks and Docker validation.
5. Commit the root gitlink and vendor snapshot together.
6. Update this document if the source strategy changes.

## Stackport And Docker Workflow

Stackport will not initialize git submodules when it pulls the repository. A Stackport-style non-recursive checkout may contain empty submodule directories or no usable submodule contents.

The production Dockerfile handles this by:

1. Installing root npm dependencies with `npm ci`.
2. Copying the repository context while `.dockerignore` excludes `src/ConsoleAdventure` and `src/RTSim`.
3. Copying `docker/vendor/ConsoleAdventure` into `src/ConsoleAdventure`.
4. Copying `docker/vendor/RTSim` into `src/RTSim`.
5. Running `npm run build`.
6. Serving `dist/` from Nginx.

The Docker build does not fetch external repositories and does not need source credentials.

## Build Behavior

Root build behavior:

- `npm run build` builds whatever source is already present in `src/ConsoleAdventure` and `src/RTSim`.
- `npm run build` does not fetch remote branches.
- `npm run sync:submodules` is the explicit developer command for local source initialization.
- `docker compose build` uses committed `docker/vendor/` snapshots and does not require initialized submodules.

## Follow-Up Responsibilities

Task 21, Stackport Handoff, must state that Stackport does not initialize submodules and must document that this repository uses committed Docker vendor snapshots for terminal app source during deployment.
