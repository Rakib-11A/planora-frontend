'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { EventReviewItem } from '@/types/review';
import { formatDate } from '@/lib/utils';

export interface EventReviewsPanelProps {
  eventId: string;
  initialReviews: EventReviewItem[];
}

export function EventReviewsPanel({ eventId, initialReviews }: EventReviewsPanelProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(routes.login);
      return;
    }
    setSubmitting(true);
    try {
      const body = { rating, comment: comment.trim() || undefined };
      const res = (await api.post(`events/${eventId}/reviews`, body)) as ApiResponse<unknown>;
      unwrapApiData(res);
      toast.success('Review submitted.');
      setComment('');
      router.refresh();
    } catch {
      toast.error(
        'Could not submit review. You may need approved participation or may have reviewed already.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card variant="glass">
      <CardTitle className="gradient-text text-xl font-bold">Reviews</CardTitle>
      <ul className="mt-5 space-y-4">
        {initialReviews.length === 0 ? (
          <li className="text-sm text-slate-600 dark:text-slate-400">No reviews yet.</li>
        ) : (
          initialReviews.map((r) => (
            <li
              key={r.id}
              className="border-b border-slate-200/80 pb-4 last:border-0 dark:border-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{r.user.name}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{r.rating}/5</span>
              </div>
              <p className="text-planora-muted text-xs">{formatDate(r.createdAt)}</p>
              {r.comment ? (
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{r.comment}</p>
              ) : null}
            </li>
          ))
        )}
      </ul>

      {isAuthenticated ? (
        <form
          className="mt-6 border-t border-white/50 pt-5 dark:border-white/10"
          onSubmit={(ev) => void submitReview(ev)}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Write a review
          </h3>
          <label className="mt-3 block text-sm text-slate-700 dark:text-slate-300">
            Rating (1–5)
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(ev) => setRating(Number(ev.target.value))}
              className="mt-1.5 block w-24 rounded-xl border border-slate-200/90 bg-white/80 px-3 py-2 text-slate-900 shadow-sm backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary dark:border-white/15 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </label>
          <label className="mt-3 block text-sm text-slate-700 dark:text-slate-300">
            Comment (optional)
            <textarea
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1.5 block w-full rounded-xl border border-slate-200/90 bg-white/80 px-3 py-2 text-slate-900 shadow-sm backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-planora-primary dark:border-white/15 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </label>
          <Button type="submit" variant="primary" className="mt-4" isLoading={submitting}>
            Submit review
          </Button>
        </form>
      ) : (
        <p className="text-planora-muted mt-5 border-t border-white/50 pt-5 text-sm dark:border-white/10">
          Sign in to leave a review.
        </p>
      )}
    </Card>
  );
}
