/**
 * When `NEXT_PUBLIC_*` vars are unset in development, these defaults keep the app
 * runnable (e.g. fresh clones without `.env.local`). Override in `.env.local` for
 * your machine.
 */
const devDefaults: Record<string, string> = {
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:5000',
  NEXT_PUBLIC_API_URL: 'http://localhost:5000/api',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};

const devWarnedMissing = new Set<string>();

const readPublicEnv = (name: string): string => {
  const value = process.env[name];
  if (value && value.length > 0) {
    return value;
  }
  if (process.env.NODE_ENV === 'development') {
    const fallback = devDefaults[name];
    if (fallback !== undefined) {
      if (!devWarnedMissing.has(name)) {
        devWarnedMissing.add(name);
        console.warn(
          `[planora] ${name} is not set; using development default "${fallback}". Add it to .env.local to override.`
        );
      }
      return fallback;
    }
  }
  return '';
};

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function ensureApiPathSegment(value: string): string {
  const trimmed = trimTrailingSlash(value);
  if (trimmed === '') return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

/**
 * Public API origin (prefer host-only, e.g. `http://168.144.44.150`).
 * Legacy `NEXT_PUBLIC_API_URL` remains supported for compatibility.
 */
export const API_BASE_URL =
  readPublicEnv('NEXT_PUBLIC_API_BASE_URL') || readPublicEnv('NEXT_PUBLIC_API_URL');

/** Base URL for the Planora API (normalized to include `/api`). */
export const API_URL = ensureApiPathSegment(API_BASE_URL);

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
  /** Gateway / mock return + manual confirm (public). */
  paymentReturn: '/payment-return',
  notifications: '/notifications',
  notificationSettings: '/notification-settings',
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
