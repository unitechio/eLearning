import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api.types';
import { toQueryString } from '../utils';

export interface AdminUser {
  id: string;
  email: string;
  status: string;
  roles?: string[];
}

export interface AdminRole {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  permissions?: Array<{ id: number; resource: string; action: string }>;
}

export interface AdminPermission {
  id: number;
  resource: string;
  action: string;
  module?: string;
  department?: string;
  service?: string;
  description?: string;
}

export interface AdminUsersResult {
  items: AdminUser[];
  meta?: ApiResponse<AdminUser[]>['meta'];
}

export interface AdminUserQuery {
  page?: number;
  page_size?: number;
  q?: string;
  status?: string;
  user_id?: string;
}

export const listAdminUsers = async (query: AdminUserQuery = {}): Promise<AdminUsersResult> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<AdminUser[]>>(`/admin/users${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};

export const updateAdminUserStatus = async (id: string, status: string): Promise<AdminUser> => {
  const response = await apiClient.put<ApiResponse<AdminUser>>(`/admin/users/${id}/status`, { status });
  return response.data.data;
};

export const listAdminRoles = async (): Promise<AdminRole[]> => {
  const response = await apiClient.get<ApiResponse<AdminRole[]>>('/admin/roles?page=1&page_size=100');
  return response.data.data;
};

export const listAdminPermissions = async (): Promise<AdminPermission[]> => {
  const response = await apiClient.get<ApiResponse<AdminPermission[]>>('/admin/permissions?page=1&page_size=200');
  return response.data.data;
};
