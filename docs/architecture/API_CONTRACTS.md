# API Contracts (index)

This document is an **endpoint index** grounded in the Express routers. It is not OpenAPI/Swagger.

**Base URL**: `/api` (see `src/app.ts`)

Legend:

- **Auth**: `Bearer` access token unless marked Public
- Paths below are expressed as `METHOD /api/...`

## Auth (`src/modules/auth/auth.routes.ts`, mount: `/api/auth`)

Public:

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-otp`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Protected:

- `GET /api/auth/me` (Auth)
- `POST /api/auth/logout` (Auth)
- `PATCH /api/auth/change-password` (Auth)

## Admin (`src/modules/admin/admin.route.ts`, mount: `/api`)

All routes require **Auth + ADMIN** (`authMiddleware` + `requireRole("ADMIN")`).

- `GET /api/admin/users`
- `PATCH /api/admin/users/:userId/ban`
- `PATCH /api/admin/users/:userId/unban`
- `GET /api/admin/events`
- `DELETE /api/admin/events/:eventId`
- `GET /api/admin/reviews`
- `DELETE /api/admin/reviews/:reviewId`

## Events (`src/modules/event/event.route.ts`, mount: `/api/events`)

Public:

- `GET /api/events/`
- `GET /api/events/:id` (optional auth via `optionalAuthMiddleware`)

Protected:

- `POST /api/events/` (Auth)
- `PATCH /api/events/:id` (Auth)
- `DELETE /api/events/:id` (Auth)

## Invitations (`src/modules/invitation/invitation.route.ts`, mount: `/api`)

Protected:

- `POST /api/events/:eventId/invite`
- `GET /api/me/invitations`
- `POST /api/invitations/:invitationId/accept`
- `POST /api/invitations/:invitationId/decline`
- `POST /api/invitations/:invitationId/cancel`
- `GET /api/events/:eventId/invitations`

## Participation (`src/modules/participation/participation.route.ts`, mount: `/api`)

Protected:

- `POST /api/events/:eventId/join`
- `POST /api/events/:eventId/cancel`
- `GET /api/me/participations`
- `GET /api/events/:eventId/participants`
- `PATCH /api/events/:eventId/participants/:userId/approve`
- `PATCH /api/events/:eventId/participants/:userId/reject`

## Payments (`src/modules/payment/payment.route.ts`, mount: `/api`)

Protected:

- `POST /api/events/:eventId/pay`
- `POST /api/payments/:paymentId/verify`
- `GET /api/me/payments`

## Reviews (`src/modules/review/review.route.ts`, mount: `/api`)

Public:

- `GET /api/events/:eventId/reviews`
- `GET /api/events/:eventId/reviews/summary`

Protected:

- `POST /api/events/:eventId/reviews`
- `PATCH /api/events/:eventId/reviews`
- `DELETE /api/events/:eventId/reviews`

## Notifications (`src/modules/notification/notification.route.ts`, mount: `/api`)

Protected:

- `GET /api/me/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

## Health / root (see `src/app.ts`)

- `GET /`
- `GET /health`

## Maintenance rules

- When you add/change routes, update this file in the same PR.
- Avoid documenting `/api/v1/...` paths — this repo does not use that prefix.
