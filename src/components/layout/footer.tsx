import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { routes } from '@/constants/config';

const footerLinks = [
  { href: routes.about, label: 'About' },
  { href: routes.contact, label: 'Contact' },
  { href: routes.privacy, label: 'Privacy Policy' },
  { href: routes.terms, label: 'Terms of Service' },
] as const;

export function Footer() {
  return (
    <footer className="border-planora-border bg-planora-surface border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col gap-3">
            <Logo size="lg" />
            <p className="max-w-xs text-sm text-gray-600">Create and join amazing events</p>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Footer">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-planora-primary hover:text-planora-primary/80 w-fit text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block" aria-hidden />
        </div>

        <div className="border-planora-border mt-10 border-t pt-6 text-center md:mt-12">
          <p className="text-sm text-gray-600">© 2026 Planora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
