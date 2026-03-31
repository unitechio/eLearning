import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface SpeakingAnalysisResponse {
  transcript: string;
  score: number;
  feedback: string;
  improved_answer: string;
}

export const useAnalyzeSpeaking = () => {
  return useMutation({
    mutationFn: async (audioBlob: Blob): Promise<{ success: boolean; data: SpeakingAnalysisResponse; message: string }> => {
      const formData = new FormData();
      // 'audio' matches the backend FormFile key
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await api.post('/speaking/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};
export const useIELTSScoring = () => {
  return useMutation({
    mutationFn: async (transcript: string): Promise<any> => {
      const response = await axios.post('/api/score/speaking', { transcript });
      return response.data;
    },
  });
};
