# Feature Development Workflow (Planora Backend)

This workflow is tailored to **this repository** (`planora-backend`). It intentionally avoids generic templates that assume `/api/v1` or class-based controllers.

## Phase 0 — Ground yourself in the repo (5 minutes)

1. Read mount points in `src/app.ts` (authoritative routing prefixing).
2. Open the closest existing module under `src/modules/` and copy its patterns:
   - middleware usage
   - Zod parsing style
   - `ApiResponse` / `ApiError` conventions

## Phase 1 — Requirements

Write a short spec:

- User story
- Acceptance criteria
- Authorization rules (USER/ADMIN/owner)
- Edge cases + expected status codes (`400/401/403/404/409`)

## Phase 2 — Architecture (`docs/agents/ARCHITECT.md`)

Prompt Cursor/Composer with:

```
@docs/agents/ARCHITECT.md

Feature: <name>
Requirements: <bullets>
Non-goals: <bullets>
```

Expected output: Prisma changes + endpoints + module file list + edge cases.

## Phase 3 — Database (`docs/agents/DATABASE.md`)

Turn architecture into Prisma schema updates under `prisma/schema/`.

Local dev commands (typical):

```bash
npx prisma migrate dev --name <feature>
npx prisma generate
npm run build
```

## Phase 4 — Implementation (`docs/agents/BACKEND.md`)

Implement module files:

- `*.validation.ts` (Zod)
- `*.repository.ts` (Prisma)
- `*.service.ts` (rules + `ApiError`)
- `*.controller.ts` (`asyncHandler` + `ApiResponse`)
- `*.route.ts` (router)

Wire the router in `src/app.ts` using the same mounting style as sibling modules.

## Phase 5 — Security review (`docs/agents/SECURITY.md`)

Especially check:

- missing `authMiddleware`
- broken ownership checks
- accidental data leaks via `select`
- abuse cases for pagination/filtering

## Phase 6 — Tests (`docs/agents/TEST.md`)

If the feature is risky (money, moderation, auth), add a test plan **even if** the repo doesn’t have a runner yet.

## Phase 7 — Documentation updates

Update:

- `docs/architecture/API_CONTRACTS.md` (endpoints index)
- `docs/architecture/CURRENT_STATE.md` (feature status)

## Definition of Done (Practical)

- `npm run build` passes
- New routes are documented in `API_CONTRACTS.md`
- No invented `/api/v1` paths in docs or code
- No `prisma` usage in controllers
