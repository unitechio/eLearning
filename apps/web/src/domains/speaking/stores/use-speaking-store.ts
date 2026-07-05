import { create } from 'zustand';
import { IELTSSpeakingResult } from '@e-english/ielts-ai';

interface SpeakingState {
  isRecording: boolean;
  setRecording: (status: boolean) => void;
  recordingTime: number;
  setRecordingTime: (time: number) => void;
  scoringResult: IELTSSpeakingResult | null;
  setScoringResult: (result: IELTSSpeakingResult | null) => void;
}

export const useSpeakingStore = create<SpeakingState>((set) => ({
  isRecording: false,
  setRecording: (status) => set({ isRecording: status }),
  recordingTime: 84, // 01:24 default for demo
  setRecordingTime: (time) => set({ recordingTime: time }),
  scoringResult: null,
  setScoringResult: (result) => set({ scoringResult: result }),
}));
