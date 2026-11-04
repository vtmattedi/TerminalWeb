# Stackport Handoff

Project: Terminal Applications
Prepared: 2026-07-23

## Onboarding Fields

Use these values when creating the Stackport project:

| Field | Value |
| --- | --- |
| `name` | `Terminal Applications` |
| `githubRepo` | `vtmattedi/ConsoleAdventureReact` |
| `domain` | `terminal.mattediworks.com` |
| `internalPort` | `3001` |
| `healthCheckEndpoint` | `/health` |
| `healthCheckIntervalS` | `30` |
| `autoDeployBranch` | `main` after this work is merged and pushed, or `newVersion` only if that is intentionally the production branch |
| `githubCredentialId` | Not required for a public GitHub repository; required if Stackport cannot clone the repository without authentication |

The root Compose file publishes one HTTP entrypoint:

```yaml
ports:
  - "3001:80"
```

The container serves plain HTTP through Nginx on container port `80`. Stackport/Nginx should terminate HTTPS and manage certificates for `terminal.mattediworks.com`.

## Required Env Files

No `.env` file is required for the current app.

No runtime secrets are needed. If analytics or another external provider is added later, document the variables before deployment and have Stackport write a relative `.env` file such as `.env`.

## Source Strategy

Stackport does not initialize git submodules on pull. This repository still builds `ConsoleAdventure`, `RTSim`, and the shared engine source through committed Docker vendor snapshots.

The Docker build does not fetch external repositories and does not need source credentials:

| Committed source | Build destination | Purpose |
| --- | --- | --- |
| `docker/vendor/ConsoleAdventure` | `src/ConsoleAdventure` | Console Adventure runtime and imported game assets. |
| `docker/vendor/RTSim` | `src/RTSim` | RTSim runtime, shared terminal engine code, and imported screenshots. |

`.dockerignore` excludes the live submodule folders from the Docker context:

```text
src/ConsoleAdventure
src/RTSim
```

The Dockerfile then recreates those paths from `docker/vendor/` before running `npm run build`. This means deployment does not depend on a recursive host clone, initialized submodule folders, floating branches, public reachability of local submodule task commits, or the host checkout's `.git` directory.

Developer provenance still lives in `.gitmodules` and the root repository gitlinks. See [source-ownership.md](source-ownership.md) for the refresh process.

## Docker Validation

Docker prep was validated locally on 2026-07-23 with commit `95065dc` for WOI task 20.

Commands and results:

| Command | Result |
| --- | --- |
| `npm run lint` | Passed. |
| `npm run typecheck` | Passed. |
| `npm test -- --run` | Passed, 14 tests. |
| `npm run build` | Passed. |
| `docker compose config` | Passed. |
| `docker compose build` | Passed using `docker/vendor/` snapshots. |
| `docker compose up -d` | Passed; service started on `127.0.0.1:3001`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/health` | Returned `204`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/` | Returned `200`. |
| `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/rtsim` | Returned `200`. |
| `docker compose ps` | Reported the service as healthy. |
| `docker compose down` | Passed and removed the container/network. |

The validation did not use a separate fresh clone. It did validate the Stackport submodule constraint by excluding `src/ConsoleAdventure` and `src/RTSim` from the Docker build context, so initialized local submodule contents were unavailable to the image build.

## Operator Checks Before Deploy

Confirm these items in Stackport or GitHub before deployment:

- Push or merge the task commits through at least `95065dc` and this handoff commit to the selected auto-deploy branch.
- Confirm whether the production branch is `main` or `newVersion`. The recommended Stackport value is `main` after merge.
- Confirm `terminal.mattediworks.com` DNS points to the Stackport host before SSL issuance.
- Confirm host port `3001` is free on the Stackport machine. If it is already used, change both Stackport `internalPort` and the host side of `docker-compose.yml`.
- Confirm Stackport can clone `vtmattedi/ConsoleAdventureReact`. Add a Stackport GitHub credential only if the repository is private.

No submodule credential blocker remains for Docker deployment because terminal app source is vendored in this repository.
