import { create } from "zustand";

interface WritingState {
  textContent: string;
  setTextContent: (text: string) => void;
  wordCount: number;
}

export const useWritingStore = create<WritingState>((set) => ({
  textContent: "",
  setTextContent: (text) => set({ 
    textContent: text, 
    wordCount: text.split(/\s+/).filter(w => w.length > 0).length 
  }),
  wordCount: 142, // Default for demo
}));
