import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-planora-border rounded-lg border border-dashed bg-slate-50/80 px-6 py-12 text-center',
        className
      )}
    >
      <p className="text-base font-medium text-slate-800">{title}</p>
      {description ? (
        <p className="text-planora-muted mx-auto mt-2 max-w-md text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
