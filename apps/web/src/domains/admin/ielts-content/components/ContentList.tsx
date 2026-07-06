import React from 'react';
import { Search } from 'lucide-react';
import { OptimizedImage } from '@/shared/components';
import { ContentSkeletonGrid } from '@/shared/components';
import type { IELTSContentItem } from '@/domains/ielts/content/api';
import type { ContentQuery } from '../hooks/useIELTSContentEditor';

interface ContentListProps {
  query: ContentQuery;
  onQueryChange: (query: ContentQuery) => void;
  items: IELTSContentItem[];
  isLoading: boolean;
  selectedContentId: number | null;
  onSelect: (id: number) => void;
  onReview: (id: number, action: 'approved' | 'published' | 'rejected' | 'archived') => void;
}

const MODULE_OPTIONS = ['self-study', 'practice', 'mock-test'];
const SKILL_OPTIONS  = ['reading', 'listening', 'writing', 'speaking'];
const STATUS_OPTIONS = ['draft', 'published', 'archived'];

export function ContentList({
  query,
  onQueryChange,
  items,
  isLoading,
  selectedContentId,
  onSelect,
  onReview,
}: ContentListProps) {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm"
            placeholder="Search title or slug"
            value={query.q}
            onChange={(e) => onQueryChange({ ...query, q: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={query.module}
            onChange={(e) => onQueryChange({ ...query, module: e.target.value })}
          >
            <option value="">All modules</option>
            {MODULE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={query.skill}
            onChange={(e) => onQueryChange({ ...query, skill: e.target.value })}
          >
            <option value="">All skills</option>
            {SKILL_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={query.status}
            onChange={(e) => onQueryChange({ ...query, status: e.target.value })}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* List */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="px-2 text-lg font-black text-slate-950">Content list</h2>
        {isLoading ? (
          <ContentSkeletonGrid count={6} />
        ) : (
          <div className="mt-4 grid gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                className={`grid gap-4 rounded-2xl border p-3 text-left transition md:grid-cols-[88px_1fr] ${
                  selectedContentId === item.id
                    ? 'border-red-300 bg-red-50/40'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
                onClick={() => onSelect(item.id)}
                type="button"
              >
                <OptimizedImage
                  src={item.thumbnail_url || item.preview_image_url}
                  alt={item.title}
                  className="h-20 w-full rounded-xl object-cover md:w-[88px]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{item.module}</span>
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">{item.skill}</span>
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">{item.status}</span>
                  </div>
                  <p className="mt-2 truncate text-base font-black text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.slug} • {item.question_count} câu • {Math.round((item.duration_seconds || 0) / 60)} phút
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(['approved', 'published', 'rejected', 'archived'] as const).map((action) => (
                      <button
                        key={action}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600"
                        onClick={(e) => { e.stopPropagation(); onReview(item.id, action); }}
                        type="button"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
