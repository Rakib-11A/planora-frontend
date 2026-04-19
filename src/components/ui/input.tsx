import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
}

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
          'border-planora-border bg-background text-foreground focus-visible:ring-planora-primary block w-full rounded-md border px-3 py-2 text-sm transition-colors',
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border-planora-danger focus-visible:ring-planora-danger',
          className
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="text-planora-danger mt-1 text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
