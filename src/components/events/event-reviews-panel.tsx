'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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
  /** Event start time (ISO) — used to show edit-window hint alongside server enforcement. */
  eventStartIso: string;
  initialReviews: EventReviewItem[];
}

export function EventReviewsPanel({ eventId, eventStartIso, initialReviews }: EventReviewsPanelProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const editHint = useMemo(() => {
    const start = new Date(eventStartIso).getTime();
    if (Number.isNaN(start)) return '';
    const hours = Number(process.env.NEXT_PUBLIC_REVIEW_EDIT_WINDOW_HOURS ?? '336');
    const safe = Number.isFinite(hours) && hours > 0 ? hours : 336;
    const end = start + safe * 60 * 60 * 1000;
    return `Authors may edit or delete until ${formatDate(end)}.`;
  }, [eventStartIso]);

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

  function startEdit(r: EventReviewItem) {
    setEditingId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment ?? '');
  }

  async function saveEdit() {
    if (!editingId) return;
    setBusyId(editingId);
    try {
      const body = {
        rating: editRating,
        comment: editComment.trim().length > 0 ? editComment.trim() : undefined,
      };
      const res = (await api.patch(`events/${eventId}/reviews`, body)) as ApiResponse<unknown>;
      unwrapApiData(res);
      toast.success('Review updated.');
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Could not update review. The edit period may have ended.');
    } finally {
      setBusyId(null);
    }
  }

  async function removeMine() {
    if (!window.confirm('Remove your review for this event?')) return;
    setBusyId('delete');
    try {
      const res = (await api.delete(`events/${eventId}/reviews`)) as ApiResponse<unknown>;
      unwrapApiData(res);
      toast.success('Review removed.');
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error('Could not delete review. The edit period may have ended.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card variant="glass">
      <CardTitle className="gradient-text text-xl font-bold">Reviews</CardTitle>
      {editHint ? <p className="text-planora-muted mt-2 text-xs">{editHint}</p> : null}
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
              {user && r.userId === user.id ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {editingId === r.id ? (
                    <>
                      <label className="text-planora-muted text-xs">
                        Rating
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="ml-2 w-16 rounded-lg border border-white/40 bg-white/70 px-2 py-1 text-slate-900 dark:bg-slate-900/60 dark:text-slate-100"
                        />
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={2}
                        maxLength={500}
                        className="min-w-[200px] flex-1 rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm text-slate-900 dark:bg-slate-900/60 dark:text-slate-100"
                      />
                      <Button type="button" size="sm" variant="primary" isLoading={busyId === r.id} onClick={() => void saveEdit()}>
                        Save
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button type="button" size="sm" variant="outline" onClick={() => startEdit(r)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        isLoading={busyId === 'delete'}
                        onClick={() => void removeMine()}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
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
