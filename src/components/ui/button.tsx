import { Loader2 } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-planora-primary text-white hover:bg-planora-primary/90',
  secondary: 'bg-planora-secondary text-white hover:bg-planora-secondary/90',
  outline:
    'border-2 border-planora-primary text-planora-primary hover:bg-planora-primary/10 bg-transparent',
  ghost: 'text-planora-primary hover:bg-planora-primary/10 bg-transparent',
  danger: 'bg-planora-danger text-white hover:bg-planora-danger/90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

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
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-planora-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
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
