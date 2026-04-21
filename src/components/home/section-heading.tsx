import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  /** Small uppercase label above the title — e.g. "Featured", "What's next". Optional. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

/**
 * Section heading for marketing-style pages.
 *
 * Typography-driven: no gradient text, no decorative underline bar. The
 * hierarchy — eyebrow → title → subtitle — is expressed in size and weight
 * alone, matching Stripe/Linear/Notion editorial pages.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className="text-primary mb-3 text-xs font-semibold uppercase tracking-[0.12em]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-muted mt-4 text-base leading-relaxed sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
