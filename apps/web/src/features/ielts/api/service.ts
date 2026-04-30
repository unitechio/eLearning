import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';

export interface ListeningLesson {
  id: string;
  title: string;
  description: string;
  audio_url: string;
}

export interface ListeningLessonSubmissionResult {
  lesson_id: string;
  title: string;
  score: number;
  answers: string[];
  transcript: string;
  submitted: boolean;
}

export interface SpeakingSession {
  id: string;
  status: string;
  started_at: string;
  stopped_at?: string;
}

export interface PronunciationResult {
  accuracy: number;
  feedback: string;
}

export interface SpeakingAnalyzeResult {
  transcript: string;
  score: number;
  feedback: string;
  improved_answer?: string;
}

export interface WritingSubmission {
  id: string;
  user_id: string;
  prompt_text: string;
  response: string;
  word_count: number;
  ai_score: number;
  ai_feedback: string;
  created_at: string;
  updated_at: string;
}

export interface WritingEvaluationResult {
  prompt: string;
  score: number;
  feedback: string;
  improved_answer?: string;
}

const unwrap = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export const listListeningLessons = async (): Promise<ListeningLesson[]> => {
  const response = await apiClient.get<ApiResponse<ListeningLesson[]>>('/listening/lessons?page=1&page_size=12');
  return unwrap(response);
};

export const getListeningLesson = async (id: string): Promise<ListeningLesson> => {
  const response = await apiClient.get<ApiResponse<ListeningLesson>>(`/listening/${id}`);
  return unwrap(response);
};

export const submitListeningLesson = async (id: string, answers: string[]): Promise<ListeningLessonSubmissionResult> => {
  const response = await apiClient.post<ApiResponse<ListeningLessonSubmissionResult>>(`/listening/${id}/submit`, { answers });
  return unwrap(response);
};

export const startSpeakingSession = async (): Promise<SpeakingSession> => {
  const response = await apiClient.post<ApiResponse<SpeakingSession>>('/speaking/session/start');
  return unwrap(response);
};

export const stopSpeakingSession = async (): Promise<SpeakingSession> => {
  const response = await apiClient.post<ApiResponse<SpeakingSession>>('/speaking/session/stop');
  return unwrap(response);
};

export const getSpeakingSession = async (id: string): Promise<SpeakingSession> => {
  const response = await apiClient.get<ApiResponse<SpeakingSession>>(`/speaking/session/${id}`);
  return unwrap(response);
};

export const analyzePronunciation = async (text: string): Promise<PronunciationResult> => {
  const response = await apiClient.post<ApiResponse<PronunciationResult>>('/speaking/pronunciation', { text });
  return unwrap(response);
};

export const analyzeSpeakingAudio = async (audio: File): Promise<SpeakingAnalyzeResult> => {
  const formData = new FormData();
  formData.append('audio', audio);
  const response = await apiClient.post<ApiResponse<SpeakingAnalyzeResult>>('/speaking/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response);
};

export const submitWriting = async (promptText: string, responseText: string): Promise<WritingSubmission> => {
  const response = await apiClient.post<ApiResponse<WritingSubmission>>('/writing/submit', {
    prompt_text: promptText,
    response: responseText,
  });
  return unwrap(response);
};

export const getWritingHistory = async (): Promise<{ items: WritingSubmission[]; meta?: ApiResponse<WritingSubmission[]>['meta'] }> => {
  const response = await apiClient.get<ApiResponse<WritingSubmission[]>>('/writing/history?page=1&page_size=10');
  return { items: response.data.data, meta: response.data.meta };
};

export const getWritingSubmission = async (id: string): Promise<Record<string, unknown>> => {
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/writing/${id}`);
  return unwrap(response);
};

export const evaluateWriting = async (prompt: string, text: string): Promise<WritingEvaluationResult> => {
  const response = await apiClient.post<ApiResponse<WritingEvaluationResult>>('/writing/evaluate', { prompt, text });
  return unwrap(response);
};
