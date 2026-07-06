import React from 'react';
import { FileUp, Plus, CheckCircle2, UploadCloud } from 'lucide-react';
import { HeaderLoadingBar } from '@/shared/components';
import { useIELTSContentEditor } from './hooks/useIELTSContentEditor';

import { ContentList } from './components/ContentList';
import { ContentForm } from './components/ContentForm';
import { PassagesEditor } from './components/PassagesEditor';
import { QuestionGroupsEditor } from './components/QuestionGroupsEditor';
import { QuestionsEditor } from './components/QuestionsEditor';
import { VocabularyEditor } from './components/VocabularyEditor';
import { RelatedPostsEditor } from './components/RelatedPostsEditor';

export function AdminIELTSContentPage() {
  const editor = useIELTSContentEditor();
  const pdfPreview = editor.pdfImportPreview;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {editor.isBusy && <HeaderLoadingBar />}

      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">IELTS Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Content editor, passages, answers</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Quản trị chung cho Reading, Listening, Writing, Speaking: nội dung bài, nhóm passage, question group, answer/explanation, định vị qua payload và dữ liệu phụ trợ.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">
              <FileUp className="h-4 w-4" />
              Import JSON/XLSX
              <input className="sr-only" type="file" accept=".json,.xlsx" onChange={(e) => void editor.handleImport(e.target.files?.[0])} />
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white">
              <UploadCloud className="h-4 w-4" />
              Scan PDF
              <input className="sr-only" type="file" accept=".pdf" onChange={(e) => void editor.handleImportPdf(e.target.files?.[0])} />
            </label>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
              onClick={editor.resetEditor}
              type="button"
            >
              <Plus className="h-4 w-4" /> New content
            </button>
          </div>
        </div>
        {editor.message && (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {editor.message}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Left Panel: Content List */}
        <ContentList
          query={editor.query}
          onQueryChange={editor.setQuery}
          items={editor.contentQuery.data?.items ?? []}
          isLoading={editor.contentQuery.isLoading}
          selectedContentId={editor.selectedContentId}
          onSelect={editor.setSelectedContentId}
          onReview={editor.handleReview}
        />

        {/* Right Panel: Editors */}
        <div className="space-y-6">
          {pdfPreview && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-950">PDF Import Preview</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Trích text theo từng trang từ PDF để nạp nhanh passage cho bài practice/test. Nếu có cờ OCR thì PDF đang là dạng scan ảnh.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white" onClick={() => editor.applyPdfDraft(pdfPreview)} type="button">
                    Load as new draft
                  </button>
                  <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700" onClick={() => editor.applyPdfDraft(pdfPreview, true)} type="button">
                    Replace passages only
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-700">{pdfPreview.file_name}</span>
                      <span className="rounded-full bg-white px-3 py-1 font-bold text-slate-700">{pdfPreview.page_count} pages</span>
                      <span className={`rounded-full px-3 py-1 font-bold ${pdfPreview.requires_ocr ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                        {pdfPreview.requires_ocr ? 'Some pages need OCR' : 'Text layer extracted'}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Extracted {pdfPreview.extracted_chars} characters. Hệ thống đang gợi ý draft dạng Reading practice, sau đó có thể đổi skill/module ngay trong form.
                    </p>
                  </div>

                  <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                    {pdfPreview.pages.map((page) => (
                      <div className="rounded-2xl border border-slate-200 p-4" key={page.page_no}>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Page {page.page_no}</span>
                          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">{page.text_length} chars</span>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{page.image_count} images</span>
                          {page.requires_ocr && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800">needs OCR</span>}
                        </div>
                        <textarea className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700" readOnly value={page.text || '[No extractable text found on this page]'} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-sm font-black text-slate-950">Suggested draft</h3>
                    <p className="mt-2 text-sm text-slate-600">{pdfPreview.title}</p>
                    <p className="mt-2 text-xs text-slate-500">Slug: {pdfPreview.suggested_content.slug}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Skill: {pdfPreview.suggested_content.skill} • Module: {pdfPreview.suggested_content.module}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Passages prepared: {pdfPreview.suggested_passages.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
                    Dùng tốt cho Reading/Listening import nguồn thô. Với PDF scan ảnh, backend đã phát hiện trang thiếu text và trả `requires_ocr` để quản trị biết trang nào cần xử lý thêm.
                  </div>
                </div>
              </div>
            </section>
          )}

          <ContentForm
            form={editor.contentForm}
            onFieldChange={editor.setFormValue}
            onSave={editor.saveContent}
            onDelete={editor.handleDeleteContent}
            onAssetUpload={editor.handleAssetUpload}
            assetKind={editor.assetKind}
            onAssetKindChange={editor.setAssetKind}
            hasSelectedContent={!!editor.selectedContentId}
            isSaving={editor.isSavingContent}
          />

          <PassagesEditor
            passages={editor.passages}
            onPassageChange={(idx, patch) => editor.setPassages((c) => c.map((p, i) => (i === idx ? { ...p, ...patch } : p)))}
            onSave={editor.upsertPassage}
            onRemove={editor.deletePassage}
            onAdd={editor.addPassage}
          />

          <QuestionGroupsEditor
            groups={editor.groups}
            passageOptions={editor.passageOptions}
            onGroupChange={(idx, patch) => editor.setGroups((c) => c.map((g, i) => (i === idx ? { ...g, ...patch } : g)))}
            onSave={editor.upsertGroup}
            onRemove={editor.deleteGroup}
            onAdd={editor.addGroup}
          />

          <QuestionsEditor
            questions={editor.questions}
            groupOptions={editor.groupOptions}
            onQuestionChange={(idx, patch) => editor.setQuestions((c) => c.map((q, i) => (i === idx ? { ...q, ...patch } : q)))}
            onSave={editor.upsertQuestion}
            onRemove={editor.deleteQuestion}
            onAdd={editor.addQuestion}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <VocabularyEditor
              vocabulary={editor.vocabulary}
              onVocabularyChange={(idx, patch) => editor.setVocabulary((c) => c.map((v, i) => (i === idx ? { ...v, ...patch } : v)))}
              onSave={editor.upsertVocabulary}
              onRemove={editor.deleteVocabulary}
              onAdd={editor.addVocabulary}
            />

            <RelatedPostsEditor
              relatedPosts={editor.relatedPosts}
              onRelatedPostChange={(idx, patch) => editor.setRelatedPosts((c) => c.map((r, i) => (i === idx ? { ...r, ...patch } : r)))}
              onSave={editor.upsertRelatedPost}
              onRemove={editor.deleteRelatedPost}
              onAdd={editor.addRelatedPost}
            />
          </div>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-black"><CheckCircle2 className="h-4 w-4" /> Quản trị chữa bài</div>
            <p className="mt-2">
              `explanation` nên chứa nội dung chữa bài. `payload` của question/group có thể dùng để lưu `locator`, `anchor_text`, `paragraph`, `passage_no`, timestamps audio hoặc dữ liệu UI khác cho Reading/Listening.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-700">
              <UploadCloud className="h-4 w-4" /> Áp dụng cho cả Reading, Listening và các content IELTS khác vì backend dùng cùng schema.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
