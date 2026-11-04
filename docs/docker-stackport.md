# Docker And Stackport Prep

Project: Terminal Applications
Prepared: 2026-07-23

## Source Strategy

Stackport does not initialize git submodules when it pulls the repository. This Docker setup does not rely on submodule checkout contents, recursive clones, host `.git`, or external source fetches.

The build uses committed source snapshots:

- `docker/vendor/ConsoleAdventure` -> copied to `src/ConsoleAdventure`
- `docker/vendor/RTSim` -> copied to `src/RTSim`

See [source-ownership.md](source-ownership.md) for the ownership and refresh process.

## Runtime Shape

- `Dockerfile`: multi-stage build.
  - Node 24 Alpine build stage runs `npm ci`, copies vendor source into the submodule import paths, and runs `npm run build`.
  - Nginx 1.27 Alpine runtime stage serves `dist/`.
- `docker/nginx.conf`: SPA fallback plus `/health`.
- `docker-compose.yml`: one public HTTP service mapped as `3001:80`.
- `.dockerignore`: excludes local dependencies, build output, env files, git metadata, and live submodule folders while keeping `docker/vendor/`.

## Stackport Defaults

- `name`: `Terminal Applications`
- `domain`: `terminal.mattediworks.com`
- `internalPort`: `3001`
- `healthCheckEndpoint`: `/health`
- `healthCheckIntervalS`: `30`
- `envFile`: none required

Stackport/Nginx should handle HTTPS and certificates. The container serves plain HTTP on port `80`.

## Validation Commands

Run from the repository root:

```sh
docker compose config
docker compose build
docker compose up -d
curl -fsS http://127.0.0.1:3001/health
docker compose down
```

The Docker build is intentionally independent of initialized submodules because `.dockerignore` excludes `src/ConsoleAdventure` and `src/RTSim` from the build context.

## Validation Results

Validated locally on 2026-07-23:

- `docker compose config`: passed.
- `docker compose build`: passed.
- `docker compose up -d`: passed; service started on `127.0.0.1:3001`.
- `curl -fsS http://127.0.0.1:3001/health`: passed with HTTP 204.
- `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/`: returned `200`.
- `curl -fsS -o NUL -w "%{http_code}" http://127.0.0.1:3001/rtsim`: returned `200`.
- `docker compose ps`: reported the service as healthy.
- `docker compose down`: passed and removed the container/network.
