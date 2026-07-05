export interface LearningPlan {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface LearningStats {
  scoreProgression: number[];
  recentAssessments: {
    id: string;
    type: string;
    title: string;
    score: string;
    icon: string;
  }[];
  streak: number;
  aiFeedback: string;
}

export interface LearningState {
  activePlanId: string | null;
  setActivePlan: (id: string) => void;
  isPlanModalOpen: boolean;
  setPlanModalOpen: (open: boolean) => void;
}
