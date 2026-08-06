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
import { useLocation } from "react-router-dom";
import { allAdminNavItems } from "@/shared/config/admin-nav";
import { cn } from "@/shared/lib/utils";

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

  return (
    <header
      className="admin__header_main bg-white sticky top-0 z-35 flex h-14 items-center gap-2 sm:gap-3 border-b border-border/70 bg-background/95 px-5 sm:px-7 backdrop-blur-sm"
      aria-label="Admin top bar"
    >
      {/* Mobile Burger Menu */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg shrink-0"
        onClick={onOpenMobileSidebar}
        aria-label="Open sidebar drawer"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb navigation" className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList className="text-xs flex items-center">
            {active ? (
              <>
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground font-medium">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-border/70 hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate text-foreground font-semibold max-w-[120px] sm:max-w-none">
                    {active.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground font-semibold">Admin</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Right zone */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Desktop Search Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hidden h-8 w-56 justify-start gap-2 text-xs text-muted-foreground md:flex rounded-lg border-border/60 bg-muted/40 hover:bg-muted/60 font-medium shadow-none"
          onClick={onOpenCommandPalette}
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="ml-auto rounded border border-border bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground/70" aria-hidden="true">
            ⌘K
          </kbd>
        </Button>

        {/* Mobile Search Icon */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg"
          onClick={onOpenCommandPalette}
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Quick Create Action */}
        <Button
          type="button"
          size="sm"
          className="hidden sm:flex h-8 gap-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-3 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </Button>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-5 w-px bg-border/60 mx-1" />

        {/* Notifications Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span
            className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background"
            aria-hidden="true"
          />
        </Button>

        {/* Theme and Profile Controls */}
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

export default AdminHeader;
