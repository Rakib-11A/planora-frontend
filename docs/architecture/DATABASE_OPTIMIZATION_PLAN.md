# Database optimization plan (Planora backend)

This document is a **performance audit** aligned with the **actual** Prisma schema and repositories in this repo. It does not assume fields that do not exist (e.g. `Event.organizerId` — the owner FK is `createdById`; invitations use `inviterId` / `inviteeId`, not sender/receiver).

---

## A) Current index inventory

### Event (`prisma/schema/event.prisma`)

| Kind | Definition |
|------|------------|
| PK | `id` |
| FK | `createdById` → `User` |
| Index | `@@index([dateTime])` |
| Index | `@@index([isPublic, isPaid, dateTime])` |
| Index | `@@index([createdById])` |
| Index | `@@index([deletedAt, dateTime])` |

### Participation (`prisma/schema/participation.prisma`)

| Kind | Definition |
|------|------------|
| PK | `id` |
| Unique | `@@unique([userId, eventId])` |
| Index | `@@index([eventId])` |
| Index | `@@index([userId])` |

### Review (`prisma/schema/review.prisma`)

| Kind | Definition |
|------|------------|
| PK | `id` |
| Unique | `@@unique([userId, eventId])` |
| Index | `@@index([eventId])` |
| Index | `@@index([eventId, deletedAt])` |

### Payment (`prisma/schema/payment.prisma`)

| Kind | Definition |
|------|------------|
| PK | `id` |
| Unique | `participationId` |
| Index | `@@index([eventId])` |
| Index | `@@index([userId])` |
| Index | `@@index([participationId])` |

### Invitation (`prisma/schema/invitation.prisma`)

| Kind | Definition |
|------|------------|
| PK | `id` |
| Unique | `@@unique([eventId, inviteeId])` |
| Index | `@@index([inviteeId])` |
| Index | `@@index([inviterId])` |

### Notification (`prisma/schema/notification.prisma`)

| Kind | Definition |
|------|------------|
| Index | `@@index([userId, createdAt])` |
| Index | `@@index([userId, isRead, createdAt])` |

### RefreshToken (`prisma/schema/refresh_token.prisma`)

| Kind | Definition |
|------|------------|
| Unique | `token` |
| Index | `@@index([userId])` |

### Otp (`prisma/schema/otp.prisma`)

| Kind | Definition |
|------|------------|
| Index | `@@index([userId])` |

### User (`prisma/schema/user.prisma`)

| Kind | Definition |
|------|------------|
| Unique | `email`, `googleId` |

---

## B) Index gap analysis (mapped to real queries)

### 1. Event listing — `listEvents` (`src/modules/event/event.repository.ts`)

**Pattern:** `WHERE deletedAt IS NULL`, optional `isPublic`, `isPaid`, `title ILIKE '%x%'`, `ORDER BY dateTime ASC`, pagination.

**Existing indexes** help the boolean + `dateTime` path. **Gap:** queries that always filter `deletedAt IS NULL` + `isPublic` + `isPaid` may benefit from a **composite** starting with `deletedAt` (see schema patch).

**Title search:** `contains` + `insensitive` → typically `ILIKE '%term%'`. A plain `@@index([title])` **does not** help leading-wildcard search. For production search, consider:

- PostgreSQL `pg_trgm` + **GIN** index on `title` (raw SQL migration), or
- Full-text search (`tsvector`) if requirements grow.

### 2. Event detail + ratings — `findEventById`

**Pattern:** one `findFirst` on `Event`, one `review.aggregate` for `eventId` + `deletedAt IS NULL`.

Acceptable as two round-trips; optimize only if this endpoint is proven hot (e.g. single `$queryRaw` joining event + aggregates).

### 3. Participation

| Query | Location | Recommended index direction |
|-------|----------|----------------------------|
| `listEventParticipants`: `eventId`, optional `status`, `orderBy createdAt asc` | `participation.repository.ts` | Composite `(eventId, status, createdAt)` |
| `listUserParticipations`: `userId`, `orderBy createdAt desc` | same | Composite `(userId, createdAt)` |
| `findApprovedParticipation`: `findFirst` on `userId`, `eventId`, `status = APPROVED` | `review.repository.ts` | Composite `(userId, eventId, status)` complements the unique on `(userId, eventId)` |

### 4. Review

| Query | Location | Note |
|-------|----------|------|
| `listEventReviews`: `eventId`, `deletedAt IS NULL`, `orderBy createdAt desc` | `review.repository.ts` | Extend to `@@index([eventId, deletedAt, createdAt])` for sort alignment |
| `getEventRatingSummary`: aggregate + 5 counts | same | See **Section G** — reduce round-trips in application code |

### 5. Payment

| Query | Location | Recommended |
|-------|----------|-------------|
| `listUserPayments`: `userId`, `orderBy createdAt desc` | `payment.repository.ts` | `@@index([userId, createdAt])` |
| Future filters by `eventId` + `status` | admin/monitoring | `@@index([eventId, status])` |

### 6. Invitation

| Query | Location | Recommended |
|-------|----------|-------------|
| `listEventInvitations`: `eventId`, optional `status`, `orderBy createdAt desc` | `invitation.repository.ts` | `@@index([eventId, status, createdAt])` |
| `listMyInvitations`: `inviteeId`, `orderBy createdAt desc` | same | `@@index([inviteeId, createdAt])` |

### 7. Otp — `findValidOtp` (`src/modules/auth/auth.repository.ts`)

**Pattern:** `userId`, `type`, `isUsed = false`, `expiresAt > now()`, `orderBy createdAt desc`.

Single-column `@@index([userId])` is weak for this conjunctive filter. Prefer **`@@index([userId, type, isUsed, expiresAt])`** (column order tunable after `EXPLAIN ANALYZE`).

### 8. RefreshToken

If you add **session expiry sweeps**, `@@index([expiresAt])` supports `WHERE expiresAt < $1` efficiently.

---

## C) Unused indexes

**Cannot** label indexes “unused” without database statistics. Run on PostgreSQL (adjust schema if needed):

```sql
SELECT
  schemaname,
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;
```

Low `idx_scan` on large indexes warrants review after representative load.

---

## D) Query pattern findings

1. **Unbounded lists:** `listUserParticipations`, `listMyInvitations`, `listUserPayments`, `listEventReviews` use `findMany` without `take`/`cursor`. Risk grows with table size — add pagination in API + repository when you prioritize scale.
2. **Review summary:** `getEventRatingSummary` issues **6 queries** (1 aggregate + 5 counts). Replaceable with one `groupBy` on `rating` + one aggregate, or one raw SQL query.
3. **N+1:** No obvious N+1 in the reviewed repositories; relations use nested `select` in single queries.

---

## E) Prisma best practices (this repo)

| Practice | Status |
|----------|--------|
| Narrow `select` | Used consistently in repositories |
| Heavy `include` | Largely avoided in favor of nested `select` |
| `$transaction` | Used for event list + review groupBy; payment verify is sequential — consider `$transaction` if you need atomic payment + participation updates |
| Connection pooling | Configure via `DATABASE_URL` (hosting-specific: PgBouncer, Neon pooler). Use a **direct** URL for migrations if your provider documents `?pgbouncer=true` / `directUrl` patterns |

---

## F) Migration plan and risks

### Steps (development)

1. Apply Prisma schema index changes (already in repo; **you** run migrate when ready):

   ```bash
   npx prisma migrate dev --name add_performance_indexes
   npx prisma generate
   npm run build
   ```

2. Before/after: run `EXPLAIN (ANALYZE, BUFFERS)` on top queries (event list, event detail, my participations, reviews by event, review summary).

### Risks (PostgreSQL)

- `CREATE INDEX` takes a **share lock**; reads usually continue; writes to the table may wait. Large tables: consider **`CREATE INDEX CONCURRENTLY`** via raw SQL migration (Prisma does not emit this by default).
- More indexes **speed up reads** and **slow writes** slightly — validate with metrics.

### Rollback

- New migration’s `down` migration drops the added indexes, or manually `DROP INDEX "TableName_field1_field2_idx";` (use exact names from migration SQL).

---

## G) Query optimization examples (BEFORE / AFTER)

### Example 1 — `getEventRatingSummary` (fewer round-trips)

**BEFORE** (conceptually, as in `review.repository.ts`): 1 `aggregate` + 5 `count` queries = 6 DB round-trips per request.

**AFTER** (single `groupBy` + one aggregate for avg/total, or derive avg in app from grouped counts):

```typescript
// One groupBy replaces five count queries; one aggregate for avg optional if you prefer DB avg
const [grouped, agg] = await prisma.$transaction([
  prisma.review.groupBy({
    by: ["rating"],
    where: { eventId, deletedAt: null },
    _count: { _all: true },
    orderBy: { rating: "asc" },
  }),
  prisma.review.aggregate({
    where: { eventId, deletedAt: null },
    _avg: { rating: true },
    _count: { _all: true },
  }),
]);
// Build breakdown map from grouped; avgRating from agg._avg.rating, totalReviews from agg._count._all
```

**Expected improvement:** ~5 fewer round-trips; latency drops mainly on **high-latency** DB connections (serverless / remote Postgres). CPU time on DB may be similar.

### Example 2 — Unbounded `listUserParticipations`

**BEFORE:**

```typescript
return prisma.participation.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  select: participationWithEventSelect,
});
```

**AFTER:**

```typescript
return prisma.participation.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" },
  take: limit,
  skip: (page - 1) * limit,
  select: participationWithEventSelect,
});
```

**Expected improvement:** bounded memory and response size; consistent API latency as data grows. Requires API validation for `page`/`limit`.

### Example 3 — Event title search (advanced)

**BEFORE:** `ILIKE '%term%'` — sequential scan on large tables.

**AFTER (PostgreSQL):** enable `pg_trgm`, add GIN index:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX CONCURRENTLY idx_event_title_trgm ON "Event" USING gin (title gin_trgm_ops);
```

Query may still need `similarity` / `LIKE` tuning. **Not** expressible as a simple Prisma `@@index`; use a custom migration SQL file.

---

## H) Schema changes applied in repo (indexes only)

See git diff on:

- `prisma/schema/event.prisma`
- `prisma/schema/participation.prisma`
- `prisma/schema/review.prisma`
- `prisma/schema/payment.prisma`
- `prisma/schema/invitation.prisma`
- `prisma/schema/otp.prisma`
- `prisma/schema/refresh_token.prisma`

**No migration was executed** as part of this audit task; generate and apply locally when ready.

---

## I) Benchmark script

See `scripts/benchmark-queries.ts` and npm script `benchmark:queries`.

Run (default 10 iterations):

```bash
npm run benchmark:queries
npm run benchmark:queries -- 25
```

Environment:

- `DATABASE_URL` (required)
- Optional: `BENCH_USER_ID`, `BENCH_EVENT_ID` — pin specific CUIDs; if unset, the script uses the first matching row in the DB (or skips event/user blocks only when no row exists).
