import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getDailyPlan, getLearningStats, LearningPlan } from "../lib/api/learning";

// Client State with Zustand
interface LearningState {
  activePlanId: string | null;
  setActivePlan: (id: string) => void;
  isPlanModalOpen: boolean;
  setPlanModalOpen: (open: boolean) => void;
  isFlipped: boolean;
  setFlipped: (flipped: boolean) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  activePlanId: null,
  setActivePlan: (id) => set({ activePlanId: id }),
  isPlanModalOpen: false,
  setPlanModalOpen: (open) => set({ isPlanModalOpen: open }),
  isFlipped: false,
  setFlipped: (flipped: boolean) => set({ isFlipped: flipped }),
}));

// Server State with React Query
export const useDailyPlan = () => {
  return useQuery({
    queryKey: ["dailyPlan"],
    queryFn: getDailyPlan,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLearningStats = () => {
  return useQuery({
    queryKey: ["learningStats"],
    queryFn: getLearningStats,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
