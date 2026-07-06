import React from 'react';
import { Loader2, Save } from 'lucide-react';
import type { DashboardFormState } from '../types';

interface DashboardConfigFormProps {
  form: DashboardFormState;
  onTextChange: (key: keyof DashboardFormState, value: string) => void;
  onNumberChange: (key: keyof DashboardFormState, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function DashboardConfigForm({ form, onTextChange, onNumberChange, onSave, isSaving }: DashboardConfigFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-950">Dashboard config</h2>
          <p className="mt-1 text-sm text-slate-500">Các JSON block sẽ render thẳng ra learner view `/lms`.</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
          onClick={onSave}
          type="button"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold">Hero title</span>
          <input className="rounded-xl border border-slate-200 px-3 py-2" value={form.hero_title} onChange={(e) => onTextChange('hero_title', e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold">Hero description</span>
          <textarea className="min-h-24 rounded-xl border border-slate-200 px-3 py-2" value={form.hero_description} onChange={(e) => onTextChange('hero_description', e.target.value)} />
        </label>

        {[
          ['current_streak', 'Current streak'],
          ['longest_streak', 'Longest streak'],
          ['overall_progress', 'Overall progress'],
          ['attendance_rate', 'Attendance'],
          ['practice_rate', 'Practice'],
          ['assignment_rate', 'Assignment'],
          ['study_days', 'Study days'],
          ['practice_sets', 'Practice sets'],
          ['assignments_done', 'Assignments done'],
        ].map(([key, label]) => (
          <label className="grid gap-2 text-sm" key={key}>
            <span className="font-semibold">{label}</span>
            <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" value={form[key as keyof DashboardFormState]} onChange={(e) => onNumberChange(key as keyof DashboardFormState, e.target.value)} />
          </label>
        ))}

        <label className="grid gap-2 text-sm">
          <span className="font-semibold">Estimated band</span>
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" step="0.1" value={form.estimated_band} onChange={(e) => onNumberChange('estimated_band', e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="font-semibold">Target band</span>
          <input className="rounded-xl border border-slate-200 px-3 py-2" type="number" step="0.1" value={form.target_band} onChange={(e) => onNumberChange('target_band', e.target.value)} />
        </label>

        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold">Current focus</span>
          <input className="rounded-xl border border-slate-200 px-3 py-2" value={form.current_focus} onChange={(e) => onTextChange('current_focus', e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold">Current focus note</span>
          <textarea className="min-h-20 rounded-xl border border-slate-200 px-3 py-2" value={form.current_focus_note} onChange={(e) => onTextChange('current_focus_note', e.target.value)} />
        </label>

        {[
          ['toolkitText', 'Toolkit JSON'],
          ['skillPlanText', 'Skill plan JSON'],
          ['scoreBreakdownText', 'Score breakdown JSON'],
          ['fourSkillsText', 'Four skills JSON'],
          ['aiFeaturesText', 'AI features JSON'],
          ['highlightCardsText', 'Highlight cards JSON'],
        ].map(([key, label]) => (
          <label className="grid gap-2 text-sm" key={key}>
            <span className="font-semibold">{label}</span>
            <textarea
              className="min-h-40 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
              value={form[key as keyof DashboardFormState] as string}
              onChange={(e) => onTextChange(key as keyof DashboardFormState, e.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
