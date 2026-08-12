import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  category: string;
  created_at: string;
  link?: string;
}

export interface NotificationListQuery {
  page?: number;
  page_size?: number;
  q?: string;
  category?: string;
  read?: boolean;
}

// API functions
export const fetchNotifications = async (query: NotificationListQuery = {}): Promise<{ items: NotificationItem[]; meta?: any }> => {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.page_size) params.set('page_size', String(query.page_size));
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (query.read !== undefined) params.set('read', String(query.read));

  const qs = params.toString();
  const response = await apiClient.get<ApiResponse<NotificationItem[]>>(`/notifications${qs ? `?${qs}` : ''}`);
  return { items: response.data.data || [], meta: response.data.meta };
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.put<ApiResponse<any>>(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.put<ApiResponse<any>>(`/notifications/read-all`);
};

// React Query hooks
export const useNotifications = (query: NotificationListQuery) => {
  return useQuery({
    queryKey: ['notifications', query],
    queryFn: () => fetchNotifications(query),
    placeholderData: (prev) => prev,
    refetchInterval: 15000, // Poll notifications every 15s to keep dashboard live
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to mark notification as read');
    }
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to mark all as read');
    }
  });
};
