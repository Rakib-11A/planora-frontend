import { Loader2 } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Button — the canonical interactive primitive.
 *
 * Variants follow a Stripe/Linear minimal hierarchy:
 *   primary    – the single page-level CTA (filled brand)
 *   secondary  – a distinct-but-quiet action (neutral filled surface)
 *   outline    – a tertiary action (bordered, transparent)
 *   ghost      – an inline action (no chrome; only hover tint)
 *   danger     – destructive (filled red)
 *
 * Sizing is deliberately tighter than a typical Bootstrap scale — `md` uses
 * `text-sm` (not `text-base`) to match Stripe/Linear density.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const base = cn(
  // Apex button type token: 14px / 600 / +0.02em tracking (spec §3).
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[0.02em]',
  // Hover transition (200ms) and active press scale (100ms) per spec §6.
  // We transition `transform` in addition to `colors` so the active scale animates.
  'motion-safe:transition-[colors,transform] motion-safe:duration-200 motion-safe:active:duration-100',
  'motion-safe:active:scale-[0.97]',
  // Ring-based focus (deviation from spec §6 — accessibility wins per Phase 1 G12).
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:pointer-events-none disabled:opacity-50'
);

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
  secondary:
    'bg-surface text-foreground border border-border hover:bg-surface-subtle hover:border-border-strong',
  outline:
    'bg-transparent text-foreground border border-border hover:bg-surface-subtle hover:border-border-strong',
  ghost: 'bg-transparent text-foreground hover:bg-surface-subtle',
  danger:
    'bg-destructive text-destructive-foreground hover:brightness-95 active:brightness-90',
};

// Apex Fitts's-law floor: primary touch target = 44px (md). `sm` is reserved for
// dense admin UIs where the action is paired with a larger primary CTA.
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

/**
 * Returns the class string for a given variant+size, so Next.js `<Link>`s and
 * other non-button elements can render with matching visuals without nesting
 * `<a>` inside `<button>` (which would be invalid HTML). Standard pattern
 * across shadcn/ui, Radix, etc.
 */
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={buttonVariants({ variant, size, className })}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-[1.1em] shrink-0 animate-spin" aria-hidden />
          {typeof children === 'string' ? <span className="sr-only">{children}</span> : null}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';
