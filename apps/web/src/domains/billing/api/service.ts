import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api.types';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
}

export interface BillingHistoryItem {
  id: string;
  plan_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface BillingSubscriptionResult {
  subscription_id: string;
  plan_id: string;
  status: string;
  expires_at: string;
}

export interface CheckoutPaymentResponse {
  invoice_id: string;
  invoice_no: string;
  transaction_id: string;
  provider: string;
  checkout_url: string;
  amount: number;
  currency: string;
  status: string;
}

export const listBillingPlans = async (): Promise<BillingPlan[]> => {
  const response = await apiClient.get<ApiResponse<BillingPlan[]>>('/billing/plans?page=1&page_size=20');
  return response.data.data;
};

export const subscribePlan = async (planId: string): Promise<BillingSubscriptionResult> => {
  const response = await apiClient.post<ApiResponse<BillingSubscriptionResult>>('/billing/subscribe', { plan_id: planId });
  return response.data.data;
};

export const listBillingHistory = async (): Promise<{ items: BillingHistoryItem[]; meta?: ApiResponse<BillingHistoryItem[]>['meta'] }> => {
  const response = await apiClient.get<ApiResponse<BillingHistoryItem[]>>('/billing/history?page=1&page_size=20');
  return { items: response.data.data, meta: response.data.meta };
};

export const createSandboxCheckout = async (planId: string): Promise<CheckoutPaymentResponse> => {
  const response = await apiClient.post<ApiResponse<CheckoutPaymentResponse>>('/billing/payments/checkout', {
    plan_id: planId,
    provider: 'sandbox',
  });
  return response.data.data;
};

export const confirmSandboxPayment = async (
  transactionId: string,
  status: 'paid' | 'failed' | 'cancelled' = 'paid'
): Promise<CheckoutPaymentResponse> => {
  const response = await apiClient.post<ApiResponse<CheckoutPaymentResponse>>(
    `/billing/payments/${transactionId}/sandbox-confirm`,
    { status }
  );
  return response.data.data;
};
