import { useEffect, useMemo, useState } from 'react';
import {
  useAdminIELTSContent,
  useAdminIELTSContentDetail,
  useCreateAdminIELTSContent,
  useCreateIELTSPassage,
  useCreateIELTSQuestion,
  useCreateIELTSQuestionGroup,
  useCreateIELTSRelatedPost,
  useCreateIELTSVocabulary,
  useDeleteAdminIELTSContent,
  useDeleteIELTSPassage,
  useDeleteIELTSQuestion,
  useDeleteIELTSQuestionGroup,
  useDeleteIELTSRelatedPost,
  useDeleteIELTSVocabulary,
  useImportIELTSContent,
  useImportIELTSPdf,
  useReviewIELTSContent,
  useUpdateAdminIELTSContent,
  useUpdateIELTSPassage,
  useUpdateIELTSQuestion,
  useUpdateIELTSQuestionGroup,
  useUpdateIELTSRelatedPost,
  useUpdateIELTSVocabulary,
  useUploadIELTSAsset,
} from '@/domains/ielts/content/hooks';
import type {
  IELTSPdfImportResult,
  IELTSPassagePayload,
  IELTSQuestionGroupPayload,
  IELTSQuestionPayload,
  IELTSRelatedPostPayload,
  IELTSVocabularyPayload,
} from '@/domains/ielts/content/api';
import {
  buildContentFormState,
  parseJSONField,
  toGroupDraft,
  toPassageDraft,
  toQuestionDraft,
  toRelatedPostDraft,
  toVocabularyDraft,
} from '../utils';
import type {
  AssetKind,
  ContentFormState,
  GroupDraft,
  PassageDraft,
  QuestionDraft,
  RelatedPostDraft,
  VocabularyDraft,
} from '../types';
import { QUESTION_TYPE_OPTIONS } from '../constants';

export type ContentQuery = {
  page: number;
  page_size: number;
  q: string;
  module: string;
  skill: string;
  status: string;
};

/**
 * useIELTSContentEditor
 *
 * Custom hook tổng hợp toàn bộ state và mutations cho IELTS Content Editor.
 * Tách ra khỏi component để page component giữ dưới 100 dòng và dễ test độc lập.
 */
export function useIELTSContentEditor() {
  const [query, setQuery] = useState<ContentQuery>({
    page: 1, page_size: 20, q: '', module: '', skill: '', status: '',
  });
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [assetKind, setAssetKind] = useState<AssetKind>('thumbnail');
  const [message, setMessage] = useState('');
  const [pdfImportPreview, setPdfImportPreview] = useState<IELTSPdfImportResult | null>(null);
  const [contentForm, setContentForm] = useState<ContentFormState>(buildContentFormState());
  const [passages, setPassages]       = useState<PassageDraft[]>([]);
  const [groups, setGroups]           = useState<GroupDraft[]>([]);
  const [questions, setQuestions]     = useState<QuestionDraft[]>([]);
  const [vocabulary, setVocabulary]   = useState<VocabularyDraft[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPostDraft[]>([]);

  // ── Queries ────────────────────────────────────────────────────────────────
  const contentQuery = useAdminIELTSContent(query);
  const detailQuery  = useAdminIELTSContentDetail(selectedContentId);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const importMutation         = useImportIELTSContent();
  const pdfImportMutation      = useImportIELTSPdf();
  const reviewMutation         = useReviewIELTSContent();
  const uploadMutation         = useUploadIELTSAsset();
  const createContentMutation  = useCreateAdminIELTSContent();
  const updateContentMutation  = useUpdateAdminIELTSContent();
  const deleteContentMutation  = useDeleteAdminIELTSContent();
  const createPassageMutation  = useCreateIELTSPassage();
  const updatePassageMutation  = useUpdateIELTSPassage();
  const deletePassageMutation  = useDeleteIELTSPassage();
  const createGroupMutation    = useCreateIELTSQuestionGroup();
  const updateGroupMutation    = useUpdateIELTSQuestionGroup();
  const deleteGroupMutation    = useDeleteIELTSQuestionGroup();
  const createQuestionMutation = useCreateIELTSQuestion();
  const updateQuestionMutation = useUpdateIELTSQuestion();
  const deleteQuestionMutation = useDeleteIELTSQuestion();
  const createVocabMutation    = useCreateIELTSVocabulary();
  const updateVocabMutation    = useUpdateIELTSVocabulary();
  const deleteVocabMutation    = useDeleteIELTSVocabulary();
  const createRelatedPostMutation = useCreateIELTSRelatedPost();
  const updateRelatedPostMutation = useUpdateIELTSRelatedPost();
  const deleteRelatedPostMutation = useDeleteIELTSRelatedPost();

  const isBusy =
    contentQuery.isLoading ||
    detailQuery.isLoading ||
    importMutation.isPending ||
    pdfImportMutation.isPending ||
    uploadMutation.isPending ||
    createContentMutation.isPending ||
    updateContentMutation.isPending ||
    deleteContentMutation.isPending;

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedSummary = useMemo(
    () => contentQuery.data?.items.find((item) => item.id === selectedContentId) ?? contentQuery.data?.items[0] ?? null,
    [contentQuery.data?.items, selectedContentId],
  );

  const passageOptions = useMemo(
    () => (detailQuery.data?.passages ?? []).map(toPassageDraft),
    [detailQuery.data?.passages],
  );
  const groupOptions   = useMemo(
    () => [...groups].sort((a, b) => a.question_from - b.question_from || a.group_no - b.group_no),
    [groups],
  );

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedContentId && selectedSummary?.id) setSelectedContentId(selectedSummary.id);
  }, [selectedContentId, selectedSummary?.id]);

  useEffect(() => {
    const item = detailQuery.data;
    if (!item) return;
    setContentForm(buildContentFormState(item));
    setPassages((item.passages ?? []).map(toPassageDraft));
    setGroups((item.question_groups ?? []).map(toGroupDraft));
    setQuestions((item.question_groups ?? []).flatMap((g) => (g.questions ?? []).map(toQuestionDraft)));
    setVocabulary((item.vocabulary ?? []).map(toVocabularyDraft));
    setRelatedPosts((item.related_posts ?? []).map(toRelatedPostDraft));
  }, [detailQuery.data]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const setFormValue = (key: keyof ContentFormState, value: string) => {
    setContentForm((curr) => ({
      ...curr,
      [key]: key === 'question_count' || key === 'duration_seconds' ? Number(value || 0) : value,
    }));
  };

  const resetEditor = () => {
    setSelectedContentId(null);
    setPdfImportPreview(null);
    setContentForm(buildContentFormState());
    setPassages([]);
    setGroups([]);
    setQuestions([]);
    setVocabulary([]);
    setRelatedPosts([]);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const saveContent = async () => {
    const payload = {
      ...contentForm,
      question_count: Number(contentForm.question_count || 0),
      duration_seconds: Number(contentForm.duration_seconds || 0),
      tags: parseJSONField<unknown[]>(contentForm.tagsText, []),
      metadata: parseJSONField<Record<string, unknown>>(contentForm.metadataText, {}),
      published_at: contentForm.published_at ? new Date(contentForm.published_at).toISOString() : undefined,
      tagsText: undefined,
      metadataText: undefined,
    };

    if (selectedContentId) {
      await updateContentMutation.mutateAsync({ id: selectedContentId, payload });
      setMessage(`Saved content #${selectedContentId}`);
      return;
    }
    const created = await createContentMutation.mutateAsync(payload);
    setSelectedContentId(created.id);
    setMessage(`Created content #${created.id}`);
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    const result = await importMutation.mutateAsync(file);
    setSelectedContentId(result.content_id);
    setMessage(`Imported #${result.content_id}: ${result.passage_count} passages, ${result.group_count} groups, ${result.question_count} questions.`);
  };

  const applyPdfDraft = (result: IELTSPdfImportResult, replaceOnlyPassages = false) => {
    if (!replaceOnlyPassages) {
      setSelectedContentId(null);
      setContentForm(buildContentFormState(result.suggested_content as Partial<IELTSContentItem>));
      setGroups([]);
      setQuestions([]);
      setVocabulary([]);
      setRelatedPosts([]);
    } else {
      setContentForm((curr: ContentFormState) => ({
        ...curr,
        metadataText: JSON.stringify(
          {
            ...parseJSONField<Record<string, unknown>>(curr.metadataText, {}),
            pdf_import: {
              file_name: result.file_name,
              page_count: result.page_count,
              requires_ocr: result.requires_ocr,
            },
          },
          null,
          2,
        ),
      }));
    }

    setPassages(result.suggested_passages.map((item, index) => ({
      id: undefined,
      passage_no: item.passage_no,
      title: item.title ?? '',
      body: item.body,
      sort_order: item.sort_order ?? index + 1,
    })));
    setMessage(
      replaceOnlyPassages
        ? `Loaded ${result.page_count} PDF pages into passages.`
        : `Prepared draft from PDF ${result.file_name}. Review and save content to persist.`,
    );
  };

  const handleImportPdf = async (file?: File) => {
    if (!file) return;
    const result = await pdfImportMutation.mutateAsync(file);
    setPdfImportPreview(result);
    setMessage(
      result.requires_ocr
        ? `PDF scanned: extracted ${result.extracted_chars} characters, but some pages need OCR.`
        : `PDF parsed: ${result.page_count} pages, ${result.extracted_chars} characters extracted.`,
    );
  };

  const handleAssetUpload = async (file?: File) => {
    if (!file || !selectedContentId) return;
    const result = await uploadMutation.mutateAsync({ contentId: selectedContentId, kind: assetKind, file });
    const urlMap: Partial<Record<AssetKind, keyof ContentFormState>> = {
      thumbnail: 'thumbnail_url',
      'content-image': 'preview_image_url',
      audio: 'audio_url',
      pdf: 'pdf_url',
    };
    const field = urlMap[assetKind];
    if (field) setContentForm((curr: ContentFormState) => ({ ...curr, [field]: result.url }));
    setMessage(`Uploaded ${result.kind}: ${result.original_name}`);
  };

  const handleDeleteContent = async () => {
    if (!selectedContentId || !window.confirm(`Delete content #${selectedContentId}?`)) return;
    await deleteContentMutation.mutateAsync(selectedContentId);
    setMessage(`Deleted content #${selectedContentId}`);
    resetEditor();
  };

  const handleReview = (id: number, action: 'approved' | 'published' | 'rejected' | 'archived') => {
    void reviewMutation.mutateAsync({ id, action });
    setMessage(`Review status updated: ${action}`);
  };

  const upsertPassage = async (draft: PassageDraft) => {
    if (!selectedContentId) return;
    const payload: IELTSPassagePayload = {
      passage_no: Number(draft.passage_no),
      title: draft.title,
      body: draft.body,
      sort_order: Number(draft.sort_order || 0),
    };
    if (draft.id) {
      await updatePassageMutation.mutateAsync({ id: draft.id, payload });
      setMessage(`Updated passage #${draft.id}`);
    } else {
      await createPassageMutation.mutateAsync({ contentId: selectedContentId, payload });
      setMessage(`Created passage`);
    }
  };

  const deletePassage = (draft: PassageDraft, index: number) => {
    if (draft.id) {
      void deletePassageMutation.mutateAsync({ id: draft.id, contentId: selectedContentId as number });
    } else {
      setPassages((curr: PassageDraft[]) => curr.filter((_, i) => i !== index));
    }
  };

  const upsertGroup = async (draft: GroupDraft) => {
    if (!selectedContentId) return;
    const payload: IELTSQuestionGroupPayload = {
      passage_id: draft.passage_id === '' ? undefined : Number(draft.passage_id),
      group_no: Number(draft.group_no),
      question_from: Number(draft.question_from),
      question_to: Number(draft.question_to),
      question_type: draft.question_type,
      instruction: draft.instruction,
      metadata: undefined,
      sort_order: Number(draft.sort_order || 0),
      payload: parseJSONField<Record<string, unknown>>(draft.payloadText, {}),
    };
    if (draft.id) {
      await updateGroupMutation.mutateAsync({ id: draft.id, payload });
      setMessage(`Updated group #${draft.id}`);
    } else {
      await createGroupMutation.mutateAsync({ contentId: selectedContentId, payload });
      setMessage(`Created question group`);
    }
  };

  const deleteGroup = (draft: GroupDraft, index: number) => {
    if (draft.id) {
      void deleteGroupMutation.mutateAsync({ id: draft.id, contentId: selectedContentId as number });
    } else {
      setGroups((curr: GroupDraft[]) => curr.filter((_, i) => i !== index));
    }
  };

  const upsertQuestion = async (draft: QuestionDraft) => {
    if (!selectedContentId || draft.group_id === '') return;
    const payload: IELTSQuestionPayload = {
      group_id: Number(draft.group_id),
      question_no: Number(draft.question_no),
      prompt: draft.prompt,
      answer: draft.answer,
      options: parseJSONField<unknown>(draft.optionsText, []),
      explanation: parseJSONField<unknown>(draft.explanationText, {}),
      payload: parseJSONField<unknown>(draft.payloadText, {}),
      sort_order: Number(draft.sort_order || 0),
      metadata: undefined,
    };
    if (draft.id) {
      await updateQuestionMutation.mutateAsync({ id: draft.id, payload });
      setMessage(`Updated question #${draft.id}`);
    } else {
      await createQuestionMutation.mutateAsync({ contentId: selectedContentId, payload });
      setMessage(`Created question`);
    }
  };

  const deleteQuestion = (draft: QuestionDraft, index: number) => {
    if (draft.id) {
      void deleteQuestionMutation.mutateAsync({ id: draft.id, contentId: selectedContentId as number });
    } else {
      setQuestions((curr: QuestionDraft[]) => curr.filter((_, i) => i !== index));
    }
  };

  const upsertVocabulary = async (draft: VocabularyDraft) => {
    if (!selectedContentId) return;
    const payload: IELTSVocabularyPayload = {
      term: draft.term, ipa: draft.ipa, part_of_speech: draft.part_of_speech,
      meaning: draft.meaning, example: draft.example, audio_url: draft.audio_url,
      image_url: draft.image_url, sort_order: Number(draft.sort_order || 0),
    };
    if (draft.id) {
      await updateVocabMutation.mutateAsync({ id: draft.id, payload });
      setMessage(`Updated vocabulary #${draft.id}`);
    } else {
      await createVocabMutation.mutateAsync({ contentId: selectedContentId, payload });
      setMessage(`Created vocabulary item`);
    }
  };

  const deleteVocabulary = (draft: VocabularyDraft, index: number) => {
    if (draft.id) {
      void deleteVocabMutation.mutateAsync({ id: draft.id, contentId: selectedContentId as number });
    } else {
      setVocabulary((curr: VocabularyDraft[]) => curr.filter((_, i) => i !== index));
    }
  };

  const upsertRelatedPost = async (draft: RelatedPostDraft) => {
    if (!selectedContentId) return;
    const payload: IELTSRelatedPostPayload = {
      post_id: Number(draft.post_id), title: draft.title,
      sort_order: Number(draft.sort_order || 0),
    };
    if (draft.id) {
      await updateRelatedPostMutation.mutateAsync({ id: draft.id, payload });
      setMessage(`Updated related post #${draft.id}`);
    } else {
      await createRelatedPostMutation.mutateAsync({ contentId: selectedContentId, payload });
      setMessage(`Created related post`);
    }
  };

  const deleteRelatedPost = (draft: RelatedPostDraft, index: number) => {
    if (draft.id) {
      void deleteRelatedPostMutation.mutateAsync({ id: draft.id, contentId: selectedContentId as number });
    } else {
      setRelatedPosts((curr: RelatedPostDraft[]) => curr.filter((_, i) => i !== index));
    }
  };

  const addPassage = () =>
    setPassages((curr) => [...curr, {
      passage_no: curr.length + 1, title: `Passage ${curr.length + 1}`, body: '', sort_order: curr.length + 1,
    }]);

  const addGroup = () =>
    setGroups((curr) => [...curr, {
      passage_id: '', group_no: curr.length + 1, question_from: 1, question_to: 1,
      question_type: QUESTION_TYPE_OPTIONS[0], instruction: '', payloadText: '{}', sort_order: curr.length + 1,
    }]);

  const addQuestion = () =>
    setQuestions((curr) => [...curr, {
      group_id: groupOptions[0]?.id ?? '', question_no: curr.length + 1, prompt: '', answer: '',
      optionsText: '[]', explanationText: '{\n  "short": "",\n  "locator": {}\n}', payloadText: '{}', sort_order: curr.length + 1,
    }]);

  const addVocabulary = () =>
    setVocabulary((curr) => [...curr, {
      term: '', ipa: '', part_of_speech: '', meaning: '', example: '',
      audio_url: '', image_url: '', sort_order: curr.length + 1,
    }]);

  const addRelatedPost = () =>
    setRelatedPosts((curr) => [...curr, { post_id: 0, title: '', sort_order: curr.length + 1 }]);

  return {
    // State
    query, setQuery,
    selectedContentId, setSelectedContentId,
    assetKind, setAssetKind,
    message,
    pdfImportPreview,
    contentForm, setFormValue,
    passages, setPassages,
    groups, setGroups,
    questions, setQuestions,
    vocabulary, setVocabulary,
    relatedPosts, setRelatedPosts,
    // Derived
    isBusy,
    contentQuery,
    detailQuery,
    passageOptions,
    groupOptions,
    // Mutation loading states
    isSavingContent: createContentMutation.isPending || updateContentMutation.isPending,
    isUpdatingDashboard: false,
    // Actions
    saveContent,
    handleImport,
    handleImportPdf,
    applyPdfDraft,
    handleAssetUpload,
    handleDeleteContent,
    handleReview,
    resetEditor,
    upsertPassage, deletePassage, addPassage,
    upsertGroup,   deleteGroup,   addGroup,
    upsertQuestion, deleteQuestion, addQuestion,
    upsertVocabulary, deleteVocabulary, addVocabulary,
    upsertRelatedPost, deleteRelatedPost, addRelatedPost,
  };
}
