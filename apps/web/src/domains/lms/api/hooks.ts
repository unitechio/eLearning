import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminLmsEnrollment,
  deleteAdminLmsEnrollment,
  getAdminLmsDashboard,
  getMyLmsDashboard,
  updateAdminLmsDashboard,
  updateAdminLmsEnrollment,
  type UpsertLmsDashboardPayload,
  type UpsertLmsEnrollmentPayload,
} from './service';

export function useMyLmsDashboard() {
  return useQuery({
    queryKey: ['lms', 'dashboard', 'me'],
    queryFn: getMyLmsDashboard,
  });
}

export function useAdminLmsDashboard(userId?: string) {
  return useQuery({
    queryKey: ['admin', 'lms', 'dashboard', userId],
    queryFn: () => getAdminLmsDashboard(userId as string),
    enabled: Boolean(userId),
  });
}

export function useUpdateAdminLmsDashboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpsertLmsDashboardPayload }) => updateAdminLmsDashboard(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lms', 'dashboard', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'dashboard', 'me'] });
    },
  });
}

export function useCreateAdminLmsEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpsertLmsEnrollmentPayload }) => createAdminLmsEnrollment(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lms', 'dashboard', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'dashboard', 'me'] });
    },
  });
}

export function useUpdateAdminLmsEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpsertLmsEnrollmentPayload }) => updateAdminLmsEnrollment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lms', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'dashboard', 'me'] });
    },
  });
}

export function useDeleteAdminLmsEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminLmsEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'lms', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'dashboard', 'me'] });
    },
  });
}
