import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api';
import { toQueryString } from '../utils';

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

export interface AdminBillingInvoice {
  id: string;
  user_id: string;
  plan_id: string;
  invoice_no: string;
  amount: number;
  currency: string;
  status: string;
  due_at?: string;
  paid_at?: string;
  description: string;
  created_at: string;
}

export interface AdminPaymentTransaction {
  id: string;
  user_id: string;
  invoice_id: string;
  plan_id: string;
  provider: string;
  provider_reference: string;
  amount: number;
  currency: string;
  status: string;
  checkout_url: string;
  paid_at?: string;
  failure_reason: string;
  created_at: string;
}

export type { AdminUserQuery } from '../users';
import type { AdminUserQuery } from '../users';
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

export const listAdminBillingInvoices = async (
  query: AdminUserQuery = { page: 1, page_size: 50 }
): Promise<{ items: AdminBillingInvoice[]; meta?: ApiResponse<AdminBillingInvoice[]>['meta'] }> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<AdminBillingInvoice[]>>(`/admin/billing/invoices${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};

export const listAdminPaymentTransactions = async (
  query: AdminUserQuery = { page: 1, page_size: 50 }
): Promise<{ items: AdminPaymentTransaction[]; meta?: ApiResponse<AdminPaymentTransaction[]>['meta'] }> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<AdminPaymentTransaction[]>>(`/admin/billing/payments${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};
