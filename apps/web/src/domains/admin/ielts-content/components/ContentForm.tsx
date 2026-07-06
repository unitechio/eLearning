import React from 'react';
import { ImagePlus, Loader2, Save, Trash2 } from 'lucide-react';
import { Field, SectionCard, SelectField } from './primitives';
import type { AssetKind, ContentFormState } from '../types';
import {
  MODULE_OPTIONS,
  SKILL_OPTIONS,
  CONTENT_TYPE_OPTIONS,
  STATUS_OPTIONS,
  REVIEW_OPTIONS,
} from '../constants';

const ASSET_KIND_OPTIONS: AssetKind[] = ['thumbnail', 'content-image', 'audio', 'pdf', 'vocab-image'];

interface ContentFormProps {
  form: ContentFormState;
  onFieldChange: (key: keyof ContentFormState, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onAssetUpload: (file?: File) => void;
  assetKind: AssetKind;
  onAssetKindChange: (kind: AssetKind) => void;
  hasSelectedContent: boolean;
  isSaving: boolean;
}

export function ContentForm({
  form,
  onFieldChange,
  onSave,
  onDelete,
  onAssetUpload,
  assetKind,
  onAssetKindChange,
  hasSelectedContent,
  isSaving,
}: ContentFormProps) {
  return (
    <SectionCard title="Content setup" description="Dùng chung cho bài Reading, Listening hoặc các content IELTS khác.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Title"    value={form.title}    onChange={(v) => onFieldChange('title', v)} />
        <Field label="Slug"     value={form.slug}     onChange={(v) => onFieldChange('slug', v)} />
        <Field label="Subtitle" value={form.subtitle} onChange={(v) => onFieldChange('subtitle', v)} />
        <Field label="Part"     value={form.part}     onChange={(v) => onFieldChange('part', v)} />

        <SelectField label="Module"       value={form.module}       options={MODULE_OPTIONS}       onChange={(v) => onFieldChange('module', v)} />
        <SelectField label="Skill"        value={form.skill}        options={SKILL_OPTIONS}        onChange={(v) => onFieldChange('skill', v)} />
        <SelectField label="Content type" value={form.content_type} options={CONTENT_TYPE_OPTIONS} onChange={(v) => onFieldChange('content_type', v)} />
        <Field label="Test kind" value={form.test_kind} onChange={(v) => onFieldChange('test_kind', v)} />

        <SelectField label="Status"        value={form.status}        options={STATUS_OPTIONS} onChange={(v) => onFieldChange('status', v)} />
        <SelectField label="Review status" value={form.review_status} options={REVIEW_OPTIONS} onChange={(v) => onFieldChange('review_status', v)} />

        <Field label="Level"            value={form.level}            onChange={(v) => onFieldChange('level', v)} />
        <Field label="Questions"        value={form.question_count}   onChange={(v) => onFieldChange('question_count', v)}   type="number" />
        <Field label="Duration seconds" value={form.duration_seconds} onChange={(v) => onFieldChange('duration_seconds', v)} type="number" />
        <Field label="Published at"     value={form.published_at}     onChange={(v) => onFieldChange('published_at', v)}     type="datetime-local" />
        <Field label="Thumbnail URL"    value={form.thumbnail_url}    onChange={(v) => onFieldChange('thumbnail_url', v)} />
        <Field label="Preview image URL" value={form.preview_image_url} onChange={(v) => onFieldChange('preview_image_url', v)} />
        <Field label="Audio URL"        value={form.audio_url}        onChange={(v) => onFieldChange('audio_url', v)} />
        <Field label="PDF URL"          value={form.pdf_url}          onChange={(v) => onFieldChange('pdf_url', v)} />

        <div className="lg:col-span-2">
          <Field label="Source URL" value={form.source_url} onChange={(v) => onFieldChange('source_url', v)} />
        </div>

        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold text-slate-700">Description</span>
          <textarea
            className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm lg:col-span-2">
          <span className="font-semibold text-slate-700">Review note</span>
          <textarea
            className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.review_note}
            onChange={(e) => onFieldChange('review_note', e.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-slate-700">Tags JSON</span>
          <textarea
            className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
            value={form.tagsText}
            onChange={(e) => onFieldChange('tagsText', e.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-slate-700">Metadata JSON</span>
          <textarea
            className="min-h-28 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
            value={form.metadataText}
            onChange={(e) => onFieldChange('metadataText', e.target.value)}
          />
        </label>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
          onClick={onSave}
          type="button"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save content
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-50"
          disabled={!hasSelectedContent}
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          Delete content
        </button>

        <div className="ml-auto grid grid-cols-[1fr_auto] gap-2">
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={assetKind}
            onChange={(e) => onAssetKindChange(e.target.value as AssetKind)}
          >
            {ASSET_KIND_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">
            <ImagePlus className="h-4 w-4" />
            Upload
            <input className="sr-only" type="file" onChange={(e) => onAssetUpload(e.target.files?.[0])} />
          </label>
        </div>
      </div>
    </SectionCard>
  );
}
