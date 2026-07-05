import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createIELTSPassage,
  createIELTSQuestion,
  createIELTSQuestionGroup,
  createIELTSRelatedPost,
  createIELTSVocabulary,
  getIELTSContent,
  importIELTSContent,
  listIELTSAttempts,
  listAdminIELTSContent,
  listIELTSContent,
  reviewIELTSContent,
  uploadIELTSAsset,
  type IELTSContentItem,
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

export function useCreateIELTSQuestionGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSQuestionGroupPayload }) => createIELTSQuestionGroup(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useCreateIELTSQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSQuestionPayload }) => createIELTSQuestion(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useCreateIELTSVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSVocabularyPayload }) => createIELTSVocabulary(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}

export function useCreateIELTSRelatedPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, payload }: { contentId: number; payload: IELTSRelatedPostPayload }) => createIELTSRelatedPost(contentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'ielts', 'content'] }),
  });
}
