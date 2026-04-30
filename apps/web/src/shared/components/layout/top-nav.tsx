import React from 'react';
import { Bell, LogOut, Search, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useLogout } from '@/features/auth';

export default function TopNav() {
  const navigate = useNavigate();
  const { user, accessProfile, logout } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // local logout still needs to happen on any remote failure
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="flex justify-between items-center w-full h-20 px-10 sticky top-0 z-40 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl font-inter text-sm transition-all duration-300 border-b border-slate-100/50 dark:border-slate-900/50">
      <div className="flex items-center bg-surface-container-low/50 border border-slate-200/20 px-6 py-3 rounded-2xl w-[450px]">
        <Search className="text-on-surface-variant w-5 h-5 mr-3 opacity-60" />
        <input
          className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full p-0 placeholder:text-on-surface-variant/50 font-medium"
          placeholder="Search lessons, vocabulary or analytics..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-on-surface-variant hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all active:scale-95 group">
            <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>
          <Link className="w-12 h-12 flex items-center justify-center rounded-2xl text-on-surface-variant hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all active:scale-95 group" to="/profile">
            <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
          </Link>
        </div>

        <div className="h-10 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 mx-4"></div>

        <div className="flex items-center gap-3 bg-surface-container-low/50 px-4 py-2 rounded-2xl border border-slate-200/20">
          <div className="text-right">
            <span className="block font-bold text-slate-800 dark:text-slate-200 leading-none">
              {accessProfile?.is_premium ? 'Premium' : 'Core'}
            </span>
            <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1 opacity-60">
              {(accessProfile?.roles ?? ['user']).join(', ')}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20">
            {accessProfile?.is_premium ? 'Unlocked' : 'Upgrade'}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 mx-2"></div>

        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2 shadow-sm">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{[user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'User'}</p>
            <p className="text-xs text-slate-500">{user?.email ?? ''}</p>
          </div>
          <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600" onClick={handleLogout} type="button">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
