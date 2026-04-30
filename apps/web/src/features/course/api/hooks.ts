import { useQuery } from '@tanstack/react-query';
import { listCourses } from './service';

export const useCourses = (params: Record<string, string | number | undefined>) =>
  useQuery({
    queryKey: ['courses', params],
    queryFn: () => listCourses(params),
  });
