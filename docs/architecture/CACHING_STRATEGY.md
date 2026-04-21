# Redis caching strategy (Planora backend)

## Overview

Read-heavy endpoints use Redis via `ioredis` with **fail-open** behavior: if Redis is unavailable or `REDIS_HOST` is unset, the API serves from PostgreSQL only.

## Configuration

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `REDIS_HOST` | No | *(empty = cache off)* | Redis host; empty disables caching |
| `REDIS_PORT` | No | `6379` | Port |
| `REDIS_PASSWORD` | No | *(empty)* | Auth |
| `REDIS_DB` | No | `0` | Logical DB index |

See [`.env.example`](../../.env.example).

## Key naming (`cache:v1`)

All keys are prefixed with `cache:v1` (versioned for future migrations).

| Pattern | Example | Purpose |
|---------|---------|---------|
| Events list | `cache:v1:events:list:qh:<sha256>` | `GET /api/events` + normalized query |
| Event detail | `cache:v1:events:detail:id:<eventId>:viewer:<userOrAnon>:qh:<sha256>` | `GET /api/events/:id` (viewer affects private events) |
| Review summary | `cache:v1:reviews:summary:event:<eventId>:qh:<sha256>` | `GET /api/events/:eventId/reviews/summary` |
| My participations | `cache:v1:participations:me:user:<userId>:qh:<sha256>` | `GET /api/me/participations` |
| My notifications | `cache:v1:notifications:me:user:<userId>:qh:<sha256>` | `GET /api/me/notifications` |

Query string is sorted by key and hashed (SHA-256, first 32 hex chars) so keys stay short and deterministic.

## TTLs

| Endpoint | TTL |
|----------|-----|
| `GET /api/events` | 300s (5 min) |
| `GET /api/events/:id` | 120s (2 min) |
| `GET /api/events/:eventId/reviews/summary` | 600s (10 min) |
| `GET /api/me/participations` | 60s (1 min) |
| `GET /api/me/notifications` | 30s |

## Cached payload shape

The middleware caches the **full JSON body** returned by the controller (including `ApiResponse` fields: `statusCode`, `data`, `message`, `success`).

## Invalidation

Invalidation uses `SCAN` + `DEL` (never `KEYS` in production paths).

| Trigger | Clears |
|---------|--------|
| Event create | All event **list** caches |
| Event update / delete (owner or admin) | Event lists, detail for that `eventId`, review summary for that `eventId` |
| Review create / update / delete | Same as event update for that `eventId` |
| Participation join / cancel / approve / reject | Affected user’s **my participations**, event lists, event detail for that `eventId` |
| Payment verify success | Payer’s **my participations**, event lists, event detail for that event |
| Notification create / mark read / mark all read | That user’s **my notifications** |
| Admin soft-delete event | Same as event delete |
| Admin soft-delete review | Lists + detail + summary for that review’s `eventId` |

Stats keys (`cache:v1:stats:*`) are **not** cleared by invalidation.

## Monitoring

- `GET /api/admin/cache/stats` (ADMIN only): JSON `data` includes:
  - `degraded` — `true` if Redis is disabled or the stats call failed
  - `totalKeys` — `DBSIZE`
  - `memoryUsed` — `used_memory_human` from `INFO memory`
  - `hits` / `misses` — counters incremented by the HTTP cache middleware
  - `hitRatePercent` — `hits / (hits + misses) * 100`, or `null` if no samples yet
  - `topKeys` — up to 10 entries `{ key, score }` from a Redis sorted set (popularity of cache keys)

## Production notes

- For very large keyspaces, tune `SCAN` count in `delPattern`.
- Hit rate and latency targets depend on traffic; measure with load tests and `redis-cli MONITOR` in non-production only.

## Local verification

1. Set `REDIS_HOST` (e.g. `localhost`) and start Redis.
2. Call a cached `GET` twice (e.g. `GET /api/events`) and watch `redis-cli MONITOR` for `GET` then `SETEX`.
3. Mutate data (e.g. `PATCH /api/events/:id`) and confirm subsequent `GET` misses until repopulated.
