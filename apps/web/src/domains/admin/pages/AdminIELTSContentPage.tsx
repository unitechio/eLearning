import React, { useMemo, useState } from 'react';
import { CheckCircle2, FileUp, ImagePlus, Loader2, Plus, Search, UploadCloud } from 'lucide-react';
import {
  useAdminIELTSContent,
  useCreateIELTSPassage,
  useCreateIELTSQuestion,
  useCreateIELTSQuestionGroup,
  useCreateIELTSRelatedPost,
  useCreateIELTSVocabulary,
  useImportIELTSContent,
  useReviewIELTSContent,
  useUploadIELTSAsset,
} from '@/domains/ielts/content/hooks';
import type { IELTSPassagePayload, IELTSQuestionGroupPayload, IELTSQuestionPayload, IELTSRelatedPostPayload, IELTSVocabularyPayload } from '@/domains/ielts/content/api';
import { ContentSkeletonGrid, HeaderLoadingBar, OptimizedImage } from '@/shared/components';

type ChildType = 'passage' | 'group' | 'question' | 'vocabulary' | 'related-post';
type AssetKind = 'thumbnail' | 'content-image' | 'audio' | 'pdf' | 'vocab-image';

const MODULE_OPTIONS = ['self-study', 'practice', 'mock-test'];
const SKILL_OPTIONS = ['reading', 'listening', 'writing', 'speaking'];
const CHILD_TEMPLATES: Record<ChildType, string> = {
  passage: JSON.stringify({ passage_no: 1, title: 'Passage 1', body: 'Paste passage body here...', sort_order: 1 }, null, 2),
  group: JSON.stringify({ group_no: 1, question_from: 1, question_to: 3, question_type: 'sentence_completion', instruction: 'Complete the sentences below.', sort_order: 1 }, null, 2),
  question: JSON.stringify({ group_id: 1, question_no: 1, prompt: 'Question prompt', answer: 'answer', explanation: { short: 'Explain answer' }, sort_order: 1 }, null, 2),
  vocabulary: JSON.stringify({ term: 'vertical', ipa: '/ˈvɜːtɪkl/', part_of_speech: 'adj.', meaning: 'dọc', example: 'The flagpole stood tall and vertical.', sort_order: 1 }, null, 2),
  'related-post': JSON.stringify({ post_id: 1, title: 'Related vocabulary article', sort_order: 1 }, null, 2),
};

function parseJSONPayload<T>(value: string): T {
  return JSON.parse(value) as T;
}

export function AdminIELTSContentPage() {
  const [query, setQuery] = useState({ page: 1, page_size: 20, q: '', module: '', skill: '', status: '' });
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [assetKind, setAssetKind] = useState<AssetKind>('thumbnail');
  const [childType, setChildType] = useState<ChildType>('passage');
  const [childPayload, setChildPayload] = useState(CHILD_TEMPLATES.passage);
  const [message, setMessage] = useState<string>('');

  const contentQuery = useAdminIELTSContent(query);
  const importMutation = useImportIELTSContent();
  const reviewMutation = useReviewIELTSContent();
  const uploadMutation = useUploadIELTSAsset();
  const createPassage = useCreateIELTSPassage();
  const createGroup = useCreateIELTSQuestionGroup();
  const createQuestion = useCreateIELTSQuestion();
  const createVocabulary = useCreateIELTSVocabulary();
  const createRelatedPost = useCreateIELTSRelatedPost();

  const isBusy = contentQuery.isLoading || importMutation.isPending || reviewMutation.isPending || uploadMutation.isPending;
  const selectedContent = useMemo(
    () => contentQuery.data?.items.find((item) => item.id === selectedContentId) ?? contentQuery.data?.items[0],
    [contentQuery.data?.items, selectedContentId]
  );

  const handleImport = async (file?: File) => {
    if (!file) return;
    const result = await importMutation.mutateAsync(file);
    setMessage(`Imported content #${result.content_id}: ${result.passage_count} passages, ${result.group_count} groups, ${result.question_count} questions.`);
  };

  const handleAssetUpload = async (file?: File) => {
    if (!file || !selectedContent) return;
    const result = await uploadMutation.mutateAsync({ contentId: selectedContent.id, kind: assetKind, file });
    setMessage(`Uploaded ${result.kind}: ${result.original_name}`);
  };

  const handleCreateChild = async () => {
    if (!selectedContent) return;
    if (childType === 'passage') {
      await createPassage.mutateAsync({ contentId: selectedContent.id, payload: parseJSONPayload<IELTSPassagePayload>(childPayload) });
    }
    if (childType === 'group') {
      await createGroup.mutateAsync({ contentId: selectedContent.id, payload: parseJSONPayload<IELTSQuestionGroupPayload>(childPayload) });
    }
    if (childType === 'question') {
      await createQuestion.mutateAsync({ contentId: selectedContent.id, payload: parseJSONPayload<IELTSQuestionPayload>(childPayload) });
    }
    if (childType === 'vocabulary') {
      await createVocabulary.mutateAsync({ contentId: selectedContent.id, payload: parseJSONPayload<IELTSVocabularyPayload>(childPayload) });
    }
    if (childType === 'related-post') {
      await createRelatedPost.mutateAsync({ contentId: selectedContent.id, payload: parseJSONPayload<IELTSRelatedPostPayload>(childPayload) });
    }
    setMessage(`Created ${childType} for ${selectedContent.title}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {isBusy ? <HeaderLoadingBar /> : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">IELTS Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Content import & question bank</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">Import JSON/XLSX, review bài, upload media và tạo nhanh passages, groups, questions, vocabulary.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">
            <FileUp className="h-4 w-4" />
            Import file
            <input className="sr-only" type="file" accept=".json,.xlsx" onChange={(event) => void handleImport(event.target.files?.[0])} />
          </label>
        </div>
        {message ? <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm" placeholder="Search title or slug" value={query.q} onChange={(event) => setQuery((state) => ({ ...state, q: event.target.value }))} />
        </div>
        <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={query.module} onChange={(event) => setQuery((state) => ({ ...state, module: event.target.value }))}>
          <option value="">All modules</option>
          {MODULE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={query.skill} onChange={(event) => setQuery((state) => ({ ...state, skill: event.target.value }))}>
          <option value="">All skills</option>
          {SKILL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm" value={query.status} onChange={(event) => setQuery((state) => ({ ...state, status: event.target.value }))}>
          <option value="">All statuses</option>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="px-2 text-lg font-black text-slate-950">Content list</h2>
          {contentQuery.isLoading ? (
            <ContentSkeletonGrid count={6} />
          ) : (
            <div className="mt-4 grid gap-3">
              {(contentQuery.data?.items ?? []).map((item) => (
                <button key={item.id} className={`grid gap-4 rounded-2xl border p-3 text-left transition md:grid-cols-[120px_1fr] ${selectedContent?.id === item.id ? 'border-red-300 bg-red-50/40' : 'border-slate-100 hover:border-slate-300'}`} onClick={() => setSelectedContentId(item.id)} type="button">
                  <OptimizedImage src={item.thumbnail_url || item.preview_image_url} alt={item.title} className="h-24 w-full rounded-xl object-cover md:w-[120px]" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{item.module}</span>
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">{item.skill}</span>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">{item.status}</span>
                    </div>
                    <p className="mt-2 truncate text-base font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.slug} • {item.question_count} câu • {Math.round((item.duration_seconds || 0) / 60)} phút</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(['approved', 'published', 'rejected', 'archived'] as const).map((action) => (
                        <span key={action} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600" onClick={(event) => { event.stopPropagation(); void reviewMutation.mutateAsync({ id: item.id, action }); }}>
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Selected content</h2>
            {selectedContent ? (
              <div className="mt-4 space-y-3 text-sm">
                <p className="font-bold text-slate-950">{selectedContent.title}</p>
                <p className="text-slate-500">ID #{selectedContent.id} • {selectedContent.slug}</p>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select className="rounded-xl border border-slate-200 px-3 py-2" value={assetKind} onChange={(event) => setAssetKind(event.target.value as AssetKind)}>
                    <option value="thumbnail">thumbnail</option>
                    <option value="content-image">content-image</option>
                    <option value="audio">audio</option>
                    <option value="pdf">pdf</option>
                    <option value="vocab-image">vocab-image</option>
                  </select>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">
                    <ImagePlus className="h-4 w-4" />
                    Upload
                    <input className="sr-only" type="file" onChange={(event) => void handleAssetUpload(event.target.files?.[0])} />
                  </label>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Select a content item first.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Create child record</h2>
            <div className="mt-4 grid gap-3">
              <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={childType} onChange={(event) => { const value = event.target.value as ChildType; setChildType(value); setChildPayload(CHILD_TEMPLATES[value]); }}>
                <option value="passage">Passage</option>
                <option value="group">Question group</option>
                <option value="question">Question</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="related-post">Related post</option>
              </select>
              <textarea className="min-h-[260px] rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-700" value={childPayload} onChange={(event) => setChildPayload(event.target.value)} />
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!selectedContent} onClick={() => void handleCreateChild()} type="button">
                {createPassage.isPending || createGroup.isPending || createQuestion.isPending || createVocabulary.isPending || createRelatedPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create {childType}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-black"><CheckCircle2 className="h-4 w-4" /> Import format</div>
            <p className="mt-2">XLSX sheets: content, passages, groups, questions, vocabulary. JSON dùng cùng shape import bundle backend.</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-700"><UploadCloud className="h-4 w-4" /> Media upload routes use shared MinIO buckets.</div>
          </section>
        </aside>
      </div>
    </div>
  );
}
