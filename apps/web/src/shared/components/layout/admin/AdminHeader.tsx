import React from "react";
import { Menu, Search, Bell, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { allAdminNavItems } from "@/shared/config/admin-nav";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead
} from "@/domains/admin/api/notificationService";

function useActiveNav() {
  const location = useLocation();
  const current = location.pathname;
  return allAdminNavItems.find(
    (item) => item.path === current || (item.path !== "/dashboard" && current.startsWith(item.path + "/")),
  );
}

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export function AdminHeader({ onOpenMobileSidebar, onOpenCommandPalette }: AdminHeaderProps) {
  const active = useActiveNav();
  const navigate = useNavigate();

  // Fetch unread notifications for popover
  const { data, isLoading } = useNotifications({ read: false });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.items || [];
  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <header
      className="admin__header_main bg-white sticky top-0 z-35 flex h-16 items-center gap-2 sm:gap-3 border-b border-border/70 bg-background/95 px-5 sm:px-7 backdrop-blur-sm"
      aria-label="Admin top bar"
    >
      {/* Mobile Burger Menu */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenMobileSidebar}
        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 lg:hidden border-none"
        aria-label="Open navigation sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs matching layout */}
      <div className="flex-1 min-w-0">
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-bold text-foreground">
                {active?.title || "Overview"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 text-xs text-muted-foreground hover:bg-muted/70 transition-colors w-32 sm:w-44 text-left"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search settings...</span>
          <span className="inline sm:hidden">Search...</span>
        </button>

        <Button
          type="button"
          size="sm"
          className="hidden sm:flex h-8 gap-1.5 rounded-sm bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-3 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </Button>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-5 w-px bg-border/60 mx-1" />

        {/* Notifications Popover Bell Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border-none"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background"
                  aria-hidden="true"
                />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 border border-border rounded-xl shadow-lg bg-popover z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/10">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
              {unreadNotifications.length > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[10px] font-semibold text-indigo-650 hover:text-indigo-705 underline border-none bg-transparent cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-450">No new notifications</div>
              ) : (
                notifications.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !item.is_read && markReadMutation.mutate(item.id)}
                    className={cn(
                      "p-3 text-left cursor-pointer transition-colors flex items-start gap-2.5",
                      !item.is_read ? "bg-slate-50/40 hover:bg-slate-50/70 dark:bg-slate-900/20" : "hover:bg-slate-50/20 dark:hover:bg-slate-900/10"
                    )}
                  >
                    {!item.is_read && (
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border bg-slate-50/20 text-center">
              <button
                onClick={() => navigate("/admin/notifications")}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-750 inline-block w-full py-1.5 bg-transparent border-none cursor-pointer"
              >
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Theme and Profile Controls */}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
export default AdminHeader;
