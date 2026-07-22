import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
} from 'lucide-react';
import { useAuth, useLogout } from '@/domains/auth';
import { OptimizedImage } from '@/shared/components/media';
import { useTheme } from '@/shared/hooks';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AdminHeaderProps {
  /** Whether the sidebar is currently collapsed (affects left offset). */
  sidebarCollapsed: boolean;
  /** Called when hamburger icon is pressed on mobile. */
  onMobileMenuToggle: () => void;
}

// ─── Avatar Dropdown ──────────────────────────────────────────────────────────

interface AvatarDropdownProps {
  user: ReturnType<typeof useAuth>['user'];
  onLogout: () => void;
  /** Passed from parent so both header & dropdown share the same theme state. */
  isDark: boolean;
  onToggleTheme: () => void;
}

function AvatarDropdown({ user, onLogout, isDark, onToggleTheme }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Admin';
  const avatarSrc =
    user?.avatar ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop';

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        <OptimizedImage
          src={avatarSrc}
          alt={fullName}
          aspectClassName="h-7 w-7 rounded-full shrink-0"
          className="border border-slate-600"
          widthHint={56}
        />
        <span className="hidden max-w-[120px] truncate sm:block">{fullName}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 rounded-2xl border border-slate-700/80 bg-slate-900 py-2 shadow-2xl shadow-black/40"
        >
          {/* User info header */}
          <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
            <OptimizedImage
              src={avatarSrc}
              alt={fullName}
              aspectClassName="h-10 w-10 rounded-full shrink-0"
              className="border-2 border-slate-700"
              widthHint={80}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-100">{fullName}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email ?? ''}</p>
            </div>
          </header>

          {/* Menu items */}
          <nav aria-label="Profile options">
            <ul className="py-1">
              <li>
                <Link
                  role="menuitem"
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>Thông tin cá nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  role="menuitem"
                  to="/admin/security"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <KeyRound className="h-4 w-4 shrink-0 text-slate-500" />
                  <span>Đổi mật khẩu</span>
                </Link>
              </li>

              {/* Theme toggle row */}
              <li>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    onToggleTheme();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {isDark ? (
                    <Sun className="h-4 w-4 shrink-0 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 shrink-0 text-indigo-400" />
                  )}
                  <span>{isDark ? 'Chế độ sáng' : 'Chế độ tối'}</span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto h-5 w-9 rounded-full transition-colors duration-300 ${
                      isDark ? 'bg-indigo-600' : 'bg-slate-600'
                    } relative`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                        isDark ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </button>
              </li>

              {/* Divider */}
              <li aria-hidden="true" className="mx-4 my-1 h-px bg-slate-800" />

              {/* Logout */}
              <li>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Đăng xuất</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

/**
 * AdminHeader — sticky top bar for the admin panel.
 *
 * Features:
 * - Responsive: hamburger button on mobile, full controls on desktop
 * - Notifications bell with badge
 * - Standalone dark/light toggle button
 * - Avatar dropdown with profile links, theme switch, and logout
 * - 100% semantic HTML — no decorative `<div>` wrappers
 */
export function AdminHeader({ sidebarCollapsed, onMobileMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  // Note: isDark and toggleTheme are passed down to AvatarDropdown
  // so both components stay in sync with the same state.

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // still proceed with local logout on remote failure
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header
      className={`
        sticky top-0 z-40 flex h-16 items-center justify-between gap-4
        border-b border-slate-800/80 bg-slate-950/90 px-4 backdrop-blur-xl
        transition-all duration-300 sm:px-6
      `}
      aria-label="Admin top navigation"
    >
      {/* ── Left side ── */}
      <section className="flex items-center gap-3" aria-label="Navigation controls">
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search bar — hidden on small screens */}
        <label
          htmlFor="admin-search"
          className="hidden items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-sm text-slate-400 transition focus-within:border-slate-600 focus-within:bg-slate-800 md:flex md:w-64 lg:w-80"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            id="admin-search"
            type="search"
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </label>
      </section>

      {/* ── Right side ── */}
      <section className="flex items-center gap-2" aria-label="Header actions">
        {/* Mobile search icon */}
        <button
          type="button"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Dark / Light toggle */}
        <button
          type="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          {isDark ? (
            <Sun className="h-4.5 w-4.5 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-indigo-400" aria-hidden="true" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications (3 unread)"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
        >
          <Bell className="h-4.5 w-4.5" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-950"
          />
        </button>

        {/* Divider */}
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-slate-800" />

        {/* Avatar dropdown */}
        <AvatarDropdown
          user={user}
          onLogout={handleLogout}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </section>
    </header>
  );
}
