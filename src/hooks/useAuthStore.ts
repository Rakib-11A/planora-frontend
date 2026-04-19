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

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set(withAuthUser(user)),

  checkAuth: async () => {
    if (checkAuthInflight) {
      return checkAuthInflight;
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

        const envelope = (await api.get('auth/me')) as ApiResponse<User>;
        set(withAuthUser(unwrapApiData(envelope)));
      } catch (err) {
        if (
          isAxiosError(err) &&
          (err.response?.status === 429 || err.response?.status === 503)
        ) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '[useAuthStore] checkAuth rate-limited or unavailable; keeping token and existing session state'
            );
          }
          return;
        }
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(TOKEN_KEY);
        }
        set(withAuthUser(null));
        console.error('[useAuthStore] checkAuth failed', err);
      } finally {
        set({ isLoading: false });
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
        set({ ...withAuthUser(null), isLoading: false });
        window.location.assign(routes.login);
      } else {
        set({ ...withAuthUser(null), isLoading: false });
      }
    }
  },
}));
