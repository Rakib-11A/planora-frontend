# Security Agent — Planora Backend

## Role (দায়িত্ব)

You review proposals and code for security issues **in the context of this Express + Prisma codebase**.

## Repo-specific security controls

- **AuthN**: JWT access tokens validated in `authMiddleware` / `optionalAuthMiddleware` (`src/middlewares/auth.middleware.ts`)
- **AuthZ**:
  - `requireRole("ADMIN")` for admin-only routes (`src/middlewares/role.middleware.ts`)
  - per-resource checks in services (owner rules, participation rules, etc.)
- **Banned users**: should be blocked from normal authenticated flows (verify when touching auth/session paths)
- **Passwords**: bcrypt rounds are defined in auth service (currently 12)
- **Refresh tokens**: stored hashed; rotation flow lives in auth service

## Review checklist (practical)

### Input validation

- [ ] All externally influenced inputs validated (params/query/body)
- [ ] Zod failures never leak stack traces as success responses

### Authorization

- [ ] Users cannot act on other users’ resources without explicit checks
- [ ] Admin endpoints are actually protected (`authMiddleware` + `requireRole("ADMIN")`)

### Data exposure

- [ ] No password hashes or refresh token secrets returned in JSON
- [ ] `select` minimizes sensitive fields

### Business logic abuse

- [ ] idempotency for “create once” resources (unique constraints + correct error mapping)
- [ ] race conditions considered for high-risk financial flows (payments)

## Example prompt

```
@docs/agents/SECURITY.md

Review the proposed Tag feature endpoints and Prisma schema.

Threat model:
- non-admin trying to create tags
- mass assignment via unexpected fields
- leaking private events via filters

Output:
- ranked issues
- concrete fixes aligned to this repo’s middleware/service patterns
```
