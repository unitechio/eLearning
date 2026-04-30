import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';

export interface DictionaryLookupResponse {
  word: string;
  meaning: string;
  ipa: string;
  audio: string;
  word_type: string;
  collocation: string;
  example: string;
  saved: boolean;
}

export const lookupDictionaryWord = async (word: string): Promise<DictionaryLookupResponse> => {
  const response = await apiClient.get<ApiResponse<DictionaryLookupResponse>>(`/dictionary/lookup?word=${encodeURIComponent(word)}`);
  return response.data.data;
};

export const lookupReadingWord = async (word: string, context: string): Promise<DictionaryLookupResponse> => {
  const response = await apiClient.post<ApiResponse<DictionaryLookupResponse>>('/reading/lookup', { word, context });
  return response.data.data;
};

export const saveReadingWord = async (word: string): Promise<DictionaryLookupResponse> => {
  const response = await apiClient.post<ApiResponse<DictionaryLookupResponse>>('/reading/save-word', { word });
  return response.data.data;
};
