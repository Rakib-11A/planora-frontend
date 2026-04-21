'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  threshold?: number;
  /** When true, disconnect after first intersection (default). */
  once?: boolean;
}

/**
 * Observes an element for viewport intersection. Honors `prefers-reduced-motion`
 * by treating content as immediately visible (no observer).
 */
export function useInView(options?: UseInViewOptions) {
  const threshold = options?.threshold ?? 0.12;
  const once = options?.once ?? true;
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isInView };
}
