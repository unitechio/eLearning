import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAccessProfile, useAuth, useMe } from '@/domains/auth';
import { AdminSideNav } from './AdminSideNav';
import { AdminHeader } from './AdminHeader';
import { CommandPalette } from './command-palette';
import { Sheet, SheetContent } from '@/shared/components/ui/sheet';
import { useUiStore } from '@/shared/stores/use-ui-store';
import { cn } from '@/shared/lib/utils';

export function AdminLayout() {
  const { token, setUser, setAccessProfile } = useAuth();
  const meQuery     = useMe(Boolean(token));
  const accessQuery = useAccessProfile(Boolean(token));

  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const mobileSidebarOpen = useUiStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  React.useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
  }, [meQuery.data, setUser]);

  React.useEffect(() => {
    if (accessQuery.data) setAccessProfile(accessQuery.data);
  }, [accessQuery.data, setAccessProfile]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSideNav collapsed={sidebarCollapsed} toggle={toggleSidebar} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[220px] border-r-0 p-0 bg-sidebar" aria-label="Mobile Navigation Sidebar">
          <AdminSideNav
            collapsed={false}
            toggle={() => setMobileSidebarOpen(false)}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Layout Container */}
      <main
        className={cn(
          'flex min-h-screen flex-col transition-[margin] duration-300',
          sidebarCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[220px]',
        )}
      >
        <AdminHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <section className="flex-1 p-5 sm:p-7 bg-background">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </section>
      </main>

      <CommandPalette />
    </div>
  );
}
