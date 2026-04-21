# Planora Backend — Current State

Last updated: 2026-04-18 (maintenance: update when you ship features)

## Overview

Planora backend is an Express + TypeScript API using Prisma (PostgreSQL). Features are organized as modules under `src/modules/*` following **Controller → Service → Repository**.

## Routing map (authoritative)

See `src/app.ts` for mounts. This repo uses `/api/...` (not `/api/v1/...`).

## Implemented modules (high level)

### Auth (`src/modules/auth`)

- Email/password auth flows, refresh rotation, OTP email verification + password reset helpers
- Login brute-force protection: lockout after repeated failures with 15-minute block window
- Router: `src/modules/auth/auth.routes.ts` mounted at `/api/auth`

### Events (`src/modules/event`)

- Event CRUD + public listing/detail (`optionalAuthMiddleware` on detail for private event UX)
- Router: `src/modules/event/event.route.ts` mounted at `/api/events`

### Participation (`src/modules/participation`)

- Join/cancel participation, owner approve/reject, listings
- Router: `src/modules/participation/participation.route.ts` mounted at `/api`

### Payments (`src/modules/payment`)

- Initiate + verify payment (provider abstraction; mock provider exists)
- Router: `src/modules/payment/payment.route.ts` mounted at `/api`

### Invitations (`src/modules/invitation`)

- Invite lifecycle for private-event UX
- Router: `src/modules/invitation/invitation.route.ts` mounted at `/api`

### Reviews (`src/modules/review`)

- Reviews + rating summary endpoints
- Router: `src/modules/review/review.route.ts` mounted at `/api`

### Notifications (`src/modules/notification`)

- DB notifications + email side effects (email failures should not break main flows)
- Centralized trigger seam: `src/modules/notification/notification.trigger.ts`
- Router: `src/modules/notification/notification.route.ts` mounted at `/api`

### Admin / moderation (`src/modules/admin`)

- Admin-only monitoring + moderation endpoints (`requireRole("ADMIN")`)
- Router: `src/modules/admin/admin.route.ts` mounted at `/api` → paths are `/api/admin/...`

## Cross-cutting behavior

### API envelopes

- Success responses commonly wrap data with `ApiResponse` (`src/utils/ApiResponse.ts`)
- Operational failures commonly use `ApiError` (`src/utils/ApiError.ts`) + `globalErrorHandler`

### Security middleware

- `authMiddleware`, `optionalAuthMiddleware` (`src/middlewares/auth.middleware.ts`)
- `requireRole` (`src/middlewares/role.middleware.ts`)

### Moderation / bans / soft delete (as implemented in codebase)

- User bans: `User.isBanned` / `User.bannedAt` (see `prisma/schema/user.prisma`)
- Soft delete fields exist for some content domains (e.g. `Event.deletedAt`, `Review.deletedAt`) — verify behavior in repositories/services when changing queries

## Known gaps / tech debt (honest)

- No standard automated test runner configured in `package.json` yet (`docs/agents/TEST.md` describes how to adopt one)
- API documentation is maintained manually here (`docs/architecture/API_CONTRACTS.md`) — no OpenAPI generator wired in-repo

## How to update this file

When you add a module or change mounts:

1. Update `src/app.ts` (if needed)
2. Update `docs/architecture/API_CONTRACTS.md`
3. Update this file with 1–2 bullets under the relevant module
