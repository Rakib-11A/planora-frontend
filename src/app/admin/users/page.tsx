'use client';

import { startTransition, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { DataTableShell } from '@/components/ui/data-table-shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MarketingHero } from '@/components/ui/marketing-hero';
import { api, unwrapApiData } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

const theadClass =
  'border-b border-slate-200/90 bg-slate-100/80 text-xs font-semibold uppercase text-slate-600 dark:border-white/10 dark:bg-slate-900/55 dark:text-slate-400';

const tbodyClass = 'divide-y divide-slate-200/80 dark:divide-white/10';

interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isBanned: boolean;
  bannedAt: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers(query: string) {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: '1', limit: '25' });
      if (query.trim()) q.set('search', query.trim());
      const res = (await api.get(`admin/users?${q}`)) as ApiResponse<PaginatedResponse<AdminUserRow>>;
      setItems(unwrapApiData(res).items);
    } catch {
      toast.error('Could not load users.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    startTransition(() => {
      void fetchUsers('');
    });
  }, []);

  async function ban(id: string) {
    if (!window.confirm('Ban this user?')) return;
    try {
      await api.patch(`admin/users/${id}/ban`);
      toast.success('User banned.');
      await fetchUsers(search);
    } catch {
      toast.error('Ban failed.');
    }
  }

  async function unban(id: string) {
    try {
      await api.patch(`admin/users/${id}/unban`);
      toast.success('User unbanned.');
      await fetchUsers(search);
    } catch {
      toast.error('Unban failed.');
    }
  }

  return (
    <div className="w-full">
      <MarketingHero
        className="mb-10"
        eyebrow="Directory"
        sectionMaxWidthClass="max-w-5xl"
        innerMaxWidthClass="max-w-3xl"
        title="Users"
        description="Moderate accounts. Admin users cannot be banned."
      />

      <section className="rounded-3xl border border-white/35 bg-white/35 p-5 shadow-lifted backdrop-blur-md dark:border-white/10 dark:bg-slate-900/35 md:p-8">
        <form
          className="mb-6 flex max-w-md flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            void fetchUsers(search);
          }}
        >
          <div className="flex-1">
            <Label htmlFor="user-search">Filter by email contains</Label>
            <Input
              id="user-search"
              className="mt-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <Button type="submit" variant="secondary">
            Apply
          </Button>
        </form>
        {loading ? (
          <div className="space-y-3">
            <div className="bg-planora-muted/20 h-12 animate-pulse rounded-xl" />
            <div className="bg-planora-muted/20 h-40 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <DataTableShell variant="glass">
            <table className="min-w-full text-left text-xs sm:text-sm">
              <thead className={theadClass}>
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Banned
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Created
                  </th>
                  <th scope="col" className="px-3 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {items.map((u) => (
                  <tr key={u.id} className="bg-white/30 dark:bg-transparent">
                    <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">{u.name}</td>
                    <td className="text-planora-muted px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{u.role}</td>
                    <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{u.isBanned ? 'Yes' : 'No'}</td>
                    <td className="text-planora-muted px-3 py-2">
                      {formatDate(u.createdAt, undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {u.role === 'ADMIN' ? null : u.isBanned ? (
                        <Button type="button" size="sm" variant="outline" onClick={() => void unban(u.id)}>
                          Unban
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="danger" onClick={() => void ban(u.id)}>
                          Ban
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTableShell>
        )}
      </section>
    </div>
  );
}
