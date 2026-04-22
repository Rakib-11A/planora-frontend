# Planora — Events Platform

A full-stack event management platform where users can discover, create, and manage events. Organizers publish listings; attendees browse, register, and pay; admins moderate everything from a dedicated console.

---

## Live URLs

| Environment | URL |
|-------------|-----|
| Production (frontend) | _Deploy to Vercel — see setup instructions_ |
| Backend API | `http://168.144.44.150` |

---

## Features

### Public
- **Event discovery** — browse all public events with search and category filters
- **Featured event** — admin-curated hero event on the homepage
- **Event detail** — ratings, participant count, organizer info, and registration

### Authentication
- Email/password registration with email verification
- Login, forgot password, and reset password flows
- Google OAuth support
- JWT access token + HttpOnly refresh token cookie session management

### Organizer (authenticated users)
- Create, edit, and soft-delete events (public/private, free/paid)
- **My Events** — view and manage all events you organize
- **Participations** — track your event registrations
- **Invitations** — accept or decline private event invitations
- **Payments** — checkout history and payment return handling
- **Notifications** — system messages with per-category notification settings
- Profile management and password change

### Admin console (`/admin`)
- **Users** — search, ban, and unban accounts
- **Events** — review listings and soft-delete events
- **Featured event** — curate the homepage hero
- **Reviews** — moderate event reviews
- **Cache** — Redis health and hot key inspection
- **Rate limits** — view blocked request buckets

### UX & DX
- Dark / light / system theme with zero flash (next-themes)
- Animated section reveals with `IntersectionObserver`
- Toast notifications (react-hot-toast)
- Form validation with Zod schemas
- Fully typed API layer with Axios and auto token refresh
- React Compiler enabled for automatic memoization

---

## Technologies

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State management | Zustand 5 |
| HTTP client | Axios with interceptor-based token refresh |
| Validation | Zod |
| Icons | Lucide React |
| Fonts | Inter (next/font/google) |
| Toasts | react-hot-toast |
| Theme | next-themes |
| Compiler | React Compiler (babel-plugin-react-compiler) |
| Linting | ESLint 9 + eslint-config-next |
| Formatting | Prettier + prettier-plugin-tailwindcss |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router — pages, layouts, loading/error UI
│   ├── (auth)/           # Login, register, verify-email, password reset
│   ├── (account)/        # Profile, participations, payments, invitations, notifications
│   ├── admin/            # Admin console (users, events, reviews, cache, rate limits)
│   ├── dashboard/        # Organizer hub — create/edit events, change password
│   ├── events/           # Public event listing and detail pages
│   └── my-events/        # Events the authenticated user organizes
├── components/
│   ├── auth/             # Auth form components
│   ├── events/           # Event cards, forms, search
│   ├── home/             # Homepage sections (hero, featured, upcoming, CTA)
│   ├── layout/           # Navbar, footer
│   ├── shared/           # Theme provider, reusable wrappers
│   └── ui/               # Design system primitives (Card, Button, etc.)
├── constants/            # Route map, env config, token keys
├── hooks/                # useAuthStore (Zustand), useInView
├── lib/                  # API client, data fetchers (events, reviews), Zod schemas, utils
└── types/                # TypeScript interfaces mirroring backend models
```

---

## Setup Instructions

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A running instance of the Planora backend API

### 1. Clone and install

```bash
git clone <repo-url>
cd planora-frontend
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Base URL of the Planora backend (no trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Public URL of this frontend app (used for redirects and links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If both variables are omitted, the app falls back to `http://localhost:5000` and `http://localhost:3000` in development with a console warning.

### 3. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the following environment variables in the Vercel project settings:

```
NEXT_PUBLIC_API_BASE_URL=http://<backend-host>
NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>
```

4. Also set on the backend side so cookies work cross-origin:

```
FRONTEND_URL=https://<your-vercel-domain>
COOKIE_SECURE=false        # set true once backend has TLS
COOKIE_SAME_SITE=lax
```

> **Note:** The backend must be served over HTTPS with a proper domain before `Secure` cookies and certain OAuth/payment callbacks will work correctly. See `DEPLOYMENT_HANDOFF.md` for details.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server with HMR |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |
