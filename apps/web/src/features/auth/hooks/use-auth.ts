import { useAuthStore } from '../stores/use-auth-store';

/**
 * Custom hook to access auth state and actions.
 * Centralizes auth logic for easier maintenance.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    setAuth,
    logout,
  };
};
