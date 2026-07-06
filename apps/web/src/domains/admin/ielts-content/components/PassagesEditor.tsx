import React from 'react';
import { Plus } from 'lucide-react';
import { Field, SectionCard, SaveRemoveButtons } from './primitives';
import type { PassageDraft } from '../types';

interface PassagesEditorProps {
  passages: PassageDraft[];
  onPassageChange: (index: number, patch: Partial<PassageDraft>) => void;
  onSave: (draft: PassageDraft) => void;
  onRemove: (draft: PassageDraft, index: number) => void;
  onAdd: () => void;
}

export function PassagesEditor({ passages, onPassageChange, onSave, onRemove, onAdd }: PassagesEditorProps) {
  return (
    <SectionCard title="Passages" description="Nhóm passage như các tab Passage 1 / Passage 2 / Passage 3 ở màn thi.">
      <div className="space-y-4">
        {passages.map((draft, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={draft.id ?? `new-passage-${index}`}>
            <div className="grid gap-3 lg:grid-cols-[120px_1fr_120px]">
              <Field label="Passage no" type="number" value={draft.passage_no}
                onChange={(v) => onPassageChange(index, { passage_no: Number(v || 0) })} />
              <Field label="Title" value={draft.title}
                onChange={(v) => onPassageChange(index, { title: v })} />
              <Field label="Sort order" type="number" value={draft.sort_order}
                onChange={(v) => onPassageChange(index, { sort_order: Number(v || 0) })} />
            </div>
            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Body</span>
              <textarea
                className="min-h-40 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={draft.body}
                onChange={(e) => onPassageChange(index, { body: e.target.value })}
              />
            </label>
            <SaveRemoveButtons
              saveLabel="Save passage"
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
          <Plus className="h-4 w-4" /> Add passage
        </button>
      </div>
    </SectionCard>
  );
}
