'use client';

import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email.');
      return;
    }
    toast.success('Thanks — we will keep you posted on event updates.');
    setEmail('');
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-4">
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email for updates
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        className={cn(
          'w-full rounded-full border border-white/20 bg-white/10 py-3.5 pl-4 pr-14 text-sm text-white',
          'placeholder:text-white/45 backdrop-blur-md',
          'focus-visible:border-sky-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50'
        )}
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        className={cn(
          'group absolute right-1 top-1/2 min-h-0 -translate-y-1/2 rounded-full px-3 py-2',
          'motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-105',
          'hover:shadow-glow-primary'
        )}
        aria-label="Subscribe to updates"
      >
        <ArrowRight
          className="size-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Button>
    </form>
  );
}
