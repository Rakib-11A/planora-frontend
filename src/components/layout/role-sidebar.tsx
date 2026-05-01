'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  exact?: boolean;
}

interface RoleSidebarProps {
  title: string;
  items: SidebarNavItem[];
  storageKey?: string;
}

export function RoleSidebar({ title, items, storageKey = 'planora_sidebar_collapsed' }: RoleSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) setCollapsed(stored === 'true');
    } catch {}
  }, [storageKey]);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {}
      return next;
    });
  }

  function isActive(href: string, exact?: boolean): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Defer collapse state to after mount to prevent hydration mismatch
  const isCollapsed = mounted && collapsed;

  return (
    <aside
      className={cn(
        'shrink-0 transition-[width] duration-200',
        isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-56'
      )}
    >
      <div className="relative rounded-3xl border border-white/35 bg-white/45 p-4 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45 lg:sticky lg:top-24">
        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute -right-3 top-5 z-10 hidden size-6 items-center justify-center rounded-full border border-border bg-surface shadow-low text-muted transition-colors hover:text-foreground lg:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" aria-hidden />
          ) : (
            <ChevronLeft className="size-3.5" aria-hidden />
          )}
        </button>

        {!isCollapsed && (
          <p className="truncate text-xs font-bold uppercase tracking-widest text-planora-primary dark:text-sky-300">
            {title}
          </p>
        )}

        <nav
          className={cn('flex flex-col gap-1', !isCollapsed && 'mt-4')}
          aria-label={title}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  'flex items-center rounded-full text-sm font-semibold motion-safe:transition motion-safe:duration-200',
                  isCollapsed ? 'justify-center px-2 py-2' : 'gap-2 px-3 py-2',
                  active
                    ? 'bg-planora-primary/15 text-planora-primary dark:bg-planora-primary/25 dark:text-sky-200'
                    : 'text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-white/10'
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
