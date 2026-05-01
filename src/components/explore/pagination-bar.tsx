'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { routes } from '@/constants/config';
import { cn } from '@/lib/utils';

export interface PaginationBarProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationBar({ totalPages, currentPage }: PaginationBarProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildPageUrl(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return qs ? `${routes.explore}?${qs}` : routes.explore;
  }

  function buildPageNumbers(): (number | 'gap')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'gap')[] = [1];
    if (currentPage > 3) pages.push('gap');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('gap');
    pages.push(totalPages);
    return pages;
  }

  const pages = buildPageNumbers();
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const itemBase = cn(
    'flex size-9 items-center justify-center rounded-md border text-sm font-medium',
    'transition-colors motion-safe:duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  );

  return (
    <nav
      aria-label="Pagination navigation"
      className="flex items-center justify-center gap-1"
    >
      {hasPrev ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className={cn(itemBase, 'border-border bg-surface text-muted hover:border-primary hover:text-primary')}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span
          className={cn(itemBase, 'cursor-not-allowed border-border bg-surface text-muted opacity-40')}
          aria-disabled="true"
          aria-label="No previous page"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </span>
      )}

      {pages.map((page, i) =>
        page === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="flex size-9 items-center justify-center text-sm text-muted"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}${page === currentPage ? ', current page' : ''}`}
            className={cn(
              itemBase,
              page === currentPage
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-foreground hover:border-primary hover:text-primary'
            )}
          >
            {page}
          </Link>
        )
      )}

      {hasNext ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className={cn(itemBase, 'border-border bg-surface text-muted hover:border-primary hover:text-primary')}
          aria-label="Go to next page"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span
          className={cn(itemBase, 'cursor-not-allowed border-border bg-surface text-muted opacity-40')}
          aria-disabled="true"
          aria-label="No next page"
        >
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
