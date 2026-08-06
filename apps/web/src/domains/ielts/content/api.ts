import { apiClient } from '@/shared/api';
import type { ApiResponse } from '@/shared/types/api';

export interface IELTSContentItem {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  module: string;
  skill: string;
  content_type: string;
  part?: string;
  test_kind?: string;
  status: string;
  level?: string;
  thumbnail_url?: string;
  preview_image_url?: string;
  audio_url?: string;
  pdf_url?: string;
  source_url?: string;
  question_count: number;
  duration_seconds: number;
  view_count: number;
  tags?: unknown[];
  metadata?: Record<string, unknown>;
  published_at?: string;
  review_status?: string;
  review_note?: string;
}

export interface IELTSPassage {
  id: number;
  content_item_id: number;
  passage_no: number;
  title?: string;
  body: string;
  sort_order: number;
}

export interface IELTSQuestion {
  id: number;
  content_item_id: number;
  group_id: number;
  question_no: number;
  prompt?: string;
  answer?: string;
  options?: unknown;
  explanation?: unknown;
  payload?: unknown;
  sort_order: number;
}

export interface IELTSQuestionGroup {
  id: number;
  content_item_id: number;
  passage_id?: number;
  group_no: number;
  question_from: number;
  question_to: number;
  question_type: string;
  instruction?: string;
  payload?: unknown;
  sort_order: number;
  questions?: IELTSQuestion[];
}

export interface IELTSVocabularyItem {
  id: number;
  content_item_id: number;
  term: string;
  ipa?: string;
  part_of_speech?: string;
  meaning?: string;
  example?: string;
  audio_url?: string;
  image_url?: string;
  sort_order: number;
}

export interface IELTSRelatedPost {
  id: number;
  content_item_id: number;
  post_id: number;
  title?: string;
  sort_order: number;
}

export interface IELTSContentDetail extends IELTSContentItem {
  passages?: IELTSPassage[];
  question_groups?: IELTSQuestionGroup[];
  vocabulary?: IELTSVocabularyItem[];
  related_posts?: IELTSRelatedPost[];
}

export interface IELTSImportResult {
  content_id: number;
  passage_count: number;
  group_count: number;
  question_count: number;
  vocabulary_count: number;
}

export interface IELTSPdfImportPage {
  page_no: number;
  title: string;
  text: string;
  text_length: number;
  image_count: number;
  requires_ocr: boolean;
  has_text_layer: boolean;
}

export interface IELTSPdfImportResult {
  file_name: string;
  title: string;
  page_count: number;
  extracted_text: string;
  extracted_chars: number;
  requires_ocr: boolean;
  has_extractable_text: boolean;
  pages: IELTSPdfImportPage[];
  suggested_content: Omit<IELTSContentItem, 'id' | 'view_count'>;
  suggested_passages: IELTSPassagePayload[];
}

export interface IELTSPassagePayload {
  passage_no: number;
  title?: string;
  body: string;
  sort_order?: number;
}

export interface IELTSQuestionGroupPayload {
  passage_id?: number;
  group_no: number;
  question_from: number;
  question_to: number;
  question_type: string;
  instruction?: string;
  payload?: unknown;
  sort_order?: number;
  metadata?: unknown;
}

export interface IELTSQuestionPayload {
  group_id: number;
  question_no: number;
  prompt?: string;
  answer?: string;
  options?: unknown;
  explanation?: unknown;
  sort_order?: number;
  metadata?: unknown;
  payload?: unknown;
}

export interface IELTSVocabularyPayload {
  term: string;
  ipa?: string;
  part_of_speech?: string;
  meaning?: string;
  example?: string;
  audio_url?: string;
  image_url?: string;
  sort_order?: number;
}

export interface IELTSRelatedPostPayload {
  post_id: number;
  title?: string;
  sort_order?: number;
}

export interface IELTSAttemptResult {
  id: number;
  status: string;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  total_questions: number;
  score: number;
  stats: unknown;
  answers: Record<string, string>;
}

export interface IELTSAssetUploadResponse {
  media_id: number;
  kind: string;
  bucket: string;
  object_key: string;
  url: string;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
}

export interface IELTSLearningProgress {
  id: number;
  user_id: string;
  content_item_id: number;
  status: string;
  completed_questions: number;
  total_questions: number;
  last_question_no: number;
  learned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IELTSPracticeAttempt {
  id: number;
  user_id: string;
  content_item_id: number;
  mode: string;
  status: string;
  started_at: string;
  submitted_at?: string;
  time_limit_seconds: number;
  elapsed_seconds: number;
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  skipped_count: number;
  score: number;
  answers: Record<string, string>;
  stats: unknown;
  content_item?: IELTSContentItem;
}

export async function listIELTSContent(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  const response = await apiClient.get<ApiResponse<IELTSContentItem[]>>(`/public/ielts/content?${search.toString()}`);
  return { items: response.data.data, meta: response.data.meta, code: response.data.code, description: response.data.description };
}

export async function getIELTSContent(slug: string) {
  const response = await apiClient.get<ApiResponse<IELTSContentItem>>(`/public/ielts/content/${slug}`);
  return response.data.data;
}

export async function getAdminIELTSContent(id: number) {
  const response = await apiClient.get<ApiResponse<IELTSContentDetail>>(`/admin/ielts/content/${id}`);
  return response.data.data;
}

export async function startIELTSAttempt(slug: string, payload: { mode?: string; time_limit_seconds?: number }) {
  const response = await apiClient.post<ApiResponse<{ id: number }>>(`/ielts/content/${slug}/attempts`, payload);
  return response.data.data;
}

export async function submitIELTSAttempt(id: number, answers: Record<string, string>, elapsedSeconds: number) {
  const response = await apiClient.post<ApiResponse<IELTSAttemptResult>>(`/ielts/attempts/${id}/submit`, {
    answers,
    elapsed_seconds: elapsedSeconds,
  });
  return response.data.data;
}

export async function listIELTSAttempts(params: Record<string, string | number | undefined> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  const response = await apiClient.get<ApiResponse<IELTSPracticeAttempt[]>>(`/ielts/attempts?${search.toString()}`);
  return { items: response.data.data, meta: response.data.meta };
}

export async function updateIELTSProgress(
  contentId: number,
  payload: { status: string; completed_questions?: number; total_questions?: number; last_question_no?: number }
) {
  const response = await apiClient.put<ApiResponse<IELTSLearningProgress>>(`/ielts/content/${contentId}/progress`, payload);
  return response.data.data;
}

export async function uploadIELTSAsset(contentId: number, kind: 'content-image' | 'thumbnail' | 'audio' | 'pdf' | 'vocab-image', file: File) {
  const formData = new FormData();
  formData.set('kind', kind);
  formData.set('file', file);
  const response = await apiClient.post<ApiResponse<IELTSAssetUploadResponse>>(`/admin/ielts/content/${contentId}/assets`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function listAdminIELTSContent(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  const response = await apiClient.get<ApiResponse<IELTSContentItem[]>>(`/admin/ielts/content?${search.toString()}`);
  return { items: response.data.data, meta: response.data.meta };
}

export async function importIELTSContent(file: File) {
  const formData = new FormData();
  formData.set('file', file);
  const response = await apiClient.post<ApiResponse<IELTSImportResult>>('/admin/ielts/content/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function importIELTSPdf(file: File) {
  const formData = new FormData();
  formData.set('file', file);
  const response = await apiClient.post<ApiResponse<IELTSPdfImportResult>>('/admin/ielts/content/import-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
}

export async function reviewIELTSContent(id: number, payload: { action: 'approved' | 'published' | 'rejected' | 'archived'; note?: string }) {
  const response = await apiClient.post<ApiResponse<IELTSContentItem>>(`/admin/ielts/content/${id}/review`, payload);
  return response.data.data;
}

export async function createIELTSPassage(contentId: number, payload: IELTSPassagePayload) {
  const response = await apiClient.post<ApiResponse<IELTSPassage>>(`/admin/ielts/content/${contentId}/passages`, payload);
  return response.data.data;
}

export async function updateIELTSPassage(id: number, payload: IELTSPassagePayload) {
  const response = await apiClient.put<ApiResponse<IELTSPassage>>(`/admin/ielts/passages/${id}`, payload);
  return response.data.data;
}

export async function deleteIELTSPassage(id: number) {
  await apiClient.delete(`/admin/ielts/passages/${id}`);
}

export async function createIELTSQuestionGroup(contentId: number, payload: IELTSQuestionGroupPayload) {
  const response = await apiClient.post<ApiResponse<IELTSQuestionGroup>>(`/admin/ielts/content/${contentId}/question-groups`, payload);
  return response.data.data;
}

export async function updateIELTSQuestionGroup(id: number, payload: IELTSQuestionGroupPayload) {
  const response = await apiClient.put<ApiResponse<IELTSQuestionGroup>>(`/admin/ielts/question-groups/${id}`, payload);
  return response.data.data;
}

export async function deleteIELTSQuestionGroup(id: number) {
  await apiClient.delete(`/admin/ielts/question-groups/${id}`);
}

export async function createIELTSQuestion(contentId: number, payload: IELTSQuestionPayload) {
  const response = await apiClient.post<ApiResponse<IELTSQuestion>>(`/admin/ielts/content/${contentId}/questions`, payload);
  return response.data.data;
}

export async function updateIELTSQuestion(id: number, payload: IELTSQuestionPayload) {
  const response = await apiClient.put<ApiResponse<IELTSQuestion>>(`/admin/ielts/questions/${id}`, payload);
  return response.data.data;
}

export async function deleteIELTSQuestion(id: number) {
  await apiClient.delete(`/admin/ielts/questions/${id}`);
}

export async function createIELTSVocabulary(contentId: number, payload: IELTSVocabularyPayload) {
  const response = await apiClient.post<ApiResponse<IELTSVocabularyItem>>(`/admin/ielts/content/${contentId}/vocabulary`, payload);
  return response.data.data;
}

export async function updateIELTSVocabulary(id: number, payload: IELTSVocabularyPayload) {
  const response = await apiClient.put<ApiResponse<IELTSVocabularyItem>>(`/admin/ielts/vocabulary/${id}`, payload);
  return response.data.data;
}

export async function deleteIELTSVocabulary(id: number) {
  await apiClient.delete(`/admin/ielts/vocabulary/${id}`);
}

export async function createIELTSRelatedPost(contentId: number, payload: IELTSRelatedPostPayload) {
  const response = await apiClient.post<ApiResponse<IELTSRelatedPost>>(`/admin/ielts/content/${contentId}/related-posts`, payload);
  return response.data.data;
}

export async function updateIELTSRelatedPost(id: number, payload: IELTSRelatedPostPayload) {
  const response = await apiClient.put<ApiResponse<IELTSRelatedPost>>(`/admin/ielts/related-posts/${id}`, payload);
  return response.data.data;
}

export async function deleteIELTSRelatedPost(id: number) {
  await apiClient.delete(`/admin/ielts/related-posts/${id}`);
}

export async function createAdminIELTSContent(payload: Omit<IELTSContentItem, 'id' | 'view_count'>) {
  const response = await apiClient.post<ApiResponse<IELTSContentItem>>('/admin/ielts/content', payload);
  return response.data.data;
}

export async function updateAdminIELTSContent(id: number, payload: Omit<IELTSContentItem, 'id' | 'view_count'>) {
  const response = await apiClient.put<ApiResponse<IELTSContentItem>>(`/admin/ielts/content/${id}`, payload);
  return response.data.data;
}

export async function deleteAdminIELTSContent(id: number) {
  await apiClient.delete(`/admin/ielts/content/${id}`);
}
