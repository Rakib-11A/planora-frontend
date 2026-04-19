'use client';

import {
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { HeroSearchBar } from '@/components/home/hero-search-bar';
import { routes } from '@/constants/config';
import type { EventWithType } from '@/types/event';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export interface HeroSectionProps {
  featuredEvent: EventWithType | null;
}

function getEventStart(event: EventWithType): string {
  return event.startDateTime ?? event.dateTime;
}

function getOrganizerName(event: EventWithType): string {
  return event.organizer?.name ?? event.createdBy?.name ?? 'Organizer';
}

function getLocationLabel(event: EventWithType): string {
  const raw = (event.location ?? event.venue ?? '').trim();
  return raw.length > 0 ? raw : 'Venue TBA';
}

function feeLabel(event: EventWithType): string {
  const n = typeof event.fee === 'number' ? event.fee : Number(event.fee);
  const fee = Number.isFinite(n) ? n : 0;
  if (fee === 0) return 'FREE';
  return formatCurrency(fee, 'BDT', 'en-BD');
}

const primaryCtaClass = cn(
  'inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-lg font-semibold',
  'bg-planora-primary text-white shadow-md',
  'focus-visible:outline-planora-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'motion-safe:transition motion-safe:duration-300 motion-safe:ease-out',
  'hover:scale-105 hover:-translate-y-1 hover:shadow-glow-primary hover:bg-planora-primary/95 active:scale-[0.98]'
);

const secondaryCtaClass = cn(
  'glass-dark inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3 text-lg font-semibold',
  'text-planora-primary dark:border-white/15 dark:text-planora-secondary',
  'focus-visible:outline-planora-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'motion-safe:transition motion-safe:duration-300 motion-safe:ease-out',
  'hover:scale-105 hover:shadow-glow-secondary active:scale-[0.98]'
);

const textLinkClass = cn(
  'font-semibold text-planora-primary underline decoration-planora-primary/40 underline-offset-4',
  'transition hover:decoration-planora-primary hover:decoration-2'
);

type Parallax = { x: number; y: number };

const CENTER: Parallax = { x: 0.5, y: 0.5 };

/** Mesh + animated wash + blobs; blob wrappers shift slightly with pointer for depth. */
function MeshBackgroundInteractive({ parallax, motionOk }: { parallax: Parallax; motionOk: boolean }) {
  const dx = motionOk ? (parallax.x - 0.5) * 36 : 0;
  const dy = motionOk ? (parallax.y - 0.5) * 28 : 0;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="gradient-animated absolute inset-0 opacity-90 motion-reduce:opacity-100 motion-reduce:[animation:none]" />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-50 mix-blend-soft-light dark:opacity-35 dark:mix-blend-screen"
        style={{
          background: `radial-gradient(680px circle at ${parallax.x * 100}% ${parallax.y * 100}%, rgba(255,255,255,0.35), transparent 42%)`,
        }}
      />
      <div
        className="absolute top-16 left-4 transition-transform duration-500 ease-out motion-reduce:transition-none sm:left-10"
        style={{ transform: `translate(${dx * 0.8}px, ${dy * 0.6}px)` }}
      >
        <div className="bg-planora-primary/25 size-56 rounded-full blur-3xl motion-safe:animate-blob-float sm:size-72" />
      </div>
      <div
        className="absolute top-40 right-0 transition-transform duration-500 ease-out motion-reduce:transition-none sm:right-10"
        style={{ transform: `translate(${-dx * 0.6}px, ${dy * 0.9}px)` }}
      >
        <div
          className="bg-planora-secondary/30 size-64 rounded-full blur-3xl motion-safe:animate-blob-float sm:size-80"
          style={{ animationDelay: '-6s' }}
        />
      </div>
      <div
        className="absolute bottom-8 left-1/3 transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translate(${dx * 0.5}px, ${-dy * 0.7}px)` }}
      >
        <div
          className="bg-planora-accent/25 size-48 rounded-full blur-3xl motion-safe:animate-blob-float sm:size-72"
          style={{ animationDelay: '-12s' }}
        />
      </div>
      <div
        className="absolute bottom-24 right-1/4 transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translate(${-dx}px, ${dy * 0.4}px)` }}
      >
        <div
          className="size-40 rounded-full bg-cyan-400/20 blur-3xl motion-safe:animate-blob-float sm:size-56"
          style={{ animationDelay: '-3s' }}
        />
      </div>
    </div>
  );
}

function FeaturedVisualCard({ event }: { event: EventWithType }) {
  const fee = feeLabel(event);
  const typeLabel = event.isPublic ? 'PUBLIC' : 'PRIVATE';
  const gradient = event.isPublic
    ? 'from-planora-primary via-indigo-500 to-planora-secondary'
    : 'from-violet-600 via-purple-600 to-fuchsia-600';

  return (
    <Link
      href={routes.event(event.id)}
      className={cn(
        'group relative block max-w-md motion-safe:transition motion-safe:duration-500 [perspective:1200px]',
        'rotate-3 hover:rotate-0 focus-visible:rotate-0',
        'focus-visible:outline-planora-primary focus-visible:outline-2 focus-visible:outline-offset-4'
      )}
    >
      <article
        className={cn(
          'shadow-lifted relative overflow-hidden rounded-4xl border border-white/40 bg-white/10 backdrop-blur-md',
          'motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:shadow-glow-primary hover:ring-2 hover:ring-white/40 dark:border-white/10'
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 z-10 translate-x-[-120%] skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-700 ease-out group-hover:translate-x-[120%] group-hover:opacity-100 motion-reduce:hidden"
          aria-hidden
        />
        <div
          className={cn(
            'relative flex h-56 items-center justify-center bg-gradient-to-br md:h-64',
            gradient
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)] opacity-80" />
          <Calendar
            className="relative size-16 text-white/95 drop-shadow-md motion-safe:transition motion-safe:duration-500 group-hover:scale-110 group-hover:rotate-6"
            aria-hidden
          />
          <span className="glass-dark absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
            {typeLabel}
          </span>
          <span className="glass-dark absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
            {fee}
          </span>
        </div>
        <div className="border-t border-white/20 bg-white/50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/40">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</p>
          <p className="text-planora-muted text-xs">Open full story</p>
        </div>
      </article>
    </Link>
  );
}

function FeaturedContent({ event }: { event: EventWithType }) {
  const start = getEventStart(event);
  const dateStr = formatDate(start, undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="min-w-0 space-y-6">
        <span
          className={cn(
            'group/badge glass-effect motion-safe:animate-glow-pulse inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-bold tracking-wide text-slate-800 uppercase',
            'shadow-glow-primary/40 ring-1 ring-planora-primary/20 dark:text-slate-100',
            'motion-safe:animate-fade-in'
          )}
        >
          <Sparkles
            className="size-4 text-planora-accent motion-safe:transition motion-safe:duration-300 group-hover/badge:rotate-12 group-hover/badge:scale-110"
            aria-hidden
          />
          Featured Event
        </span>

        <h1
          className={cn(
            'gradient-text text-5xl leading-tight font-black tracking-tight md:text-6xl',
            'motion-safe:animate-fade-in motion-safe:[animation-delay:80ms] motion-safe:[animation-fill-mode:both]'
          )}
        >
          {event.title}
        </h1>

        <div className="flex flex-wrap gap-3">
          <span className="group/pill glass-dark motion-safe:animate-fade-in motion-safe:[animation-delay:140ms] motion-safe:[animation-fill-mode:both] inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-800 transition hover:border-white/40 hover:shadow-md dark:text-slate-100">
            <Calendar
              className="text-planora-primary size-4 shrink-0 motion-safe:transition motion-safe:duration-300 group-hover/pill:rotate-12"
              aria-hidden
            />
            {dateStr}
          </span>
          <span className="group/pill glass-dark motion-safe:animate-fade-in motion-safe:[animation-delay:200ms] motion-safe:[animation-fill-mode:both] inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-800 transition hover:border-white/40 hover:shadow-md dark:text-slate-100">
            <MapPin
              className="text-planora-primary size-4 shrink-0 motion-safe:transition motion-safe:duration-300 group-hover/pill:rotate-12"
              aria-hidden
            />
            {getLocationLabel(event)}
          </span>
          <span className="group/pill glass-dark motion-safe:animate-fade-in motion-safe:[animation-delay:260ms] motion-safe:[animation-fill-mode:both] inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-800 transition hover:border-white/40 hover:shadow-md dark:text-slate-100">
            <User
              className="text-planora-primary size-4 shrink-0 motion-safe:transition motion-safe:duration-300 group-hover/pill:rotate-12"
              aria-hidden
            />
            {getOrganizerName(event)}
          </span>
        </div>

        <div className="relative mt-2 motion-safe:animate-fade-in motion-safe:[animation-delay:320ms] motion-safe:[animation-fill-mode:both]">
          <p className="line-clamp-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">{event.description}</p>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/95 to-transparent dark:from-slate-950/95"
            aria-hidden
          />
        </div>

        <div className="flex flex-wrap gap-4 pt-2 motion-safe:animate-fade-in motion-safe:[animation-delay:400ms] motion-safe:[animation-fill-mode:both]">
          <Link href={routes.event(event.id)} className={cn('group', primaryCtaClass)}>
            Join event
            <ArrowRight className="size-5 shrink-0 motion-safe:transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link href={routes.event(event.id)} className={cn('group', secondaryCtaClass)}>
            View details
            <ArrowRight className="size-5 shrink-0 motion-safe:transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="motion-safe:animate-fade-in motion-safe:[animation-delay:220ms] motion-safe:[animation-fill-mode:both] flex justify-center lg:justify-end">
        <FeaturedVisualCard event={event} />
      </div>
    </div>
  );
}

function FallbackContent() {
  const highlights = [
    { icon: Zap, title: 'Create', body: 'Launch paid or free events in minutes.' },
    { icon: TrendingUp, title: 'Discover', body: 'Browse curated public listings.' },
    { icon: Users, title: 'Connect', body: 'Invite guests and grow attendance.' },
  ] as const;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <h1
        className={cn(
          'gradient-text text-4xl leading-tight font-black tracking-tight sm:text-5xl md:text-6xl',
          'motion-safe:animate-fade-in'
        )}
      >
        Discover what&apos;s next
      </h1>
      <p
        className={cn(
          'glass-dark mt-6 inline-block max-w-xl rounded-full px-6 py-3 text-base text-slate-800 md:text-lg dark:text-slate-100',
          'motion-safe:animate-fade-in motion-safe:[animation-delay:100ms] motion-safe:[animation-fill-mode:both]',
          'border border-white/20 shadow-depth-soft transition hover:border-planora-primary/30 hover:shadow-glow-primary/30'
        )}
      >
        Create, manage, and join events with a calm, premium experience.
      </p>

      <div className="motion-safe:animate-fade-in motion-safe:[animation-delay:160ms] motion-safe:[animation-fill-mode:both] w-full">
        <HeroSearchBar />
      </div>

      <div className="mt-14 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className={cn(
              'group glass-dark rounded-3xl border border-white/25 p-5 text-left shadow-md',
              'motion-safe:animate-fade-in motion-safe:[animation-fill-mode:both]',
              'motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-glow-primary dark:border-white/10',
              'cursor-default focus-within:ring-2 focus-within:ring-planora-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-transparent',
              i === 0 && 'motion-safe:[animation-delay:220ms]',
              i === 1 && 'motion-safe:[animation-delay:280ms]',
              i === 2 && 'motion-safe:[animation-delay:340ms]'
            )}
          >
            <Icon
              className="text-planora-primary mb-3 size-8 motion-safe:transition motion-safe:duration-300 group-hover:rotate-12 group-hover:scale-110"
              aria-hidden
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h2>
            <p className="text-planora-muted mt-1 text-sm leading-snug">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 motion-safe:animate-fade-in motion-safe:[animation-delay:420ms] motion-safe:[animation-fill-mode:both]">
        <Link href={routes.events} className={cn('group', primaryCtaClass)}>
          Browse events
          <Search className="size-5 shrink-0 motion-safe:transition group-hover:scale-110" aria-hidden />
        </Link>
        <Link href={routes.register} className={textLinkClass}>
          Create an account
        </Link>
      </div>
    </div>
  );
}

export function HeroSection({ featuredEvent }: HeroSectionProps) {
  const [entered, setEntered] = useState(false);
  const [parallax, setParallax] = useState<Parallax>(CENTER);
  const [motionOk, setMotionOk] = useState(false);
  const rafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (!cancelled) setEntered(true);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotionOk(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!motionOk) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / Math.max(1, r.width);
        const y = (e.clientY - r.top) / Math.max(1, r.height);
        setParallax({
          x: Math.min(1, Math.max(0, x)),
          y: Math.min(1, Math.max(0, y)),
        });
      });
    },
    [motionOk]
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setParallax(CENTER);
  }, []);

  const shellTilt =
    motionOk && entered
      ? {
          transform: `perspective(1100px) rotateX(${(parallax.y - 0.5) * -5}deg) rotateY(${(parallax.x - 0.5) * 7}deg)`,
        }
      : undefined;

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
      className="relative isolate cursor-default overflow-hidden px-4 py-12 md:py-24"
    >
      <MeshBackgroundInteractive parallax={parallax} motionOk={motionOk} />

      <div
        className={cn(
          'relative z-10 mx-auto max-w-7xl motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out',
          entered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          style={shellTilt}
          className={cn(
            'glass-effect rounded-5xl shadow-lifted border border-white/40 p-8 backdrop-blur-xl will-change-transform md:p-12',
            'ring-1 ring-white/30 dark:border-white/10 dark:ring-white/5',
            'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out',
            'hover:ring-planora-primary/25'
          )}
        >
          {featuredEvent ? <FeaturedContent event={featuredEvent} /> : <FallbackContent />}
        </div>
      </div>
    </section>
  );
}
