import { ArrowRight, CalendarCheck, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const trustedCompanies = ['Northstar Labs', 'Helio Bank', 'CedarWorks', 'Summit VC', 'Orbit School'];

const features = [
  {
    title: 'Launch pages that convert',
    body: 'Publish polished registration pages, ticket tiers, invitations, and confirmations without stitching tools together.',
    icon: Sparkles,
  },
  {
    title: 'Operate from one console',
    body: 'Track attendees, payments, reviews, notifications, and admin decisions from a calm workspace built for repeat use.',
    icon: CalendarCheck,
  },
  {
    title: 'Keep every flow trusted',
    body: 'Role-aware access, verified emails, rate limits, and audit-ready operations keep teams confident as events scale.',
    icon: ShieldCheck,
  },
];

const categories = [
  'Executive summits',
  'Product launches',
  'Community meetups',
  'Workshops',
  'Investor days',
  'Internal offsites',
];

const stats = [
  { value: '10k+', label: 'active organizers' },
  { value: '99.9%', label: 'platform availability' },
  { value: '42%', label: 'faster event setup' },
  { value: '3.8x', label: 'higher repeat attendance' },
];

const testimonials = [
  {
    quote:
      'Planora gave our launch team a single source of truth. The experience feels composed for guests and precise for operators.',
    name: 'Maya Chen',
    role: 'VP Marketing, Northstar Labs',
    avatar: '/avatar-maya.svg',
  },
  {
    quote:
      'We replaced a fragile stack of forms, spreadsheets, and payment links. Our team now moves from idea to sold-out in days.',
    name: 'Omar Rahman',
    role: 'Operations Lead, Helio Bank',
    avatar: '/avatar-omar.svg',
  },
  {
    quote:
      'The dashboard gives us the confidence to run premium programs without adding extra coordination overhead.',
    name: 'Elena Torres',
    role: 'Programs Director, CedarWorks',
    avatar: '/avatar-elena.svg',
  },
];

const posts = [
  {
    title: 'The registration moments that decide attendance',
    body: 'A practical framework for reducing drop-off before payment and confirmation.',
  },
  {
    title: 'How lean teams run enterprise-grade event operations',
    body: 'The playbook for roles, approvals, reminders, and post-event loops.',
  },
  {
    title: 'Designing event pages that feel credible instantly',
    body: 'Trust signals, hierarchy, and CTA placement patterns that improve conversion.',
  },
];

const faqs = [
  {
    question: 'Can Planora support both free and paid events?',
    answer:
      'Yes. Teams can publish public events, manage invitations, track participation, and connect paid flows through the payment workflow.',
  },
  {
    question: 'Is the dashboard built for non-technical operators?',
    answer:
      'Yes. The workspace keeps core jobs visible: create, review, feature, invite, notify, and report without exposing technical complexity.',
  },
  {
    question: 'How quickly can a team launch?',
    answer:
      'Most teams can configure their first event in one session because pages, validation, authentication, and attendee workflows are already connected.',
  },
  {
    question: 'Does Planora work for recurring event programs?',
    answer:
      'Yes. The account workspace is designed for repeated planning cycles, not one-off landing pages.',
  },
];

function SectionHeading({
  eyebrow,
  title,
  body,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  centered?: boolean;
}) {
  return (
    <div className={cn('max-w-3xl', centered && 'mx-auto text-center')}>
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-h2 text-foreground">{title}</h2>
      <p className="mt-4 text-body text-muted">{body}</p>
    </div>
  );
}

function SectionShell({
  id,
  children,
  subtle = false,
}: {
  id?: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  return (
    <section id={id} className={cn('px-4 py-16 md:py-24', subtle && 'bg-surface-subtle')}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-subtle', className)} aria-hidden />;
}

export function ApexLandingPage() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-[68vh] items-center px-4 pb-16 pt-16 md:min-h-[70vh] md:pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_20%,var(--primary-subtle)_0,transparent_32%),radial-gradient(circle_at_82%_18%,var(--surface-subtle)_0,transparent_34%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="motion-safe:animate-slide-up">
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary">
              Project Apex for modern event teams
            </p>
            <h1 className="mt-4 max-w-4xl text-h1 text-foreground">
              Turn event operations into a premium product experience.
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-muted">
              Planora gives teams the launch pages, attendee workflows, payments, reviews, and admin controls needed to run events with invisible precision.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={routes.register} className={buttonVariants({ size: 'md', className: 'h-11' })}>
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={routes.events}
                className={buttonVariants({ variant: 'secondary', size: 'md', className: 'h-11' })}
              >
                Explore events
              </Link>
            </div>
          </div>
          <div className="relative motion-safe:animate-fade-in">
            <div className="absolute -inset-4 rounded-lg bg-primary/8 blur-3xl" aria-hidden />
            <Image
              src="/apex-dashboard-preview.svg"
              alt="Planora dashboard preview showing event controls, metrics, and attendee workflows"
              width={1200}
              height={820}
              priority
              className="relative rounded-lg border border-border bg-surface shadow-high motion-safe:animate-blob-float"
            />
          </div>
        </div>
      </section>

      <SectionShell>
        <div className="flex flex-col gap-8">
          <p className="text-center text-caption font-semibold uppercase tracking-[0.12em] text-muted">
            Trusted by teams building high-touch event programs
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {trustedCompanies.map((company) => (
              <div
                key={company}
                className="flex h-16 items-center justify-center rounded-lg border border-border bg-surface px-4 opacity-70 grayscale transition-opacity hover:opacity-100"
              >
                <span className="text-center text-sm font-semibold text-muted-strong">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell id="features" subtle>
        <SectionHeading
          eyebrow="Why Planora"
          title="Everything your audience sees is backed by serious operations."
          body="Apex strips away visual noise and keeps the product focused on the moments that create confidence: discovery, registration, payment, attendance, and follow-up."
          centered
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-lg border border-border bg-surface p-6 shadow-low">
                <div className="flex size-11 items-center justify-center rounded-md bg-primary-subtle text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-6 text-h4 text-foreground">{feature.title}</h3>
                <p className="mt-3 text-body text-muted">{feature.body}</p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="How it works"
          title="From concept to confirmed attendees in three disciplined moves."
          body="Planora keeps each step explicit so teams can move quickly without losing operational control."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {['Build the event page', 'Open registration', 'Operate the room'].map((step, index) => (
            <div key={step} className="contents">
              <article className="rounded-lg border border-border bg-surface p-6 shadow-low">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-h4 text-foreground">{step}</h3>
                <p className="mt-3 text-body text-muted">
                  {index === 0
                    ? 'Shape the offer, schedule, category, and attendee promise in a focused creation flow.'
                    : index === 1
                      ? 'Collect signups, verify accounts, and keep payment or invitation status clear.'
                      : 'Monitor demand, update details, notify participants, and learn from reviews.'}
                </p>
              </article>
              {index < 2 ? <ArrowRight className="hidden size-6 text-primary md:block" aria-hidden /> : null}
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell subtle>
        <SectionHeading
          eyebrow="Use cases"
          title="A single operating layer for the events that matter most."
          body="Each category card is designed for fast scanning and decisive action."
          centered
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={routes.events}
              className="group rounded-lg border border-border bg-surface p-6 shadow-low transition hover:-translate-y-1 hover:border-border-strong hover:shadow-medium"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-h4 text-foreground">{category}</h3>
                <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
              </div>
              <p className="mt-4 text-body text-muted">
                Build a credible, conversion-focused flow for guests, operators, and leadership.
              </p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="pricing">
        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-surface p-6 shadow-low">
              <p className="text-h2 text-primary">{stat.value}</p>
              <p className="mt-2 text-body text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell subtle>
        <SectionHeading
          eyebrow="Customers"
          title="Designed for teams whose events carry brand weight."
          body="Planora is built for operators who need calm software, credible guest experiences, and fewer manual gaps."
          centered
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-lg border border-border bg-surface p-6 shadow-low">
              <p className="text-body text-foreground">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <Image src={item.avatar} alt="" width={48} height={48} className="rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-caption text-muted">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Playbooks"
          title="A sharper operating model for every event team."
          body="Practical guidance for teams improving conversion, trust, and repeat attendance."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-lg border border-border bg-surface p-6 shadow-low">
              <SkeletonLoader className="mb-6 h-32" />
              <h3 className="text-h4 text-foreground">{post.title}</h3>
              <p className="mt-3 text-body text-muted">{post.body}</p>
              <Link href={routes.about} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read more
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell subtle>
        <SectionHeading
          eyebrow="FAQ"
          title="Answers before your team commits."
          body="The most common questions from teams evaluating Planora for public and private event programs."
          centered
        />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-lg border border-border bg-surface shadow-low">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-foreground">
                {faq.question}
                <CheckCircle2 className="size-5 shrink-0 text-primary transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-4 text-body text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <div className="rounded-lg border border-border bg-primary px-6 py-16 text-center shadow-high md:px-12">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-primary-foreground/80">
            Ready for the Apex standard
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-h2 text-primary-foreground">
            Launch your next event with the confidence of a product team.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-body text-primary-foreground/85">
            Start with the workflows that matter most: conversion-ready pages, authenticated guests, and a dashboard your team can trust.
          </p>
          <Link
            href={routes.register}
            className={buttonVariants({
              variant: 'secondary',
              size: 'md',
              className: 'mt-8 h-11 bg-surface text-foreground hover:bg-surface-subtle',
            })}
          >
            Get Started Now
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SectionShell>
    </main>
  );
}
