# Database Benchmark Results

Date: 2026-04-18

## Setup

- Command: `npm run benchmark:queries -- 25`
- Runtime: local machine, Node + Prisma client
- Database: local PostgreSQL (`localhost:5432`, database `planora`)
- Dataset note: benchmark script now auto-creates a synthetic fixture event and related records if data is missing.

## Raw results (25 iterations)

- `events:listPublicUpcoming(take=20)`: min `0.71ms`, avg `0.87ms`, max `1.74ms`
- `event:findFirstById(...)`: min `0.81ms`, avg `0.93ms`, max `1.41ms`
- `reviews:summaryOptimized(tx: aggregate+groupBy)`: min `1.34ms`, avg `2.07ms`, max `4.69ms`
- `reviews:summaryLegacy(aggregate+5counts)`: min `2.27ms`, avg `3.07ms`, max `5.64ms`
- `participation:listByUser(take=50)`: min `0.58ms`, avg `0.71ms`, max `1.25ms`

## Before vs after comparison

For review summary, the benchmark script measures both approaches in the same environment:

- Before (legacy 6-query pattern): `3.07ms` avg
- After (aggregate + groupBy): `2.07ms` avg
- Improvement: `32.57%` faster average latency

Calculation:

`((3.07 - 2.07) / 3.07) * 100 = 32.57%`

## Migration and production safety note

- Attempted command: `npx prisma migrate dev --name add_performance_indexes`
- In this environment, Prisma blocked `migrate dev` because the shell is non-interactive.
- A SQL migration file was generated and added at:
  - `prisma/migrations/20260418120000_add_performance_indexes/migration.sql`
  - rollback companion: `prisma/migrations/20260418120000_add_performance_indexes/rollback.sql`

`CREATE INDEX CONCURRENTLY` was intentionally not put in Prisma migration SQL because Prisma migrations run transactionally and PostgreSQL rejects concurrent index creation inside a transaction block. For production large-table rollouts, run a separate hand-written non-transactional SQL step with `CREATE INDEX CONCURRENTLY` and track that operation in deployment notes.

## Compression benchmark (before vs after)

Date: 2026-04-18

Server mode: `npm run dev` (local)

### Commands

```bash
# Baseline (compression bypassed)
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept-Encoding: gzip" \
  -H "x-no-compression: 1" \
  "http://localhost:5000/api/auth/login" \
  -d '{}' \
  -o /tmp/login-uncompressed.bin

# Compressed
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Accept-Encoding: gzip" \
  "http://localhost:5000/api/auth/login" \
  -d '{}' \
  -D /tmp/login-compressed.headers \
  -o /tmp/login-compressed.bin

wc -c /tmp/login-uncompressed.bin /tmp/login-compressed.bin
```

### Results

- Uncompressed payload size: `1975` bytes
- Compressed payload size: `564` bytes
- Response header confirms compression: `Content-Encoding: gzip`
- Size reduction: `71.44%`

Calculation:

`((1975 - 564) / 1975) * 100 = 71.44%`

### Threshold control check

`GET /health` stayed at `43` bytes with and without compression, confirming the `threshold: 1024` behavior for small payloads.
