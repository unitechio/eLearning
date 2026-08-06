import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { HeaderLoadingBar } from '@/shared/components/feedback';
import { useAccessProfile, useAuthStore } from '@/domains/auth';

export function RequireAdmin() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessProfile = useAuthStore((state) => state.accessProfile);
  const accessQuery = useAccessProfile(isAuthenticated && !accessProfile);

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  const profile = accessProfile ?? accessQuery.data;
  if (!profile && accessQuery.isLoading) {
    return <HeaderLoadingBar />;
  }

  if (!profile?.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
}
