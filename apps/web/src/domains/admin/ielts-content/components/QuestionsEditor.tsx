import React from 'react';
import { Plus } from 'lucide-react';
import { Field, SectionCard, SaveRemoveButtons } from './primitives';
import type { GroupDraft, QuestionDraft } from '../types';

interface QuestionsEditorProps {
  questions: QuestionDraft[];
  groupOptions: GroupDraft[];
  onQuestionChange: (index: number, patch: Partial<QuestionDraft>) => void;
  onSave: (draft: QuestionDraft) => void;
  onRemove: (draft: QuestionDraft, index: number) => void;
  onAdd: () => void;
}

export function QuestionsEditor({
  questions, groupOptions, onQuestionChange, onSave, onRemove, onAdd,
}: QuestionsEditorProps) {
  return (
    <SectionCard title="Questions + Explanation" description="Điền đáp án, explanation và payload để phục vụ phần chữa bài và định vị câu trả lời.">
      <div className="space-y-4">
        {questions.map((draft, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={draft.id ?? `new-question-${index}`}>
            <div className="grid gap-3 lg:grid-cols-4">
              {/* Group selector */}
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Group</span>
                <select
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={draft.group_id}
                  onChange={(e) => onQuestionChange(index, { group_id: e.target.value ? Number(e.target.value) : '' })}
                >
                  <option value="">Select group</option>
                  {groupOptions.map((g) => (
                    <option key={g.id ?? `group-${g.group_no}`} value={g.id}>
                      {g.group_no} • Q{g.question_from}-{g.question_to} • {g.question_type}
                    </option>
                  ))}
                </select>
              </label>

              <Field label="Question no" type="number" value={draft.question_no} onChange={(v) => onQuestionChange(index, { question_no: Number(v || 0) })} />
              <Field label="Answer" value={draft.answer} onChange={(v) => onQuestionChange(index, { answer: v })} />
              <Field label="Sort order" type="number" value={draft.sort_order} onChange={(v) => onQuestionChange(index, { sort_order: Number(v || 0) })} />
            </div>

            <label className="mt-3 grid gap-2 text-sm">
              <span className="font-semibold text-slate-700">Prompt</span>
              <textarea
                className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={draft.prompt}
                onChange={(e) => onQuestionChange(index, { prompt: e.target.value })}
              />
            </label>

            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Options JSON</span>
                <textarea
                  className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
                  value={draft.optionsText}
                  onChange={(e) => onQuestionChange(index, { optionsText: e.target.value })}
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Explanation JSON</span>
                <textarea
                  className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
                  value={draft.explanationText}
                  onChange={(e) => onQuestionChange(index, { explanationText: e.target.value })}
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-slate-700">Payload JSON</span>
                <textarea
                  className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
                  value={draft.payloadText}
                  onChange={(e) => onQuestionChange(index, { payloadText: e.target.value })}
                />
              </label>
            </div>

            <SaveRemoveButtons
              saveLabel="Save question"
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
          <Plus className="h-4 w-4" /> Add question
        </button>
      </div>
    </SectionCard>
  );
}
