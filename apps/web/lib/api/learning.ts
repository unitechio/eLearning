import { apiClient } from "./client";

export interface LearningPlan {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: string;
  duration: string;
  status: "completed" | "current" | "upcoming";
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

export const getDailyPlan = async (): Promise<LearningPlan[]> => {
  // return apiClient.get("/learning/daily-plan");
  
  // Mock data to match the HTML design
  return [
    {
      id: "1",
      title: "Advanced Collocations for 'Environment'",
      description: "Review 15 high-level phrases and synonyms.",
      completed: true,
      type: "VOCABULARY",
      duration: "10 MINS",
      status: "completed",
    },
    {
      id: "2",
      title: "Critical Analysis: Argumentative Essays",
      description: "AI-guided breakdown of a Band 9 response.",
      completed: false,
      type: "WRITING",
      duration: "20 MINS",
      status: "current",
    },
    {
      id: "3",
      title: "Mock Speaking: Part 2 Simulation",
      description: "Practice cue cards with real-time feedback.",
      completed: false,
      type: "SPEAKING",
      duration: "15 MINS",
      status: "upcoming",
    },
  ];
};

export const getLearningStats = async (): Promise<LearningStats> => {
  // return apiClient.get("/learning/stats");

  // Mock data
  return {
    scoreProgression: [40, 55, 45, 70, 65, 85, 95], // percentages
    recentAssessments: [
      { id: "1", type: "WRITING TASK 1", title: "Graph Description", score: "Band 7.5", icon: "analytics" },
      { id: "2", type: "SPEAKING PART 3", title: "Urbanization Trends", score: "Band 8.0", icon: "forum" },
      { id: "3", type: "READING MOCK", title: "Academic Passage 2", score: "Band 9.0", icon: "library_books" },
    ],
    streak: 14,
    aiFeedback: '"Your coherence and cohesion scores are peaking. Focus on lexical resource—specifically topic-specific vocabulary—to break the Band 8 barrier."',
  };
};
