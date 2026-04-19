'use client';

import { ChevronDown, Menu, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { cn } from '@/lib/utils';

const navLinkBase =
  'rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-planora-primary';

const authLinkBase =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-planora-primary focus-visible:ring-offset-2';

const authLinkOutline =
  'border-2 border-planora-primary text-planora-primary hover:bg-planora-primary/10';

const authLinkPrimary = 'bg-planora-primary text-white hover:bg-planora-primary/90';

const navItems = [
  { href: routes.home, label: 'Home' },
  { href: routes.events, label: 'Events' },
  { href: routes.about, label: 'About' },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavTextLink({
  href,
  children,
  pathname,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      className={cn(navLinkBase, active && 'text-planora-primary')}
      onClick={onNavigate}
    >
      {children}
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

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

  const authLinks = (
    <>
      <Link href={routes.login} className={cn(authLinkBase, authLinkOutline)} onClick={closeMobile}>
        Login
      </Link>
      <Link
        href={routes.register}
        className={cn(authLinkBase, authLinkPrimary)}
        onClick={closeMobile}
      >
        Sign Up
      </Link>
    </>
  );

  const navLinks = (onNavigate?: () => void) => (
    <>
      {navItems.map((item) => (
        <NavTextLink key={item.href} href={item.href} pathname={pathname} onNavigate={onNavigate}>
          {item.label}
        </NavTextLink>
      ))}
    </>
  );

  const userMenu = (onNavigate?: () => void) => (
    <div className="border-planora-border flex flex-col gap-1 border-t pt-2 md:border-0 md:pt-0">
      <Link
        href={routes.dashboard}
        className={cn(
          navLinkBase,
          isActivePath(pathname, routes.dashboard) && 'text-planora-primary'
        )}
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
      >
        Dashboard
      </Link>
      <Link
        href={routes.myEvents}
        className={cn(
          navLinkBase,
          isActivePath(pathname, routes.myEvents) && 'text-planora-primary'
        )}
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
      >
        My Events
      </Link>
      <Link
        href={routes.profile}
        className={cn(
          navLinkBase,
          isActivePath(pathname, routes.profile) && 'text-planora-primary'
        )}
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
        }}
      >
        Profile
      </Link>
      <Button
        type="button"
        variant="ghost"
        className="text-planora-danger hover:bg-planora-danger/10 justify-start px-3"
        onClick={() => {
          setDropdownOpen(false);
          onNavigate?.();
          void logout();
        }}
      >
        Logout
      </Button>
    </div>
  );

  return (
    <>
      <nav
        className="border-planora-border fixed top-0 z-50 h-16 w-full border-b bg-white"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <Logo size="sm" />

          <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {navLinks()}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isLoading ? (
              <div className="bg-planora-border h-9 w-36 animate-pulse rounded-md" aria-hidden />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="text-foreground hover:bg-planora-primary/10 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="User menu"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  <User className="text-planora-primary size-4 shrink-0" aria-hidden />
                  <span className="max-w-[10rem] truncate">{user.name}</span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 transition-transform',
                      dropdownOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
                {dropdownOpen ? (
                  <div
                    className="border-planora-border absolute right-0 z-50 mt-2 min-w-[12rem] rounded-md border bg-white py-1 shadow-lg"
                    role="menu"
                  >
                    <div className="flex flex-col px-1">{userMenu()}</div>
                  </div>
                ) : null}
              </div>
            ) : (
              authLinks
            )}
          </div>

          <button
            type="button"
            className="text-planora-primary hover:bg-planora-primary/10 inline-flex items-center justify-center rounded-md p-2 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((o) => !o)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobile}
      />

      <aside
        className={cn(
          'border-planora-border fixed top-0 right-0 z-[60] flex h-full w-[min(100%,20rem)] flex-col border-l bg-white shadow-xl transition-transform duration-300 ease-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="border-planora-border flex h-16 items-center justify-between border-b px-4">
          <span className="text-planora-primary text-sm font-semibold">Menu</span>
          <button
            type="button"
            className="text-planora-primary hover:bg-planora-primary/10 rounded-md p-2"
            aria-label="Close menu"
            onClick={closeMobile}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
          <div className="flex flex-col gap-1">{navLinks(closeMobile)}</div>
          <div className="border-planora-border border-t pt-4">
            {isLoading ? (
              <div className="bg-planora-border h-10 w-full animate-pulse rounded-md" aria-hidden />
            ) : isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                  <User className="text-planora-primary size-4" aria-hidden />
                  <span className="truncate">{user.name}</span>
                </div>
                {userMenu(closeMobile)}
              </div>
            ) : (
              <div className="flex flex-col gap-2">{authLinks}</div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
