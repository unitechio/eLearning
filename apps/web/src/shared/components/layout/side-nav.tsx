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
  UserCircle2,
  GraduationCap,
  CreditCard,
  LineChart,
} from 'lucide-react';
import { useAuthStore } from '@/domains/auth';
import { OptimizedImage } from '@/shared/components/media';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: LineChart, label: 'LMS', path: '/lms' },
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

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r-0 bg-slate-50/80 p-4 text-sm font-medium antialiased backdrop-blur-xl transition-all duration-300 dark:bg-slate-950/80 font-inter">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 text-white">
          <Sparkles className="h-5 w-5 fill-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter leading-none text-slate-900 dark:text-slate-50">eEnglish</h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">AI Scholar</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary/10 font-bold text-primary shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="mt-auto border-t border-slate-200/50 pt-6">
        <div className="mb-6 flex cursor-pointer items-center gap-3 px-2 group">
          <div className="relative">
            <OptimizedImage
              alt={[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User'}
              aspectClassName="h-10 w-10 rounded-full"
              className="border-2 border-white shadow-sm dark:border-slate-800"
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop'}
              widthHint={96}
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-50 bg-green-500 dark:border-slate-900" />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
              {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Guest'}
            </p>
            <p className="truncate text-xs text-on-surface-variant opacity-60">{user?.email ?? ''}</p>
          </div>
        </div>
        <button className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 active:scale-95 duration-150">
          Start Practice
        </button>
      </div>
    </aside>
  );
}
