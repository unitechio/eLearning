import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  level: string;
  status: string;
  visibility: string;
}

export const listCourses = async (params: Record<string, string | number | undefined> = {}): Promise<CourseItem[]> => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });
  const response = await apiClient.get<ApiResponse<CourseItem[]>>(`/courses${search.size ? `?${search.toString()}` : ''}`);
  return response.data.data;
};
