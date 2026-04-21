# Frontend Production Handoff

## Frontend environment variables

- `NEXT_PUBLIC_API_BASE_URL=http://168.144.44.150`
- `NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>`

## Backend environment variables (required for cross-origin cookies)

- `FRONTEND_URL=https://<your-vercel-domain>`

If your backend has explicit cookie settings, use these production-safe values while backend stays on HTTP:

- `COOKIE_SECURE=false`
- `COOKIE_SAME_SITE=lax`

## Why this is currently limited

Backend is running on plain HTTP and an IP origin. This prevents secure cookies, blocks some OAuth and
payment callback requirements, and may trigger browser restrictions for cross-site credentials.

## Recommended upgrade

Move backend to `https://api.<your-domain>` with TLS, then set:

- `NEXT_PUBLIC_API_BASE_URL=https://api.<your-domain>`
- backend cookie settings: `Secure=true`, `SameSite=None` (if cross-site is required)