import React from 'react';
import { Plus } from 'lucide-react';
import { Field, SectionCard, SaveRemoveButtons, SelectField } from './primitives';
import { QUESTION_TYPE_OPTIONS } from '../constants';
import type { GroupDraft, PassageDraft } from '../types';

interface QuestionGroupsEditorProps {
  groups: GroupDraft[];
  passageOptions: PassageDraft[];
  onGroupChange: (index: number, patch: Partial<GroupDraft>) => void;
  onSave: (draft: GroupDraft) => void;
  onRemove: (draft: GroupDraft, index: number) => void;
  onAdd: () => void;
}

export function QuestionGroupsEditor({
  groups, passageOptions, onGroupChange, onSave, onRemove, onAdd,
}: QuestionGroupsEditorProps) {
  return (
    <SectionCard title="Question Groups" description="Dùng để điều khiển nhóm câu hỏi theo passage, question range và kiểu bài.">
      <div className="space-y-4">
        {groups.map((draft, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={draft.id ?? `new-group-${index}`}>
            <div className="grid gap-3 lg:grid-cols-4">
              {/* Passage selector */}
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Passage</span>
                <select
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={draft.passage_id}
                  onChange={(e) => onGroupChange(index, { passage_id: e.target.value ? Number(e.target.value) : '' })}
                >
                  <option value="">No passage</option>
                  {passageOptions.map((p) => (
                    <option key={p.id} value={p.id}>Passage {p.passage_no} - {p.title || 'Untitled'}</option>
                  ))}
                </select>
              </label>

              <Field label="Group no"      type="number" value={draft.group_no}     onChange={(v) => onGroupChange(index, { group_no: Number(v || 0) })} />
              <Field label="Question from" type="number" value={draft.question_from} onChange={(v) => onGroupChange(index, { question_from: Number(v || 0) })} />
              <Field label="Question to"   type="number" value={draft.question_to}   onChange={(v) => onGroupChange(index, { question_to: Number(v || 0) })} />

              <SelectField label="Question type" value={draft.question_type} options={QUESTION_TYPE_OPTIONS}
                onChange={(v) => onGroupChange(index, { question_type: v })} />
              <Field label="Sort order" type="number" value={draft.sort_order} onChange={(v) => onGroupChange(index, { sort_order: Number(v || 0) })} />

              <label className="grid gap-2 text-sm lg:col-span-2">
                <span className="font-semibold text-slate-700">Instruction</span>
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={draft.instruction}
                  onChange={(e) => onGroupChange(index, { instruction: e.target.value })}
                />
              </label>
            </div>

            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Payload JSON</span>
              <textarea
                className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
                value={draft.payloadText}
                onChange={(e) => onGroupChange(index, { payloadText: e.target.value })}
              />
            </label>

            <SaveRemoveButtons
              saveLabel="Save group"
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
          <Plus className="h-4 w-4" /> Add question group
        </button>
      </div>
    </SectionCard>
  );
}
