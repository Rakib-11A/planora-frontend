'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { routes } from '@/constants/config';
import { useAuthStore } from '@/hooks/useAuthStore';
import { api, unwrapApiData } from '@/lib/api';
import { myNotificationsResponseSchema, type NotificationItem } from '@/lib/schemas/me';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setUnread(0);
      return;
    }
    try {
      const res = (await api.get('me/notifications?page=1&limit=100')) as ApiResponse<
        PaginatedResponse<NotificationItem>
      >;
      const parsed = myNotificationsResponseSchema.safeParse(unwrapApiData(res));
      if (!parsed.success) {
        setUnread(0);
        return;
      }
      const n = parsed.data.items.filter((i) => !i.isRead).length;
      setUnread(n);
    } catch {
      setUnread(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!isAuthenticated) return null;

  return (
    <Link
      href={routes.notifications}
      className="text-planora-primary hover:bg-planora-primary/10 relative inline-flex size-10 items-center justify-center rounded-md transition-colors"
      aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
    >
      <Bell className="size-5" aria-hidden />
      {unread > 0 ? (
        <span className="bg-planora-danger absolute -top-0.5 -right-0.5 flex min-h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      ) : null}
    </Link>
  );
}
