'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const FAB_SHOW_AFTER = 320;

export interface HomeScrollChromeProps {
  children: ReactNode;
}

export function HomeScrollChrome({ children }: HomeScrollChromeProps) {
  const [progress, setProgress] = useState(0);
  const [fabVisible, setFabVisible] = useState(false);

  const onScroll = useCallback(() => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    setProgress(scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0);
    setFabVisible(y > FAB_SHOW_AFTER);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => onScroll());
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 bg-slate-200/60"
        aria-hidden
      >
        <div
          className="gradient-animated h-full w-full origin-left will-change-transform motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <Link
        href={routes.createEvent}
        aria-label="Create a new event"
        className={cn(
          'fixed bottom-6 right-5 z-[90] flex size-14 items-center justify-center rounded-full',
          'glass-effect border border-white/40 text-planora-primary shadow-lifted backdrop-blur-xl',
          'motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out',
          'hover:shadow-glow-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary',
          'motion-safe:hover:scale-105',
          fabVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0 md:translate-y-6'
        )}
      >
        <Plus className="size-7 stroke-[2.5]" aria-hidden />
      </Link>

      {children}
    </>
  );
}
