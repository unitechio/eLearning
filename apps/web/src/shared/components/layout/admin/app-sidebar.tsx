import { NavLink, useLocation } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { adminNavGroups, type NavItem } from "@/shared/config/admin-nav";
import { useUiStore } from "@/shared/stores/use-ui-store";
import { useLogout } from "@/domains/auth/api/hooks";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

function isActive(path: string, current: string) {
  if (path === "/dashboard") return current === "/dashboard";
  return current === path || current.startsWith(path + "/");
}

function NavItemLink({ item, collapsed, onClick }: { item: NavItem; collapsed: boolean; onClick?: () => void }) {
  const location = useLocation();
  const active = isActive(item.path, location.pathname);
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-primary",
        collapsed && "justify-center px-0",
        item.soon && "opacity-60",
      )}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-sidebar-primary" />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge && (
            <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              {item.badge}
            </span>
          )}
          {item.soon && (
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              Soon
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {item.title}
        {item.badge && ` · ${item.badge}`}
        {item.soon && " · Planned"}
      </TooltipContent>
    </Tooltip>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn("transition-transform duration-200", open ? "rotate-90" : "")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 2l3 4-3 4" />
    </svg>
  );
}

function NavGroup({
  label,
  items,
  collapsed,
}: {
  label: string;
  items: readonly NavItem[];
  collapsed: boolean;
}) {
  const location = useLocation();
  const groupActive = items.some((i) => isActive(i.path, location.pathname));
  const [open, setOpen] = useState(groupActive || label === "Overview");

  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <NavItemLink key={item.path} item={item} collapsed />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <span>{label}</span>
          <ChevronIcon open={open} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pt-1">
        {items.map((item) => (
          <NavItemLink key={item.path} item={item} collapsed={false} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const logout = useLogout();

  const handleLogout = () => logout.mutate();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar",
        !onNavigate && "fixed inset-y-0 left-0 z-40 transition-[width] duration-300",
        collapsed ? "w-[72px]" : "w-[280px]",
      )}
      aria-label="Admin sidebar"
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
          E
        </div>
        {!collapsed && (
          <span className="ml-3 text-sm font-semibold text-foreground">
            eEnglish Admin
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group) => (
          <NavGroup
            key={group.label}
            label={group.label}
            items={group.items}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        {onNavigate ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onNavigate();
              logout.mutate();
            }}
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        ) : (
          <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </Button>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className="h-8 w-8"
                >
                  {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
