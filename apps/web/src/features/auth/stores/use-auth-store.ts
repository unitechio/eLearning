import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      accessProfile: null,
      isAuthenticated: false,
      setAuth: ({ user, token, refresh_token }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, refreshToken: refresh_token ?? null, isAuthenticated: true });
      },
      setUser: (user) => set((state) => ({ ...state, user })),
      setAccessProfile: (accessProfile) => set((state) => ({ ...state, accessProfile })),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null, refreshToken: null, accessProfile: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
