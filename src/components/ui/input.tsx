import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
}

/**
 * Input — form field primitive.
 *
 * Uses semantic tokens so dark mode, disabled, and error states are all
 * coherent. Ring-based focus matches the Button primitive.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, id, ...rest },
  ref
) {
  const uid = useId();
  const errorId = `${uid}-error`;
  const inputId = id ?? uid;

  return (
    <div className="w-full">
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'bg-input text-foreground border-input-border placeholder:text-muted block h-11 w-full rounded-md border px-3 text-sm',
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

Input.displayName = 'Input';
