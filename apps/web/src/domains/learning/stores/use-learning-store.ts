import { create } from 'zustand';
import { LearningState } from '../types';

export const useLearningStore = create<LearningState>((set) => ({
  activePlanId: null,
  setActivePlan: (id) => set({ activePlanId: id }),
  isPlanModalOpen: false,
  setPlanModalOpen: (open) => set({ isPlanModalOpen: open }),
}));
