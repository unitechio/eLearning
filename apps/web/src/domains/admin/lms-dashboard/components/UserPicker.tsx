import React from 'react';
import { Search, UserCircle2 } from 'lucide-react';
import type { AdminUser } from '@/domains/admin/api/users';

interface UserPickerProps {
  query: { page: number; page_size: number; q: string };
  onQueryChange: React.Dispatch<React.SetStateAction<{ page: number; page_size: number; q: string }>>;
  users: AdminUser[];
  selectedUserId: string;
  onSelect: (id: string) => void;
}

export function UserPicker({ query, onQueryChange, users, selectedUserId, onSelect }: UserPickerProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm"
          placeholder="Search user email"
          value={query.q}
          onChange={(e) => onQueryChange({ ...query, q: e.target.value })}
        />
      </div>
      <div className="mt-4 space-y-3">
        {users.map((user) => (
          <button
            key={user.id}
            className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
              selectedUserId === user.id
                ? 'border-red-300 bg-red-50/40'
                : 'border-slate-100 hover:border-slate-300'
            }`}
            onClick={() => onSelect(user.id)}
            type="button"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <UserCircle2 className="h-5 w-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900">{user.email}</p>
              <p className="mt-1 text-xs text-slate-500">{user.status}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
