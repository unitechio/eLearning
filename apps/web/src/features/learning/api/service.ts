import { apiClient } from '@/shared/services';
import { LearningPlan, LearningStats } from '../types';
import { ApiResponse } from '@/shared/types/api.types';

interface PlannerResponse {
  focus_area: string;
  weekly_target: number;
  tasks: string[];
}

interface UserStatsResponse {
  total_study_minutes: number;
  current_streak: number;
  completed_courses: number;
  average_score: number;
}

interface UserActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  occurred_at: string;
}

export const getDailyPlan = async (): Promise<LearningPlan[]> => {
  const [plannerRes, activitiesRes] = await Promise.all([
    apiClient.get<ApiResponse<PlannerResponse>>('/planner'),
    apiClient.get<ApiResponse<UserActivityItem[]>>('/users/activities?page=1&page_size=3'),
  ]);

  const planner = plannerRes.data.data;
  const activities = activitiesRes.data.data;

  const plannerTasks = (planner.tasks || []).map((task, index) => ({
    id: `planner-${index + 1}`,
    title: task,
    description: planner.focus_area ? `Focus area: ${planner.focus_area}` : 'Personalized study task',
    completed: false,
    type: 'PLANNER',
    duration: `${Math.max(10, Math.floor((planner.weekly_target || 1) * 5))} MINS`,
    status: index === 0 ? 'current' : 'upcoming',
  })) as LearningPlan[];

  const activityItems = activities.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    completed: index === 0,
    type: item.type.toUpperCase(),
    duration: '15 MINS',
    status: index === 0 ? 'completed' : index === 1 ? 'current' : 'upcoming',
  })) as LearningPlan[];

  return [...plannerTasks, ...activityItems].slice(0, 3);
};

export const getLearningStats = async (): Promise<LearningStats> => {
  const [statsRes, progressRes, activitiesRes] = await Promise.all([
    apiClient.get<ApiResponse<UserStatsResponse>>('/users/stats'),
    apiClient.get<ApiResponse<{ overall_completion: number; current_streak: number; weekly_minutes: number }>>('/progress'),
    apiClient.get<ApiResponse<UserActivityItem[]>>('/users/activities?page=1&page_size=3'),
  ]);

  const stats = statsRes.data.data;
  const progress = progressRes.data.data;
  const activities = activitiesRes.data.data;

  const completion = Math.max(10, Math.min(100, Math.round(progress.overall_completion)));
  const averageScorePercent = Math.max(10, Math.min(100, Math.round(stats.average_score * 10)));

  return {
    scoreProgression: [
      Math.max(10, completion - 25),
      Math.max(20, completion - 15),
      Math.max(25, completion - 10),
      Math.max(30, completion - 5),
      Math.max(35, averageScorePercent - 10),
      Math.max(40, averageScorePercent - 5),
      averageScorePercent,
    ],
    recentAssessments: activities.map((item, index) => ({
      id: item.id,
      type: item.type.toUpperCase(),
      title: item.title,
      score: `Band ${(stats.average_score || 0).toFixed(1)}`,
      icon: index % 2 === 0 ? 'analytics' : 'forum',
    })),
    streak: stats.current_streak || progress.current_streak,
    aiFeedback: `"You have completed ${stats.completed_courses} courses and studied ${stats.total_study_minutes} minutes. Keep pushing ${progress.weekly_minutes} weekly minutes to improve your band score."`,
  };
};
