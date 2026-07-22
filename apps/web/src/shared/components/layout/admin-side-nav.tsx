import React, { useCallback, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  FileText,
  Flag,
  GraduationCap,
  Image,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  LogOut,
  Mail,
  Megaphone,
  MessageSquare,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { useAuth, useLogout } from '@/domains/auth';
import { OptimizedImage } from '@/shared/components/media';

// ─── Navigation Data ──────────────────────────────────────────────────────────

const adminNavItems = [
  {
    group: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    group: 'Analytics',
    items: [
      { icon: TrendingUp,  label: 'Traffic Analytics', path: '/admin/analytics/traffic' },
      { icon: LineChart,   label: 'Revenue Report',    path: '/admin/analytics/revenue' },
      { icon: BarChart3,   label: 'User Behaviour',    path: '/admin/analytics/behaviour' },
    ],
  },
  {
    group: 'User Management',
    items: [
      { icon: Users,    label: 'Users',               path: '/admin/users' },
      { icon: Shield,   label: 'Access Control',      path: '/admin/access' },
      { icon: KeyRound, label: 'User Access',         path: '/admin/user-access' },
      { icon: Bell,     label: 'Notifications Mgmt',  path: '/admin/notifications' },
    ],
  },
  {
    group: 'Content',
    items: [
      { icon: BookOpen,        label: 'IELTS Content',  path: '/admin/ielts' },
      { icon: GraduationCap,   label: 'Courses',        path: '/admin/courses' },
      { icon: FileText,        label: 'Exam Banks',     path: '/admin/exam-banks' },
      { icon: Image,           label: 'Media Library',  path: '/admin/media' },
      { icon: Megaphone,       label: 'Announcements',  path: '/admin/announcements' },
      { icon: LineChart,       label: 'LMS',            path: '/admin/lms' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { icon: CreditCard, label: 'Billing',        path: '/admin/billing' },
      { icon: Zap,        label: 'Subscriptions',  path: '/admin/subscriptions' },
      { icon: Receipt,    label: 'Transactions',   path: '/admin/transactions' },
      { icon: Tag,        label: 'Coupons',        path: '/admin/coupons' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { icon: Settings,     label: 'Platform Settings', path: '/admin/platform-settings' },
      { icon: Flag,         label: 'Feature Flags',     path: '/admin/feature-flags' },
      { icon: Activity,     label: 'System Health',     path: '/admin/system-health' },
      { icon: Database,     label: 'Cache Manager',     path: '/admin/cache' },
      { icon: Wifi,         label: 'API Rate Limits',   path: '/admin/rate-limits' },
      { icon: ScrollText,   label: 'Audit Logs',        path: '/admin/audit-logs' },
      { icon: Mail,         label: 'Email Logs',        path: '/admin/email-logs' },
    ],
  },
  {
    group: 'Support',
    items: [
      { icon: LifeBuoy,      label: 'Support Tickets', path: '/admin/support' },
      { icon: MessageSquare, label: 'Feedback & Reviews', path: '/admin/feedback' },
      { icon: AlertCircle,   label: 'Error Reports',   path: '/admin/errors' },
    ],
  },
] as const;

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  collapsed: boolean;
}

function SideNavItem({ icon: Icon, label, path, collapsed }: NavItemProps) {
  return (
    <li>
      <NavLink
        to={path}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          `mx-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-150 ${
            isActive
              ? 'bg-red-600/20 font-bold text-red-400'
              : 'font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`h-4 w-4 shrink-0 ${isActive ? 'text-red-400' : 'text-slate-500'}`}
              aria-hidden="true"
            />
            {!collapsed && <span className="truncate">{label}</span>}
            {isActive && collapsed && (
              <span className="sr-only">{label} (active)</span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface AdminSideNavProps {
  /** Mobile overlay visibility — controlled from AdminLayout. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Notify parent of collapsed state for layout offset. */
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function AdminSideNav({
  mobileOpen = false,
  onMobileClose,
  onCollapsedChange,
}: AdminSideNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // local logout still proceeds on remote failure
    } finally {
      logout();
      navigate('/login');
    }
  };

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      onCollapsedChange?.(next);
      return next;
    });
  }, [onCollapsedChange]);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Admin';
  const avatarSrc =
    user?.avatar ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop';

  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        aria-label="Admin sidebar navigation"
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-slate-800 bg-slate-950 text-sm font-medium antialiased
          transition-all duration-300
          ${collapsed ? 'w-[68px]' : 'w-60'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Logo / Brand ── */}
        <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-5">
          <figure
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-900/30"
          >
            <Sparkles className="h-4 w-4 fill-white text-white" />
          </figure>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black tracking-tight text-white">
                Admin Panel
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                eLearning
              </p>
            </div>
          )}

          {/* Collapse toggle — desktop only */}
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleCollapse}
            className="ml-auto hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 lg:flex"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onMobileClose}
            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ── Navigation ── */}
        <nav
          aria-label="Admin navigation"
          className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {adminNavItems.map((group) => (
            <section key={group.group} className="mb-4">
              {!collapsed && (
                <p className="mb-1 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {group.group}
                </p>
              )}
              {collapsed && (
                <hr className="mx-3 mb-2 border-slate-800" aria-hidden="true" />
              )}
              <ul className="space-y-0.5" role="list">
                {group.items.map((item) => (
                  <SideNavItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    collapsed={collapsed}
                  />
                ))}
              </ul>
            </section>
          ))}
        </nav>

        {/* ── User Footer ── */}
        <footer className="border-t border-slate-800 p-3">
          {collapsed ? (
            <button
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <OptimizedImage
                alt={fullName}
                aspectClassName="h-8 w-8 rounded-full shrink-0"
                className="border border-slate-700"
                src={avatarSrc}
                widthHint={64}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-200">{fullName}</p>
                <p className="truncate text-[10px] text-slate-500">{user?.email ?? ''}</p>
              </div>
              <button
                type="button"
                aria-label="Logout"
                onClick={handleLogout}
                className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </footer>
      </aside>
    </>
  );
}
