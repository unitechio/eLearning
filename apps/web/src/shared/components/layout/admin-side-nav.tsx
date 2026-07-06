import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Flag,
  ScrollText,
  Mail,
  CreditCard,
  BookOpen,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LineChart,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { useAuth, useLogout } from '@/domains/auth';
import { OptimizedImage } from '@/shared/components/media';

const adminNavItems = [
  {
    group: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    group: 'User Management',
    items: [
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Shield, label: 'Access Control', path: '/admin/access' },
      { icon: KeyRound, label: 'User Access', path: '/admin/user-access' },
    ],
  },
  {
    group: 'Content',
    items: [
      { icon: BookOpen, label: 'IELTS Content', path: '/admin/ielts' },
      { icon: LineChart, label: 'LMS', path: '/admin/lms' },
    ],
  },
  {
    group: 'Platform',
    items: [
      { icon: Settings, label: 'Platform Settings', path: '/admin/platform-settings' },
      { icon: Flag, label: 'Feature Flags', path: '/admin/feature-flags' },
      { icon: ScrollText, label: 'Audit Logs', path: '/admin/audit-logs' },
      { icon: Mail, label: 'Email Logs', path: '/admin/email-logs' },
    ],
  },
  {
    group: 'Finance',
    items: [
      { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    ],
  },
  {
    group: 'Support',
    items: [
      { icon: LifeBuoy, label: 'Support Tickets', path: '/admin/support' },
    ],
  },
];

export function AdminSideNav() {
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

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-800 bg-slate-950 text-sm font-medium antialiased transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-700 shadow-lg shadow-red-900/30">
          <Sparkles className="h-4 w-4 fill-white text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight text-white">Admin Panel</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">eLearning</p>
          </div>
        )}
        <button
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          onClick={() => setCollapsed((prev) => !prev)}
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {adminNavItems.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `mx-2 mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-150 ${
                      isActive
                        ? 'bg-red-600/20 text-red-400 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                          isActive ? 'text-red-400' : 'group-hover:scale-110'
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-800 p-3">
        {collapsed ? (
          <button
            className="flex w-full items-center justify-center rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
            onClick={handleLogout}
            type="button"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <OptimizedImage
              alt={[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Admin'}
              aspectClassName="h-8 w-8 rounded-full shrink-0"
              className="border border-slate-700"
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop'}
              widthHint={64}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-200">
                {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Admin'}
              </p>
              <p className="truncate text-[10px] text-slate-500">{user?.email ?? ''}</p>
            </div>
            <button
              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              onClick={handleLogout}
              type="button"
              aria-label="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
