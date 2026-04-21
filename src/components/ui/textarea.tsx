import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  error?: string;
}

/**
 * Textarea — multi-line form field primitive. Mirrors `Input` styling so
 * forms feel consistent; diverges only in fixed block height.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, id, ...rest },
  ref
) {
  const uid = useId();
  const errorId = `${uid}-error`;
  const fieldId = id ?? uid;

  return (
    <div className="w-full">
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(
          'bg-input text-foreground border-input-border placeholder:text-muted block w-full rounded-md border px-3 py-2 text-sm',
          'motion-safe:transition-colors motion-safe:duration-150',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:bg-surface-subtle disabled:text-muted disabled:cursor-not-allowed',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-destructive mt-1.5 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
