export interface User {
  id: string;
  tenant_id?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
  status?: string;
  email_verified?: boolean;
  roles?: Array<{ id: number; name: string; display_name?: string }>;
}

export interface AccessProfile {
  user_id: string;
  tenant_id: string;
  email: string;
  roles: string[];
  permissions: string[];
  features: string[];
  is_admin: boolean;
  is_instructor: boolean;
  is_premium: boolean;
}

export interface AuthPayload {
  user: User;
  token: string;
  refresh_token?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  accessProfile: AccessProfile | null;
  isAuthenticated: boolean;
  setAuth: (payload: AuthPayload) => void;
  setUser: (user: User) => void;
  setAccessProfile: (profile: AccessProfile) => void;
  logout: () => void;
}
