import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  listAdminCourses,
  getAdminCourseDetail,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  listCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  listCourseResources,
  createCourseResource,
  deleteCourseResource,
  listCourseReviews,
  createCourseReview
} from './courseManagerService';
import { CourseListQuery, CourseCategoryPayload, AdminCourse } from '../types';

export const useAdminCourses = (query: CourseListQuery) => {
  return useQuery({
    queryKey: ['admin', 'courses', query],
    queryFn: () => listAdminCourses(query),
    placeholderData: (prev) => prev
  });
};

export const useAdminCourseDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['admin', 'course-detail', id],
    queryFn: () => getAdminCourseDetail(id),
    enabled: !!id && enabled
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      toast.success('Course created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create course');
    }
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminCourse> }) =>
      updateAdminCourse(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-detail', data.id] });
      toast.success('Course updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update course');
    }
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete course');
    }
  });
};

// Categories
export const useCourseCategories = () => {
  return useQuery({
    queryKey: ['admin', 'course-categories'],
    queryFn: listCourseCategories
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-categories'] });
      toast.success('Category created successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create category');
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CourseCategoryPayload }) =>
      updateCourseCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-categories'] });
      toast.success('Category updated successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update category');
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  });
};

// Resources
export const useCourseResources = (courseId: string) => {
  return useQuery({
    queryKey: ['admin', 'course-resources', courseId],
    queryFn: () => listCourseResources(courseId),
    enabled: !!courseId
  });
};

export const useCreateResource = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; storage_key: string; mime_type?: string; size_bytes?: number }) =>
      createCourseResource(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-resources', courseId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-detail', courseId] });
      toast.success('Resource added successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add resource');
    }
  });
};

export const useDeleteResource = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourseResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-resources', courseId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-detail', courseId] });
      toast.success('Resource deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to delete resource');
    }
  });
};

// Reviews
export const useCourseReviews = (courseId: string) => {
  return useQuery({
    queryKey: ['admin', 'course-reviews', courseId],
    queryFn: () => listCourseReviews(courseId),
    enabled: !!courseId
  });
};

export const useCreateReview = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; comment?: string }) =>
      createCourseReview(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-reviews', courseId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-detail', courseId] });
      toast.success('Review added successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add review');
    }
  });
};
