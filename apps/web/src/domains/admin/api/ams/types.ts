// ─── AMS Entity Types ─────────────────────────────────────────────────────────

export interface AmsUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'locked';
  email_verified: boolean;
  require_otp: boolean;
  two_factor_enabled: boolean;
  allowed_clients: string[];
  allowed_channels: string[];
  last_login?: string;
  created_at: string;
  updated_at: string;
  roles?: AmsRole[];
}

export interface AmsRole {
  id: number;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  permissions?: AmsRolePermission[];
}

export interface AmsRolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  scope: 'self' | 'department' | 'organization' | 'global';
  code?: string;
}

export interface AmsPermission {
  id: number;
  code: string;
  name: string;
  description: string;
  group_name: string;
  created_at: string;
  lines?: AmsPermissionLine[];
}

export interface AmsPermissionLine {
  id: number;
  permission_id: number;
  controller: string;
  action: string;
  note: string;
}

export interface AmsMenu {
  id: number;
  title: string;
  url: string;
  sort_order: number;
  icon?: string;
  permission_code?: string;
  parent_id?: number;
  menu_type: 'main' | 'sub' | 'separator';
}

export interface AmsAuthClient {
  id: number;
  client_id: string;
  name: string;
  type: 'confidential' | 'public' | 'service';
  allowed_grants: string[];
  redirect_uris: string[];
  allowed_scopes: string[];
  allowed_origins: string[];
  pkce_required: boolean;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AmsSSOProvider {
  id: number;
  provider_id: string;
  name: string;
  type: 'oidc' | 'saml';
  client_id: string;
  client_secret?: string;
  authorize_url: string;
  token_url: string;
  user_info_url: string;
  redirect_uri: string;
  scope: string;
  saml_login_url?: string;
  enabled: boolean;
  allow_auto_provision: boolean;
  icon?: string;
  created_at: string;
  updated_at?: string;
}

export interface AmsLoginChannel {
  id: number;
  name: string;
  channel_id: string;
  type: string;
  enabled: boolean;
  mfa_required: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AmsSecurityPolicy {
  id: number;
  code: string;
  name: string;
  description: string;
  policy_type: 'auth' | 'step-up' | 'rate-limit';
  scope_type: 'global' | 'client' | 'channel';
  target_client?: string;
  target_channel?: string;
  priority: number;
  active: boolean;
  config_json: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface AmsReferenceOption {
  id: number;
  code: string;
  label: string;
  group: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AmsAuditLog {
  id: number;
  user_id?: number;
  username: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address: string;
  allowed: boolean;
  created_at: string;
}

export interface AmsAuthHistoryItem {
  id: number;
  user_id: number;
  username: string;
  session_id: string;
  client_id?: string;
  device_name: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;
  trusted: boolean;
  revoked: boolean;
  revoked_reason?: string;
  last_used_at?: string;
  created_at: string;
}

export interface AmsDevice {
  id: number;
  user_id: number;
  device_name: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;
  trusted: boolean;
  revoked: boolean;
  last_used_at?: string;
  created_at: string;
}

export interface AmsListResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface AmsDashboardStats {
  total_users: number;
  active_users: number;
  locked_users: number;
  total_roles: number;
  total_permissions: number;
  total_clients: number;
  total_sso_providers: number;
  recent_audit_logs?: AmsAuditLog[];
}

// ─── Query Types ──────────────────────────────────────────────────────────────

export interface AmsListQuery {
  page?: number;
  page_size?: number;
  q?: string;
  status?: string;
  group?: string;
  policy_type?: string;
  scope_type?: string;
  action?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
  allowed?: boolean;
  trusted?: boolean;
  revoked?: boolean;
}

// ─── Payload Types ────────────────────────────────────────────────────────────

export interface CreateAmsUserPayload {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone?: string;
  status?: 'active' | 'inactive';
  role_ids?: number[];
  allowed_clients?: string[];
  allowed_channels?: string[];
}

export interface UpdateAmsUserPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'locked';
  role_ids?: number[];
  allowed_clients?: string[];
  allowed_channels?: string[];
  require_otp?: boolean;
  two_factor_enabled?: boolean;
}

export interface CreateAmsRolePayload {
  name: string;
  description?: string;
}

export type UpdateAmsRolePayload = Partial<CreateAmsRolePayload>;

export interface AssignRolePermissionsPayload {
  permissions: Array<{
    permission_id: number;
    scope: 'self' | 'department' | 'organization' | 'global';
  }>;
}

export interface CreateAmsPermissionPayload {
  code: string;
  name: string;
  description?: string;
  group_name: string;
}

export interface AddPermissionLinePayload {
  controller: string;
  action: string;
  note?: string;
}

export interface CreateAmsMenuPayload {
  title: string;
  url?: string;
  sort_order?: number;
  icon?: string;
  permission_code?: string;
  parent_id?: number;
  menu_type?: 'main' | 'sub' | 'separator';
}

export type UpdateAmsMenuPayload = Partial<CreateAmsMenuPayload>;

export interface CreateAmsAuthClientPayload {
  name: string;
  type: 'confidential' | 'public' | 'service';
  allowed_grants?: string[];
  redirect_uris?: string[];
  allowed_scopes?: string[];
  allowed_origins?: string[];
  pkce_required?: boolean;
}

export type UpdateAmsAuthClientPayload = Partial<CreateAmsAuthClientPayload>;

export interface CreateAmsSSOProviderPayload {
  provider_id: string;
  name: string;
  type: 'oidc' | 'saml';
  client_id: string;
  client_secret?: string;
  authorize_url?: string;
  token_url?: string;
  user_info_url?: string;
  redirect_uri?: string;
  scope?: string;
  saml_login_url?: string;
  enabled?: boolean;
  allow_auto_provision?: boolean;
  icon?: string;
}

export type UpdateAmsSSOProviderPayload = Partial<CreateAmsSSOProviderPayload>;

export interface CreateAmsLoginChannelPayload {
  name: string;
  channel_id: string;
  type: string;
  enabled?: boolean;
  mfa_required?: boolean;
}

export type UpdateAmsLoginChannelPayload = Partial<CreateAmsLoginChannelPayload>;

export interface CreateAmsSecurityPolicyPayload {
  code: string;
  name: string;
  description?: string;
  policy_type: 'auth' | 'step-up' | 'rate-limit';
  scope_type?: 'global' | 'client' | 'channel';
  target_client?: string;
  target_channel?: string;
  priority?: number;
  active?: boolean;
  config_json?: Record<string, unknown>;
}

export type UpdateAmsSecurityPolicyPayload = Partial<CreateAmsSecurityPolicyPayload>;

export interface CreateAmsReferenceOptionPayload {
  code: string;
  label: string;
  group: string;
  sort_order?: number;
  active?: boolean;
}

export type UpdateAmsReferenceOptionPayload = Partial<CreateAmsReferenceOptionPayload>;
