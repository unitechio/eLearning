import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as platformService from './service';

export const usePlatformEnvironments = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'environments'],
    queryFn: platformService.listPlatformEnvironments,
  });

export const useFeatureFlags = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'feature-flags'],
    queryFn: platformService.listFeatureFlags,
  });

export const useSystemSettings = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'system-settings'],
    queryFn: platformService.listSystemSettings,
  });

export const useAuditLogs = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'audit-logs'],
    queryFn: platformService.listAuditLogs,
  });

export const useEmailLogs = () =>
  useQuery({
    queryKey: ['admin', 'platform', 'email-logs'],
    queryFn: platformService.listEmailLogs,
  });

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformService.createEnvironment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useUpdateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: platformService.EnvironmentPayload }) => platformService.updateEnvironment(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useDeleteEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => platformService.deleteEnvironment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'environments'] }),
  });
};

export const useCreateFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformService.createFeatureFlag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useUpdateFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformService.updateFeatureFlag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useDeleteFeatureFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => platformService.deleteFeatureFlag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'feature-flags'] }),
  });
};

export const useCreateSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformService.createSystemSetting,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: platformService.SystemSettingPayload }) => platformService.updateSystemSetting(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useDeleteSystemSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => platformService.deleteSystemSetting(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'system-settings'] }),
  });
};

export const useCleanupAuditLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retentionDays: number) => platformService.cleanupAuditLogs(retentionDays),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'audit-logs'] }),
  });
};

export const useSendPlatformEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: platformService.sendPlatformEmail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'platform', 'email-logs'] }),
  });
};
