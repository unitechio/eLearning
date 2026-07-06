import React from 'react';
import { Plus } from 'lucide-react';
import { Field, SectionCard, SaveRemoveButtons } from './primitives';
import type { RelatedPostDraft } from '../types';

interface RelatedPostsEditorProps {
  relatedPosts: RelatedPostDraft[];
  onRelatedPostChange: (index: number, patch: Partial<RelatedPostDraft>) => void;
  onSave: (draft: RelatedPostDraft) => void;
  onRemove: (draft: RelatedPostDraft, index: number) => void;
  onAdd: () => void;
}

export function RelatedPostsEditor({
  relatedPosts, onRelatedPostChange, onSave, onRemove, onAdd,
}: RelatedPostsEditorProps) {
  return (
    <SectionCard title="Related Posts" description="Liên kết sang bài viết giải thích, từ vựng hoặc bài chữa chi tiết.">
      <div className="space-y-4">
        {relatedPosts.map((draft, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={draft.id ?? `new-post-${index}`}>
            <div className="grid gap-3 lg:grid-cols-2">
              <Field label="Post ID"    type="number" value={draft.post_id}    onChange={(v) => onRelatedPostChange(index, { post_id: Number(v || 0) })} />
              <Field label="Sort order" type="number" value={draft.sort_order} onChange={(v) => onRelatedPostChange(index, { sort_order: Number(v || 0) })} />
            </div>
            
            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Title</span>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={draft.title}
                onChange={(e) => onRelatedPostChange(index, { title: e.target.value })}
              />
            </label>

            <SaveRemoveButtons
              saveLabel="Save related post"
              onSave={() => onSave(draft)}
              onRemove={() => onRemove(draft, index)}
            />
          </div>
        ))}
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
          onClick={onAdd}
          type="button"
        >
          <Plus className="h-4 w-4" /> Add related post
        </button>
      </div>
    </SectionCard>
  );
}
