/**
 * When `NEXT_PUBLIC_*` vars are unset in development, these defaults keep the app
 * runnable (e.g. fresh clones without `.env.local`). Override in `.env.local` for
 * your machine.
 */
const devDefaults: Record<string, string> = {
  NEXT_PUBLIC_API_URL: 'http://localhost:5000/api',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};

const readPublicEnv = (name: string): string => {
  const value = process.env[name];
  if (value && value.length > 0) {
    return value;
  }
  if (process.env.NODE_ENV === 'development') {
    const fallback = devDefaults[name];
    if (fallback !== undefined) {
      console.warn(
        `[planora] ${name} is not set; using development default "${fallback}". Add it to .env.local to override.`
      );
      return fallback;
    }
  }
  return '';
};

/** Base URL for the Planora API (includes `/api` path segment). */
export const API_URL = readPublicEnv('NEXT_PUBLIC_API_URL');

/** Public site URL for links and redirects. */
export const APP_URL = readPublicEnv('NEXT_PUBLIC_APP_URL');

/** `localStorage` key for the JWT access token. */
export const TOKEN_KEY = 'planora_access_token';

/**
 * Reserved for flows that store a refresh token client-side.
 * The backend currently issues refresh tokens in an **HttpOnly cookie** — do not
 * assume this key is populated for session refresh.
 */
export const REFRESH_TOKEN_KEY = 'planora_refresh_token';

export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  events: '/events',
  event: (id: string) => `/events/${id}`,
  about: '/about',
  dashboard: '/dashboard',
  createEvent: '/dashboard/create-event',
  editEvent: (id: string) => `/dashboard/events/${id}/edit`,
  changePassword: '/dashboard/change-password',
  myEvents: '/my-events',
  profile: '/profile',
  participations: '/participations',
  reviews: '/reviews',
  invitations: '/invitations',
  payments: '/payments',
  notifications: '/notifications',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminEvents: '/admin/events',
  adminReviews: '/admin/reviews',
  adminFeatured: '/admin/featured',
  adminCache: '/admin/cache',
  adminRateLimits: '/admin/rate-limits',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const;
