# Rate limiting (Redis-backed)

This API uses [`express-rate-limit`](https://github.com/express-rate-limit/express-rate-limit) with a [`rate-limit-redis`](https://github.com/express-rate-limit/rate-limit-redis) store when Redis is available. **Admin routes are not rate limited.**

## Bypass (testing / ops)

Set optional env `RATE_LIMIT_BYPASS_TOKEN` (see `.env.example`). When non-empty, requests that send header:

`x-bypass-token: <same value>`

skip all application rate limiters. Leave empty in production unless you have a strict operational need.

## Response shape on block (HTTP 429)

```json
{
  "error": "Too Many Requests",
  "message": "<human-readable reason>",
  "retryAfter": "<Retry-After header value when present>"
}
```

## Headers

- **Standard** `RateLimit-*` headers are enabled (`standardHeaders: true`).
- **Legacy** `X-RateLimit-*` headers are **disabled** (`legacyHeaders: false`).
- **`Retry-After`** is set by `express-rate-limit` when applicable.

## Limit matrix

| Bucket / counter key | Max | Window | Key basis | Typical routes |
| --- | --- | --- | --- | --- |
| `global` | 100 | 15 min | IP | All API routes |
| `auth:login` | 5 | 15 min | IP | `POST /api/auth/login` |
| `auth:register` | 5 | 15 min | IP | `POST /api/auth/register` |
| `auth:verify-email` | 5 | 15 min | IP | Email verification POST |
| `auth:resend-otp` | 5 | 15 min | IP | Resend OTP POST |
| `auth:refresh-token` | 5 | 15 min | IP | Refresh token POST |
| `auth:forgot-password` | 5 | 15 min | IP | Forgot password POST |
| `auth:reset-password` | 5 | 15 min | IP | Reset password POST |
| `public:read` | 100 | 15 min | IP | Public `GET` event/review reads |
| `user:general` | 100 | 15 min | User id (fallback IP) | Authenticated reads & general traffic on protected routers |
| `user:write` | 30 | 15 min | User id (fallback IP) | Authenticated `POST` / `PATCH` / `DELETE` mutating routes |

Exact route wiring lives in each module’s `*.route.ts` / `auth.routes.ts`.

## Redis keys

### Sliding/window counters (limiter store)

Prefix pattern: `rl:<redisPrefix>:` (see `src/middlewares/rateLimiter.ts`).

Examples:

- `rl:auth:login:*`
- `rl:public:read:*`
- `rl:user:general:*`
- `rl:user:write:*`

### Blocked-event counters (monitoring)

Each time a limiter returns **429**, the API increments:

`rate:v1:blocked:<bucket>`

where `<bucket>` matches the table above (e.g. `auth:login`, `user:write`).

These counters are **monotonic** (they do not reset with the rate-limit window); they are for **operational visibility** only.

### Verification (`redis-cli`)

```text
# Sample limiter store keys (names vary by client IP / user id)
KEYS rl:auth:login:*
KEYS rl:public:read:*

# Blocked counters (after some 429s)
KEYS rate:v1:blocked:*
MGET rate:v1:blocked:auth:login rate:v1:blocked:public:read
```

Prefer `SCAN` over `KEYS` in production.

## Admin: stats endpoint

`GET /api/admin/rate-limits` (admin auth required) returns:

- `degraded`: `true` if Redis is down or scan failed
- `fetchedAt`: ISO timestamp
- `buckets`: `{ bucket, blockedCount }[]` from `rate:v1:blocked:*`

Admin traffic is **not** throttled by these limiters.

## Degraded behavior

- If Redis is **unavailable**, limiters run **in-memory** per process (see `passOnStoreError: true` and conditional store attachment).
- Block counter increments and the admin stats scan require Redis; they no-op or return `degraded: true` when Redis is missing.
