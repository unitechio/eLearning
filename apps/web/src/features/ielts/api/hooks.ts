import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from './service';

export const useListeningLessons = () =>
  useQuery({
    queryKey: ['ielts', 'listening', 'lessons'],
    queryFn: service.listListeningLessons,
  });

export const useListeningLesson = (lessonId?: string) =>
  useQuery({
    queryKey: ['ielts', 'listening', 'lesson', lessonId],
    queryFn: () => service.getListeningLesson(lessonId as string),
    enabled: Boolean(lessonId),
  });

export const useSubmitListeningLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, answers }: { lessonId: string; answers: string[] }) => service.submitListeningLesson(lessonId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
    },
  });
};

export const useStartSpeakingSession = () =>
  useMutation({
    mutationFn: service.startSpeakingSession,
  });

export const useStopSpeakingSession = () =>
  useMutation({
    mutationFn: service.stopSpeakingSession,
  });

export const useSpeakingSession = (sessionId?: string) =>
  useQuery({
    queryKey: ['ielts', 'speaking', 'session', sessionId],
    queryFn: () => service.getSpeakingSession(sessionId as string),
    enabled: Boolean(sessionId),
    refetchInterval: sessionId ? 10000 : false,
  });

export const useAnalyzePronunciation = () =>
  useMutation({
    mutationFn: service.analyzePronunciation,
  });

export const useAnalyzeSpeakingAudio = () =>
  useMutation({
    mutationFn: service.analyzeSpeakingAudio,
  });

export const useWritingHistory = () =>
  useQuery({
    queryKey: ['ielts', 'writing', 'history'],
    queryFn: service.getWritingHistory,
  });

export const useWritingSubmission = (submissionId?: string) =>
  useQuery({
    queryKey: ['ielts', 'writing', 'submission', submissionId],
    queryFn: () => service.getWritingSubmission(submissionId as string),
    enabled: Boolean(submissionId),
  });

export const useEvaluateWriting = () =>
  useMutation({
    mutationFn: ({ prompt, text }: { prompt: string; text: string }) => service.evaluateWriting(prompt, text),
  });

export const useSubmitWriting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ promptText, responseText }: { promptText: string; responseText: string }) => service.submitWriting(promptText, responseText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ielts', 'writing', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
    },
  });
};
