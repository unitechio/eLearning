import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as svc from './service';
import type {
  AmsListQuery,
  CreateAmsUserPayload, UpdateAmsUserPayload,
  CreateAmsRolePayload, UpdateAmsRolePayload, AssignRolePermissionsPayload,
  CreateAmsPermissionPayload, AddPermissionLinePayload,
  CreateAmsMenuPayload, UpdateAmsMenuPayload,
  CreateAmsAuthClientPayload, UpdateAmsAuthClientPayload,
  CreateAmsSSOProviderPayload, UpdateAmsSSOProviderPayload,
  CreateAmsLoginChannelPayload, UpdateAmsLoginChannelPayload,
  CreateAmsSecurityPolicyPayload, UpdateAmsSecurityPolicyPayload,
  CreateAmsReferenceOptionPayload, UpdateAmsReferenceOptionPayload,
} from './types';

// ─── Users ────────────────────────────────────────────────────────────────────

export const useAmsUsers = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'users', query], queryFn: () => svc.listAmsUsers(query) });

export const useAmsUser = (id: number) =>
  useQuery({ queryKey: ['ams', 'users', id], queryFn: () => svc.getAmsUser(id), enabled: id > 0 });

export const useCreateAmsUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsUserPayload) => svc.createAmsUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'users'] }),
  });
};

export const useUpdateAmsUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsUserPayload }) =>
      svc.updateAmsUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'users'] }),
  });
};

export const useDeleteAmsUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'users'] }),
  });
};

export const useResetAmsUserPassword = () =>
  useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      svc.resetAmsUserPassword(id, password),
  });

// ─── Roles ────────────────────────────────────────────────────────────────────

export const useAmsRoles = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'roles', query], queryFn: () => svc.listAmsRoles(query) });

export const useAmsRole = (id: number) =>
  useQuery({ queryKey: ['ams', 'roles', id], queryFn: () => svc.getAmsRole(id), enabled: id > 0 });

export const useCreateAmsRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsRolePayload) => svc.createAmsRole(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'roles'] }),
  });
};

export const useUpdateAmsRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsRolePayload }) =>
      svc.updateAmsRole(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'roles'] }),
  });
};

export const useDeleteAmsRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'roles'] }),
  });
};

export const useAssignRolePermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, payload }: { roleId: number; payload: AssignRolePermissionsPayload }) =>
      svc.assignAmsRolePermissions(roleId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'roles'] }),
  });
};

// ─── Permissions ──────────────────────────────────────────────────────────────

export const useAmsPermissions = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'permissions', query], queryFn: () => svc.listAmsPermissions(query) });

export const useCreateAmsPermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsPermissionPayload) => svc.createAmsPermission(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'permissions'] }),
  });
};

export const useAddPermissionLine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: AddPermissionLinePayload }) =>
      svc.addAmsPermissionLine(code, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'permissions'] }),
  });
};

export const useDeletePermissionLine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, lineId }: { code: string; lineId: number }) =>
      svc.deleteAmsPermissionLine(code, lineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'permissions'] }),
  });
};

// ─── Menus ────────────────────────────────────────────────────────────────────

export const useAmsMenus = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'menus', query], queryFn: () => svc.listAmsMenus(query) });

export const useMyAmsMenus = () =>
  useQuery({ queryKey: ['ams', 'my-menus'], queryFn: svc.getMyAmsMenus });

export const useCreateAmsMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsMenuPayload) => svc.createAmsMenu(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'menus'] }),
  });
};

export const useUpdateAmsMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsMenuPayload }) =>
      svc.updateAmsMenu(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'menus'] }),
  });
};

export const useDeleteAmsMenu = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsMenu(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'menus'] }),
  });
};

// ─── Auth Clients ─────────────────────────────────────────────────────────────

export const useAmsAuthClients = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'auth-clients', query], queryFn: () => svc.listAmsAuthClients(query) });

export const useAmsAuthClient = (id: number) =>
  useQuery({
    queryKey: ['ams', 'auth-clients', id],
    queryFn: () => svc.getAmsAuthClient(id),
    enabled: id > 0,
  });

export const useCreateAmsAuthClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsAuthClientPayload) => svc.createAmsAuthClient(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'auth-clients'] }),
  });
};

export const useUpdateAmsAuthClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsAuthClientPayload }) =>
      svc.updateAmsAuthClient(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'auth-clients'] }),
  });
};

export const useDeleteAmsAuthClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsAuthClient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'auth-clients'] }),
  });
};

export const useRotateAmsClientSecret = () =>
  useMutation({ mutationFn: (id: number) => svc.rotateAmsClientSecret(id) });

// ─── SSO Providers ────────────────────────────────────────────────────────────

export const useAmsSSOProviders = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'sso-providers', query], queryFn: () => svc.listAmsSSOProviders(query) });

export const useCreateAmsSSOProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsSSOProviderPayload) => svc.createAmsSSOProvider(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'sso-providers'] }),
  });
};

export const useUpdateAmsSSOProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsSSOProviderPayload }) =>
      svc.updateAmsSSOProvider(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'sso-providers'] }),
  });
};

export const useDeleteAmsSSOProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsSSOProvider(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'sso-providers'] }),
  });
};

// ─── Login Channels ───────────────────────────────────────────────────────────

export const useAmsLoginChannels = (query: AmsListQuery = {}) =>
  useQuery({
    queryKey: ['ams', 'login-channels', query],
    queryFn: () => svc.listAmsLoginChannels(query),
  });

export const useCreateAmsLoginChannel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsLoginChannelPayload) => svc.createAmsLoginChannel(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'login-channels'] }),
  });
};

export const useUpdateAmsLoginChannel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsLoginChannelPayload }) =>
      svc.updateAmsLoginChannel(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'login-channels'] }),
  });
};

export const useDeleteAmsLoginChannel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsLoginChannel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'login-channels'] }),
  });
};

// ─── Security Policies ────────────────────────────────────────────────────────

export const useAmsSecurityPolicies = (query: AmsListQuery = {}) =>
  useQuery({
    queryKey: ['ams', 'security-policies', query],
    queryFn: () => svc.listAmsSecurityPolicies(query),
  });

export const useCreateAmsSecurityPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsSecurityPolicyPayload) => svc.createAmsSecurityPolicy(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'security-policies'] }),
  });
};

export const useUpdateAmsSecurityPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsSecurityPolicyPayload }) =>
      svc.updateAmsSecurityPolicy(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'security-policies'] }),
  });
};

export const useDeleteAmsSecurityPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsSecurityPolicy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'security-policies'] }),
  });
};

// ─── Reference Options ────────────────────────────────────────────────────────

export const useAmsReferenceOptions = (query: AmsListQuery = {}) =>
  useQuery({
    queryKey: ['ams', 'reference-options', query],
    queryFn: () => svc.listAmsReferenceOptions(query),
  });

export const useCreateAmsReferenceOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAmsReferenceOptionPayload) => svc.createAmsReferenceOption(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'reference-options'] }),
  });
};

export const useUpdateAmsReferenceOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAmsReferenceOptionPayload }) =>
      svc.updateAmsReferenceOption(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'reference-options'] }),
  });
};

export const useDeleteAmsReferenceOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.deleteAmsReferenceOption(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ams', 'reference-options'] }),
  });
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const useAmsAuditLogs = (query: AmsListQuery = {}) =>
  useQuery({
    queryKey: ['ams', 'audit-logs', query],
    queryFn: () => svc.listAmsAuditLogs(query),
  });

// ─── Auth History ─────────────────────────────────────────────────────────────

export const useAmsAuthHistory = (query: AmsListQuery = {}) =>
  useQuery({
    queryKey: ['ams', 'auth-history', query],
    queryFn: () => svc.listAmsAuthHistory(query),
  });

// ─── Devices ──────────────────────────────────────────────────────────────────

export const useAmsDevices = (query: AmsListQuery = {}) =>
  useQuery({ queryKey: ['ams', 'devices', query], queryFn: () => svc.listAmsDevices(query) });

export const useRevokeAmsDevice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => svc.revokeAmsDevice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ams', 'devices'] });
      qc.invalidateQueries({ queryKey: ['ams', 'auth-history'] });
    },
  });
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const useAmsDashboardStats = () =>
  useQuery({ queryKey: ['ams', 'dashboard-stats'], queryFn: svc.getAmsDashboardStats });
