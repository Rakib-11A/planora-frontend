import { ArrowRight, CalendarHeart, Globe, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { FooterNewsletter } from '@/components/layout/footer-newsletter';
import { Logo } from '@/components/layout/logo';
import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

const quickLinks = [
  { href: routes.home, label: 'Home' },
  { href: routes.events, label: 'Events' },
  { href: routes.about, label: 'About' },
  { href: routes.contact, label: 'Contact' },
] as const;

const supportLinks = [
  { href: routes.contact, label: 'FAQ & Help' },
  { href: routes.contact, label: 'Help Center' },
  { href: routes.privacy, label: 'Privacy Policy' },
  { href: routes.terms, label: 'Terms of Service' },
] as const;

const socialLinks = [
  { href: routes.events, label: 'Events', icon: CalendarHeart },
  { href: routes.about, label: 'About Planora', icon: Sparkles },
  { href: routes.contact, label: 'Contact', icon: Mail },
  { href: routes.home, label: 'Website', icon: Globe },
] as const;

function FooterLinkRow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'group/footerlink flex items-center gap-2 py-1 text-sm text-white/70',
        'motion-safe:transition-colors motion-safe:duration-200 hover:text-white'
      )}
    >
      <span>{children}</span>
      <ArrowRight
        className="size-3.5 shrink-0 -translate-x-2 opacity-0 motion-safe:transition-all motion-safe:duration-200 group-hover/footerlink:translate-x-0 group-hover/footerlink:opacity-100"
        aria-hidden
      />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-auto">
      <div className="gradient-animated h-1 w-full opacity-90" aria-hidden />

      <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <div
          className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full bg-planora-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-20 left-10 size-64 rounded-full bg-planora-secondary/15 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col gap-4">
              <Logo size="lg" variant="gradient" className="text-4xl md:text-5xl" />
              <p className="max-w-xs text-sm leading-relaxed text-white/65">
                Create and join amazing events
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className={cn(
                      'glass-dark inline-flex rounded-full p-2.5 text-white/75',
                      'motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-110',
                      'hover:text-white hover:shadow-glow-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                    )}
                  >
                    <Icon className="size-5 motion-safe:transition-transform motion-safe:duration-300 hover:rotate-12" aria-hidden />
                  </a>
                ))}
              </div>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Quick links">
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/50">Quick Links</h3>
              {quickLinks.map((item) => (
                <FooterLinkRow key={item.href + item.label} href={item.href}>
                  {item.label}
                </FooterLinkRow>
              ))}
            </nav>

            <nav className="flex flex-col gap-2" aria-label="Support">
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/50">Support</h3>
              {supportLinks.map((item) => (
                <FooterLinkRow key={item.label} href={item.href}>
                  {item.label}
                </FooterLinkRow>
              ))}
            </nav>

            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-white/50">Stay Updated</h3>
              <p className="text-sm leading-relaxed text-white/65">
                Get event updates in your inbox
              </p>
              <FooterNewsletter />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/25">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
            <p className="text-center text-sm text-white/50 md:text-left">
              © 2026 Planora. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="glass-dark rounded-full px-3 py-1 text-xs font-medium text-white/70">
                Built with Next.js
              </span>
              <span className="glass-dark rounded-full px-3 py-1 text-xs font-medium text-white/70">
                Powered by TypeScript
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
