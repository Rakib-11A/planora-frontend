import { isAxiosError } from 'axios';
import { create } from 'zustand';

import { TOKEN_KEY, routes } from '@/constants/config';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Becomes true after the first `checkAuth()` run finishes (any outcome). Used so layouts do not treat "not yet loaded" the same as "logged out". */
  sessionHydrated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

function withAuthUser(user: User | null): Pick<AuthState, 'user' | 'isAuthenticated'> {
  return { user, isAuthenticated: user !== null };
}

/** Coalesces concurrent `checkAuth` calls (navbar + several layouts each mount together). */
let checkAuthInflight: Promise<void> | null = null;

/** After a 429 on `auth/me`, skip starting new checks briefly to avoid hammering the API (dev Strict Mode + many layouts). */
let checkAuthCooldownUntil = 0;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  sessionHydrated: false,

  setUser: (user) => set({ ...withAuthUser(user), sessionHydrated: true }),

  checkAuth: async () => {
    if (checkAuthInflight) {
      return checkAuthInflight;
    }
    const { sessionHydrated: alreadyHydrated } = useAuthStore.getState();
    if (alreadyHydrated && Date.now() < checkAuthCooldownUntil) {
      return Promise.resolve();
    }

    checkAuthInflight = (async () => {
      set({ isLoading: true });
      try {
        if (typeof window === 'undefined') {
          return;
        }
        const token = window.localStorage.getItem(TOKEN_KEY);
        if (!token) {
          set(withAuthUser(null));
          return;
        }

        const loadMe = async () => {
          const envelope = (await api.get('auth/me')) as ApiResponse<User>;
          set(withAuthUser(unwrapApiData(envelope)));
        };
        await loadMe();
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 429) {
          checkAuthCooldownUntil = Date.now() + 4000;
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[useAuthStore] checkAuth rate limited; backing off without clearing session (token + refresh cookie kept)'
            );
          }
          // One delayed retry — avoids false "logged out" on dev StrictMode / burst mounts.
          const stillHasToken =
            typeof window !== 'undefined' && window.localStorage.getItem(TOKEN_KEY) !== null;
          if (stillHasToken) {
            await new Promise<void>((resolve) => {
              setTimeout(() => resolve(), 1200);
            });
            try {
              const envelope = (await api.get('auth/me')) as ApiResponse<User>;
              set(withAuthUser(unwrapApiData(envelope)));
            } catch {
              // keep token; user state unknown until next navigation triggers checkAuth again
            }
          }
          return;
        }
        // Transient: server unreachable (no response) or 5xx / timeout. Do NOT treat as
        // session loss — api.ts has already handled true auth failures (401 + failed refresh)
        // by clearing the token and redirecting to /login. If we got here with a non-401
        // response or no response at all, the token is still valid; a backend restart or
        // network blip should not log the user out.
        if (isAxiosError(err)) {
          const status = err.response?.status;
          const isNetworkError = err.response === undefined;
          const isServerError = typeof status === 'number' && status >= 500;
          if (isNetworkError || isServerError) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(
                `[useAuthStore] checkAuth transient failure (${isNetworkError ? 'network' : String(status)}); keeping session`
              );
            }
            return;
          }
        }
        // At this point the error is an unambiguous auth failure (typically 401 that api.ts
        // already cleaned up) — mirror the cleared session in store state.
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(TOKEN_KEY);
        }
        set(withAuthUser(null));
        console.error('[useAuthStore] checkAuth failed', err);
      } finally {
        set({ isLoading: false, sessionHydrated: true });
        checkAuthInflight = null;
      }
    })();

    return checkAuthInflight;
  },

  logout: async () => {
    try {
      await api.post('auth/logout');
    } catch (err) {
      console.error('[useAuthStore] logout failed', err);
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(TOKEN_KEY);
        set({ ...withAuthUser(null), isLoading: false, sessionHydrated: true });
        window.location.assign(routes.login);
      } else {
        set({ ...withAuthUser(null), isLoading: false, sessionHydrated: true });
      }
    }
  },
}));
