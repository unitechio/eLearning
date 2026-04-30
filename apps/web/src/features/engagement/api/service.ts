import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';

export interface Planner {
  focus_area: string;
  weekly_target: number;
  tasks: string[];
}

export interface PlannerUpdatePayload {
  focus_area: string;
  weekly_target: number;
  tasks: string[];
}

export interface GamificationProfile {
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  next_level_at_xp: number;
  current_badge: string;
  achievement_pct: number;
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  xp: number;
  time_spent: number;
  is_current: boolean;
}

export interface HeatmapPoint {
  date: string;
  count: number;
}

export interface DailyActivityPoint {
  date: string;
  xp: number;
  time_spent: number;
  completed_labs: number;
}

const unwrap = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export const getPlanner = async (): Promise<Planner> => {
  const response = await apiClient.get<ApiResponse<Planner>>('/planner');
  return unwrap(response);
};

export const generatePlanner = async (): Promise<Planner> => {
  const response = await apiClient.post<ApiResponse<Planner>>('/planner/generate');
  return unwrap(response);
};

export const updatePlanner = async (payload: PlannerUpdatePayload): Promise<Planner> => {
  const response = await apiClient.put<ApiResponse<Planner>>('/planner/update', payload);
  return unwrap(response);
};

export const getGamificationProfile = async (): Promise<GamificationProfile> => {
  const response = await apiClient.get<ApiResponse<GamificationProfile>>('/gamification/profile');
  return unwrap(response);
};

export const getAchievements = async (): Promise<Achievement[]> => {
  const response = await apiClient.get<ApiResponse<Achievement[]>>('/gamification/achievements');
  return unwrap(response);
};

export const getLeaderboard = async (params: { type?: string; metric?: string } = {}): Promise<LeaderboardEntry[]> => {
  const query = new URLSearchParams();
  if (params.type) query.set('type', params.type);
  if (params.metric) query.set('metric', params.metric);
  const response = await apiClient.get<ApiResponse<LeaderboardEntry[]>>(`/leaderboard${query.size ? `?${query.toString()}` : ''}`);
  return unwrap(response);
};

export const getMyLeaderboard = async (params: { type?: string; metric?: string } = {}): Promise<LeaderboardEntry> => {
  const query = new URLSearchParams();
  if (params.type) query.set('type', params.type);
  if (params.metric) query.set('metric', params.metric);
  const response = await apiClient.get<ApiResponse<LeaderboardEntry>>(`/leaderboard/me${query.size ? `?${query.toString()}` : ''}`);
  return unwrap(response);
};

export const getHeatmap = async (range = '6m'): Promise<HeatmapPoint[]> => {
  const response = await apiClient.get<ApiResponse<HeatmapPoint[]>>(`/activity/heatmap?range=${encodeURIComponent(range)}`);
  return unwrap(response);
};

export const getDailyActivity = async (range = '30d'): Promise<DailyActivityPoint[]> => {
  const response = await apiClient.get<ApiResponse<DailyActivityPoint[]>>(`/activity/daily?range=${encodeURIComponent(range)}`);
  return unwrap(response);
};
