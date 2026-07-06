import React from 'react';

/**
 * Shared primitive UI components dùng nội bộ trong IELTS Content Editor.
 * Không export ra ngoài module — dùng shared/components nếu cần dùng global.
 */

export function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'datetime-local';
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <input
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        onChange={(e) => onChange(e.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <select
        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </label>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function SaveRemoveButtons({
  onSave,
  onRemove,
  saveLabel,
}: {
  onSave: () => void;
  onRemove: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
        onClick={onSave}
        type="button"
      >
        {saveLabel ?? 'Save'}
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
        onClick={onRemove}
        type="button"
      >
        Remove
      </button>
    </div>
  );
}
