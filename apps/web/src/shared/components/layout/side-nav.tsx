import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Mic2,
  Edit3,
  Sparkles,
  Trophy,
  Calendar,
  Shield,
  UserCircle2,
  GraduationCap,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Vocabulary', path: '/vocabulary' },
  { icon: Mic2, label: 'Speaking', path: '/speaking' },
  { icon: Edit3, label: 'Writing', path: '/writing' },
  { icon: GraduationCap, label: 'TOEIC', path: '/toeic' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: Calendar, label: 'Study Planner', path: '/planner' },
  { icon: UserCircle2, label: 'Profile', path: '/profile' },
];

export default function SideNav() {
  const user = useAuthStore((state) => state.user);
  const accessProfile = useAuthStore((state) => state.accessProfile);
  const isAdmin = Boolean(accessProfile?.is_admin);

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl w-64 border-r-0 font-inter antialiased text-sm font-medium z-50 transition-all duration-300">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles className="w-5 h-5 fill-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 leading-none">eEnglish</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black opacity-40 mt-1">AI Scholar</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
        {isAdmin ? (
          <>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Admin Users
              </>
            </NavLink>
            <NavLink
              to="/admin/access"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Admin Access
              </>
            </NavLink>
            <NavLink
              to="/admin/platform-settings"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Platform Settings
              </>
            </NavLink>
            <NavLink
              to="/admin/feature-flags"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Feature Flags
              </>
            </NavLink>
            <NavLink
              to="/admin/audit-logs"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Audit Logs
              </>
            </NavLink>
            <NavLink
              to="/admin/email-logs"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Email Logs
              </>
            </NavLink>
            <NavLink
              to="/admin/billing"
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <>
                <Shield className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                Billing Admin
              </>
            </NavLink>
          </>
        ) : null}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/50">
        <div className="flex items-center gap-3 px-2 mb-6 group cursor-pointer">
          <div className="relative">
            <img
              alt={[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop'}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-50 dark:border-slate-900 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">{[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Guest'}</p>
            <p className="text-xs text-on-surface-variant opacity-60 truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm active:scale-95 duration-150 shadow-lg shadow-primary/20">
          Start Practice
        </button>
      </div>
    </aside>
  );
}
