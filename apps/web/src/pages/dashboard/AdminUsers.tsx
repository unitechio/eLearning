import React, { useMemo, useState } from 'react';
import { useAdminUsers, useUpdateAdminUserStatus } from '@/features/admin/api/hooks';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Navigate } from 'react-router-dom';

const statuses = ['active', 'inactive', 'suspended', 'pending'] as const;

export function AdminUsersPage() {
  const { accessProfile } = useAuth();
  const [query, setQuery] = useState({ q: '', status: '', page: 1, page_size: 20 });
  const usersQuery = useAdminUsers(query);
  const updateStatus = useUpdateAdminUserStatus();

  const canAccess = useMemo(() => accessProfile?.is_admin, [accessProfile]);
  if (accessProfile && !canAccess) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin user management</h1>
        <p className="mt-2 text-sm text-slate-500">Manage real users, account state, and current role assignments from the backend.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <Input placeholder="Search email or name" value={query.q} onChange={(e) => setQuery((s) => ({ ...s, q: e.target.value, page: 1 }))} />
          <select
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium"
            value={query.status}
            onChange={(e) => setQuery((s) => ({ ...s, status: e.target.value, page: 1 }))}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-500">Email</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500">Roles</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500">Status</th>
                <th className="px-4 py-3 text-left font-bold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {(usersQuery.data?.items ?? []).map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 font-medium text-slate-900">{item.email}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(item.roles ?? []).map((role) => (
                        <span key={role} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-700">{item.status}</td>
                  <td className="px-4 py-4">
                    <select
                      className="rounded-lg border border-slate-200 px-3 py-2"
                      defaultValue={item.status}
                      onChange={(e) => updateStatus.mutate({ id: item.id, status: e.target.value })}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Total: {usersQuery.data?.meta?.total_items ?? usersQuery.data?.items.length ?? 0}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={query.page <= 1} onClick={() => setQuery((s) => ({ ...s, page: s.page - 1 }))}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={Boolean(usersQuery.data?.meta && query.page >= usersQuery.data.meta.total_pages)}
              onClick={() => setQuery((s) => ({ ...s, page: s.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
