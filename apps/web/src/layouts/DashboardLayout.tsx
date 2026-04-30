import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav, TopNav } from "@/shared/components";
import { useAccessProfile, useAuth, useMe } from '@/features/auth';

export function DashboardLayout() {
  const { token, setUser, setAccessProfile } = useAuth();
  const meQuery = useMe(Boolean(token));
  const accessQuery = useAccessProfile(Boolean(token));

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (accessQuery.data) {
      setAccessProfile(accessQuery.data);
    }
  }, [accessQuery.data, setAccessProfile]);

  return (
    <div className="min-h-screen bg-surface flex">
      <SideNav />
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopNav />
        <div className="w-full flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
