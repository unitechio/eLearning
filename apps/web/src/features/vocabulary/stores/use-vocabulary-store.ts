import { create } from 'zustand';

interface VocabularyState {
  isFlipped: boolean;
  setFlipped: (flipped: boolean) => void;
}

export const useVocabularyStore = create<VocabularyState>((set) => ({
  isFlipped: false,
  setFlipped: (flipped: boolean) => set({ isFlipped: flipped }),
}));
