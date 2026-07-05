import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, X, User, Crown, Gift, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib";
import { HeaderLoadingBar } from "@/shared/components/feedback";

function UniLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice">
      <div className="relative h-9 w-9 overflow-hidden rounded-full bg-red-600 flex-shrink-0">
        <div className="absolute -left-2 top-1 h-5 w-9 -rotate-12 rounded-full bg-white" />
        <div className="absolute bottom-1 right-1 h-4 w-5 -rotate-12 rounded-full bg-white" />
      </div>
      <div className={compact ? 'hidden sm:block' : ''}>
        <p className="text-[11px] font-black uppercase leading-none text-slate-950">UNI</p>
        <p className="text-xs font-black uppercase leading-none text-slate-950">Tự học</p>
      </div>
    </Link>
  );
}

// ─── Dropdowns ─────────────────────────────────────────────────────────────

function NavDropdownMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative inline-flex items-center h-14">
      <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-red-600 transition" type="button">
        {label} <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {/* Dropdown Container */}
      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-white rounded-[8px] shadow-xl border border-slate-100 p-6 flex gap-8 min-w-[360px]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Search Overlay ────────────────────────────────────────────────────────

function GlobalSearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center pt-20">
      {/* Search Modal */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Area */}
        <div className="flex items-center border-b border-slate-100 px-4 py-3 bg-slate-50/50">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center ml-2 bg-slate-100 rounded-full px-4 h-11">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent px-3 text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
              placeholder="Bạn muốn tìm..."
              autoFocus
            />
          </div>
        </div>

        {/* Search Results / Suggestions */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Popular</p>
            <div className="space-y-4">
              {[
                "Music therapy for surgical patients IELTS Listening Answers with Explanation",
                "The Globemakers: The Curious Story of an Ancient Craft IELTS Reading Answers with Explanation",
                "Urban Farming IELTS Reading Answers with Explanation"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-pointer">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800 transition">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-red-600 transition">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Explore UNI's Content Types</p>
            <div className="flex flex-wrap gap-3">
              {['Online Test', 'Reading Practice', 'Listening Practice', 'Chép Chính Tả', 'Daily Learning'].map((tag) => (
                <button key={tag} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 transition">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Dropdown ──────────────────────────────────────────────────────

function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#69a84f] text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-green-600/20"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        P
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-[8px] bg-white shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
          <Link to="#" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition">
            <User className="h-4 w-4 text-slate-400" />
            Thông tin cá nhân
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition">
            <Crown className="h-4 w-4 text-slate-400" />
            Tài khoản Pro
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition">
            <Gift className="h-4 w-4 text-slate-400" />
            Nhận ngày học FREE
          </Link>
          <div className="h-px bg-slate-100 my-1 mx-4" />
          <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition">
            <LogOut className="h-4 w-4 text-slate-400" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}


// ─── Main Header Component ──────────────────────────────────────────────────

export interface PublicHeaderProps {
  loading?: boolean;
}

export function PublicHeader({ loading = false }: PublicHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <UniLogo />

          <nav className="hidden h-full items-center gap-7 lg:flex">
            <NavDropdownMenu label="IELTS Online Test">
              <div>
                <p className="text-xs font-black text-slate-900 mb-3 uppercase">Academic</p>
                <div className="space-y-2">
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium">Practice Tests</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium">Mini Tests</Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 mb-3 uppercase">General</p>
                <div className="space-y-2">
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium">Practice Tests</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium">Mini Tests</Link>
                </div>
              </div>
            </NavDropdownMenu>

            <NavDropdownMenu label="Bài mẫu IELTS">
              <div>
                <p className="text-xs font-black text-slate-900 mb-4 uppercase">BÀI MẪU WRITING</p>
                <div className="space-y-3">
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Writing Task 1 General</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Writing Task 1 Academic</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Writing Task 2 Academic</Link>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 mb-4 uppercase">BÀI MẪU SPEAKING</p>
                <div className="space-y-3">
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Speaking Part 1</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Speaking Part 2</Link>
                  <Link to="#" className="block text-sm text-slate-600 hover:text-red-600 font-medium transition">Speaking Part 3</Link>
                </div>
              </div>
            </NavDropdownMenu>

            <Link className="text-xs font-semibold text-slate-700 hover:text-red-600 transition" to="/login">
              Chép chính tả
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
              type="button"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </button>
            <ProfileMenu />
          </div>
        </div>
        <HeaderLoadingBar loading={loading} />
      </header>

      <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
