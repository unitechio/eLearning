import { create } from 'zustand';
export interface IELTSSpeakingResult {
  overall_band: number;
  feedback: string;
  criteria: {
    fluency: number;
    lexical: number;
  };
  mistakes: {
    text: string;
    suggestion: string;
  }[];
}

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
