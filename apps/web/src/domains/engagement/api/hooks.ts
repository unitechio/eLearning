import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as service from './service';

export const usePlanner = () =>
  useQuery({
    queryKey: ['engagement', 'planner'],
    queryFn: service.getPlanner,
  });

export const useGeneratePlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: service.generatePlanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement', 'planner'] });
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] });
    },
  });
};

export const useUpdatePlanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: service.updatePlanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement', 'planner'] });
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] });
    },
  });
};

export const useGamificationProfile = () =>
  useQuery({
    queryKey: ['engagement', 'gamification', 'profile'],
    queryFn: service.getGamificationProfile,
  });

export const useAchievements = () =>
  useQuery({
    queryKey: ['engagement', 'gamification', 'achievements'],
    queryFn: service.getAchievements,
  });

export const useLeaderboard = (params: { type?: string; metric?: string } = {}) =>
  useQuery({
    queryKey: ['engagement', 'leaderboard', params],
    queryFn: () => service.getLeaderboard(params),
  });

export const useMyLeaderboard = (params: { type?: string; metric?: string } = {}) =>
  useQuery({
    queryKey: ['engagement', 'leaderboard', 'me', params],
    queryFn: () => service.getMyLeaderboard(params),
  });

export const useHeatmap = (range = '6m') =>
  useQuery({
    queryKey: ['engagement', 'activity', 'heatmap', range],
    queryFn: () => service.getHeatmap(range),
  });

export const useDailyActivitySeries = (range = '30d') =>
  useQuery({
    queryKey: ['engagement', 'activity', 'daily', range],
    queryFn: () => service.getDailyActivity(range),
  });
