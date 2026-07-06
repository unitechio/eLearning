import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAccessProfile, useAuth, useMe } from '@/domains/auth';
import { AdminSideNav } from '@/shared/components/layout/admin-side-nav';

/**
 * AdminLayout — layout riêng cho toàn bộ /admin/* routes.
 * Tách biệt hoàn toàn khỏi DashboardLayout (user layout).
 * Dùng AdminSideNav với dark theme và grouped navigation.
 */
export function AdminLayout() {
  const { token, setUser, setAccessProfile } = useAuth();
  const meQuery = useMe(Boolean(token));
  const accessQuery = useAccessProfile(Boolean(token));

  React.useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
  }, [meQuery.data, setUser]);

  React.useEffect(() => {
    if (accessQuery.data) setAccessProfile(accessQuery.data);
  }, [accessQuery.data, setAccessProfile]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSideNav />
      {/* Main content — offset matches collapsed (68px) or expanded (240px) sidebar via CSS var */}
      <main className="ml-60 flex min-h-screen flex-1 flex-col transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
