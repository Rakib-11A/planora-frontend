const missingPublicEnv = (name: string): never => {
  throw new Error(
    `Missing ${name}. Add it to .env.local (see NEXT_PUBLIC_* in the Planora frontend README or scaffold).`
  );
};

const readPublicEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || value.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      missingPublicEnv(name);
    }
    return '';
  }
  return value;
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
  events: '/events',
  event: (id: string) => `/events/${id}`,
  profile: '/profile',
} as const;
