import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminIELTSContent,
  createIELTSPassage,
  createIELTSQuestion,
  createIELTSQuestionGroup,
  createIELTSRelatedPost,
  createIELTSVocabulary,
  deleteAdminIELTSContent,
  deleteIELTSPassage,
  deleteIELTSQuestion,
  deleteIELTSQuestionGroup,
  deleteIELTSRelatedPost,
  deleteIELTSVocabulary,
  getAdminIELTSContent,
  getIELTSContent,
  importIELTSContent,
  importIELTSPdf,
  listIELTSAttempts,
  listAdminIELTSContent,
  listIELTSContent,
  reviewIELTSContent,
  uploadIELTSAsset,
  updateAdminIELTSContent,
  updateIELTSPassage,
  updateIELTSQuestion,
  updateIELTSQuestionGroup,
  updateIELTSRelatedPost,
  updateIELTSVocabulary,
  type IELTSContentItem,
  type IELTSContentDetail,
  type IELTSPassagePayload,
  type IELTSPracticeAttempt,
  type IELTSQuestionGroupPayload,
  type IELTSQuestionPayload,
  type IELTSRelatedPostPayload,
  type IELTSVocabularyPayload,
} from './api';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

export function useIELTSContentList(params: Record<string, string | number | undefined>) {
  const [state, setState] = useState<AsyncState<IELTSContentItem[]>>({ data: null, loading: true, error: null });
  const stableParams = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    listIELTSContent(JSON.parse(stableParams))
      .then((result) => {
        if (active) setState({ data: result.items, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [stableParams]);

  return state;
}

export function useAdminIELTSContentDetail(id?: number | null) {
  return useQuery<IELTSContentDetail>({
    queryKey: ['admin', 'ielts', 'content-detail', id],
    queryFn: () => getAdminIELTSContent(id as number),
    enabled: Boolean(id),
  });
}

export function useIELTSContent(slug?: string) {
  const [state, setState] = useState<AsyncState<IELTSContentItem>>({ data: null, loading: Boolean(slug), error: null });

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    getIELTSContent(slug)
      .then((item) => {
        if (active) setState({ data: item, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}

export function useIELTSAttemptHistory(params: Record<string, string | number | undefined>) {
  const [state, setState] = useState<AsyncState<IELTSPracticeAttempt[]>>({ data: null, loading: true, error: null });
  const stableParams = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: null }));
    listIELTSAttempts(JSON.parse(stableParams))
      .then((result) => {
        if (active) setState({ data: result.items, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error });
      });
    return () => {
      active = false;
    };
  }, [stableParams]);

  return state;
}

export function useAdminIELTSContent(params: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ['admin', 'ielts', 'content', params],
    queryFn: () => listAdminIELTSContent(params),
  });
}

export function useImportIELTSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importIELTSContent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useImportIELTSPdf() {
  return useMutation({
    mutationFn: importIELTSPdf,
  });
}

export function useCreateAdminIELTSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminIELTSContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
    },
  });
}

export function useUpdateAdminIELTSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Omit<IELTSContentItem, 'id' | 'view_count'> }) => updateAdminIELTSContent(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', variables.id] });
    },
  });
}

export function useDeleteAdminIELTSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminIELTSContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
    },
  });
}

export function useReviewIELTSContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, note }: { id: number; action: 'approved' | 'published' | 'rejected' | 'archived'; note?: string }) =>
      reviewIELTSContent(id, { action, note }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUploadIELTSAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, kind, file }: { contentId: number; kind: 'content-image' | 'thumbnail' | 'audio' | 'pdf' | 'vocab-image'; file: File }) =>
      uploadIELTSAsset(contentId, kind, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useCreateIELTSPassage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSPassagePayload }) => createIELTSPassage(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUpdateIELTSPassage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IELTSPassagePayload }) => updateIELTSPassage(id, payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', item.content_item_id] });
    },
  });
}

export function useDeleteIELTSPassage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contentId }: { id: number; contentId: number }) => deleteIELTSPassage(id).then(() => contentId),
    onSuccess: (contentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', contentId] });
    },
  });
}

export function useCreateIELTSQuestionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSQuestionGroupPayload }) => createIELTSQuestionGroup(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUpdateIELTSQuestionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IELTSQuestionGroupPayload }) => updateIELTSQuestionGroup(id, payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', item.content_item_id] });
    },
  });
}

export function useDeleteIELTSQuestionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contentId }: { id: number; contentId: number }) => deleteIELTSQuestionGroup(id).then(() => contentId),
    onSuccess: (contentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', contentId] });
    },
  });
}

export function useCreateIELTSQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSQuestionPayload }) => createIELTSQuestion(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUpdateIELTSQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IELTSQuestionPayload }) => updateIELTSQuestion(id, payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', item.content_item_id] });
    },
  });
}

export function useDeleteIELTSQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contentId }: { id: number; contentId: number }) => deleteIELTSQuestion(id).then(() => contentId),
    onSuccess: (contentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', contentId] });
    },
  });
}

export function useCreateIELTSVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSVocabularyPayload }) => createIELTSVocabulary(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUpdateIELTSVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IELTSVocabularyPayload }) => updateIELTSVocabulary(id, payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', item.content_item_id] });
    },
  });
}

export function useDeleteIELTSVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contentId }: { id: number; contentId: number }) => deleteIELTSVocabulary(id).then(() => contentId),
    onSuccess: (contentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', contentId] });
    },
  });
}

export function useCreateIELTSRelatedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSRelatedPostPayload }) => createIELTSRelatedPost(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useUpdateIELTSRelatedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IELTSRelatedPostPayload }) => updateIELTSRelatedPost(id, payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', item.content_item_id] });
    },
  });
}

export function useDeleteIELTSRelatedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contentId }: { id: number; contentId: number }) => deleteIELTSRelatedPost(id).then(() => contentId),
    onSuccess: (contentId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content-detail', contentId] });
    },
  });
}
