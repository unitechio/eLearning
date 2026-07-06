import React from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { EnrollmentDraft } from '../types';

interface EnrollmentListProps {
  enrollments: EnrollmentDraft[];
  onEnrollmentChange: (index: number, patch: Partial<EnrollmentDraft>) => void;
  onAdd: () => void;
  onSave: (draft: EnrollmentDraft) => void;
  onRemove: (draft: EnrollmentDraft, index: number) => void;
}

export function EnrollmentList({
  enrollments,
  onEnrollmentChange,
  onAdd,
  onSave,
  onRemove,
}: EnrollmentListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Course cards / enrollments</h2>
          <p className="mt-1 text-sm text-slate-500">Các card hiển thị ở phần khóa học của learner dashboard.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
          onClick={onAdd}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add card
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {enrollments.map((item, index) => (
          <div className="rounded-2xl border border-slate-200 p-4" key={item.id ?? `new-enrollment-${index}`}>
            <div className="grid gap-3 lg:grid-cols-2">
              {[
                ['title', 'Title'],
                ['track', 'Track'],
                ['status', 'Status'],
                ['schedule_label', 'Schedule label'],
                ['time_range', 'Time range'],
                ['center_name', 'Center'],
                ['room_name', 'Room'],
                ['instructor_name', 'Instructor'],
                ['current_lesson', 'Current lesson'],
                ['next_lesson', 'Next lesson'],
                ['certificate_name', 'Certificate name'],
                ['certificate_url', 'Certificate URL'],
              ].map(([key, label]) => (
                <label className="grid gap-2 text-sm" key={key}>
                  <span className="font-semibold">{label}</span>
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2"
                    value={String(item[key as keyof EnrollmentDraft] ?? '')}
                    onChange={(e) => onEnrollmentChange(index, { [key]: e.target.value })}
                  />
                </label>
              ))}

              {[
                ['progress_percent', 'Progress %'],
                ['attendance_percent', 'Attendance %'],
                ['practice_percent', 'Practice %'],
                ['assignment_percent', 'Assignment %'],
                ['sort_order', 'Sort order'],
              ].map(([key, label]) => (
                <label className="grid gap-2 text-sm" key={key}>
                  <span className="font-semibold">{label}</span>
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2"
                    type="number"
                    value={Number(item[key as keyof EnrollmentDraft] ?? 0)}
                    onChange={(e) => onEnrollmentChange(index, { [key]: Number(e.target.value || 0) })}
                  />
                </label>
              ))}

              <label className="grid gap-2 text-sm lg:col-span-2">
                <span className="font-semibold">Metrics JSON</span>
                <textarea
                  className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
                  value={item.metricsText}
                  onChange={(e) => onEnrollmentChange(index, { metricsText: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                onClick={() => onSave(item)}
                type="button"
              >
                <Save className="h-4 w-4" />
                Save card
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
                onClick={() => onRemove(item, index)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
