import React from "react";

interface NavItem {
  label: string;
  href?: string;
}

interface HeaderNavProps {
  /** Nav items to display */
  navItems?: NavItem[];
  /** Currently active nav item label */
  active?: string;
  /** Short brand name shown in header */
  brandName?: string;
  /** Brand logo initial letter */
  logoLetter?: string;
  /** Called when logo/brand is clicked */
  onBrandClick?: () => void;
  /** Called when search icon is clicked */
  onSearchClick?: () => void;
}

export default function HeaderNav({
  navItems = [],
  active = "",
  brandName = "eEnglish",
  logoLetter = "E",
  onBrandClick,
  onSearchClick,
}: HeaderNavProps) {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onBrandClick}
        role="button"
        tabIndex={0}
        aria-label={`${brandName} – về trang chủ`}
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-xs">
          {logoLetter}
        </div>
        <span className="font-headline font-black text-on-surface text-sm tracking-tight">
          {brandName}
        </span>
      </div>

      {/* Nav */}
      {navItems.length > 0 && (
        <nav className="hidden md:flex items-center gap-6" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                active === item.label ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Tìm kiếm"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
        >
          🔍
        </button>
      </div>
    </header>
  );
}
