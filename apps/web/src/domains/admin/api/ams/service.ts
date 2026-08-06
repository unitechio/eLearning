import { amsClient } from './client';
import { toQueryString } from '../utils';
import type {
  AmsUser, AmsRole, AmsPermission, AmsPermissionLine, AmsMenu,
  AmsAuthClient, AmsSSOProvider, AmsLoginChannel, AmsSecurityPolicy,
  AmsReferenceOption, AmsAuditLog, AmsAuthHistoryItem, AmsDevice,
  AmsListResponse, AmsListQuery, AmsDashboardStats,
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

const qs = (query: AmsListQuery) => {
  const str = toQueryString(query as Record<string, unknown>);
  return str ? `?${str}` : '';
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const listAmsUsers = (query: AmsListQuery = {}): Promise<AmsListResponse<AmsUser>> =>
  amsClient.get<AmsListResponse<AmsUser>>(`/users${qs(query)}`).then((r) => r.data);

export const getAmsUser = (id: number): Promise<AmsUser> =>
  amsClient.get<AmsUser>(`/users/${id}`).then((r) => r.data);

export const createAmsUser = (payload: CreateAmsUserPayload): Promise<AmsUser> =>
  amsClient.post<AmsUser>('/users', payload).then((r) => r.data);

export const updateAmsUser = (id: number, payload: UpdateAmsUserPayload): Promise<AmsUser> =>
  amsClient.put<AmsUser>(`/users/${id}`, payload).then((r) => r.data);

export const deleteAmsUser = (id: number): Promise<void> =>
  amsClient.delete(`/users/${id}`).then(() => undefined);

export const resetAmsUserPassword = (id: number, password: string): Promise<void> =>
  amsClient.post(`/users/${id}/reset-password`, { password }).then(() => undefined);

// ─── Roles ────────────────────────────────────────────────────────────────────

export const listAmsRoles = (query: AmsListQuery = {}): Promise<AmsListResponse<AmsRole>> =>
  amsClient.get<AmsListResponse<AmsRole>>(`/roles${qs(query)}`).then((r) => r.data);

export const getAmsRole = (id: number): Promise<AmsRole> =>
  amsClient.get<AmsRole>(`/roles/${id}`).then((r) => r.data);

export const createAmsRole = (payload: CreateAmsRolePayload): Promise<AmsRole> =>
  amsClient.post<AmsRole>('/roles', payload).then((r) => r.data);

export const updateAmsRole = (id: number, payload: UpdateAmsRolePayload): Promise<AmsRole> =>
  amsClient.put<AmsRole>(`/roles/${id}`, payload).then((r) => r.data);

export const deleteAmsRole = (id: number): Promise<void> =>
  amsClient.delete(`/roles/${id}`).then(() => undefined);

export const assignAmsRolePermissions = (
  roleId: number,
  payload: AssignRolePermissionsPayload,
): Promise<void> =>
  amsClient.put(`/roles/${roleId}/permissions`, payload).then(() => undefined);

// ─── Permissions ──────────────────────────────────────────────────────────────

export const listAmsPermissions = (query: AmsListQuery = {}): Promise<AmsPermission[]> =>
  amsClient.get<AmsPermission[]>(`/permissions${qs(query)}`).then((r) => r.data);

export const createAmsPermission = (payload: CreateAmsPermissionPayload): Promise<AmsPermission> =>
  amsClient.post<AmsPermission>('/permissions', payload).then((r) => r.data);

export const addAmsPermissionLine = (
  code: string,
  payload: AddPermissionLinePayload,
): Promise<AmsPermissionLine> =>
  amsClient.post<AmsPermissionLine>(`/permissions/${code}/lines`, payload).then((r) => r.data);

export const deleteAmsPermissionLine = (code: string, lineId: number): Promise<void> =>
  amsClient.delete(`/permissions/${code}/lines/${lineId}`).then(() => undefined);

// ─── Menus ────────────────────────────────────────────────────────────────────

export const listAmsMenus = (query: AmsListQuery = {}): Promise<AmsMenu[]> =>
  amsClient.get<AmsMenu[]>(`/menus${qs(query)}`).then((r) => r.data);

export const getMyAmsMenus = (): Promise<AmsMenu[]> =>
  amsClient.get<AmsMenu[]>('/my-menus').then((r) => r.data);

export const createAmsMenu = (payload: CreateAmsMenuPayload): Promise<AmsMenu> =>
  amsClient.post<AmsMenu>('/menus', payload).then((r) => r.data);

export const updateAmsMenu = (id: number, payload: UpdateAmsMenuPayload): Promise<AmsMenu> =>
  amsClient.put<AmsMenu>(`/menus/${id}`, payload).then((r) => r.data);

export const deleteAmsMenu = (id: number): Promise<void> =>
  amsClient.delete(`/menus/${id}`).then(() => undefined);

// ─── Auth Clients ─────────────────────────────────────────────────────────────

export const listAmsAuthClients = (query: AmsListQuery = {}): Promise<AmsListResponse<AmsAuthClient>> =>
  amsClient.get<AmsListResponse<AmsAuthClient>>(`/auth-clients${qs(query)}`).then((r) => r.data);

export const getAmsAuthClient = (id: number): Promise<AmsAuthClient> =>
  amsClient.get<AmsAuthClient>(`/auth-clients/${id}`).then((r) => r.data);

export const createAmsAuthClient = (payload: CreateAmsAuthClientPayload): Promise<AmsAuthClient> =>
  amsClient.post<AmsAuthClient>('/auth-clients', payload).then((r) => r.data);

export const updateAmsAuthClient = (
  id: number,
  payload: UpdateAmsAuthClientPayload,
): Promise<AmsAuthClient> =>
  amsClient.put<AmsAuthClient>(`/auth-clients/${id}`, payload).then((r) => r.data);

export const deleteAmsAuthClient = (id: number): Promise<void> =>
  amsClient.delete(`/auth-clients/${id}`).then(() => undefined);

export const rotateAmsClientSecret = (id: number): Promise<{ client_secret: string }> =>
  amsClient.post<{ client_secret: string }>(`/auth-clients/${id}/rotate-secret`).then((r) => r.data);

// ─── SSO Providers ────────────────────────────────────────────────────────────

export const listAmsSSOProviders = (query: AmsListQuery = {}): Promise<AmsSSOProvider[]> =>
  amsClient.get<AmsSSOProvider[]>(`/sso-providers${qs(query)}`).then((r) => r.data);

export const getAmsSSOProvider = (id: number): Promise<AmsSSOProvider> =>
  amsClient.get<AmsSSOProvider>(`/sso-providers/${id}`).then((r) => r.data);

export const createAmsSSOProvider = (payload: CreateAmsSSOProviderPayload): Promise<AmsSSOProvider> =>
  amsClient.post<AmsSSOProvider>('/sso-providers', payload).then((r) => r.data);

export const updateAmsSSOProvider = (
  id: number,
  payload: UpdateAmsSSOProviderPayload,
): Promise<AmsSSOProvider> =>
  amsClient.put<AmsSSOProvider>(`/sso-providers/${id}`, payload).then((r) => r.data);

export const deleteAmsSSOProvider = (id: number): Promise<void> =>
  amsClient.delete(`/sso-providers/${id}`).then(() => undefined);

// ─── Login Channels ───────────────────────────────────────────────────────────

export const listAmsLoginChannels = (query: AmsListQuery = {}): Promise<AmsLoginChannel[]> =>
  amsClient.get<AmsLoginChannel[]>(`/login-channels${qs(query)}`).then((r) => r.data);

export const getAmsLoginChannel = (id: number): Promise<AmsLoginChannel> =>
  amsClient.get<AmsLoginChannel>(`/login-channels/${id}`).then((r) => r.data);

export const createAmsLoginChannel = (payload: CreateAmsLoginChannelPayload): Promise<AmsLoginChannel> =>
  amsClient.post<AmsLoginChannel>('/login-channels', payload).then((r) => r.data);

export const updateAmsLoginChannel = (
  id: number,
  payload: UpdateAmsLoginChannelPayload,
): Promise<AmsLoginChannel> =>
  amsClient.put<AmsLoginChannel>(`/login-channels/${id}`, payload).then((r) => r.data);

export const deleteAmsLoginChannel = (id: number): Promise<void> =>
  amsClient.delete(`/login-channels/${id}`).then(() => undefined);

// ─── Security Policies ────────────────────────────────────────────────────────

export const listAmsSecurityPolicies = (
  query: AmsListQuery = {},
): Promise<AmsListResponse<AmsSecurityPolicy>> =>
  amsClient.get<AmsListResponse<AmsSecurityPolicy>>(`/security-policies${qs(query)}`).then((r) => r.data);

export const getAmsSecurityPolicy = (id: number): Promise<AmsSecurityPolicy> =>
  amsClient.get<AmsSecurityPolicy>(`/security-policies/${id}`).then((r) => r.data);

export const createAmsSecurityPolicy = (
  payload: CreateAmsSecurityPolicyPayload,
): Promise<AmsSecurityPolicy> =>
  amsClient.post<AmsSecurityPolicy>('/security-policies', payload).then((r) => r.data);

export const updateAmsSecurityPolicy = (
  id: number,
  payload: UpdateAmsSecurityPolicyPayload,
): Promise<AmsSecurityPolicy> =>
  amsClient.put<AmsSecurityPolicy>(`/security-policies/${id}`, payload).then((r) => r.data);

export const deleteAmsSecurityPolicy = (id: number): Promise<void> =>
  amsClient.delete(`/security-policies/${id}`).then(() => undefined);

// ─── Reference Options ────────────────────────────────────────────────────────

export const listAmsReferenceOptions = (
  query: AmsListQuery = {},
): Promise<AmsListResponse<AmsReferenceOption>> =>
  amsClient.get<AmsListResponse<AmsReferenceOption>>(`/reference-options${qs(query)}`).then((r) => r.data);

export const createAmsReferenceOption = (
  payload: CreateAmsReferenceOptionPayload,
): Promise<AmsReferenceOption> =>
  amsClient.post<AmsReferenceOption>('/reference-options', payload).then((r) => r.data);

export const updateAmsReferenceOption = (
  id: number,
  payload: UpdateAmsReferenceOptionPayload,
): Promise<AmsReferenceOption> =>
  amsClient.put<AmsReferenceOption>(`/reference-options/${id}`, payload).then((r) => r.data);

export const deleteAmsReferenceOption = (id: number): Promise<void> =>
  amsClient.delete(`/reference-options/${id}`).then(() => undefined);

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const listAmsAuditLogs = (
  query: AmsListQuery = {},
): Promise<AmsListResponse<AmsAuditLog>> =>
  amsClient.get<AmsListResponse<AmsAuditLog>>(`/logs/audit${qs(query)}`).then((r) => r.data);

// ─── Auth History ─────────────────────────────────────────────────────────────

export const listAmsAuthHistory = (
  query: AmsListQuery = {},
): Promise<AmsListResponse<AmsAuthHistoryItem>> =>
  amsClient.get<AmsListResponse<AmsAuthHistoryItem>>(`/logs/auth${qs(query)}`).then((r) => r.data);

// ─── Devices ──────────────────────────────────────────────────────────────────

export const listAmsDevices = (query: AmsListQuery = {}): Promise<AmsListResponse<AmsDevice>> =>
  amsClient.get<AmsListResponse<AmsDevice>>(`/devices${qs(query)}`).then((r) => r.data);

export const revokeAmsDevice = (id: number): Promise<void> =>
  amsClient.delete(`/devices/${id}`).then(() => undefined);

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getAmsDashboardStats = (): Promise<AmsDashboardStats> =>
  amsClient.get<AmsDashboardStats>('/dashboard/stats').then((r) => r.data);
