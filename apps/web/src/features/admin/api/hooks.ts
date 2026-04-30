import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminService from './service';

export const useAdminUsers = (query: adminService.AdminUserQuery) =>
  useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => adminService.listAdminUsers(query),
  });

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateAdminUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminRoles = () =>
  useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: adminService.listAdminRoles,
  });

export const useAdminPermissions = () =>
  useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminService.listAdminPermissions,
  });

export const usePlatformEnvironments = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'environments'],
    queryFn: adminService.listPlatformEnvironments,
  });

export const useFeatureFlags = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'feature-flags'],
    queryFn: adminService.listFeatureFlags,
  });

export const useSystemSettings = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'system-settings'],
    queryFn: adminService.listSystemSettings,
  });

export const useAuditLogs = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'audit-logs'],
    queryFn: adminService.listAuditLogs,
  });

export const useEmailLogs = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'email-logs'],
    queryFn: adminService.listEmailLogs,
  });

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createEnvironment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useUpdateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: adminService.EnvironmentPayload }) => adminService.updateEnvironment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useDeleteEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteEnvironment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useCreateFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createFeatureFlag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useUpdateFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateFeatureFlag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useDeleteFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteFeatureFlag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useCreateSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createSystemSetting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: adminService.SystemSettingPayload }) => adminService.updateSystemSetting(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useDeleteSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteSystemSetting(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useCleanupAuditLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retentionDays: number) => adminService.cleanupAuditLogs(retentionDays),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'audit-logs'] }),
  });
};

export const useSendPlatformEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.sendPlatformEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'email-logs'] }),
  });
};

export const useAdminBillingPlans = () =>
  useQuery({
    queryKey: ['admin', 'billing', 'plans'],
    queryFn: adminService.listAdminBillingPlans,
  });

export const useCreateAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createAdminBillingPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useUpdateAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: adminService.UpdateAdminBillingPlanPayload }) => adminService.updateAdminBillingPlan(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useDeleteAdminBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteAdminBillingPlan(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'plans'] }),
  });
};

export const useAdminBillingSubscriptions = () =>
  useQuery({
    queryKey: ['admin', 'billing', 'subscriptions'],
    queryFn: adminService.listAdminBillingSubscriptions,
  });

export const useUpdateAdminBillingSubscriptionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: adminService.UpdateSubscriptionStatusPayload }) => adminService.updateAdminBillingSubscriptionStatus(id, payload),
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
    mutationFn: (id: string) => adminService.cancelAdminBillingSubscription(id),
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
    mutationFn: adminService.grantPremiumSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'billing', 'subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'access-profile'] });
      queryClient.invalidateQueries({ queryKey: ['billing', 'history'] });
    },
  });
};
