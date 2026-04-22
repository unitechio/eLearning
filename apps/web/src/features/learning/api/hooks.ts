import { useQuery } from '@tanstack/react-query';
import * as learningService from './service';

export const useDailyPlan = () => {
  return useQuery({
    queryKey: ['dailyPlan'],
    queryFn: learningService.getDailyPlan,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLearningStats = () => {
  return useQuery({
    queryKey: ['learningStats'],
    queryFn: learningService.getLearningStats,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
