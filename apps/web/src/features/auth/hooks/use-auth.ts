import { useAuthStore } from '../stores/use-auth-store';

/**
 * Custom hook to access auth state and actions.
 * Centralizes auth logic for easier maintenance.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const accessProfile = useAuthStore((state) => state.accessProfile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessProfile = useAuthStore((state) => state.setAccessProfile);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    token,
    accessProfile,
    isAuthenticated,
    setAuth,
    setUser,
    setAccessProfile,
    logout,
  };
};
