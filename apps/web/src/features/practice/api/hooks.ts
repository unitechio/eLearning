import { useMutation } from '@tanstack/react-query';
import * as practiceService from './service';

export const useReadingLookup = () =>
  useMutation({
    mutationFn: ({ word, context }: { word: string; context: string }) => practiceService.lookupReadingWord(word, context),
  });

export const useSaveReadingWord = () =>
  useMutation({
    mutationFn: (word: string) => practiceService.saveReadingWord(word),
  });
