import React from "react";

interface FooterNavColumn {
  title: string;
  items: string[];
}

interface FooterNavProps {
  /** Brand name displayed in footer */
  brandName?: string;
  /** Brand logo letter */
  logoLetter?: string;
  /** Brand description text */
  brandDescription?: string;
  /** Physical address */
  address?: string;
  /** Hotline number */
  hotline?: string;
  /** Navigation columns */
  columns?: FooterNavColumn[];
  /** Copyright year (defaults to current year) */
  copyrightYear?: number;
  /** Copyright owner name */
  copyrightOwner?: string;
  /** Bottom links */
  bottomLinks?: string[];
}

export default function FooterNav({
  brandName = "eEnglish",
  logoLetter = "E",
  brandDescription,
  address,
  hotline,
  columns = [],
  copyrightYear = new Date().getFullYear(),
  copyrightOwner = "eEnglish",
  bottomLinks = ["Giới thiệu", "Chính sách bảo mật", "Điều khoản sử dụng"],
}: FooterNavProps) {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface/60 px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-black text-xs">
              {logoLetter}
            </div>
            <span className="text-inverse-on-surface font-bold font-headline">{brandName}</span>
          </div>
          {brandDescription && (
            <p className="text-xs leading-relaxed text-inverse-on-surface/50">
              {brandDescription}
            </p>
          )}
          {address && (
            <p className="text-xs mt-2 text-inverse-on-surface/50">{address}</p>
          )}
          {hotline && (
            <p className="text-xs mt-1 text-inverse-on-surface/50">Hotline: {hotline}</p>
          )}
        </div>

        {/* Nav columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-inverse-on-surface font-semibold mb-3 text-xs uppercase tracking-wider font-label">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-xs text-inverse-on-surface/50 hover:text-inverse-on-surface transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-inverse-on-surface/10 flex items-center justify-between text-xs text-inverse-on-surface/40">
        <span>© {copyrightYear} {copyrightOwner}. All rights reserved.</span>
        <nav aria-label="Footer links">
          <ul className="flex gap-4">
            {bottomLinks.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  className="hover:text-inverse-on-surface/60 transition-colors"
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
