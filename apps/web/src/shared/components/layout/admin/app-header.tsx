import { Menu, Search } from "lucide-react";
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
import { useUiStore } from "@/shared/stores/use-ui-store";
import { useLocation } from "react-router-dom";
import { allAdminNavItems } from "@/shared/config/admin-nav";

function useActiveNav() {
  const location = useLocation();
  const current = location.pathname;
  const active = allAdminNavItems.find(
    (item) => item.path === current || (item.path !== "/dashboard" && current.startsWith(item.path + "/")),
  );
  return active;
}

export function AppHeader() {
  const setMobileSidebarOpen = useUiStore((s) => s.setMobileSidebarOpen);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const active = useActiveNav();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            {active && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="truncate">{active.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <Button
        variant="outline"
        size="sm"
        className="hidden h-9 w-64 justify-start text-muted-foreground md:flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search…
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
