/**
 * Mirrors Prisma `UserRole`. Used on the `User.role` field from API payloads.
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

/**
 * Mirrors Prisma `AuthProvider`. Indicates email/password vs Google OAuth.
 */
export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

/**
 * Mirrors backend `UserPublic` — password is never returned on the wire.
 * Date fields arrive as ISO strings from JSON; parse with `new Date()` when needed.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  isBanned: boolean;
  bannedAt: string | null;
  isEmailVerified: boolean;
  authProvider: AuthProvider;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * Shape of `ApiResponse.data` after successful login.
 *
 * The backend sets the **refresh token in an HttpOnly cookie** (`refreshToken`);
 * it is not included in this object. Browser clients must not expect
 * `refreshToken` in JSON or in `localStorage`.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}
