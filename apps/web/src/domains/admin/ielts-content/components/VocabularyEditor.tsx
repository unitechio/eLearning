import React from 'react';
import { Plus } from 'lucide-react';
import { Field, SectionCard, SaveRemoveButtons } from './primitives';
import type { VocabularyDraft } from '../types';

interface VocabularyEditorProps {
  vocabulary: VocabularyDraft[];
  onVocabularyChange: (index: number, patch: Partial<VocabularyDraft>) => void;
  onSave: (draft: VocabularyDraft) => void;
  onRemove: (draft: VocabularyDraft, index: number) => void;
  onAdd: () => void;
}

export function VocabularyEditor({
  vocabulary, onVocabularyChange, onSave, onRemove, onAdd,
}: VocabularyEditorProps) {
  return (
    <SectionCard title="Vocabulary" description="Phần từ vựng của bài.">
      <div className="space-y-4">
        {vocabulary.map((draft, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={draft.id ?? `new-vocab-${index}`}>
            <div className="grid gap-3 lg:grid-cols-2">
              <Field label="Term"           value={draft.term}           onChange={(v) => onVocabularyChange(index, { term: v })} />
              <Field label="IPA"            value={draft.ipa}            onChange={(v) => onVocabularyChange(index, { ipa: v })} />
              <Field label="Part of speech" value={draft.part_of_speech} onChange={(v) => onVocabularyChange(index, { part_of_speech: v })} />
              <Field label="Sort order"     value={draft.sort_order}     onChange={(v) => onVocabularyChange(index, { sort_order: Number(v || 0) })} type="number" />
              <Field label="Image URL"      value={draft.image_url}      onChange={(v) => onVocabularyChange(index, { image_url: v })} />
              <Field label="Audio URL"      value={draft.audio_url}      onChange={(v) => onVocabularyChange(index, { audio_url: v })} />
            </div>

            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Meaning</span>
              <textarea
                className="min-h-20 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={draft.meaning}
                onChange={(e) => onVocabularyChange(index, { meaning: e.target.value })}
              />
            </label>

            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Example</span>
              <textarea
                className="min-h-20 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={draft.example}
                onChange={(e) => onVocabularyChange(index, { example: e.target.value })}
              />
            </label>

            <SaveRemoveButtons
              saveLabel="Save vocabulary"
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
          <Plus className="h-4 w-4" /> Add vocabulary
        </button>
      </div>
    </SectionCard>
  );
}
