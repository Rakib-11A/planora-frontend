'use client';

import {
  Bell,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Shield,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/layout/logo';
import { NotificationBell } from '@/components/layout/notification-bell';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

const navItems = [
  { href: routes.home, label: 'Home' },
  { href: routes.events, label: 'Events' },
  { href: routes.about, label: 'About' },
  { href: routes.contact, label: 'Contact' },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hueFromString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 360;
  }
  return h;
}

function DesktopPillLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'relative rounded-full px-4 py-2 text-sm font-medium text-foreground/90',
        'motion-safe:transition-all motion-safe:duration-200',
        'hover:bg-white/15 hover:text-foreground',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
        active && 'bg-white/25 font-semibold text-planora-primary shadow-depth-soft'
      )}
    >
      {label}
      {active ? (
        <span
          className="bg-planora-primary absolute bottom-1 left-1/2 hidden size-1.5 -translate-x-1/2 rounded-full md:block"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

function MobileNavCard({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string;
  label: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'mb-3 block rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-base font-semibold text-white/95 shadow-sm backdrop-blur-md',
        'motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02] hover:bg-white/15',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        active && 'border-sky-400/50 bg-planora-primary/25 text-white'
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const logout = useAuthStore((s) => s.logout);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const onWindowScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => onWindowScroll());
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onWindowScroll);
    };
  }, [onWindowScroll]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [dropdownOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const closeMobile = () => setMobileMenuOpen(false);

  const avatarHue = user ? hueFromString(user.name) : 0;
  const avatarInitial = user?.name?.trim().charAt(0).toUpperCase() ?? '?';

  type MenuEntry = {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
    match: (p: string) => boolean;
  };

  const accountMenuEntries: MenuEntry[] = [
    { href: routes.dashboard, label: 'Dashboard', icon: LayoutDashboard, match: (p) => isActivePath(p, routes.dashboard) },
    { href: routes.myEvents, label: 'My Events', icon: Ticket, match: (p) => isActivePath(p, routes.myEvents) },
    { href: routes.profile, label: 'Profile', icon: User, match: (p) => isActivePath(p, routes.profile) },
    { href: routes.participations, label: 'Participations', icon: Users, match: (p) => isActivePath(p, routes.participations) },
    { href: routes.invitations, label: 'Invitations', icon: Mail, match: (p) => isActivePath(p, routes.invitations) },
    { href: routes.payments, label: 'Payments', icon: CreditCard, match: (p) => isActivePath(p, routes.payments) },
    { href: routes.notifications, label: 'Notifications', icon: Bell, match: (p) => isActivePath(p, routes.notifications) },
    { href: routes.changePassword, label: 'Change password', icon: Settings, match: (p) => isActivePath(p, routes.changePassword) },
  ];

  const renderDesktopMenuItem = (entry: MenuEntry, onNavigate?: () => void) => {
    const Icon = entry.icon;
    const active = entry.match(pathname);
    return (
      <Link
        key={entry.href}
        href={entry.href}
        role="menuitem"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        className={cn(
          'group/menuitem flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/95',
          'motion-safe:transition-colors motion-safe:duration-200',
          'hover:bg-white/12',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
          active && 'bg-white/18 font-semibold text-planora-primary'
        )}
      >
        <Icon
          className="text-planora-primary/80 size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 group-hover/menuitem:rotate-12"
          aria-hidden
        />
        {entry.label}
      </Link>
    );
  };

  const renderMobileMenuItem = (entry: MenuEntry, onNavigate?: () => void) => {
    const Icon = entry.icon;
    const active = entry.match(pathname);
    return (
      <Link
        key={entry.href}
        href={entry.href}
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
        className={cn(
          'mb-2 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/95',
          'motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02] hover:bg-white/15',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
          active && 'border-sky-400/45 bg-planora-primary/30 text-white'
        )}
      >
        <Icon className="size-4 shrink-0 text-sky-300" aria-hidden />
        {entry.label}
      </Link>
    );
  };

  const shellClass = cn(
    'glass-effect flex w-full max-w-7xl items-center justify-between gap-3 rounded-full border border-white/25 shadow-lifted backdrop-blur-xl',
    'motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out',
    scrolled ? 'px-4 py-2 shadow-lifted-lg md:px-5' : 'px-4 py-2.5 md:px-6 md:py-3',
    'bg-white/55 dark:bg-black/25'
  );

  return (
    <>
      <div className="pointer-events-none fixed top-4 left-0 right-0 z-50 flex justify-center px-2">
        <nav className={cn(shellClass, 'pointer-events-auto')} aria-label="Main navigation">
          <Logo size="sm" variant="gradient" className="shrink-0" />

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => (
              <DesktopPillLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <NotificationBell />
            {isLoading ? (
              <div className="bg-planora-border/80 h-9 w-36 animate-pulse rounded-full" aria-hidden />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className={cn(
                    'text-foreground hover:bg-white/12 inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1.5 pr-3 text-sm font-medium',
                    'motion-safe:transition-colors motion-safe:duration-200',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
                    dropdownOpen && 'border-white/20 bg-white/15'
                  )}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="User menu"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-depth-soft"
                    style={{
                      background: `linear-gradient(135deg, hsl(${avatarHue}, 72%, 46%), hsl(${(avatarHue + 48) % 360}, 70%, 52%))`,
                    }}
                    aria-hidden
                  >
                    {avatarInitial}
                  </span>
                  <span className="max-w-[9rem] truncate">{user.name}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200',
                      dropdownOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
                {dropdownOpen ? (
                  <div
                    className={cn(
                      'absolute right-0 z-50 mt-2 min-w-[15rem] rounded-2xl border border-white/25 bg-white/80 p-2 shadow-lifted-lg backdrop-blur-xl animate-menu-down',
                      'dark:border-white/15 dark:bg-zinc-900/85'
                    )}
                    role="menu"
                  >
                    <div className="flex flex-col gap-0.5">
                      {accountMenuEntries.map((e) => renderDesktopMenuItem(e))}
                      {user.role === UserRole.ADMIN ? (
                        <Link
                          href={routes.admin}
                          role="menuitem"
                          onClick={() => {
                            setDropdownOpen(false);
                          }}
                          className={cn(
                            'group/menuitem flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/12',
                            isActivePath(pathname, routes.admin) && 'bg-white/18 font-semibold text-planora-primary'
                          )}
                        >
                          <Shield
                            className="text-planora-primary/80 size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 group-hover/menuitem:rotate-12"
                            aria-hidden
                          />
                          Admin
                        </Link>
                      ) : null}
                    </div>
                    <div className="my-2 border-t border-white/15 dark:border-white/10" />
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-planora-danger hover:bg-red-500/10 h-auto w-full justify-start gap-3 rounded-xl px-3 py-2.5 font-medium"
                      onClick={() => {
                        setDropdownOpen(false);
                        void logout();
                      }}
                    >
                      <LogOut className="size-4 shrink-0" aria-hidden />
                      Logout
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={routes.login}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-foreground/90',
                    'border border-transparent hover:border-white/25 hover:bg-white/15',
                    'motion-safe:transition-all motion-safe:duration-200',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary'
                  )}
                >
                  Login
                </Link>
                <Link
                  href={routes.register}
                  className={cn(
                    'inline-flex items-center justify-center rounded-full bg-planora-primary px-4 py-2 text-sm font-semibold text-white shadow-md',
                    'motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:scale-105',
                    'hover:bg-planora-primary/90 hover:shadow-glow-primary',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary'
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <NotificationBell />
            <button
              type="button"
              className={cn(
                'relative flex size-10 flex-col items-center justify-center rounded-full border border-white/25 bg-white/30',
                'motion-safe:transition-colors motion-safe:duration-200',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
                'dark:bg-white/10'
              )}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <span
                className={cn(
                  'bg-foreground absolute block h-0.5 w-5 rounded-full motion-safe:transition-transform motion-safe:duration-300',
                  mobileMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5'
                )}
              />
              <span
                className={cn(
                  'bg-foreground absolute block h-0.5 w-5 rounded-full motion-safe:transition-opacity motion-safe:duration-200',
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'bg-foreground absolute block h-0.5 w-5 rounded-full motion-safe:transition-transform motion-safe:duration-300',
                  mobileMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5'
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/45 backdrop-blur-[2px] motion-safe:transition-opacity motion-safe:duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobile}
      />

      <aside
        className={cn(
          'fixed top-0 right-0 z-[60] flex h-full w-[min(100%,22rem)] flex-col border-l border-white/10 bg-slate-950/92 text-white shadow-lifted-lg backdrop-blur-2xl',
          'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!mobileMenuOpen}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 pb-4 pt-24">
          <span className="text-sm font-semibold tracking-wide text-white/90">Menu</span>
          <button
            type="button"
            className="rounded-full p-2 text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <span className="relative flex size-6 items-center justify-center">
              <span className="absolute block h-0.5 w-5 rotate-45 rounded-full bg-white" />
              <span className="absolute block h-0.5 w-5 -rotate-45 rounded-full bg-white" />
            </span>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-8">
          {navItems.map((item) => (
            <MobileNavCard
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
              onNavigate={closeMobile}
            />
          ))}
          <div className="mt-4 border-t border-white/10 pt-4">
            {isLoading ? (
              <div className="h-10 w-full animate-pulse rounded-2xl bg-white/10" aria-hidden />
            ) : isAuthenticated && user ? (
              <div className="flex flex-col gap-1">
                <div className="mb-2 flex items-center gap-2 px-1 text-sm font-semibold text-white/90">
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, hsl(${avatarHue}, 72%, 46%), hsl(${(avatarHue + 48) % 360}, 70%, 52%))`,
                    }}
                  >
                    {avatarInitial}
                  </span>
                  <span className="truncate">{user.name}</span>
                </div>
                {accountMenuEntries.map((e) => renderMobileMenuItem(e, closeMobile))}
                {user.role === UserRole.ADMIN ? (
                  <Link
                    href={routes.admin}
                    onClick={closeMobile}
                    className="mb-2 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/95 hover:bg-white/15"
                  >
                    <Shield className="size-4 shrink-0 text-sky-300" aria-hidden />
                    Admin
                  </Link>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  className="text-planora-danger hover:bg-red-500/15 mt-2 h-auto justify-start gap-3 rounded-2xl border border-red-500/20 px-4 py-3 font-medium text-red-200"
                  onClick={() => {
                    closeMobile();
                    void logout();
                  }}
                >
                  <LogOut className="size-4 shrink-0" aria-hidden />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href={routes.login}
                  onClick={closeMobile}
                  className="glass-effect rounded-2xl border border-white/25 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
                <Link
                  href={routes.register}
                  onClick={closeMobile}
                  className="rounded-2xl bg-planora-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-glow-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
