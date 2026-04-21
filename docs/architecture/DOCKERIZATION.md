# Dockerization (Backend First)

This project now supports backend-first Docker workflows with Postgres and Redis.

## Files

- `Dockerfile` (multi-stage builder + production image)
- `docker-compose.yml` (default local dev stack)
- `docker-compose.dev.yml` (dev overrides)
- `docker-compose.prod.yml` (production overrides)
- `.dockerignore`

## Environment notes

The runtime env contract in `src/config/env.ts` is unchanged.

Use existing keys:

- `DATABASE_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_DB`

Container-safe examples are included in `.env.example`.

## Run (development)

```bash
docker compose up --build
```

Backend: `http://localhost:5000`  
Health endpoint: `http://localhost:5000/health`

Stop:

```bash
docker compose down
```

## Run (production-like compose)

```bash
docker compose -f docker-compose.prod.yml up --build
```

In production mode, app startup runs:

- `npx prisma migrate deploy`
- `node dist/server.js`

Stop:

```bash
docker compose -f docker-compose.prod.yml down
```

If host ports `5432` or `6379` are already in use (for example by local Postgres/Redis), change mapped host ports in compose files before running.

## Prisma behavior

- `prisma generate` runs during Docker build.
- `prisma migrate deploy` runs at production startup.
- Dev mode uses `npm run dev` with bind-mounted source for hot reload.
