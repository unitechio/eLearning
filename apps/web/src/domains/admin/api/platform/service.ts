import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api.types';

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
