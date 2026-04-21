import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  href: string;
  label: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  return (
    <nav className={cn('text-planora-muted mb-6 text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span className="text-slate-300" aria-hidden>
                /
              </span>
            ) : null}
            {i === items.length - 1 ? (
              <span className="text-slate-600" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-planora-primary font-medium hover:underline motion-safe:transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
