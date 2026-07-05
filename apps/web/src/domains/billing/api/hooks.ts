import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { confirmSandboxPayment, createSandboxCheckout, listBillingHistory, listBillingPlans, subscribePlan } from './service';

export const useBillingPlans = () =>
  useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: listBillingPlans,
  });

export const useBillingHistory = () =>
  useQuery({
    queryKey: ['billing', 'history'],
    queryFn: listBillingHistory,
  });

export const useSubscribePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => subscribePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'plans'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useCreateSandboxCheckout = () =>
  useMutation({
    mutationFn: (planId: string) => createSandboxCheckout(planId),
  });

export const useConfirmSandboxPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => confirmSandboxPayment(transactionId, 'paid'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};
