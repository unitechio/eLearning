import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as billingService from './service';

export const useAdminBillingPlans = () =>
  useQuery({
    queryKey: ['admin', 'billing', 'plans'],
    queryFn: billingService.listAdminBillingPlans,
  });

export const useCreateAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingService.createAdminBillingPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useUpdateAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: billingService.UpdateAdminBillingPlanPayload }) => billingService.updateAdminBillingPlan(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useDeleteAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingService.deleteAdminBillingPlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useAdminBillingSubscriptions = () =>
  useQuery({
    queryKey: ['admin', 'billing', 'subscriptions'],
    queryFn: billingService.listAdminBillingSubscriptions,
  });

export const useAdminBillingInvoices = (query: billingService.AdminUserQuery = { page: 1, page_size: 50 }) =>
  useQuery({
    queryKey: ['admin', 'billing', 'invoices', query],
    queryFn: () => billingService.listAdminBillingInvoices(query),
  });

export const useAdminPaymentTransactions = (query: billingService.AdminUserQuery = { page: 1, page_size: 50 }) =>
  useQuery({
    queryKey: ['admin', 'billing', 'payments', query],
    queryFn: () => billingService.listAdminPaymentTransactions(query),
  });

export const useUpdateAdminBillingSubscriptionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: billingService.UpdateSubscriptionStatusPayload }) => billingService.updateAdminBillingSubscriptionStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
    },
  });
};

export const useCancelAdminBillingSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingService.cancelAdminBillingSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
    },
  });
};

export const useGrantPremiumSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billingService.grantPremiumSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
    },
  });
};
