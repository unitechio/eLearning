import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';

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

export interface PlatformEnvironment {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  type?: string;
  url?: string;
  color?: string;
  is_active?: boolean;
  sort_order?: number;
}

export interface FeatureFlag {
  id: number;
  name: string;
  key: string;
  description?: string;
  category?: string;
  enabled: boolean;
  required_tier?: string;
}

export interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type?: string;
  category?: string;
  description?: string;
  is_public?: boolean;
  is_editable?: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  description?: string;
  method?: string;
  path?: string;
  ip_address?: string;
  created_at: string;
}

export interface EmailLog {
  id: number;
  to: string;
  from: string;
  subject: string;
  status: string;
  created_at?: string;
  sent_at?: string;
}

export interface AdminBillingPlan {
  id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  description: string;
  billing_cycle: string;
  is_active: boolean;
}

export interface AdminBillingSubscription {
  id: string;
  user_id: string;
  user_email: string;
  plan_id: string;
  plan_name: string;
  status: string;
  started_at: string;
  expires_at?: string;
  cancelled_at?: string;
  is_premium: boolean;
}

export interface AdminUserQuery {
  page?: number;
  page_size?: number;
  q?: string;
  status?: string;
}

export interface EnvironmentPayload {
  name: string;
  slug?: string;
  description?: string;
  type?: string;
  url?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface FeatureFlagPayload {
  id?: number;
  name: string;
  key: string;
  description?: string;
  category?: string;
  enabled: boolean;
  required_tier?: string;
}

export interface SystemSettingPayload {
  key: string;
  value: string;
  type: string;
  category?: string;
  description?: string;
  is_public?: boolean;
  is_editable?: boolean;
}

export interface SendEmailPayload {
  to: string[];
  subject: string;
  body?: string;
  html_body?: string;
}

export interface CreateAdminBillingPlanPayload {
  name: string;
  code: string;
  price: number;
  currency?: string;
  description?: string;
  billing_cycle?: string;
  is_active?: boolean;
}

export interface UpdateAdminBillingPlanPayload extends CreateAdminBillingPlanPayload {}

export interface UpdateSubscriptionStatusPayload {
  status: string;
}

export interface GrantPremiumPayload {
  user_id: string;
  plan_id: string;
}

const toQueryString = (query: AdminUserQuery) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

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

export const listPlatformEnvironments = async (): Promise<PlatformEnvironment[]> => {
  const response = await apiClient.get<ApiResponse<PlatformEnvironment[]>>('/platform/environments?page=1&page_size=100');
  return response.data.data;
};

export const listFeatureFlags = async (): Promise<FeatureFlag[]> => {
  const response = await apiClient.get<ApiResponse<FeatureFlag[]>>('/platform/feature-flags');
  return response.data.data;
};

export const listSystemSettings = async (): Promise<SystemSetting[]> => {
  const response = await apiClient.get<ApiResponse<SystemSetting[]>>('/platform/system-settings');
  return response.data.data;
};

export const listAuditLogs = async (): Promise<{ items: AuditLog[]; meta?: ApiResponse<AuditLog[]>['meta'] }> => {
  const response = await apiClient.get<ApiResponse<AuditLog[]>>('/platform/audit/logs?page=1&page_size=50');
  return { items: response.data.data, meta: response.data.meta };
};

export const listEmailLogs = async (): Promise<{ items: EmailLog[]; meta?: ApiResponse<EmailLog[]>['meta'] }> => {
  const response = await apiClient.get<ApiResponse<EmailLog[]>>('/platform/emails/logs?page=1&page_size=50');
  return { items: response.data.data, meta: response.data.meta };
};

export const createEnvironment = async (payload: EnvironmentPayload): Promise<PlatformEnvironment> => {
  const response = await apiClient.post<ApiResponse<PlatformEnvironment>>('/platform/environments', payload);
  return response.data.data;
};

export const updateEnvironment = async (id: number, payload: EnvironmentPayload): Promise<PlatformEnvironment> => {
  const response = await apiClient.put<ApiResponse<PlatformEnvironment>>(`/platform/environments/${id}`, payload);
  return response.data.data;
};

export const deleteEnvironment = async (id: number): Promise<void> => {
  await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/platform/environments/${id}`);
};

export const createFeatureFlag = async (payload: FeatureFlagPayload): Promise<FeatureFlag> => {
  const response = await apiClient.post<ApiResponse<FeatureFlag>>('/platform/feature-flags', payload);
  return response.data.data;
};

export const updateFeatureFlag = async (payload: FeatureFlagPayload): Promise<FeatureFlag> => {
  const response = await apiClient.put<ApiResponse<FeatureFlag>>('/platform/feature-flags', payload);
  return response.data.data;
};

export const deleteFeatureFlag = async (id: number): Promise<void> => {
  await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/platform/feature-flags/${id}`);
};

export const createSystemSetting = async (payload: SystemSettingPayload): Promise<SystemSetting> => {
  const response = await apiClient.post<ApiResponse<SystemSetting>>('/platform/system-settings', payload);
  return response.data.data;
};

export const updateSystemSetting = async (id: number, payload: SystemSettingPayload): Promise<SystemSetting> => {
  const response = await apiClient.put<ApiResponse<SystemSetting>>(`/platform/system-settings/${id}`, payload);
  return response.data.data;
};

export const deleteSystemSetting = async (id: number): Promise<void> => {
  await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/platform/system-settings/${id}`);
};

export const cleanupAuditLogs = async (retentionDays: number): Promise<void> => {
  await apiClient.post<ApiResponse<{ retention_days: number }>>(`/platform/audit/cleanup?retention_days=${retentionDays}`);
};

export const sendPlatformEmail = async (payload: SendEmailPayload): Promise<void> => {
  await apiClient.post<ApiResponse<{ to: string[] }>>('/platform/emails/send', payload);
};

export const listAdminBillingPlans = async (): Promise<AdminBillingPlan[]> => {
  const response = await apiClient.get<ApiResponse<AdminBillingPlan[]>>('/admin/billing/plans?page=1&page_size=100');
  return response.data.data;
};

export const createAdminBillingPlan = async (payload: CreateAdminBillingPlanPayload): Promise<AdminBillingPlan> => {
  const response = await apiClient.post<ApiResponse<AdminBillingPlan>>('/admin/billing/plans', payload);
  return response.data.data;
};

export const updateAdminBillingPlan = async (id: string, payload: UpdateAdminBillingPlanPayload): Promise<AdminBillingPlan> => {
  const response = await apiClient.put<ApiResponse<AdminBillingPlan>>(`/admin/billing/plans/${id}`, payload);
  return response.data.data;
};

export const deleteAdminBillingPlan = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/billing/plans/${id}`);
};

export const listAdminBillingSubscriptions = async (): Promise<{ items: AdminBillingSubscription[]; meta?: ApiResponse<AdminBillingSubscription[]>['meta'] }> => {
  const response = await apiClient.get<ApiResponse<AdminBillingSubscription[]>>('/admin/billing/subscriptions?page=1&page_size=100');
  return { items: response.data.data, meta: response.data.meta };
};

export const updateAdminBillingSubscriptionStatus = async (id: string, payload: UpdateSubscriptionStatusPayload): Promise<AdminBillingSubscription> => {
  const response = await apiClient.put<ApiResponse<AdminBillingSubscription>>(`/admin/billing/subscriptions/${id}/status`, payload);
  return response.data.data;
};

export const cancelAdminBillingSubscription = async (id: string): Promise<AdminBillingSubscription> => {
  const response = await apiClient.post<ApiResponse<AdminBillingSubscription>>(`/admin/billing/subscriptions/${id}/cancel`);
  return response.data.data;
};

export const grantPremiumSubscription = async (payload: GrantPremiumPayload): Promise<AdminBillingSubscription> => {
  const response = await apiClient.post<ApiResponse<AdminBillingSubscription>>('/admin/billing/subscriptions/grant-premium', payload);
  return response.data.data;
};
