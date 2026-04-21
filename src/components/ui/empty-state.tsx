import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * EmptyState — shown when a list/section has no content. Uses a dashed border
 * to signal "placeholder" rather than a real card.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-surface-subtle rounded-lg border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      <p className="text-foreground text-base font-medium">{title}</p>
      {description ? (
        <p className="text-muted mx-auto mt-2 max-w-md text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
