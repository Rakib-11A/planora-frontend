# Planora UI route checklist (manual QA)

Use after deployments or major UI changes. **API contract:** `/api/docs` (Swagger). **Auth:** Bearer in `Authorization` for protected routes; refresh cookie for `/api/auth/refresh-token`.

| Backend surface | UI owner | Manual test note |
|-----------------|----------|------------------|
| `GET /api/auth/me` | `/profile` | Loads name, email, role, verified flag. |
| `PATCH /api/auth/change-password` | `/dashboard/change-password` | Strong password rules; success returns to dashboard. |
| `POST /api/auth/login` | `/login` | Token stored; redirect home. |
| `POST /api/auth/register` | `/register` | Success toast; then verify email if required. |
| `POST /api/auth/forgot-password` | `/forgot-password` | Email validation; success message. |
| `POST /api/auth/reset-password` | `/reset-password` | Email + 6-digit OTP + new password. |
| `POST /api/auth/verify-email` | `/verify-email` | Email + OTP; resend uses `POST /api/auth/resend-otp`. |
| `GET /api/events` (public list) | `/`, `/events` | Grid renders; empty + 429 handled gracefully on SSR. |
| `GET /api/events/:id` | `/events/[id]` | Detail, reviews, participation, pay block for paid pending. |
| `GET /api/events/mine` | `/my-events` | Auth required; list + edit links. |
| `POST/PATCH/DELETE /api/events` | `/dashboard/create-event`, edit | Breadcrumbs; invitations panel when owner. |
| `POST /api/events/:eventId/join` | Event detail | Join + cancel; syncs with `GET /api/me/participations`. |
| `POST /api/events/:eventId/pay` | Event detail (`EventPayBlock`) | Opens `paymentUrl`; then verify. |
| `POST /api/payments/:id/verify` | Event detail, `/payments` | Completes mock checkout flow. |
| `GET /api/me/payments` | `/payments` | Table + verify for `INITIATED`. |
| `GET /api/me/participations` | `/participations` | List + link to event. |
| `GET /api/me/invitations` | `/invitations` | Accept / decline pending. |
| `POST /api/events/:eventId/invite` | Edit event (owner) | Requires invitee **user id** (CUID). |
| `GET /api/events/:eventId/invitations` | Edit event (owner) | Table + cancel pending. |
| `GET /api/me/notifications` | `/notifications`, navbar bell | Unread badge; mark read / read all. |
| `PATCH /api/notifications/:id/read` | `/notifications` | Row action. |
| `PATCH /api/notifications/read-all` | `/notifications` | Header action. |
| `GET /api/admin/users` + ban/unban | `/admin/users` | Search by email substring; ban not shown for `ADMIN`. |
| `GET/DELETE /api/admin/events` | `/admin/events` | Soft-delete; deleted rows flagged. |
| `GET/DELETE /api/admin/reviews` | `/admin/reviews` | Soft-delete review. |
| `GET /api/admin/cache/stats` | `/admin/cache` | Summary + top keys table. |
| `GET /api/admin/rate-limits` | `/admin/rate-limits` | Bucket list. |
| Static marketing | `/about`, `/contact`, `/privacy`, `/terms` | Navbar/footer links; placeholder copy. |

**Responsive / a11y spot-check:** mobile nav drawer, keyboard focus on forms (`Input` / `Button` rings), table horizontal scroll on small screens (`DataTableShell`), breadcrumb `aria-label`, notification bell `aria-label` with unread count.
