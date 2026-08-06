import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Download,
  Users,
  ShieldCheck,
  History,
  FileText,
  School,
  CreditCard,
  LifeBuoy,
  Settings,
  Zap,
  ChevronDown,
  ChevronsUpDown,
  Building,
  Check,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import { useLogout, useMe } from "@/domains/auth/api/hooks";
import { cn } from "@/shared/lib/utils";
import "@/assets/styles/globals.css";
// --- Types ---
interface SidebarSubItem {
  title: string;
  path: string;
  soon?: boolean;
  badge?: string;
}

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  path?: string; // If flat
  badge?: string;
  soon?: boolean;
  subItems?: SidebarSubItem[];
}

interface SidebarGroup {
  label?: string; // Separator label
  items: SidebarItem[];
}

// --- Navigation Config ---
const sidebarGroups: SidebarGroup[] = [
  {
    items: [
      { title: "Home", path: "/dashboard", icon: LayoutDashboard },
      { title: "Calendar", path: "/admin/calendar", icon: Calendar },
      { title: "Downloads", path: "/admin/downloads", icon: Download },
      { title: "Referrals", path: "/admin/referrals", icon: Heart },
      { title: "Tasks (Users)", path: "/admin/users", icon: Users },
      {
        title: "Identity & Access",
        icon: ShieldCheck,
        subItems: [
          { title: "Roles & Permissions", path: "/admin/access" },
          { title: "Auth Clients", path: "/admin/ams/auth-clients" },
          { title: "SSO Providers", path: "/admin/ams/sso-providers" },
          { title: "Login Channels", path: "/admin/ams/login-channels" },
          { title: "Security Policies", path: "/admin/ams/security-policies" },
        ],
      },
      {
        title: "Security",
        icon: History,
        subItems: [
          { title: "Auth History", path: "/admin/ams/auth-history" },
          { title: "Trusted Devices", path: "/admin/ams/devices" },
          { title: "Audit Logs", path: "/admin/audit-logs" },
          { title: "Reference Data", path: "/admin/ams/reference-options" },
        ],
      },
    ],
  },
  {
    label: "Workflows",
    items: [
      {
        title: "Content",
        icon: FileText,
        subItems: [
          { title: "Content Manager", path: "/admin/content" },
          { title: "Mock Tests", path: "/admin/mock-tests" },
          { title: "IELTS Content", path: "/admin/ielts" },
          { title: "Documents", path: "/admin/documents" },
          { title: "Writing Review", path: "/admin/writing-review" },
          { title: "Blueprints Library", path: "/admin/blueprints" },
        ],
      },
      { title: "LMS Console", path: "/admin/lms", icon: School },
      {
        title: "Payments (Billing)",
        icon: CreditCard,
        subItems: [
          { title: "Billing Details", path: "/admin/billing" },
          { title: "Invoices", path: "/admin/invoices" },
          { title: "Invoice Categories", path: "/admin/invoice-categories" },
          { title: "Vouchers", path: "/admin/vouchers" },
        ],
      },
      {
        title: "Operations",
        icon: LifeBuoy,
        subItems: [
          { title: "Support Tickets", path: "/admin/support" },
          { title: "Email Logs", path: "/admin/email-logs" },
          { title: "Agent Console", path: "/admin/agent-console", badge: "AI" },
          { title: "Integrations Hub", path: "/admin/integrations" },
        ],
      },
      {
        title: "System Config",
        icon: Settings,
        subItems: [
          { title: "Platform Settings", path: "/admin/platform-settings" },
          { title: "Feature Flags", path: "/admin/feature-flags" },
        ],
      },
      {
        title: "Planned Releases",
        icon: Zap,
        subItems: [
          { title: "Delivery Tracker", path: "/admin/delivery-tracker", soon: true },
          { title: "Signer Flow", path: "/admin/signer-flow", soon: true },
          { title: "Bio Pages", path: "/admin/bio-pages", soon: true },
          { title: "QR Generator", path: "/admin/qr-generator", soon: true },
          { title: "Call History", path: "/admin/call-history", soon: true },
        ],
      },
    ],
  },
];

// Helper to determine active state
function checkIsActive(path: string, current: string) {
  if (path === "/dashboard") return current === "/dashboard";
  return current === path || current.startsWith(path + "/");
}

export interface AdminSideNavProps {
  collapsed: boolean;
  toggle: () => void;
  onNavigate?: () => void;
}

export function AdminSideNav({ collapsed, toggle, onNavigate }: AdminSideNavProps) {
  const location = useLocation();
  const logout = useLogout();
  const { data: user } = useMe();

  // Local state for workspaces/teams switcher
  const [activeWorkspace, setActiveWorkspace] = useState("Orbix Studio Team");
  const workspaces = ["Orbix Studio Team", "Personal Workspace", "Dev Team"];

  const handleLogout = () => logout.mutate();
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "Manager";

  // Reusable styling tokens for menu rows
  const menuRowBase = "flex h-10 w-full items-center justify-between rounded-sm px-3 py-2 text-[13px] font-medium tracking-[-0.01em] leading-5 transition-all duration-150 outline-none select-none cursor-pointer relative";
  const inactiveRowClass = "text-[#667085] hover:text-[#344054] hover:bg-[#F8FAFC] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] dark:hover:bg-[#18181b]";
  const activeRowClass = "bg-[#FEF2F2] text-[#111827] font-semibold dark:bg-[#1e1b4b]/60 dark:text-white";

  return (
    <aside
      className={cn(
        "admin__sidebar_main flex h-full flex-col bg-white  dark:bg-[#09090b] dark:border-[#1E1F22]",
        !onNavigate && "fixed inset-y-0 left-0 z-40 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
      aria-label="Admin sidebar"
    >
      {/* Workspace Switcher */}
      <div className={cn("shrink-0 p-3", collapsed && "flex justify-center p-2")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded="false"
              className={cn(
                "flex items-center gap-2.5 rounded-md bg-[#F8FAFC] hover:bg-[#dcdfe5] dark:hover:bg-[#18181b] p-2 transition-all text-left w-full outline-none select-none border border-transparent",
                collapsed && "justify-center p-1.5"
              )}
            >
              {/* Green Custom Logo */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-450 shadow-none">
                <Building className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>

              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold text-[#98A2B3] dark:text-[#71717a] leading-none uppercase tracking-wider">Agency</p>
                    <p className="text-[12px] font-semibold text-[#344054] dark:text-[#f4f4f5] truncate mt-1 leading-none">{activeWorkspace}</p>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-[#98A2B3] dark:text-[#71717a] shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent role="menu" className="w-[200px]" align="start" sideOffset={10}>
            <DropdownMenuLabel className="text-[10px] font-bold uppercase text-[#98A2B3] dark:text-[#71717a] tracking-wider">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((team) => (
              <DropdownMenuItem
                key={team}
                role="menuitem"
                onClick={() => setActiveWorkspace(team)}
                className="flex items-center justify-between text-xs py-2 px-2.5 rounded-lg cursor-pointer text-[#667085] hover:text-[#344054] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
              >
                <span>{team}</span>
                {activeWorkspace === team && <Check className="h-4 w-4 text-[#C81E1E]" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem role="menuitem" className="text-xs py-2 px-2.5 rounded-lg cursor-pointer gap-2 text-[#667085] hover:text-[#344054] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]">
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem role="menuitem" className="text-xs py-2 px-2.5 rounded-lg cursor-pointer gap-2 text-[#667085] hover:text-[#344054] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]">
              <Settings className="h-4 w-4" />
              <span>Team Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation Scroll Area */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto no-scrollbar py-3 space-y-4",
          collapsed ? "px-2" : "px-3"
        )}
        aria-label="Admin primary navigation"
      >
        {sidebarGroups.map((group, groupIdx) => (
          <section key={groupIdx} className="space-y-0.5">
            {/* Group Header Label */}
            {group.label && !collapsed && (
              <h2 className="px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#98A2B3] dark:text-[#71717a] uppercase mb-1 mt-2 pl-3">
                {group.label}
              </h2>
            )}

            <ul className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;

                // If it is a Collapsible Submenu
                if (item.subItems) {
                  const isAnySubActive = item.subItems.some((sub) => checkIsActive(sub.path, location.pathname));
                  const [isOpen, setIsOpen] = useState(isAnySubActive);

                  if (collapsed) {
                    return (
                      <li key={itemIdx}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "flex w-full items-center justify-center rounded-xl p-2.5 transition-all duration-150 relative",
                                isAnySubActive
                                  ? "bg-[#FEF2F2] text-[#111827] dark:bg-[#1e1b4b]/60 dark:text-white"
                                  : "text-[#667085] hover:text-[#344054] hover:bg-[#F8FAFC] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] dark:hover:bg-[#18181b]"
                              )}
                              aria-haspopup="menu"
                            >
                              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                              {isAnySubActive && (
                                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[#C81E1E] dark:bg-[#818cf8]" />
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-[180px]">
                            <DropdownMenuLabel className="text-[13px] font-bold uppercase text-[#98A2B3] dark:text-[#71717a] tracking-wider">
                              {item.title}
                            </DropdownMenuLabel>
                            {item.subItems.map((sub, subIdx) => (
                              <DropdownMenuItem key={subIdx} asChild>
                                <NavLink
                                  to={sub.path}
                                  onClick={onNavigate}
                                  className={cn(
                                    "flex w-full items-center py-2 px-2.5 text-xs rounded-lg cursor-pointer",
                                    checkIsActive(sub.path, location.pathname)
                                      ? "bg-[#FEF2F2] text-[#111827] font-semibold dark:bg-[#1e1b4b]/60 dark:text-white"
                                      : "text-[#667085] hover:bg-[#F8FAFC] hover:text-[#344054] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5] dark:hover:bg-[#18181b]"
                                  )}
                                >
                                  {sub.title}
                                </NavLink>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    );
                  }

                  return (
                    <li key={itemIdx}>
                      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            className={cn(
                              menuRowBase,
                              isAnySubActive ? activeRowClass : inactiveRowClass
                            )}
                          >
                            <span className="flex items-center gap-3">
                              {isAnySubActive && (
                                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[#C81E1E] dark:bg-[#818cf8]" />
                              )}
                              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                              <span>{item.title}</span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 text-[#98A2B3] dark:text-[#71717a] transition-transform duration-200 shrink-0",
                                isOpen && "rotate-180"
                              )}
                              strokeWidth={1.75}
                            />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                          <ul className="mt-1 pl-9 pr-1 space-y-0.5 border-l border-[#EAECF0]/60 dark:border-[#1E1F22]/50 ml-[21px]">
                            {item.subItems.map((sub, subIdx) => {
                              const isSubActive = checkIsActive(sub.path, location.pathname);
                              return (
                                <li key={subIdx}>
                                  <NavLink
                                    to={sub.path}
                                    onClick={onNavigate}
                                    className={cn(
                                      "flex w-full items-center rounded-lg py-1.5 px-2.5 text-[12px] font-medium transition-all duration-150 truncate",
                                      isSubActive
                                        ? "text-[#111827] font-semibold dark:text-white"
                                        : "text-[#667085] hover:text-[#344054] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
                                    )}
                                  >
                                    <span>{sub.title}</span>
                                    {sub.soon && (
                                      <span className="ml-auto rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.2 text-[8px] font-semibold text-muted-foreground/60">Soon</span>
                                    )}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  );
                }

                // If it is a Flat NavLink
                const isItemActive = item.path ? checkIsActive(item.path, location.pathname) : false;
                const linkElement = (
                  <NavLink
                    to={item.path || "#"}
                    onClick={onNavigate}
                    className={cn(
                      menuRowBase,
                      isItemActive ? activeRowClass : inactiveRowClass,
                      collapsed && "justify-center px-0",
                      item.soon && "opacity-40 cursor-default"
                    )}
                  >
                    {isItemActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[#C81E1E] dark:bg-[#818cf8]" />
                    )}
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate ml-3">{item.title}</span>
                        {item.badge && (
                          <span className="rounded bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 text-[9px] font-bold text-[#C81E1E] dark:text-[#818cf8]">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );

                return (
                  <li key={itemIdx}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={12} className="text-xs font-semibold">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkElement
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      {/* Credit / Promo Card Widget (Bottom) */}
      {!collapsed && (
        <div className="px-3 mb-3 shrink-0">
          <div className="relative overflow-visible rounded-2xl bg-[#F8FAFC]/50 dark:bg-[#18181b]/20 border border-[#EAECF0]/60 dark:border-[#1E1F22]/40 p-4 pt-10 flex flex-col items-center">

            {/* Visual Credit Card */}
            {/*<div className="absolute top-[-26px] w-[120px] h-[65px] bg-[#111827] dark:bg-[#18181b] rounded-xl p-2.5 shadow-md border border-[#EAECF0]/10 text-white flex flex-col justify-between overflow-hidden pointer-events-none select-none">
              <div className="flex justify-between items-start">
                <div className="h-4.5 w-5.5 rounded bg-amber-400/80 flex items-center justify-center">
                  <div className="h-2.5 w-3.5 rounded border border-amber-600/30"></div>
                </div>
                <span className="text-[6px] tracking-widest font-extrabold uppercase opacity-85">GlobalLink</span>
              </div>
              <div className="space-y-0.5">
                <div className="h-1.2 w-full bg-neutral-800 rounded"></div>
                <div className="flex gap-1.5 justify-between">
                  <div className="h-1.2 w-2/3 bg-neutral-800 rounded"></div>
                  <div className="h-1.2 w-1/5 bg-neutral-800 rounded"></div>
                </div>
              </div>
            </div>*/}

            {/* Promo Description */}
            <p className="text-[11px] font-medium text-[#667085] dark:text-[#a1a1aa] text-center leading-relaxed tracking-tight mb-2.5">
              Accept credit cards and bank payment
            </p>

            <Button
              type="button"
              className="h-8 w-full bg-black hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl text-[10px] shadow-none transition-all"
            >
              Set up now
            </Button>
          </div>
        </div>
      )}

      {/* User Footer / Sidebar collapse control */}
      <div className={cn("border-t border-[#EAECF0] dark:border-[#1E1F22] shrink-0", collapsed ? "p-2" : "p-3")}>
        {onNavigate ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { onNavigate(); handleLogout(); }}
            className="w-full justify-start text-[#667085] hover:text-destructive hover:bg-red-500/10 text-xs rounded-xl"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2.5">
            {!collapsed ? (
              <>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#344054] dark:text-[#f4f4f5] truncate leading-none">{displayName}</p>
                    <p className="text-[10px] text-[#98A2B3] dark:text-[#71717a] truncate mt-1 leading-none">Administrator</p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label="Collapse sidebar"
                      className="h-7 w-7 text-[#98A2B3] hover:text-[#344054] hover:bg-[#F8FAFC] dark:text-[#71717a] dark:hover:text-[#f4f4f5] dark:hover:bg-[#18181b] rounded-lg flex items-center justify-center transition-all duration-150 outline-none"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Collapse</TooltipContent>
                </Tooltip>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2.5 w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-[10px] flex items-center justify-center cursor-pointer">
                      {displayName.slice(0, 2).toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">{displayName}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={toggle}
                      aria-label="Expand sidebar"
                      className="h-7 w-7 text-[#98A2B3] hover:text-[#344054] hover:bg-[#F8FAFC] dark:text-[#71717a] dark:hover:text-[#f4f4f5] dark:hover:bg-[#18181b] rounded-lg flex items-center justify-center transition-all duration-150 outline-none"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
