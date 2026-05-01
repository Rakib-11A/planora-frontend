'use client';

import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, Shield, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/layout/logo';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/user';

const loggedOutLinks = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: routes.about, label: 'About' },
] as const;

const loggedInLinks = [
  { href: routes.dashboard, label: 'Dashboard' },
  { href: routes.profile, label: 'Profile' },
  { href: routes.notificationSettings, label: 'Settings' },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href.startsWith('#')) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const roleBadgeConfig: Record<UserRole, { label: string; className: string }> = {
  [UserRole.ADMIN]: {
    label: 'Admin',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  [UserRole.MANAGER]: {
    label: 'Manager',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  [UserRole.USER]: {
    label: 'Member',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  },
};

function RoleBadge({ role }: { role: UserRole }) {
  const config = roleBadgeConfig[role] ?? roleBadgeConfig[UserRole.USER];
  return (
    <span
      className={cn(
        'mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary-subtle-foreground">
      {initial}
    </span>
  );
}

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium text-muted-strong transition-colors hover:bg-surface-subtle hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active && 'bg-primary-subtle text-primary-subtle-foreground'
      )}
    >
      {label}
    </Link>
  );
}

export function ApexNavbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void useAuthStore.getState().checkAuth();
  }, []);

  const updateScrollState = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(updateScrollState);
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateScrollState);
    };
  }, [updateScrollState]);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [profileOpen]);

  const links = isAuthenticated && user ? loggedInLinks : loggedOutLinks;
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav
          aria-label="Main navigation"
          className={cn(
            'mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-lg border border-border bg-surface/88 px-4 shadow-low backdrop-blur-md transition-all duration-200',
            scrolled && 'h-14 bg-surface/94 shadow-medium'
          )}
        >
          <Logo size="sm" className="shrink-0" />

          <div className="hidden items-center gap-1 md:flex">
            {links.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-11 w-36 animate-pulse rounded-md bg-surface-subtle" aria-hidden />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((open) => !open)}
                >
                  <Avatar name={user.name} />
                  <span className="max-w-32 truncate">{user.name}</span>
                  <ChevronDown
                    className={cn('size-4 text-muted transition-transform', profileOpen && 'rotate-180')}
                    aria-hidden
                  />
                </button>

                {profileOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-surface p-2 shadow-high"
                  >
                    <div className="flex items-center gap-3 border-b border-border px-3 py-3">
                      <Avatar name={user.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="truncate text-caption text-muted">{user.email}</p>
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                    {user.role === UserRole.ADMIN && (
                      <Link
                        href={routes.admin}
                        role="menuitem"
                        className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield className="size-4 text-red-500" aria-hidden />
                        Admin Portal
                      </Link>
                    )}
                    {user.role === UserRole.MANAGER && (
                      <Link
                        href={routes.manager}
                        role="menuitem"
                        className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield className="size-4 text-purple-500" aria-hidden />
                        Manager Portal
                      </Link>
                    )}
                    <Link
                      href={routes.dashboard}
                      role="menuitem"
                      className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="size-4 text-primary" aria-hidden />
                      Dashboard
                    </Link>
                    <Link
                      href={routes.profile}
                      role="menuitem"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="size-4 text-primary" aria-hidden />
                      Account settings
                    </Link>
                    <Link
                      href={routes.notificationSettings}
                      role="menuitem"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-subtle"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="size-4 text-primary" aria-hidden />
                      Preferences
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="mt-2 flex w-full items-center gap-2 rounded-md border-t border-border px-3 py-3 text-left text-sm font-semibold text-destructive hover:bg-destructive-subtle"
                      onClick={() => {
                        setProfileOpen(false);
                        void logout();
                      }}
                    >
                      <LogOut className="size-4" aria-hidden />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link
                  href={routes.login}
                  className={buttonVariants({ variant: 'ghost', className: 'h-11' })}
                >
                  Login
                </Link>
                <Link href={routes.register} className={buttonVariants({ className: 'h-11' })}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md border border-border bg-surface text-foreground md:hidden"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </nav>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMobile}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed right-4 top-24 z-50 w-[calc(100%-2rem)] rounded-lg border border-border bg-surface p-4 shadow-high transition-transform md:hidden',
          mobileOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-4 opacity-0'
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-1">
          {links.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} onClick={closeMobile} />
          ))}
        </div>
        <div className="mt-4 border-t border-border pt-4">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="truncate text-caption text-muted">{user.email}</p>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <button
                type="button"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full justify-start text-destructive hover:bg-destructive-subtle',
                })}
                onClick={() => {
                  closeMobile();
                  void logout();
                }}
              >
                <LogOut className="size-4" aria-hidden />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={routes.login}
                onClick={closeMobile}
                className={buttonVariants({ variant: 'outline' })}
              >
                Login
              </Link>
              <Link href={routes.register} onClick={closeMobile} className={buttonVariants()}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
