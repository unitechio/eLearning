import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Trophy, 
  BookOpen, 
  Sparkles, 
  CalendarDays, 
  Compass, 
  Award,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  GraduationCap,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth, useLogout, useMe, useAccessProfile } from '@/domains/auth';
import { useTheme } from '@/shared/hooks/useTheme';
import { cn } from '@/shared/lib';

export function LmsLayout() {
  const { theme, toggleTheme } = useTheme();
  const { token, user, logout, setUser, setAccessProfile } = useAuth();
  const meQuery = useMe(Boolean(token));
  const accessQuery = useAccessProfile(Boolean(token));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutMutation = useLogout();

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (accessQuery.data) {
      setAccessProfile(accessQuery.data);
    }
  }, [accessQuery.data, setAccessProfile]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Proceed locally anyway
    } finally {
      logout();
      navigate('/lms/login');
    }
  };

  const navItems = [
    { label: "Tổng quan", icon: ClipboardList, path: "/lms" },
    { label: "AI Practice", icon: Trophy, path: "/speaking-simulation" },
    { label: "Thảo luận & Chat", icon: MessageSquare, path: "/lms/chat" },
    { label: "Lịch học & Sự kiện", icon: CalendarDays, path: "/lms/calendar" },
    { label: "Tài liệu học tập", icon: BookOpen, path: "/lms/documents" },
    { label: "Lịch sử học tập", icon: Compass, path: "/planner" },
    { label: "Chứng nhận & Điểm", icon: Award, path: "/achievements" },
  ];

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Học viên eEnglish';
  const avatarSrc = user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <header aria-label="DOL LMS Top bar" className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-650 text-white font-black text-xl shadow-md">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight leading-none text-slate-900 dark:text-white">DOL LMS</span>
              <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 leading-none mt-1">ĐÌNH LỰC</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-orange-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Notifications */}
          <button 
            type="button" 
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              2
            </span>
          </button>

          {/* Profile Dropdown */}
          <figure aria-label="Student profile" className="h-9 w-9 rounded-full overflow-hidden border border-red-500 shadow-sm cursor-pointer">
            <img 
              alt={fullName} 
              src={avatarSrc} 
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex">
        {/* Left Standalone Sidebar */}
        <aside 
          aria-label="LMS navigation menu" 
          className={cn(
            "fixed inset-y-0 left-0 top-[73px] z-30 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 transition-transform lg:translate-x-0 lg:static lg:z-0 lg:h-auto flex flex-col justify-between",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav aria-label="Main sidebar navigation" className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all",
                    isActive 
                      ? "bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout footer inside sidebar */}
          <footer className="border-t border-slate-100 dark:border-slate-900 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-650 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-all"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Đăng xuất</span>
            </button>
          </footer>
        </aside>

        {/* Backdrop for mobile */}
        {mobileOpen && (
          <button 
            type="button"
            className="fixed inset-0 top-[73px] bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu backdrop"
          />
        )}

        {/* Content Outlet frame */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
