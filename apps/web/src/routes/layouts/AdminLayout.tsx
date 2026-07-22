import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAccessProfile, useAuth, useMe } from '@/domains/auth';
import { AdminSideNav } from '@/shared/components/layout/admin-side-nav';
import { AdminHeader } from '@/shared/components/layout/admin-header';

/**
 * AdminLayout — layout riêng cho toàn bộ /admin/* routes.
 *
 * Features:
 * - Tách biệt hoàn toàn khỏi DashboardLayout (user layout)
 * - AdminSideNav với dark theme và grouped navigation
 * - AdminHeader với avatar dropdown, dark/light toggle, notifications
 * - Responsive: sidebar overlay on mobile, collapsible on desktop
 * - 100% semantic HTML — main/aside/header/footer elements
 */
export function AdminLayout() {
  const { token, setUser, setAccessProfile } = useAuth();
  const meQuery     = useMe(Boolean(token));
  const accessQuery = useAccessProfile(Boolean(token));

  /** Desktop sidebar collapsed state — synced from AdminSideNav */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  /** Mobile sidebar open/close state */
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
  }, [meQuery.data, setUser]);

  React.useEffect(() => {
    if (accessQuery.data) setAccessProfile(accessQuery.data);
  }, [accessQuery.data, setAccessProfile]);

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* ── Sidebar ── */}
      <AdminSideNav
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* ── Main content — offset matches sidebar width ── */}
      <main
        className={`
          flex min-h-screen flex-1 flex-col transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-60'}
        `}
      >
        {/* Sticky header */}
        <AdminHeader
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileSidebarOpen((v) => !v)}
        />

        {/* Page content */}
        <section className="flex-1 p-4 sm:p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
