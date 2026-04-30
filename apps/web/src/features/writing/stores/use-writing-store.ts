import { create } from 'zustand';

interface WritingState {
  textContent: string;
  wordCount: number;
  setTextContent: (text: string) => void;
}

export const useWritingStore = create<WritingState>((set) => ({
  textContent: '',
  wordCount: 0,
  setTextContent: (text) =>
    set({
      textContent: text,
      wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
    }),
}));
