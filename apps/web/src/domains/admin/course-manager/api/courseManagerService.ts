import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api';
import {
  AdminCourse,
  CourseCategory,
  CourseCategoryPayload,
  CourseResource,
  CourseReview,
  AdminCourseDetail,
  CourseListQuery
} from '../types';

const toQueryString = (query: CourseListQuery) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export const listAdminCourses = async (query: CourseListQuery = {}): Promise<{ items: AdminCourse[]; meta?: any }> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<AdminCourse[]>>(`/admin/courses${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};

export const getAdminCourseDetail = async (id: string): Promise<AdminCourseDetail> => {
  const response = await apiClient.get<ApiResponse<AdminCourseDetail>>(`/admin/courses/${id}`);
  return response.data.data;
};

export const createAdminCourse = async (payload: Partial<AdminCourse>): Promise<AdminCourse> => {
  const response = await apiClient.post<ApiResponse<AdminCourse>>('/admin/courses', payload);
  return response.data.data;
};

export const updateAdminCourse = async (id: string, payload: Partial<AdminCourse>): Promise<AdminCourse> => {
  const response = await apiClient.put<ApiResponse<AdminCourse>>(`/admin/courses/${id}`, payload);
  return response.data.data;
};

export const deleteAdminCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/courses/${id}`);
};

// Course Categories
export const listCourseCategories = async (): Promise<CourseCategory[]> => {
  const response = await apiClient.get<ApiResponse<CourseCategory[]>>('/admin/categories');
  return response.data.data;
};

export const createCourseCategory = async (payload: CourseCategoryPayload): Promise<CourseCategory> => {
  const response = await apiClient.post<ApiResponse<CourseCategory>>('/admin/categories', payload);
  return response.data.data;
};

export const updateCourseCategory = async (id: string, payload: CourseCategoryPayload): Promise<CourseCategory> => {
  const response = await apiClient.put<ApiResponse<CourseCategory>>(`/admin/categories/${id}`, payload);
  return response.data.data;
};

export const deleteCourseCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/categories/${id}`);
};

// Course Resources
export const listCourseResources = async (courseId: string): Promise<CourseResource[]> => {
  const response = await apiClient.get<ApiResponse<CourseResource[]>>(`/admin/courses/${courseId}/resources`);
  return response.data.data;
};

export const createCourseResource = async (
  courseId: string,
  payload: { name: string; storage_key: string; mime_type?: string; size_bytes?: number }
): Promise<CourseResource> => {
  const response = await apiClient.post<ApiResponse<CourseResource>>(`/admin/courses/${courseId}/resources`, payload);
  return response.data.data;
};

export const deleteCourseResource = async (resourceId: string): Promise<void> => {
  await apiClient.delete(`/admin/courses/resources/${resourceId}`);
};

// Course Reviews
export const listCourseReviews = async (courseId: string): Promise<CourseReview[]> => {
  const response = await apiClient.get<ApiResponse<CourseReview[]>>(`/admin/courses/${courseId}/reviews`);
  return response.data.data;
};

export const createCourseReview = async (
  courseId: string,
  payload: { rating: number; comment?: string }
): Promise<CourseReview> => {
  const response = await apiClient.post<ApiResponse<CourseReview>>(`/admin/courses/${courseId}/reviews`, payload);
  return response.data.data;
};
