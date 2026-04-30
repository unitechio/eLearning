// ============================================================
// DOL / SENGLISH — Full App (all pages, components, layouts)
// Single-file React artifact — uses Tailwind CDN utility classes
// Nav bar at top lets you switch between every page.
// ============================================================
import { useState } from "react";

// ── LAYOUT: SenglishSidebar ─────────────────────────────────────────────────
// components/layout/SenglishSidebar.jsx
// Used by: Leaderboard, Progress, Shadowing, Dictation pages (Senglish domain)

const NAV = [
  { section: "TỔNG QUAN", items: [{ icon: "🏠", label: "Trang chủ", id: "home" }] },
  {
    section: "LUYỆN TẬP",
    items: [
      { icon: "🎧", label: "Dictation", id: "dictation" },
      { icon: "🎤", label: "Shadowing", id: "shadowing" },
      { icon: "💬", label: "Luyện nói", id: "speaking" },
      { icon: "📚", label: "Luyện từ vựng", id: "vocab" },
    ],
  },
  {
    section: "THƯ VIỆN",
    items: [
      { icon: "🎬", label: "Video của tôi", id: "video" },
      { icon: "📋", label: "Danh sách từ", id: "wordlist", badge: 0 },
      { icon: "🤖", label: "Từ điển AI", id: "ai-dict" },
    ],
  },
  {
    section: "TIẾN ĐỘ",
    items: [
      { icon: "🏆", label: "Xếp hạng", id: "leaderboard" },
      { icon: "📊", label: "Thống kê", id: "stats" },
    ],
  },
];

function SenglishSidebar({ active = "shadowing", collapsed = false }) {
  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-44"
      } bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-700 rounded text-white font-black text-xs flex items-center justify-center shrink-0">
          S
        </div>
        {!collapsed && (
          <span className="text-sm font-black text-white tracking-tight">SENGLISH</span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-xs text-gray-600 uppercase tracking-widest px-2 mb-1">
                {group.section}
              </p>
            )}
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                  item.id === active
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto bg-gray-700 text-gray-400 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        <button className="w-full text-xs bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-3 py-2 rounded-lg transition-colors">
          {collapsed ? "⚡" : "⚡ Nâng cấp Premium"}
        </button>
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-full bg-gray-600 text-xs flex items-center justify-center shrink-0 text-gray-300">
            14
          </div>
          {!collapsed && (
            <span className="text-xs text-gray-400 truncate">14.phạm tiến đạt</span>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── LAYOUT: DolHeader ───────────────────────────────────────────────────────
// components/layout/DolHeader.jsx
// Used by: Writing, IELTS Test, Dictation pages (DOL Tự Học domain)

const NAV_ITEMS = ["IELTS Online Test ▾", "Bài mẫu IELTS ▾", "Chép chính tả"];

function DolHeader({ active = "" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">
          D
        </div>
        <span className="font-black text-gray-900 text-sm tracking-tight">DOL TỰ HỌC</span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={`text-sm font-medium transition-colors hover:text-red-600 ${
              active === item ? "text-red-600" : "text-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-800 transition-colors">🔍</button>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
          P
        </div>
      </div>
    </header>
  );
}

// ── LAYOUT: DolFooter ───────────────────────────────────────────────────────
// components/layout/DolFooter.jsx
// Used by all public DOL Tự Học pages (not full-screen test/practice pages)

const FOOTER_COLS = [
  {
    title: "LUYỆN THI IELTS",
    items: ["IELTS Online Test", "IELTS Reading Practice", "IELTS Listening Practice"],
  },
  {
    title: "VỀ DOL IELTS ĐÌNH LỰC",
    items: ["Linearthinking", "Nền tảng công nghệ", "Đội ngũ giáo viên", "Thành tích học viên"],
  },
  {
    title: "DOL ECOSYSTEM",
    items: ["DOL Grammar", "DOL Dictionary", "Kiến thức IELTS tổng hợp", "DOL superLMS"],
  },
];

function DolFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">
              D
            </div>
            <span className="text-white font-bold">DOL TỰ HỌC</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Một sản phẩm thuộc Học viện Tiếng Anh Tự Duy DOL English (IELTS Đình Lực) –{" "}
            <span className="hover:text-white cursor-pointer">www.dolenglish.vn</span>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Trụ sở: Hẻm 458/14, đường 3/2, P12, Q10, TP.HCM
          </p>
          <p className="text-xs mt-1 text-gray-500">Hotline: 1800 96 96 39</p>
          <div className="flex gap-2 mt-3">
            {["f", "▶", "📸"].map((icon, i) => (
              <button
                key={i}
                className="w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-full text-xs flex items-center justify-center transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.items.map((item) => (
                <li key={item}>
                  <button className="text-xs text-gray-500 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
        <span>© 2024 DOL English. All rights reserved.</span>
        <div className="flex gap-4">
          {["Giới thiệu", "Chính sách bảo mật", "Điều khoản sử dụng"].map((t) => (
            <button key={t} className="hover:text-gray-400 transition-colors">{t}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── LAYOUT: HeroBanner ──────────────────────────────────────────────────────
// components/layout/HeroBanner.jsx
// Reusable hero section for DOL Tự Học public pages

function HeroBanner({ title, titleRed, description, ctaLabel = "Tìm hiểu khóa học" }) {
  return (
    <section className="bg-amber-50 py-14 text-center px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
        {title}
        {titleRed && (
          <>
            <br />
            <span className="text-red-600">{titleRed}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-2.5 rounded-full text-sm transition-colors">
        {ctaLabel}
      </button>
    </section>
  );
}

// ── LAYOUT: IELTSTestHeader ─────────────────────────────────────────────────
// components/layout/IELTSTestHeader.jsx
// Used by: Listening Test, Reading Test pages (full-screen test mode)

function IELTSTestHeader({ title, subtitle, timeLeft = "60:00" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: close + branding */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
          ✕
        </button>
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded">
              DOL ĐÌNH LỰC
            </div>
            {title && <span className="text-sm font-bold text-gray-900">{title}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: timer */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <span>⏱</span>
        <span className="font-mono">{timeLeft}</span>
      </div>
    </header>
  );
}

// ─── Section nav bar (bottom of listening/reading test) ──────────────────────
function IELTSTestBottomNav({
  sections,        // [{ id: 1, label: "Section 1", score: "0/10" }]
  active,
  onSelect,
  onSubmit,
  leftSlot,        // JSX — e.g. question-number pills or "Đã làm 0/10"
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-40">
      {/* Left info */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {leftSlot}
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect?.(s.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              s.id === active
                ? "bg-red-600 text-white"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {s.label}
            <span className={`ml-1 ${s.id === active ? "text-red-200" : "text-gray-300"}`}>
              {s.score}
            </span>
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
      >
        Nộp bài
      </button>
    </div>
  );
}

// ── UI: shared components ───────────────────────────────────────────────────
// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ name = "", src, size = 10 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0`}
      style={{ background: "linear-gradient(135deg,#e05,#f90)" }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${className}`}
    >
      {children}
    </span>
  );
}

// ─── RedButton ────────────────────────────────────────────────────────────────
function RedButton({ children, onClick, className = "", small = false }) {
  return (
    <button
      onClick={onClick}
      className={`bg-red-600 hover:bg-red-700 text-white font-bold transition-colors rounded-full ${
        small ? "text-xs px-4 py-1.5" : "text-sm px-6 py-2.5"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ─── CTABanner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex items-center justify-between mt-12 mx-4 md:mx-0">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900">Gia hạn miễn phí!</h3>
        <p className="text-gray-500 text-sm mt-1">
          Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!
        </p>
        <RedButton className="mt-3">Gia hạn miễn phí</RedButton>
      </div>
      <div className="text-6xl hidden md:block">📚</div>
    </div>
  );
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return <h2 className="text-xl font-extrabold text-gray-900 mb-4">{children}</h2>;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current = 1, total = 2, onChange }) {
  return (
    <div className="flex items-center gap-1 mt-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange?.(p)}
          className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
            p === current
              ? "bg-red-600 text-white"
              : "border border-gray-300 text-gray-600 hover:border-red-400"
          }`}
        >
          {p}
        </button>
      ))}
      <button className="w-8 h-8 text-gray-400 hover:text-gray-700">›</button>
    </div>
  );
}

// components/ui/AudioPlayer.jsx
// Reusable audio player strip — works in both light (DOL) and dark (Senglish) themes.
//
// Props:
//   speed       string   current speed label e.g. "1x"
//   onSpeed     fn       called with new speed string
//   progress    number   0-100
//   duration    string   "00:06"
//   elapsed     string   "00:00"
//   onPlay      fn
//   onReplay    fn
//   playing     bool
//   dark        bool     dark theme variant (Senglish / Shadowing)

const SPEEDS = ["0.5x", "0.75x", "1x", "1.25x", "1.5x"];

function AudioPlayer({
  speed = "1x",
  onSpeed,
  progress = 0,
  duration = "00:06",
  elapsed = "00:00",
  onPlay,
  onReplay,
  playing = false,
  dark = false,
}) {
  const track  = dark ? "bg-gray-700" : "bg-gray-200";
  const btn    = dark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500";
  const pill   = dark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700";
  const pillOn = dark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800";

  return (
    <div className="flex items-center gap-3">
      {/* Play / Pause */}
      <button
        onClick={onPlay}
        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-sm transition-colors shadow-sm shrink-0"
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Replay */}
      <button
        onClick={onReplay}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors shrink-0 ${btn}`}
      >
        ↩
      </button>

      {/* Progress bar */}
      <div className={`flex-1 h-1.5 ${track} rounded-full cursor-pointer relative`}>
        <div
          className="h-1.5 bg-red-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 font-mono whitespace-nowrap shrink-0">
        {elapsed}/{duration}
      </span>

      {/* Speed pills */}
      <div className="flex gap-0.5 shrink-0">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed?.(s)}
            className={`text-xs px-1.5 py-0.5 rounded transition-all ${
              speed === s ? pillOn : pill
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loop */}
      <button className={`text-xs border rounded px-2 py-1 transition-colors shrink-0 ${
        dark ? "border-gray-700 text-gray-500 hover:border-gray-500" : "border-gray-300 text-gray-500 hover:border-red-400"
      }`}>
        ⟳
      </button>
    </div>
  );
}

// components/ui/QuestionGrid.jsx
// Circular question-number grid (sidebar in Dictation, drawer in IELTS test).
//
// Props:
//   total       number   total questions
//   current     number   currently active question (1-indexed)
//   answered    number[] array of answered question numbers
//   onSelect    fn(n)
//   columns     number   grid columns (default 5)

function QuestionNumberGrid({
  total = 40,
  current = 1,
  answered = [],
  onSelect,
  columns = 5,
}) {
  const answeredSet = new Set(answered);

  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const isActive   = n === current;
        const isDone     = answeredSet.has(n);

        return (
          <button
            key={n}
            onClick={() => onSelect?.(n)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
              isActive
                ? "bg-red-600 text-white shadow-sm"
                : isDone
                ? "bg-red-100 text-red-600 border border-red-300"
                : "border border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

// ─── Collapsible drawer wrapper (used inside IELTS test) ──────────────────────
function QuestionDrawer({ sections, current, answered, onSelect, open, onToggle }) {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-200 ${open ? "w-52" : "w-0 overflow-hidden"}`}>
      {open && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-700">Bảng câu hỏi</span>
            <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          {sections.map((sec) => (
            <div key={sec.label} className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{sec.label}</p>
              <QuestionNumberGrid
                total={sec.total}
                current={current}
                answered={answered}
                onSelect={onSelect}
                columns={5}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// components/ui/FilterSidebar.jsx
// Generic left sidebar with search + checkbox filter groups + sort.
// Used by Writing List and Dictation List pages.
//
// Props:
//   groups      [{ title, items: string[] }]
//   selected    { [groupTitle]: string[] }    checked values per group
//   onToggle    fn(group, item)
//   sort        string
//   sortOptions string[]
//   onSort      fn(value)
//   searchValue string
//   onSearch    fn(value)

function FilterSidebar({
  groups = [],
  selected = {},
  onToggle,
  sort,
  sortOptions = ["Mới nhất", "Cũ nhất", "Nhiều lượt xem nhất"],
  onSort,
  searchValue = "",
  onSearch,
}) {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      {/* Search */}
      <p className="font-bold text-sm text-gray-700 mb-2">Tìm kiếm</p>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-5">
        <input
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          className="flex-1 text-sm px-3 py-2 outline-none"
          placeholder="Search"
        />
        <span className="px-3 text-gray-400 text-sm">🔍</span>
      </div>

      {/* Filter groups */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bộ lọc</p>
      {groups.map((group) => (
        <div key={group.title} className="mb-5">
          {group.title && (
            <p className="text-sm font-semibold text-gray-700 mb-1">{group.title}</p>
          )}
          <div className="space-y-1.5">
            {group.items.map((item) => {
              const checked = (selected[group.title] ?? []).includes(item);
              return (
                <label key={item} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={checked}
                    onChange={() => onToggle?.(group.title, item)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sort */}
      {sortOptions.length > 0 && (
        <>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">SẮP XẾP THEO</p>
          <div className="space-y-1.5">
            {sortOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-sort"
                  value={s}
                  checked={sort === s}
                  onChange={() => onSort?.(s)}
                  className="accent-red-600"
                />
                <span className="text-sm text-gray-600">{s}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

// components/ui/StatCard.jsx
// Small stat display card for Progress/Home pages.

function StatCard({ icon, value, label, dark = false }) {
  return (
    <div className={`rounded-xl p-4 flex items-center gap-3 ${dark ? "bg-gray-900" : "bg-white border border-gray-100 shadow-sm"}`}>
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>{value}</p>
        <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
      </div>
    </div>
  );
}

// ─── Streak badge ──────────────────────────────────────────────────────────────
function StreakBadge({ days }) {
  if (!days) return null;
  return (
    <span className="text-xs text-orange-400 flex items-center gap-0.5">
      🔥 {days} ngày
    </span>
  );
}

// ─── Level badge ───────────────────────────────────────────────────────────────
function LevelBadge({ level, className = "" }) {
  const colors = {
    A1: "bg-gray-200 text-gray-700",
    A2: "bg-green-100 text-green-700",
    B1: "bg-blue-100 text-blue-700",
    B2: "bg-blue-500 text-white",
    C1: "bg-purple-500 text-white",
    C2: "bg-red-600 text-white",
  };
  return (
    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colors[level] ?? "bg-gray-200 text-gray-700"} ${className}`}>
      {level}
    </span>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ icon = "📭", title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-3">{icon}</span>
      <p className="font-bold text-gray-700">{title}</p>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}

// ─── Tab bar (horizontal) ─────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange, dark = false }) {
  return (
    <div className={`flex gap-1 ${dark ? "bg-gray-800" : "bg-gray-100"} p-1 rounded-xl`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange?.(tab)}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            active === tab
              ? "bg-red-600 text-white shadow-sm"
              : dark
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── PAGE: Senglish Home ─────────────────────────────────────────────────────
// pages/senglish/HomePage.jsx

const RECENT_LESSONS = [
  { id: "cam20-t2-food",    title: "[CAM20 - T2] Developing food trends",   type: "Dictation",  progress: 0,  total: 42 },
  { id: "cam20-t2-vol",     title: "[CAM20 - T2] Role of the volunteers",    type: "Dictation",  progress: 0,  total: 43 },
  { id: "aero-smartwatch",  title: "Aero Smartwatch Sales Success",           type: "Shadowing",  progress: 0,  total: 9  },
];

const SUGGESTED = [
  { title: "[CAM20 - T1] The increase in loneliness",   type: "Dictation",  level: "B1", q: 64 },
  { title: "[CAM20 - T1] Reclaiming urban rivers",       type: "Dictation",  level: "B2", q: 53 },
  { title: "Tech Startup Pitch Meeting",                  type: "Shadowing",  level: "B2", q: 7  },
  { title: "[CAM20 - T3] Community project",              type: "Dictation",  level: "B1", q: 47 },
];

const TYPE_ICON = { Dictation: "🎧", Shadowing: "🎤", Speaking: "💬", Vocab: "📚" };

function LessonCard({ lesson, dark = false }) {
  const pct = lesson.total ? Math.round((lesson.progress / lesson.total) * 100) : 0;
  return (
    <div className={`rounded-xl p-4 cursor-pointer group transition-all ${
      dark
        ? "bg-gray-900 hover:bg-gray-800 border border-gray-800"
        : "bg-white border border-gray-200 hover:border-red-400 hover:shadow-sm"
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{TYPE_ICON[lesson.type] ?? "📄"}</span>
          <span className={`text-xs font-semibold ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {lesson.type}
          </span>
        </div>
        {lesson.level && <LevelBadge level={lesson.level} />}
      </div>
      <p className={`text-sm font-semibold leading-snug line-clamp-2 group-hover:text-red-500 transition-colors ${
        dark ? "text-gray-100" : "text-gray-900"
      }`}>
        {lesson.title}
      </p>
      <div className="mt-3">
        <div className={`h-1.5 rounded-full ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
          <div
            className="h-1.5 rounded-full bg-red-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
          {lesson.progress}/{lesson.total} câu · {pct}%
        </p>
      </div>
    </div>
  );
}

function DailyGoalRing({ done = 0, goal = 30 }) {
  const pct    = Math.min(100, Math.round((done / goal) * 100));
  const r      = 28;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#1f2937" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
        <text x="36" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
          {pct}%
        </text>
      </svg>
      <p className="text-xs text-gray-400">Mục tiêu ngày</p>
      <p className="text-xs text-gray-500">{done}/{goal} phút</p>
    </div>
  );
}

function SenglishHomePage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      <SenglishSidebar active="home" collapsed={collapsed} />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ☰
            </button>
            <h1 className="text-lg font-extrabold">Trang chủ</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white text-sm transition-colors">🔔</button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold">
              14
            </div>
          </div>
        </header>

        <div className="p-6 space-y-8 max-w-4xl">
          {/* Welcome + daily goal */}
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold">
                Chào buổi sáng, <span className="text-red-500">14.phạm tiến đạt</span> 👋
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Hôm nay bạn chưa luyện tập. Bắt đầu ngay để duy trì chuỗi ngày học!
              </p>
              <button className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors">
                Tiếp tục luyện tập →
              </button>
            </div>
            <DailyGoalRing done={0} goal={30} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon="🔥" value="0 ngày" label="Chuỗi hiện tại" dark />
            <StatCard icon="⏱" value="0m" label="Hôm nay" dark />
            <StatCard icon="🎯" value="0 XP" label="Tuần này" dark />
            <StatCard icon="🏆" value="#2930" label="Xếp hạng" dark />
          </div>

          {/* Continue learning */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold">Tiếp tục học</h2>
              <button className="text-sm text-red-500 hover:text-red-400 transition-colors">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {RECENT_LESSONS.map((l) => <LessonCard key={l.id} lesson={l} dark />)}
            </div>
          </section>

          {/* Suggested */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold">Gợi ý cho bạn</h2>
              <button className="text-sm text-red-500 hover:text-red-400 transition-colors">Xem thêm</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUGGESTED.map((l) => <LessonCard key={l.title} lesson={{ ...l, progress: 0, total: l.q }} dark />)}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="text-lg font-extrabold mb-3">Luyện tập nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "🎧", label: "Dictation",     sub: "Nghe & chép",   color: "from-blue-600 to-blue-800"   },
                { icon: "🎤", label: "Shadowing",     sub: "Nghe & lặp lại", color: "from-purple-600 to-purple-800" },
                { icon: "💬", label: "Luyện nói",    sub: "Speaking AI",    color: "from-green-600 to-green-800"  },
                { icon: "📚", label: "Từ vựng",      sub: "Flashcard",      color: "from-orange-600 to-orange-800" },
              ].map((a) => (
                <button
                  key={a.label}
                  className={`bg-gradient-to-br ${a.color} rounded-xl p-4 text-left hover:opacity-90 transition-opacity`}
                >
                  <span className="text-2xl block mb-2">{a.icon}</span>
                  <p className="font-bold text-sm">{a.label}</p>
                  <p className="text-xs text-white/70 mt-0.5">{a.sub}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ── PAGE: Leaderboard + Progress ────────────────────────────────────────────
// pages/senglish/LeaderboardPage.jsx

const DATA = [
  { rank: 1, name: "Diệu Thanh",                  time: "8h 3m",   streak: 11, medal: "🥇" },
  { rank: 2, name: "대목 원",                       time: "14h 42m", streak: 21, medal: "🥈" },
  { rank: 3, name: "Hồng khương",                  time: "7h",      streak: 9,  medal: "🥉" },
  { rank: 4, name: "Thu Uyên Mai",                 time: "6h 5m",   streak: 3 },
  { rank: 5, name: "Tienganhluyennoi123 User",     time: "5h 21m",  streak: 4 },
  { rank: 6, name: "THO TRẦN NHẬT",               time: "4h 54m" },
  { rank: 7, name: "Nguyễn Phát",                 time: "4h 36m",  streak: 4 },
  { rank: 8, name: "Thu Oanh Đào",                time: "4h 4m",   streak: 4 },
  { rank: 9, name: "Trần Phương",                  time: "3h 50m",  streak: 6 },
  { rank: 10, name: "Hee Min",                     time: "3h 27m",  streak: 2 },
  { rank: 11, name: "Linh Nguyễn Diệu",           time: "3h 20m" },
  { rank: 12, name: "suna kim",                    time: "3h 10m" },
  { rank: 13, name: "Phương Uyên Trần Nguyễn",    time: "3h 3m",   streak: 6 },
  { rank: 14, name: "Quỳnh Hương Đặng Nguyễn",   time: "3h 1m",   streak: 11 },
  { rank: 15, name: "Ann User",                    time: "2h 57m" },
  { rank: 16, name: "Phương Nam Trần",             time: "2h 52m" },
  { rank: 17, name: "Liam Fung",                   time: "2h 37m" },
  { rank: 18, name: "Tùng Phạm Xuân",             time: "2h 34m" },
  { rank: 19, name: "Ngọc Trần",                  time: "2h 31m",  streak: 5 },
  { rank: 20, name: "Harvey Nguyen",               time: "2h 29m",  streak: 37 },
];

// ─── Podium top-3 ─────────────────────────────────────────────────────────────
function Podium({ top3 }) {
  const order = [top3[1], top3[0], top3[2]]; // 2nd  1st  3rd
  const heights = ["h-28", "h-36", "h-24"];
  const sizes   = ["w-14 h-14", "w-20 h-20", "w-14 h-14"];
  const borders = ["border-gray-300", "border-yellow-400", "border-orange-500"];

  return (
    <div className="flex justify-center items-end gap-6 px-6 py-8">
      {order.map((u, i) => (
        <div key={u.rank} className="flex flex-col items-center gap-1">
          <span className="text-2xl">{u.medal}</span>
          <div className={`rounded-full border-4 ${borders[i]} overflow-hidden ${sizes[i]}`}>
            <Avatar name={u.name} size={i === 1 ? 20 : 14} />
          </div>
          <span className={`font-semibold mt-1 ${i === 1 ? "text-white text-sm" : "text-gray-300 text-xs"}`}>
            {u.name.length > 12 ? u.name.slice(0, 12) + "…" : u.name}
          </span>
          <span className="text-xs text-gray-400">{u.time}</span>
          {u.streak && <span className="text-xs text-orange-400">🔥 {u.streak}d</span>}
          <div
            className={`${heights[i]} w-20 rounded-t-lg mt-1 flex items-end justify-center pb-2 font-bold text-lg`}
            style={{ background: i === 1 ? "rgba(212,37,37,0.25)" : "rgba(255,255,255,0.06)" }}
          >
            {u.rank}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function RankRow({ user }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
      <span className="w-7 text-center text-gray-500 font-mono text-sm">{user.rank}</span>
      <Avatar name={user.name} size={9} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{user.name}</p>
        {user.streak && <p className="text-xs text-orange-400">🔥 {user.streak} ngày</p>}
      </div>
      <span className="text-sm font-semibold text-gray-200">{user.time}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function LeaderboardPage() {
  const [period, setPeriod] = useState("Tuần");
  const [tab,    setTab]    = useState("time");

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <SenglishSidebar active="leaderboard" />

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Title */}
        <div className="text-center pt-10 pb-4 px-4">
          <h1 className="text-3xl font-extrabold">🏆 Bảng xếp hạng</h1>
          <p className="text-gray-400 mt-1 text-sm">Xem thứ hạng của bạn so với người học khác</p>
          <p className="text-gray-500 text-xs mt-1">Vị trí đầu bảng chỉ cách một buổi luyện tập. 🚀</p>

          {/* Period toggle */}
          <div className="mt-4 inline-flex gap-1 bg-gray-800 p-1 rounded-full">
            {["Tuần", "Tháng"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  period === p ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Metric toggle */}
          <div className="mt-3 flex justify-center gap-2">
            {[
              { key: "time",   label: "⏱ Thời gian luyện tập" },
              { key: "points", label: "⭐ Điểm" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  tab === key
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Podium top3={DATA.slice(0, 3)} />

        {/* Ranks 4-20 */}
        <div className="max-w-2xl mx-auto px-4 space-y-1">
          {DATA.slice(3).map((u) => <RankRow key={u.rank} user={u} />)}
        </div>
      </main>

      {/* My rank sticky bar */}
      <div className="fixed bottom-0 right-0 left-44 bg-gray-900 border-t border-gray-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-gray-400 font-mono text-sm">#2930</span>
          <Avatar name="14.phạm tiến đạt" size={8} />
          <span className="flex-1 text-sm">14.phạm tiến đạt</span>
          <span className="text-gray-400 text-sm">0m</span>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// pages/senglish/ProgressPage.jsx
// ══════════════════════════════════════════════════════════════════════════════
function ProgressPage() {
  const [tab, setTab] = useState("Dictation");
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <SenglishSidebar active="stats" />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-extrabold">Tiến trình học tập</h1>
        <p className="text-gray-400 text-sm mt-1">
          Theo dõi hoạt động hàng ngày, chuỗi ngày học và thói quen luyện tập.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { icon: "🔥", value: "0 ngày", label: "Chuỗi dài nhất" },
            { icon: "📖", value: "0",       label: "Từ đã lưu" },
            { icon: "⏱",  value: "0m",      label: "Thời gian luyện tập" },
            { icon: "🎯", value: "0 XP",    label: "Tổng XP" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="mt-8">
          <h2 className="font-bold mb-3">Tổng quan hoạt động (6 tháng gần đây)</h2>
          <div className="bg-gray-900 rounded-xl p-5 overflow-x-auto">
            <div className="flex gap-4 text-xs text-gray-500 mb-2 ml-8">
              {months.map((m) => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
            {["Mon", "Wed", "Fri"].map((day) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <span className="w-7 text-xs text-gray-500">{day}</span>
                <div className="flex gap-1">
                  {Array.from({ length: 26 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-sm bg-gray-800" />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">0 activities in 2025</p>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <span>Less</span>
              {[0.15, 0.3, 0.5, 0.7, 0.9].map((o) => (
                <div
                  key={o}
                  className="w-3 h-3 rounded-sm"
                  style={{ background: `rgba(212,37,37,${o})` }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Daily chart */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h2 className="font-bold">Luyện tập hàng ngày (30 ngày gần đây)</h2>
            <div className="flex gap-2 flex-wrap">
              {["Dictation", "Shadowing", "Luyện nói", "Từ vựng"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    tab === t
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Phút luyện tập", "XP kiếm được"].map((label) => (
              <div key={label} className="bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-3">{label}</p>
                {[4, 3, 2, 1].map((n) => (
                  <div key={n} className="flex items-center gap-1 mb-1">
                    <span className="text-xs text-gray-600 w-3">{n}</span>
                    <div className="flex-1 border-b border-dashed border-gray-800" />
                  </div>
                ))}
                <div className="mt-1 h-1 bg-red-600/20 rounded-full" />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>27 thg 3</span>
                  <span>25 thg 4</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// ── PAGE: Vocab ─────────────────────────────────────────────────────────────
// pages/senglish/VocabPage.jsx

const WORD_LISTS = [
  { id: 1, name: "CAM20 - T2 Food Trends",      count: 18, learned: 0,  color: "bg-blue-600"   },
  { id: 2, name: "CAM20 - T2 Volunteers",        count: 12, learned: 0,  color: "bg-green-600"  },
  { id: 3, name: "Nanotechnology",               count: 24, learned: 0,  color: "bg-purple-600" },
  { id: 4, name: "Aero Smartwatch",              count: 9,  learned: 0,  color: "bg-orange-600" },
];

const SAMPLE_WORDS = [
  { word: "ambassador",    pos: "n", vn: "đại sứ; người đại diện", example: "Influencers become brand ambassadors on social media." },
  { word: "distinctive",  pos: "adj", vn: "đặc trưng, khác biệt",  example: "Hoi An has a distinctive cuisine." },
  { word: "ingredient",   pos: "n", vn: "nguyên liệu",              example: "Supermarkets track demand for ingredients." },
  { word: "influential",  pos: "adj", vn: "có ảnh hưởng",           example: "Famous chefs are influential in food trends." },
  { word: "publicity",    pos: "n", vn: "sự quảng bá",              example: "The campaign received a lot of publicity." },
  { word: "sustainability", pos: "n", vn: "tính bền vững",          example: "Consumers care about environmental sustainability." },
];

// ─── Flashcard ─────────────────────────────────────────────────────────────────
function Flashcard({ word, onKnow, onRepeat }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="w-full max-w-sm cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "200px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-3xl font-extrabold text-white">{word.word}</p>
            <p className="text-sm text-gray-400 uppercase tracking-widest">{word.pos}</p>
            <p className="text-xs text-gray-600 mt-2">Nhấn để xem nghĩa</p>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-red-600 rounded-2xl flex flex-col items-center justify-center gap-3 px-6 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xl font-bold text-white">{word.vn}</p>
            <p className="text-sm text-red-100 italic">"{word.example}"</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <button
          onClick={onRepeat}
          className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white text-sm font-semibold transition-all"
        >
          🔁 Ôn lại
        </button>
        <button
          onClick={onKnow}
          className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all"
        >
          ✓ Đã biết
        </button>
      </div>
    </div>
  );
}

// ─── Word row (list view) ──────────────────────────────────────────────────────
function WordRow({ word }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-gray-900 rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-gray-850 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-white">{word.word}</span>
          <span className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{word.pos}</span>
        </div>
        <p className="text-sm text-gray-300">{word.vn}</p>
        <p className="text-xs text-gray-500 mt-1 italic">"{word.example}"</p>
      </div>
      <button
        onClick={() => setSaved(!saved)}
        className={`shrink-0 text-lg transition-all ${saved ? "text-red-500" : "text-gray-700 hover:text-gray-400"}`}
      >
        {saved ? "♥" : "♡"}
      </button>
    </div>
  );
}

// ─── Word List Card ────────────────────────────────────────────────────────────
function WordListCard({ list }) {
  const pct = list.count ? Math.round((list.learned / list.count) * 100) : 0;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-red-600 transition-all group">
      <div className={`w-10 h-10 ${list.color} rounded-lg flex items-center justify-center text-xl mb-3`}>
        📚
      </div>
      <p className="font-semibold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2">
        {list.name}
      </p>
      <p className="text-xs text-gray-500 mt-1">{list.count} từ</p>
      <div className="mt-3 h-1.5 bg-gray-800 rounded-full">
        <div
          className={`h-1.5 rounded-full ${list.color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{list.learned}/{list.count} đã học</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VocabPage
// ══════════════════════════════════════════════════════════════════════════════
function VocabPage() {
  const [mode,    setMode]    = useState("Danh sách");
  const [cardIdx, setCardIdx] = useState(0);

  const currentCard = SAMPLE_WORDS[cardIdx % SAMPLE_WORDS.length];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      <SenglishSidebar active="vocab" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h1 className="text-lg font-extrabold">Luyện từ vựng</h1>
          <div className="w-64">
            <TabBar
              tabs={["Danh sách", "Flashcard", "Kho từ"]}
              active={mode}
              onChange={setMode}
              dark
            />
          </div>
        </header>

        <div className="p-6 max-w-3xl">
          {/* ── Danh sách ── */}
          {mode === "Danh sách" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-extrabold text-base mb-3">Danh sách từ của tôi</h2>
                {WORD_LISTS.length === 0 ? (
                  <EmptyState icon="📭" title="Chưa có danh sách từ" description="Lưu từ vựng từ bài luyện tập để tạo danh sách." />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {WORD_LISTS.map((l) => <WordListCard key={l.id} list={l} />)}
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-extrabold text-base mb-3">Từ vựng từ bài học gần đây</h2>
                <div className="space-y-2">
                  {SAMPLE_WORDS.map((w) => <WordRow key={w.word} word={w} />)}
                </div>
              </div>
            </div>
          )}

          {/* ── Flashcard ── */}
          {mode === "Flashcard" && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{cardIdx + 1} / {SAMPLE_WORDS.length} từ</p>
                <div className="flex-1 mx-4 h-1.5 bg-gray-800 rounded-full">
                  <div
                    className="h-1.5 bg-red-600 rounded-full transition-all"
                    style={{ width: `${((cardIdx + 1) / SAMPLE_WORDS.length) * 100}%` }}
                  />
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Xáo trộn</button>
              </div>

              <Flashcard
                word={currentCard}
                onKnow={() => setCardIdx((i) => i + 1)}
                onRepeat={() => setCardIdx((i) => i + 1)}
              />
            </div>
          )}

          {/* ── Kho từ ── */}
          {mode === "Kho từ" && (
            <div className="space-y-4">
              {/* Search */}
              <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 gap-2">
                <span className="text-gray-500">🔍</span>
                <input
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                  placeholder="Tìm từ vựng..."
                />
              </div>

              <div className="space-y-2">
                {SAMPLE_WORDS.map((w) => <WordRow key={w.word} word={w} />)}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── PAGE: Speaking ──────────────────────────────────────────────────────────
// pages/senglish/SpeakingPage.jsx

const TOPICS = [
  { id: 1, title: "Introduce yourself",           level: "A2", questions: 5,  done: false, icon: "👋" },
  { id: 2, title: "Describe your hometown",        level: "B1", questions: 6,  done: false, icon: "🏙️" },
  { id: 3, title: "Talk about your daily routine", level: "B1", questions: 5,  done: false, icon: "⏰" },
  { id: 4, title: "Environmental issues",          level: "B2", questions: 7,  done: false, icon: "🌱" },
  { id: 5, title: "Technology & society",          level: "B2", questions: 6,  done: false, icon: "💻" },
  { id: 6, title: "Work & career goals",           level: "C1", questions: 8,  done: false, icon: "💼" },
];

const IELTS_PARTS = [
  {
    part: "Part 1",
    sub: "Short questions about familiar topics",
    questions: [
      "Do you work or are you a student?",
      "Where are you from?",
      "Do you enjoy reading? Why or why not?",
    ],
  },
  {
    part: "Part 2",
    sub: "1-2 minute individual long turn",
    questions: [
      "Describe a place you have visited that you particularly liked. You should say: where it is, when you went there, what you did there, and explain why you liked it so much.",
    ],
  },
  {
    part: "Part 3",
    sub: "Discussion of abstract topics",
    questions: [
      "Why do you think people travel to foreign countries?",
      "How has tourism changed in your country?",
      "What are the advantages and disadvantages of living abroad?",
    ],
  },
];

// ─── Topic Card ────────────────────────────────────────────────────────────────
function TopicCard({ topic }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-red-600 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{topic.icon}</span>
        <LevelBadge level={topic.level} />
      </div>
      <p className="font-semibold text-sm text-white group-hover:text-red-400 transition-colors">
        {topic.title}
      </p>
      <p className="text-xs text-gray-500 mt-1">{topic.questions} câu hỏi</p>
      <button className="mt-3 w-full py-1.5 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-all">
        Luyện tập →
      </button>
    </div>
  );
}

// ─── Recording panel ──────────────────────────────────────────────────────────
function RecordingPanel({ question }) {
  const [state,    setState]    = useState("idle"); // idle | recording | done
  const [feedback, setFeedback] = useState(null);

  const handleRecord = () => {
    if (state === "idle")      { setState("recording"); }
    else if (state === "recording") {
      setState("done");
      // simulate AI feedback
      setFeedback({
        score: 6.5,
        fluency: 6,
        vocab: 7,
        grammar: 6,
        tips: [
          "Try to use more linking words (however, furthermore, as a result).",
          "Your vocabulary range is good — aim for less common collocations.",
          "Watch out for subject-verb agreement in complex sentences.",
        ],
      });
    }
    else { setState("idle"); setFeedback(null); }
  };

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Câu hỏi</p>
        <p className="text-white text-base leading-relaxed">{question}</p>
        <p className="text-xs text-gray-600 mt-3">💡 Chuẩn bị 1 phút · Trả lời 2 phút</p>
      </div>

      {/* Record button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleRecord}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg ${
            state === "recording"
              ? "bg-red-600 animate-pulse shadow-red-600/40"
              : state === "done"
              ? "bg-green-600 shadow-green-600/30"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          {state === "idle" ? "🎙" : state === "recording" ? "⏹" : "✓"}
        </button>
        <p className="text-xs text-gray-500">
          {state === "idle" && "Nhấn để ghi âm"}
          {state === "recording" && "Đang ghi âm… nhấn để dừng"}
          {state === "done" && "Hoàn thành! Xem phản hồi bên dưới"}
        </p>
      </div>

      {/* AI Feedback */}
      {feedback && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <p className="font-bold text-white">🤖 Phản hồi AI</p>

          {/* Score */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-red-500">{feedback.score}</p>
              <p className="text-xs text-gray-500">Band ước tính</p>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: "Fluency", score: feedback.fluency },
                { label: "Vocabulary", score: feedback.vocab },
                { label: "Grammar", score: feedback.grammar },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20 shrink-0">{m.label}</span>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full">
                    <div
                      className="h-1.5 bg-red-600 rounded-full"
                      style={{ width: `${(m.score / 9) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white w-6 text-right">{m.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Gợi ý cải thiện</p>
            {feedback.tips.map((tip, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-red-500 shrink-0">•</span>
                <p className="text-xs text-gray-300">{tip}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setState("idle"); setFeedback(null); }}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SpeakingPage
// ══════════════════════════════════════════════════════════════════════════════
function SpeakingPage() {
  const [tab,      setTab]      = useState("Chủ đề");
  const [partIdx,  setPartIdx]  = useState(0);
  const [qIdx,     setQIdx]     = useState(0);

  const part     = IELTS_PARTS[partIdx];
  const question = part.questions[qIdx];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      <SenglishSidebar active="speaking" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h1 className="text-lg font-extrabold">Luyện nói</h1>
          <div className="w-72">
            <TabBar
              tabs={["Chủ đề", "IELTS Speaking"]}
              active={tab}
              onChange={setTab}
              dark
            />
          </div>
        </header>

        <div className="p-6 max-w-3xl space-y-6">
          {/* ── Chủ đề ── */}
          {tab === "Chủ đề" && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Chọn chủ đề để luyện nói cùng AI</p>
                <div className="flex gap-2">
                  {["Tất cả", "A2", "B1", "B2", "C1"].map((f) => (
                    <button key={f} className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TOPICS.map((t) => <TopicCard key={t.id} topic={t} />)}
              </div>
            </>
          )}

          {/* ── IELTS Speaking ── */}
          {tab === "IELTS Speaking" && (
            <div className="flex gap-6">
              {/* Part selector */}
              <div className="w-44 shrink-0 space-y-2">
                {IELTS_PARTS.map((p, i) => (
                  <button
                    key={p.part}
                    onClick={() => { setPartIdx(i); setQIdx(0); }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      partIdx === i
                        ? "bg-red-600 text-white"
                        : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <p className="text-sm font-bold">{p.part}</p>
                    <p className="text-xs opacity-70 mt-0.5 line-clamp-1">{p.sub}</p>
                  </button>
                ))}
              </div>

              {/* Practice panel */}
              <div className="flex-1 space-y-4">
                {/* Question nav */}
                <div className="flex items-center gap-2">
                  {part.questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setQIdx(i)}
                      className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                        qIdx === i
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <RecordingPanel question={question} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── PAGE: AI Dictionary ─────────────────────────────────────────────────────
// pages/senglish/AIDictPage.jsx

const EXAMPLE_RESULT = {
  word: "ambassador",
  ipa: "/æmˈbæs.ə.dər/",
  pos: "noun",
  definitions: [
    { vn: "đại sứ (ngoại giao)", en: "An official who lives in a foreign country and represents their own government there." },
    { vn: "đại diện, người quảng bá", en: "A person who acts as a representative of a particular activity or cause." },
  ],
  examples: [
    "Influencers on social media become ambassadors for a brand.",
    "She was appointed as a goodwill ambassador for UNICEF.",
  ],
  collocations: ["brand ambassador", "goodwill ambassador", "cultural ambassador", "appoint an ambassador"],
  synonyms: ["representative", "envoy", "diplomat", "spokesperson"],
  antonyms: [],
  level: "C1",
  family: [
    { word: "embassy", pos: "n", vn: "đại sứ quán" },
    { word: "ambassadorial", pos: "adj", vn: "thuộc đại sứ" },
  ],
};

const RECENT = ["ambassador", "distinctive", "sustainability", "publicity", "ingredient"];

// ─── IPA chip ──────────────────────────────────────────────────────────────────
function IPAChip({ ipa }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 font-mono text-sm">{ipa}</span>
      <button className="text-gray-600 hover:text-white text-sm transition-colors">🔊</button>
    </div>
  );
}

// ─── Tag pill ──────────────────────────────────────────────────────────────────
function Pill({ label, variant = "default" }) {
  const styles = {
    default: "bg-gray-800 text-gray-300",
    red:     "bg-red-600/20 text-red-400 border border-red-600/30",
    blue:    "bg-blue-600/20 text-blue-400 border border-blue-600/30",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AIDictPage
// ══════════════════════════════════════════════════════════════════════════════
function AIDictPage() {
  const [query,   setQuery]   = useState("");
  const [result,  setResult]  = useState(EXAMPLE_RESULT);
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState("Định nghĩa");

  const handleSearch = (word) => {
    if (!word.trim()) return;
    setLoading(true);
    setQuery(word);
    setTimeout(() => { setResult({ ...EXAMPLE_RESULT, word }); setLoading(false); }, 600);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      <SenglishSidebar active="ai-dict" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-800">
          <h1 className="text-lg font-extrabold mb-3">Từ điển AI</h1>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus-within:border-red-600 transition-colors">
            <span className="text-gray-500">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm"
              placeholder="Nhập từ hoặc cụm từ cần tra..."
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
            )}
            <button
              onClick={() => handleSearch(query)}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Tra
            </button>
          </div>

          {/* Recent */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-gray-600">Gần đây:</span>
            {RECENT.map((w) => (
              <button
                key={w}
                onClick={() => handleSearch(w)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors underline underline-offset-2"
              >
                {w}
              </button>
            ))}
          </div>
        </header>

        <div className="p-6 max-w-2xl">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <span className="animate-spin mr-2">⏳</span> Đang tra...
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5">
              {/* Word header */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-white">{result.word}</h2>
                    <IPAChip ipa={result.ipa} />
                    <div className="flex items-center gap-2 mt-2">
                      <Pill label={result.pos} />
                      <Pill label={result.level} variant="red" />
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-red-500 text-2xl transition-colors">♡</button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-gray-800">
                {["Định nghĩa", "Ví dụ", "Từ liên quan"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-2 text-sm font-semibold transition-all border-b-2 -mb-px ${
                      tab === t
                        ? "border-red-600 text-white"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* ── Định nghĩa ── */}
              {tab === "Định nghĩa" && (
                <div className="space-y-4">
                  {result.definitions.map((def, i) => (
                    <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shrink-0 font-bold">
                          {i + 1}
                        </span>
                        <p className="text-red-400 font-semibold text-sm">{def.vn}</p>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed pl-7">{def.en}</p>
                    </div>
                  ))}

                  {/* Collocations */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Collocations</p>
                    <div className="flex flex-wrap gap-2">
                      {result.collocations.map((c) => <Pill key={c} label={c} variant="blue" />)}
                    </div>
                  </div>

                  {/* Synonyms */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Từ đồng nghĩa</p>
                    <div className="flex flex-wrap gap-2">
                      {result.synonyms.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSearch(s)}
                          className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Ví dụ ── */}
              {tab === "Ví dụ" && (
                <div className="space-y-3">
                  {result.examples.map((ex, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3">
                      <span className="text-red-500 font-bold shrink-0">{i + 1}.</span>
                      <div>
                        <p className="text-sm text-white leading-relaxed">{ex}</p>
                        <button className="text-xs text-gray-600 hover:text-gray-400 mt-1 transition-colors">
                          🔊 Nghe
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* AI generate */}
                  <button className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-red-600 hover:text-red-400 text-sm transition-all">
                    ✨ Tạo thêm ví dụ bằng AI
                  </button>
                </div>
              )}

              {/* ── Từ liên quan ── */}
              {tab === "Từ liên quan" && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Họ từ (Word family)</p>
                  {result.family.map((f) => (
                    <div
                      key={f.word}
                      onClick={() => handleSearch(f.word)}
                      className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-red-600 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white group-hover:text-red-400 transition-colors">{f.word}</span>
                        <Pill label={f.pos} />
                      </div>
                      <span className="text-sm text-gray-400">{f.vn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── PAGE: Shadowing ─────────────────────────────────────────────────────────
// pages/shadowing/ShadowingPage.jsx

// ─── data ─────────────────────────────────────────────────────────────────────
const SENTENCES = [
  { id: 1, words: 17, active: true,  text: "Before we wrap up today's meeting, there's one more thing we need to cover: the Aero smartwatch." },
  { id: 2, words: 22, active: false, text: null },
  { id: 3, words: 18, active: false, text: null },
  { id: 4, words: 14, active: false, text: null },
  { id: 5, words: 9,  active: false, text: null },
  { id: 6, words: 19, active: false, text: null },
  { id: 7, words: 12, active: false, text: null },
  { id: 8, words: 10, active: false, text: null },
  { id: 9, words: 16, active: false, text: null },
];

const SPEEDS = ["0.5x", "0.75x", "1x", "1.25x", "1.5x"];

const WORD_HINTS = [
  "••••••", "••", "••••", "••", "••••••••", "•••••••", "•••",
  "••••", "•••••", "••", "••••", "••", "•••••", "•••", "••••", "••••••••••",
];

// ─── Audio player strip ───────────────────────────────────────────────────────
function AudioStrip({ speed, onSpeed }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button className="text-gray-400 hover:text-white transition-colors">⏮</button>
      <button className="text-gray-400 hover:text-white transition-colors">↩</button>
      <button className="w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold hover:scale-105 transition-transform shadow">
        ▶
      </button>
      <div className="flex gap-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed(s)}
            className={`text-xs px-2 py-0.5 rounded transition-all ${
              speed === s
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sentence list item ───────────────────────────────────────────────────────
function SentenceItem({ s, isCurrent, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-3 cursor-pointer transition-all ${
        isCurrent
          ? "bg-gray-700 border border-gray-600"
          : "bg-gray-800 hover:bg-gray-750"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              isCurrent ? "border-red-600 bg-red-600" : "border-gray-600"
            }`}
          >
            {isCurrent && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
          </div>
          <span className="text-xs text-gray-400">#{s.id}</span>
        </div>
        <div className="flex items-center gap-2">
          {isCurrent && (
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
              ĐANG HỌC
            </span>
          )}
          <button className="text-gray-600 hover:text-white text-xs transition-colors">↩</button>
          <button className="text-gray-600 hover:text-white text-xs transition-colors">→</button>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed font-mono tracking-wider">
        {isCurrent
          ? "•••••• •••• •••• •••••••••• •••••••• ••• •••• •••• •• •••••••• •• ••• ••••"
          : "•• ••••• •• ••• •••••• •••••••••"}
      </p>
    </div>
  );
}

// ─── Lesson panel (middle column) ─────────────────────────────────────────────
function LessonPanel({ current, onSelect, speed, onSpeed }) {
  const [showSubs, setShowSubs] = useState(true);

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-start gap-2">
        <button className="text-gray-400 hover:text-white mt-0.5 transition-colors">←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold shrink-0">B2</span>
            <span className="text-sm font-bold text-white truncate">Aero Smartwatch Sales Success</span>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="px-4 py-2 flex gap-2 border-b border-gray-800">
        <button className="text-xs bg-gray-700 text-white font-semibold px-3 py-1.5 rounded-lg">
          🎧 Shadowing
        </button>
        <button className="text-xs text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors">
          🎙 Dictation
        </button>
      </div>

      {/* Mini audio player */}
      <div className="p-4 border-b border-gray-800">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
            🎵
          </div>
          <p className="text-xs text-gray-400">Audio Lesson</p>
          <p className="font-mono text-white font-bold text-lg">00:00</p>
          <p className="text-xs text-gray-600 mt-0.5">1/9</p>
        </div>
        <div className="mt-3">
          <AudioStrip speed={speed} onSpeed={onSpeed} />
        </div>
      </div>

      {/* Subtitle tab */}
      <div className="px-4 pt-3 flex gap-3 border-b border-gray-800 pb-3">
        <button className="text-xs text-white font-semibold border-b-2 border-white pb-1">
          ≡ Phụ đề
        </button>
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          ✨ Gợi ý bài học
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <span>0/9</span>
        <div className="flex items-center gap-2">
          <span>Hiện</span>
          <button
            onClick={() => setShowSubs(!showSubs)}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              showSubs ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${
              showSubs ? "left-4" : "left-0.5"
            }`} />
          </button>
        </div>
      </div>
      <div className="px-4 pb-2 flex items-center justify-between text-xs">
        <span className="text-gray-400">Tiến độ</span>
        <span className="text-white font-semibold">0%</span>
      </div>

      {/* Sentence list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {SENTENCES.map((s) => (
          <SentenceItem
            key={s.id}
            s={s}
            isCurrent={s.id === current}
            onClick={() => onSelect(s.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Shadowing Page
// ══════════════════════════════════════════════════════════════════════════════
function ShadowingPage() {
  const [current,   setCurrent]   = useState(1);
  const [speed,     setSpeed]     = useState("1x");
  const [recording, setRecording] = useState(false);

  const sentence = SENTENCES.find((s) => s.id === current);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white font-sans">
      {/* Left nav */}
      <SenglishSidebar active="shadowing" />

      {/* Middle lesson panel */}
      <LessonPanel
        current={current}
        onSelect={setCurrent}
        speed={speed}
        onSpeed={setSpeed}
      />

      {/* Right practice panel */}
      <main className="flex-1 p-8 flex flex-col gap-5 overflow-y-auto">
        {/* Sentence display */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              #{current} · {sentence?.words} từ
            </span>
            <div className="flex gap-3">
              <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                📋 Câu mẫu
              </button>
              <button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                🌐 Dịch nghĩa
              </button>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">
                ⚑ Báo cáo
              </button>
            </div>
          </div>

          {sentence?.text ? (
            <p className="text-white text-lg font-medium leading-relaxed">{sentence.text}</p>
          ) : (
            <p className="text-gray-600 text-lg font-mono tracking-widest">
              •••••• •• ••••• ••••• ••• •••• •• •• ••••••••• •• •••• ••••••••
            </p>
          )}
          <p className="text-xs text-blue-400 mt-3 cursor-pointer hover:underline">
            ⊞ Nhấn vào từ để tra nghĩa
          </p>
        </div>

        {/* Recording */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <button
            onClick={() => setRecording(!recording)}
            className="w-full flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                recording
                  ? "bg-red-600 animate-pulse shadow-lg shadow-red-600/30"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              🎙
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">
                {recording ? "Đang ghi âm…" : "Nhấn để bắt đầu ghi âm"}
              </p>
              <p className="text-xs text-gray-400">(Tối đa 30 giây)</p>
            </div>
          </button>
        </div>

        {/* Word hints */}
        <div>
          <p className="text-xs text-gray-500 mb-3">Nghe và lặp lại câu trên</p>
          <div className="flex flex-wrap gap-2">
            {WORD_HINTS.map((w, i) => (
              <span
                key={i}
                className="bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-sm font-mono tracking-widest hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between pt-2">
          <AudioStrip speed={speed} onSpeed={setSpeed} />
          <button
            onClick={() => setCurrent((c) => Math.min(SENTENCES.length, c + 1))}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            Tiếp theo →
          </button>
        </div>
      </main>
    </div>
  );
}

// ── PAGE: IELTS Listening + Reading Test ────────────────────────────────────
// pages/ielts-test/ListeningTestPage.jsx + ReadingTestPage.jsx

// ─── shared data ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 1, label: "Section 1", score: "0/10" },
  { id: 2, label: "Section 2", score: "0/10" },
  { id: 3, label: "Section 3", score: "0/10" },
  { id: 4, label: "Section 4", score: "0/10" },
];

// ─── Q11-16 data ──────────────────────────────────────────────────────────────
const Q11_16 = [
  { id: 11, text: "Walking around the town centre" },
  { id: 12, text: "Helping at concerts" },
  { id: 13, text: "Getting involved with community groups" },
  { id: 14, text: "Helping with a magazine" },
  { id: 15, text: "Participating at lunches for retired people" },
  { id: 16, text: "Helping with the website" },
];
const OPTIONS_AI = [
  { key: "A", text: "Providing entertainment" },
  { key: "B", text: "Providing publicity about a council service" },
  { key: "C", text: "Contacting local businesses" },
  { key: "D", text: "Giving advice to visitors" },
  { key: "E", text: "Collecting feedback on events" },
  { key: "F", text: "Selling tickets" },
  { key: "G", text: "Introducing guest speakers at an event" },
  { key: "H", text: "Encouraging cooperation between local organisations" },
  { key: "I", text: "Helping people find their seats" },
];

// ─── Q17-20 data ──────────────────────────────────────────────────────────────
const Q17_20 = [
  { id: 17, q: "Which event requires the largest number of volunteers?",
    opts: ["the music festival", "the science festival", "the book festival"] },
  { id: 18, q: "What is the most important requirement for volunteers at the festivals?",
    opts: ["interpersonal skills", "personal interest in the event", "flexibility"] },
  { id: 19, q: "New volunteers will start working in the week beginning",
    opts: ["2 September.", "9 September.", "23 September."] },
  { id: 20, q: "What is the next annual event for volunteers?",
    opts: ["a boat trip", "a barbecue", "a party"] },
];

// ─── Q31-40 data ──────────────────────────────────────────────────────────────
const Q31_40 = [
  {
    heading: "Developing food trends",
    items: [
      { id: 31, pre: "The growth in interest in food fashions started with", post: "of food being shared on social media." },
      { id: 32, pre: "Sales of", post: "food brands have grown rapidly this way." },
      { id: 33, pre: "Famous", post: "are influential." },
    ],
  },
  {
    heading: "Marketing campaigns",
    subsections: [
      {
        title: "The avocado:",
        items: [
          { id: 34, pre: "", post: "were invited to visit growers in South Africa." },
          { id: 35, pre: "Advertising focused on its", post: "benefits." },
        ],
      },
      {
        title: "Oat milk:",
        items: [
          { id: null, pre: "A Swedish brand's media campaign received publicity by upsetting competitors.", post: "" },
          { id: 36, pre: "Promotion in the USA through", post: "shops reduced the need for advertising." },
          { id: 37, pre: "It appealed to consumers who are concerned about the", post: "." },
        ],
      },
      {
        title: "Norwegian salmon:",
        items: [
          { id: 38, pre: "Was helped strengthen the", post: "of Norwegian seafood." },
        ],
      },
    ],
  },
  {
    heading: "Ethical concerns",
    subsections: [
      {
        title: "Quinoa:",
        items: [
          { id: 39, pre: "Its success led to an increase in its", post: "." },
          { id: 40, pre: "Overuse of resources resulted in poor", post: "." },
        ],
      },
    ],
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────
function FillInput({ id, value, onChange }) {
  return (
    <>
      {" "}
      <span className="text-red-600 font-bold">{id}</span>
      <input
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="mx-1 border-b-2 border-gray-300 focus:border-red-600 outline-none text-sm w-24 text-center bg-transparent"
      />
    </>
  );
}

function GridMatch({ gridAnswers, toggleGrid }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="w-6" />
            <th className="text-left font-normal text-gray-500 pb-2 pr-4 text-xs" />
            {OPTIONS_AI.map((o) => (
              <th key={o.key} className="text-center font-bold text-gray-700 w-8 pb-2 text-xs">
                {o.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Q11_16.map((q) => (
            <tr key={q.id} className="border-t border-gray-100">
              <td className="text-red-600 font-bold py-2 pr-2">{q.id}.</td>
              <td className="pr-4 py-2 text-gray-800 whitespace-nowrap text-xs">{q.text}</td>
              {OPTIONS_AI.map((o) => (
                <td key={o.key} className="text-center py-2">
                  <button
                    onClick={() => toggleGrid(q.id, o.key)}
                    className={`w-5 h-5 rounded border text-xs transition-all ${
                      gridAnswers[`${q.id}-${o.key}`]
                        ? "bg-red-600 border-red-600 text-white"
                        : "border-gray-300 text-gray-300 hover:border-red-400"
                    }`}
                  >
                    ✓
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">List of Options</p>
        {OPTIONS_AI.map((o) => (
          <p key={o.key} className="text-sm text-gray-700">
            <span className="font-bold text-gray-900 mr-1">{o.key}</span>{o.text}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Listening Test Page ──────────────────────────────────────────────────────
function ListeningTestPage() {
  const [section,      setSection]      = useState(2);
  const [gridAnswers,  setGridAnswers]  = useState({});
  const [mcAnswers,    setMcAnswers]    = useState({});
  const [fillAnswers,  setFillAnswers]  = useState({});

  const toggleGrid = (row, col) =>
    setGridAnswers((p) => ({ ...p, [`${row}-${col}`]: !p[`${row}-${col}`] }));

  const setFill = (id, val) =>
    setFillAnswers((p) => ({ ...p, [id]: val }));

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <IELTSTestHeader
        subtitle="IELTS Online Test · CAM 20 · Listening Test 2"
        timeLeft="25:00"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* Section 2 — Q11-16 + Q17-20 */}
          {section === 2 && (
            <>
              {/* Q11-16 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                  Question 11 – 16 &nbsp; Match each role of the volunteers,{" "}
                  <b>A–I</b>, with the correct activity.
                </div>
                <div className="p-4">
                  <GridMatch gridAnswers={gridAnswers} toggleGrid={toggleGrid} />
                </div>
              </div>

              {/* Q17-20 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                  Question 17 – 20 &nbsp; Choose appropriate options{" "}
                  <b>A</b>, <b>B</b>, or <b>C</b>.
                </div>
                <div className="p-4 space-y-4">
                  {Q17_20.map((item) => (
                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-800 mb-3">
                        <span className="text-red-600 font-bold mr-1">{item.id}</span>
                        {item.q}
                      </p>
                      <div className="space-y-2">
                        {item.opts.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`q${item.id}`}
                              value={opt}
                              checked={mcAnswers[item.id] === opt}
                              onChange={() => setMcAnswers((p) => ({ ...p, [item.id]: opt }))}
                              className="accent-red-600"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section 4 — Q31-40 */}
          {section === 4 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                Question 31 – 40 &nbsp; Complete the notes below using{" "}
                <span className="underline font-bold">ONE WORD ONLY</span>.
              </div>
              <div className="p-5 text-sm text-gray-800 space-y-6">
                {Q31_40.map((block) => (
                  <div key={block.heading}>
                    <h3 className="font-bold mb-2">{block.heading}</h3>

                    {/* flat items */}
                    {block.items && (
                      <ul className="space-y-2 list-disc list-inside">
                        {block.items.map((it) => (
                          <li key={it.id ?? it.pre}>
                            {it.pre}
                            {it.id && (
                              <FillInput id={it.id} value={fillAnswers[it.id] || ""} onChange={setFill} />
                            )}
                            {it.post && ` ${it.post}`}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* subsections */}
                    {block.subsections?.map((sub) => (
                      <div key={sub.title} className="mt-3">
                        <p className="font-semibold mb-1">{sub.title}</p>
                        <ul className="space-y-2 list-disc list-inside">
                          {sub.items.map((it) => (
                            <li key={it.id ?? it.pre}>
                              {it.pre}
                              {it.id && (
                                <FillInput id={it.id} value={fillAnswers[it.id] || ""} onChange={setFill} />
                              )}
                              {it.post && ` ${it.post}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {section !== 2 && section !== 4 && (
            <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm">
              Section {section} — click section tabs below to switch
            </div>
          )}
        </div>
      </div>

      <IELTSTestBottomNav
        sections={SECTIONS}
        active={section}
        onSelect={setSection}
        leftSlot={
          <span>⋮⋮&nbsp; Section {section} &nbsp;<span className="text-gray-300">Đã làm 0/10</span></span>
        }
      />
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Reading Test Page
// ══════════════════════════════════════════════════════════════════════════════
const READING_SECTIONS = [
  { id: 1, label: "Passage 1", score: "0/13" },
  { id: 2, label: "Passage 2", score: "0/13" },
  { id: 3, label: "Passage 3", score: "0/14" },
];

const KAKAPO_PASSAGE = `The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures.

The kakapo, also known as the owl parrot, is a large, forest-dwelling bird, with a pale owl-like face. Up to 64 cm in length, it has predominantly yellow-green feathers, forward-facing eyes, a large grey beak, large blue feet, and relatively short wings and tail. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.

Kakapo are solitary birds and tend to occupy the same home range for many years. They forage on the ground and climb high into trees. They often leap from trees and flap their wings, but at best manage a controlled descent to the ground. They are entirely vegetarian, with their diet including the leaves, roots and bark of trees as well as bulbs, and fern fronds.

Kakapo breed in summer and autumn, but only in years when food is plentiful. Males play no part in incubation or chick-rearing – females alone incubate eggs and feed the chicks. The 1-4 eggs are laid in soil, which is repeatedly turned over before and during incubation. The female kakapo has to spend long periods away from the nest searching for food, which leaves the unattended eggs and chicks particularly vulnerable to predators.

Before humans arrived, kākāpō were common throughout New Zealand's forests. However, this all changed with the arrival of the first Polynesian settlers about 700 years ago. For the early settlers, the flightless kakapo was easy prey. They ate its meat and used its feathers to make soft cloaks. With them came the Polynesian dog and rat, which also preyed on kakapo. By the time European colonisers arrived in the early 1800s, kākāpō had become confined to the central North Island and forested parts of the South Island.`;

const TFNG_QS = [
  { id: 3, text: "Adult male kakapo bring food back to nesting females." },
  { id: 4, text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers." },
  { id: 5, text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats." },
];

function ReadingTestPage() {
  const [answers,  setAnswers]  = useState({});
  const [passage,  setPassage]  = useState(1);
  const [question, setQuestion] = useState(7);
  const totalPages = 13;

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <IELTSTestHeader
        subtitle="IELTS Online Test · CAM 20 · Reading Test 1"
        timeLeft="58:52"
      />

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 112px)" }}>
        {/* Passage */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200 bg-white">
          <h2 className="text-xl font-extrabold mb-1">The kākāpō</h2>
          <p className="text-xs text-gray-400 mb-3 italic">
            The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures.
          </p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {KAKAPO_PASSAGE}
          </p>
        </div>

        {/* Questions */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-4">
          {TFNG_QS.map((q) => (
            <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-800 mb-3">
                <span className="text-red-600 font-bold mr-1">{q.id}</span>
                {q.text}
              </p>
              <div className="space-y-2">
                {["True", "False", "Not given"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={`rq${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className="accent-red-600"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>⋮⋮</span>
          <span>Passage {passage}</span>
          <span className="text-gray-300 mx-1">·</span>
          <span>Đã làm 0/13</span>
        </div>

        {/* Question number pills */}
        <div className="flex gap-1 overflow-x-auto max-w-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setQuestion(n)}
              className={`w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all ${
                n === question
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
          7 → 13
        </button>
      </div>
    </div>
  );
}

// ── PAGE: Writing List + Detail ─────────────────────────────────────────────
// pages/writing/WritingListPage.jsx + WritingDetailPage.jsx

// ─── data ─────────────────────────────────────────────────────────────────────
const SAMPLES = [
  { tag: "Advice Seeking Letter", quarter: "Quí 3 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3", img: "🏙️" },
  { tag: "Advice Seeking Letter", quarter: "Quí 2 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 2", img: "💼" },
  { tag: "Advice Seeking Letter", quarter: "Quí 2 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 1", img: "🚗" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư đăng ký (Application Letter) - IELTS General Writing Task 1 - Đề 3",         img: "📋" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư xin việc (Job Application Letter) - IELTS General Writing Task 1 - Đề 2",     img: "🤝" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư xin việc (Job Application Letter) - IELTS General Writing Task 1 - Đề 1",     img: "🗼" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 3",            img: "📝" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 2",            img: "🚖" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 1",            img: "📨" },
];

const FILTER_TAGS = [
  "Request Letter", "Advice Seeking Letter", "Application letter",
  "Complaint Letter", "Apology Letter",
];

// ─── Sidebar filter ────────────────────────────────────────────────────────────
function FilterSidebar({ selected, onSelect, sort, onSort }) {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      {/* Search */}
      <p className="font-bold text-sm text-gray-700 mb-3">Tìm kiếm</p>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-5">
        <input className="flex-1 text-sm px-3 py-2 outline-none" placeholder="Search" />
        <button className="px-3 text-gray-400">🔍</button>
      </div>

      {/* Filter */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bộ lọc</p>
      <p className="font-semibold text-sm text-gray-700 mb-1">DẠNG ĐỀ BÀI (6)</p>
      <div className="space-y-1.5 mb-5">
        {FILTER_TAGS.map((tag) => (
          <label key={tag} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-red-600"
              checked={selected === tag}
              onChange={() => onSelect(selected === tag ? null : tag)}
            />
            <span className="text-sm text-gray-600 hover:text-red-600 transition-colors">{tag}</span>
          </label>
        ))}
      </div>

      {/* Year */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">NĂM</p>
      <label className="flex items-center gap-2 cursor-pointer mb-5">
        <input type="checkbox" className="accent-red-600" defaultChecked />
        <span className="text-sm text-gray-600">2021</span>
      </label>

      {/* Sort */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">SẮP XẾP THEO</p>
      {["Mới nhất", "Cũ nhất", "Nhiều lượt xem nhất"].map((s) => (
        <label key={s} className="flex items-center gap-2 cursor-pointer mb-1.5">
          <input
            type="radio"
            name="sort"
            value={s}
            checked={sort === s}
            onChange={() => onSort(s)}
            className="accent-red-600"
          />
          <span className="text-sm text-gray-600">{s}</span>
        </label>
      ))}
    </aside>
  );
}

// ─── Article card (list row) ──────────────────────────────────────────────────
function ArticleRow({ item }) {
  return (
    <div className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-5">
      <div className="w-36 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl shrink-0">
        {item.img}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-red-600 font-semibold mb-1">
          {item.quarter} · {item.tag}
        </p>
        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-sm leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          Đề thi IELTS General Writing Task 1 yêu cầu viết một là thư cho lời khuyên.
          Đây là một trong những dạng bài của Writing General. Dưới đây, DOL sẽ cung cấp
          cho bạn một bài làm mẫu của dạng này, các bạn có thể…
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Writing List Page
// ══════════════════════════════════════════════════════════════════════════════
function WritingListPage() {
  const [selected, setSelected] = useState(null);
  const [sort,     setSort]     = useState("Mới nhất");
  const [page,     setPage]     = useState(1);

  const filtered = selected ? SAMPLES.filter((s) => s.tag === selected) : SAMPLES;

  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="Bài mẫu IELTS ▾" />

      <HeroBanner
        title="DOL IELTS Writing"
        titleRed="Task 1 General Sample"
        description="Tổng hợp bài mẫu IELTS General Writing Task 1 và hướng dẫn cách làm bài, từ vựng chi tiết theo chủ đề"
      />

      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8">
        <FilterSidebar
          selected={selected}
          onSelect={setSelected}
          sort={sort}
          onSort={setSort}
        />

        <div className="flex-1 space-y-5">
          {filtered.map((item, i) => <ArticleRow key={i} item={item} />)}
          <Pagination current={page} total={2} onChange={setPage} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Writing Detail Page
// ══════════════════════════════════════════════════════════════════════════════
const UNDERLINED_PARAGRAPHS = [
  {
    parts: [
      { text: "I am an " },
      { text: "avid reader", u: true },
      { text: " of The Guardian and I " },
      { text: "happened to read", u: true },
      { text: " your article about Hoi An City which was " },
      { text: "published", u: true },
      { text: " on the 15th issue. There is some " },
      { text: "incorrect information", u: true },
      { text: " in your article and I would like to " },
      { text: "suggest corrections", u: true },
      { text: " for it." },
    ],
  },
  {
    parts: [
      { text: "In your article, you note that Hoi An City does not have a " },
      { text: "distinctive cuisine", u: true },
      { text: " and that most of its " },
      { text: "food variety", u: true },
      { text: " comes from other areas. I have to say that this information is indeed incorrect. We have a variety of " },
      { text: "speciality dishes", u: true },
      { text: " to our hometown that cannot be found anywhere else in Vietnam. I have been living in Hoi An City for over 18 years so I know " },
      { text: "this city like the back of my hand", u: true },
      { text: "." },
    ],
  },
  {
    parts: [
      { text: "I hope it is possible that you can correct this information as soon as possible as it may " },
      { text: "confuse readers", u: true },
      { text: " and " },
      { text: "lead to a biased view about Hoi An", u: true },
      { text: " which can affect the image of my hometown." },
    ],
  },
];

const EXERCISE_ITEMS = [
  { q: "Tôi là độc giả thân thiết của báo:", fill: "I am an ___ reader" },
  { q: "Tôi muốn đề xuất:",                   fill: "I would like to ___" },
  { q: "Tôi đã sống ở đây kể từ khi sinh:",   fill: "I have been living here since I was born as ___" },
];

function WritingDetailPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputs,     setInputs]     = useState({});

  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="Bài mẫu IELTS ▾" />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-gray-400 flex gap-1 flex-wrap">
        {["Trang chủ", "IELTS Bài mẫu", "IELTS Writing General Task 1"].map((b) => (
          <span key={b} className="flex items-center gap-1">
            <button className="hover:text-red-600 cursor-pointer">{b}</button>
            <span className="text-gray-300">›</span>
          </span>
        ))}
        <span className="text-gray-600">Thư cho lời khuyên - Đề 3</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 flex gap-8">
        {/* Main */}
        <article className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3
          </h1>

          {/* Prompt */}
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            <p className="italic mb-3">
              Recently you saw an article in a newspaper/journal about a city/town you know.
              Some of the information in the article was incorrect. Write a letter to the editor regarding this.
            </p>
            <p className="font-semibold mb-1">In your letter, you should tell:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>how you know about this city/town</li>
              <li>what information was incorrect</li>
              <li>what the editor should do about this.</li>
            </ul>
          </div>

          {/* DOL badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              DOL IELTS Đình Lực
            </span>
            <span className="text-xs text-gray-400">· 39 phút trước</span>
          </div>

          {/* Bài mẫu */}
          <section className="mt-7">
            <div className="flex items-center gap-2 mb-3">
              <span>✍️</span>
              <h2 className="font-extrabold text-gray-900">Bài mẫu</h2>
              <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                <span>Band 7.0+</span>
                <span className="mx-1">|</span>
                <span>168 words</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 text-sm text-gray-800 leading-relaxed space-y-3">
              <p>Dear Mr/Ms Madam,</p>
              {UNDERLINED_PARAGRAPHS.map((para, pi) => (
                <p key={pi}>
                  {para.parts.map((part, i) =>
                    part.u ? (
                      <span key={i} className="underline decoration-red-400">{part.text}</span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              ))}
              <p>I am looking forward to hearing back from you.</p>
              <p>Yours sincerely,</p>
              <p className="italic text-gray-400 text-xs">(168 words)</p>
            </div>
          </section>

          {/* Phân dịch */}
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <span>🌐</span>
              <h2 className="font-extrabold text-gray-900">Phân dịch</h2>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>Thưa Ngài,</p>
              <p>
                Tôi là một độc giả thường xuyên của tờ The Guardian và tôi tình cờ đọc bài viết
                về Thành phố Hội An. Bài viết đó có một số thông tin không chính xác và tôi muốn
                đề xuất chỉnh sửa cho nó.
              </p>
              <p>
                Trong bài báo, bạn lưu ý rằng Thành phố Hội An không có ẩm thực đặc trưng và phần
                lớn sự đa dạng thực phẩm đến từ các khu vực khác. Tôi phải nói rằng thông tin này
                thực sự không đúng.
              </p>
            </div>
          </section>

          {/* Exercise */}
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span>🔥</span>
              <h2 className="font-extrabold text-gray-900">Bài tập Exercise</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
              <p className="font-semibold text-gray-800">Exercise 1:</p>
              <p className="text-gray-500 text-xs mb-2">
                Dịch các câu sau đây từ Tiếng Anh sang Tiếng Việt:
              </p>
              {EXERCISE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5 shrink-0">ℹ</span>
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs">{item.q}</p>
                    <input
                      value={inputs[i] || ""}
                      onChange={(e) => setInputs((p) => ({ ...p, [i]: e.target.value }))}
                      placeholder={item.fill}
                      className="mt-1 border-b-2 border-gray-300 focus:border-red-600 outline-none text-sm w-56 bg-transparent text-gray-700 placeholder-gray-300"
                    />
                  </div>
                </div>
              ))}

              {showAnswer && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 space-y-1">
                  <p><b>1.</b> avid</p>
                  <p><b>2.</b> suggest</p>
                  <p><b>3.</b> born</p>
                </div>
              )}

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                {showAnswer ? "Ẩn đáp án" : "Check đáp án"}
              </button>
            </div>
          </section>

          {/* Tip */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-gray-700">
            <p className="font-bold text-gray-900 mb-1">💡 Lời khuyên</p>
            <p>
              Sau khi xem mẫu này, DOL muốn bạn không chỉ đơn giản đọc và hiểu mà còn thực sự
              luyện tập. Hãy thử viết lại bài theo cách của bạn và so sánh với bài mẫu.
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-60 hidden lg:block shrink-0">
          <div className="sticky top-20 space-y-4">
            <div className="bg-red-600 text-white rounded-xl p-4 text-center">
              <p className="font-bold text-sm">Tìm hiểu DOL English</p>
              <p className="text-xs mt-1 text-red-100">Học IELTS hiệu quả cùng Linearthinking</p>
              <button className="mt-3 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full">
                Tìm hiểu ngay
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Bài viết khác</p>
              {["Thư xin việc - Đề 1", "Thư xin việc - Đề 2", "Thư yêu cầu - Đề 1", "Thư yêu cầu - Đề 2"].map((t) => (
                <p key={t} className="text-xs text-gray-600 hover:text-red-600 cursor-pointer py-1.5 border-b border-gray-100 last:border-0 transition-colors">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}

// ── PAGE: Dictation List + Practice ─────────────────────────────────────────
// pages/dictation/DictationListPage.jsx + DictationPracticePage.jsx

// ─── data ─────────────────────────────────────────────────────────────────────
const DICTATION_ITEMS = [
  { tag: "58 câu", title: "[CAM13 - T2] Nanotechnology",                               type: "Audio", views: "37K lượt chép", img: "🔬" },
  { tag: "36 câu", title: "[CAM20 - T4] Research in the area around the Cheme Bird",   type: "Audio", views: "22K lượt chép", img: "🦅" },
  { tag: "67 câu", title: "[CAM20 - T4] Teaching handwriting",                          type: "Audio", views: "18K lượt chép", img: "✏️" },
  { tag: "42 câu", title: "[CAM20 - T4] The football stadium",                          type: "Audio", views: "1K lượt chép",  img: "🏟️" },
  { tag: "75 câu", title: "[CAM20 - T4] Advice on family visit",                        type: "Audio", views: "15K lượt chép", img: "👨‍👩‍👧" },
  { tag: "60 câu", title: "[CAM20 - T3] Inclusive design",                              type: "Audio", views: "5K lượt chép",  img: "♿" },
  { tag: "63 câu", title: "[CAM20 - T3] Finn and Maya's project",                       type: "Audio", views: "3K lượt chép",  img: "💻" },
  { tag: "47 câu", title: "[CAM20 - T3] Community project",                             type: "Audio", views: "8K lượt chép",  img: "🤝" },
  { tag: "56 câu", title: "[CAM20 - T3] Furniture rental companies",                    type: "Audio", views: "3K lượt chép",  img: "🛋️" },
  { tag: "42 câu", title: "[CAM20 - T2] Developing food trends",                        type: "Audio", views: "3K lượt chép",  img: "🍽️" },
  { tag: "75 câu", title: "[CAM20 - T2] Human geography",                               type: "Audio", views: "3K lượt chép",  img: "🌍" },
  { tag: "43 câu", title: "[CAM20 - T2] Role of the volunteers",                        type: "Audio", views: "5K lượt chép",  img: "🙋" },
];

const FILTER_GROUPS = [
  { title: "TRẠNG THÁI",  items: ["Bài chưa làm", "Bài đang làm", "Bài đã làm"] },
  { title: "PROGRAM",     items: ["IELTS", "TOEIC", "General English"] },
  { title: "TYPE",        items: ["Video", "Audio"] },
  { title: "SECTION",     items: ["Section 1", "Section 2", "Section 3", "Section 4"] },
];

// ─── Dictation card ───────────────────────────────────────────────────────────
function DictationCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-md transition-all cursor-pointer group">
      <div className="h-32 bg-gray-100 flex items-center justify-center text-5xl relative">
        {item.img}
        <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">
          {item.tag}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="text-xs text-gray-400 mt-1">{item.type} · {item.views}</p>
        <button className="mt-2 flex items-center gap-1 text-xs text-red-600 font-semibold hover:underline">
          ⊕ Chép bài
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Dictation List Page
// ══════════════════════════════════════════════════════════════════════════════
function DictationListPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="Chép chính tả" />

      <HeroBanner
        title="Chép Chính Tả Tiếng Anh -"
        titleRed="DOL Tự học"
        description="Website nghe chép chính tả Tiếng Anh DOL Tự học cung cấp nguồn nghe chép chính tả đa dạng theo chủ đề và độ khó của bài nghe, kèm transcript tiếng anh và tiếng việt."
      />

      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="w-44 shrink-0 hidden md:block">
          <p className="font-bold text-sm text-gray-700 mb-3">Tìm kiếm</p>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-5">
            <input className="flex-1 text-sm px-3 py-2 outline-none" placeholder="Search" />
            <button className="px-2 text-gray-400">🔍</button>
          </div>

          {FILTER_GROUPS.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {group.title}
              </p>
              {group.items.map((item) => (
                <label key={item} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="checkbox" className="accent-red-600" />
                  <span className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DICTATION_ITEMS.map((item) => (
              <DictationCard key={item.title} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1 mt-8">
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                  p === 1
                    ? "bg-red-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:border-red-400"
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-gray-400 px-1">·</span>
            <button className="w-8 h-8 border border-gray-300 rounded-full text-sm text-gray-600 hover:border-red-400">
              99
            </button>
            <button className="w-8 h-8 text-gray-400 hover:text-gray-700">›</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Dictation Practice Page  (full-screen, no header/footer)
// ══════════════════════════════════════════════════════════════════════════════
const TOTAL = 58;

function QuestionSidebar({ current, onSelect }) {
  return (
    <aside className="w-52 bg-white border-r border-gray-200 p-4 hidden md:block overflow-y-auto">
      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 mb-4 transition-colors">
        ✕ Ẩn danh sách câu hỏi
      </button>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
              n === current
                ? "bg-red-600 text-white shadow-sm"
                : n < current
                ? "bg-gray-200 text-gray-500"
                : "border border-gray-300 text-gray-500 hover:border-red-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </aside>
  );
}

function AudioPlayer({ speed, onSpeedChange }) {
  const speeds = ["0.5x", "0.75x", "1x", "1.25x", "1.5x"];
  return (
    <div className="flex items-center gap-3">
      {/* Play */}
      <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm">
        ▶
      </button>
      {/* Replay */}
      <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors">
        ↩
      </button>
      {/* Progress */}
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full cursor-pointer">
        <div className="w-0 h-1.5 bg-red-600 rounded-full" />
      </div>
      <span className="text-xs text-gray-400 font-mono whitespace-nowrap">00:00/00:06</span>
      {/* Speed */}
      <div className="flex items-center gap-1">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`text-xs px-1.5 py-0.5 rounded transition-all ${
              speed === s
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <button className="text-xs border border-gray-300 rounded px-2 py-1 text-gray-500 hover:border-red-400 transition-colors">
        ⟳
      </button>
    </div>
  );
}

function DictationPracticePage() {
  const [current,  setCurrent]  = useState(24);
  const [input,    setInput]    = useState("");
  const [speed,    setSpeed]    = useState("1x");
  const [mode,     setMode]     = useState("EASY");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            ✕
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                DOL ĐÌNH LỰC
              </span>
              <span className="text-sm font-bold text-gray-900">[CAM13 - T2] Nanotechnology</span>
            </div>
            <p className="text-xs text-gray-400">Audio · 58 câu</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button className="hover:text-gray-700 transition-colors">↗ Share</button>
          <button className="hover:text-gray-700 transition-colors">🎧 Shadowing</button>
          <button className="hover:text-gray-700 transition-colors">📖 Từ vựng</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <QuestionSidebar current={current} onSelect={setCurrent} />

        {/* Practice panel */}
        <main className="flex-1 flex items-start justify-center p-8">
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

              {/* Progress header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <button
                  onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  ←
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    Câu {current}/{TOTAL}
                  </span>
                  <button
                    onClick={() => setCurrent((c) => Math.min(TOTAL, c + 1))}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    →
                  </button>
                  <span className="text-gray-400 text-sm">17 từ</span>
                </div>
                <div className="flex items-center gap-2">
                  {["EASY", "HARD"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`text-xs font-bold px-3 py-1 rounded border transition-all ${
                        mode === m
                          ? "border-gray-700 text-gray-900 bg-gray-100"
                          : "border-gray-200 text-gray-400 hover:border-gray-400"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio player */}
              <div className="px-5 py-4 border-b border-gray-100">
                <AudioPlayer speed={speed} onSpeedChange={setSpeed} />
              </div>

              {/* Text input */}
              <div className="px-5 py-4">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập những gì bạn nghe được"
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:border-red-400 resize-none transition-colors"
                  />
                  <button className="absolute bottom-3 right-3 text-gray-300 hover:text-red-400 transition-colors">
                    🎙
                  </button>
                </div>

                <div className="flex items-start justify-between mt-3 gap-2">
                  <div>
                    <p className="text-xs text-blue-500">
                      ℹ Nhấn phím{" "}
                      <kbd className="border border-gray-300 rounded px-1 bg-gray-100 text-gray-600">
                        Enter
                      </kbd>{" "}
                      để kiểm tra.
                    </p>
                    <p className="text-xs text-gray-400">
                      Chuyển qua Unikey Eng để tránh lỗi typing trên Macbook.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="text-sm border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg hover:border-red-400 transition-colors">
                      Làm lại
                    </button>
                    <button
                      disabled={!input.trim()}
                      className={`text-sm px-4 py-1.5 rounded-lg font-semibold transition-all ${
                        input.trim()
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Kiểm tra
                    </button>
                  </div>
                </div>
              </div>

              {/* Script accordion */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full border-t border-gray-100 px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700">
                  Script, pronunciation & translate
                </span>
                <span className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {expanded && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                  <p className="py-3 italic text-gray-400">
                    Script sẽ hiển thị sau khi bạn kiểm tra câu trả lời.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── PAGE: IELTS Test List ────────────────────────────────────────────────────
// pages/dol/IELTSTestListPage.jsx

// ─── data ─────────────────────────────────────────────────────────────────────
const LATEST = [
  { name: "CAM 20 - Listening Test 1", meta: "54K lượt làm · 40 câu", cta: "▶ Làm bài"  },
  { name: "CAM 20 - Listening Test 2", meta: "0/40 câu",               cta: "⏪ Làm tiếp" },
  { name: "CAM 20 - Listening Test 3", meta: "19K lượt làm · 40 câu", cta: "▶ Làm bài"  },
  { name: "CAM 20 - Listening Test 4", meta: "17K lượt làm · 40 câu", cta: "▶ Làm bài"  },
  { name: "CAM 20 - Reading Test 1",   meta: "0/40 câu",               cta: "⏪ Làm tiếp" },
  { name: "CAM 20 - Reading Test 2",   meta: "25K lượt làm · 40 câu", cta: "▶ Làm bài"  },
];

const RECENT = [
  { name: "CAM 20 - Reading Test 1",   sub: "0/40 câu" },
  { name: "CAM 20 - Listening Test 2", sub: "0/40 câu" },
];

const CAMBRIDGE = [
  { name: "Cambridge IELTS 20", tests: "8 bài tests", views: "22K lượt làm",  color: "bg-orange-100", emoji: "📙" },
  { name: "Cambridge IELTS 19", tests: "8 bài tests", views: "137K lượt làm", color: "bg-blue-100",   emoji: "📘" },
  { name: "Cambridge IELTS 18", tests: "8 bài tests", views: "170K lượt làm", color: "bg-gray-800",   emoji: "📓", dark: true },
  { name: "Cambridge IELTS 17", tests: "8 bài tests", views: "123K lượt làm", color: "bg-green-700",  emoji: "📗", dark: true },
];

const PRACTICE_PLUS = [
  { name: "Practice Test Plus 1", tests: "10 bài tests", views: "59K lượt làm",  color: "bg-blue-50",   emoji: "📋" },
  { name: "Practice Test Plus 2", tests: "11 bài tests", views: "96K lượt làm",  color: "bg-pink-50",   emoji: "📋" },
  { name: "Practice Test Plus 3", tests: "14 bài tests", views: "33K lượt làm",  color: "bg-orange-50", emoji: "📋" },
];

const ACTUAL = [
  { name: "Actual Test 1", tests: "13 bài tests", views: "47K lượt làm" },
  { name: "Actual Test 2", tests: "8 bài tests",  views: "10K lượt làm" },
  { name: "Actual Test 3", tests: "11 bài tests", views: "20K lượt làm" },
  { name: "Actual Test 4", tests: "11 bài tests", views: "20K lượt làm" },
  { name: "Actual Test 5", tests: "12 bài tests", views: "35K lượt làm" },
  { name: "Actual Test 6", tests: "12 bài tests", views: "83K lượt làm" },
];

const OFFICIAL = [
  { name: "Official Guide to IELTS", tests: "14 bài tests", views: "39K lượt làm", emoji: "📘" },
  { name: "IELTS Trainer",           tests: "12 bài tests", views: "25K lượt làm", emoji: "📗" },
];

// ─── sub-components ───────────────────────────────────────────────────────────
function TestCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-red-400 hover:shadow-sm transition-all cursor-pointer group">
      <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
        {item.name}
      </p>
      <p className="text-xs text-gray-400 mt-1">{item.meta ?? item.sub}</p>
      {item.cta && (
        <button className="mt-2 text-xs text-red-600 font-semibold hover:underline">
          {item.cta}
        </button>
      )}
    </div>
  );
}

function BookCard({ b }) {
  return (
    <div className="cursor-pointer group">
      <div
        className={`${b.color} rounded-xl h-32 flex items-center justify-center text-4xl ${
          b.dark ? "text-white" : ""
        }`}
      >
        {b.emoji}
      </div>
      <p className="font-semibold text-sm text-gray-900 mt-2 group-hover:text-red-600 transition-colors">
        {b.name}
      </p>
      <p className="text-xs text-gray-400">{b.tests} · {b.views}</p>
      <button className="text-xs text-red-600 font-semibold mt-1 hover:underline">
        Xem bài test ›
      </button>
    </div>
  );
}

function ActualCard({ t }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-red-400 transition-all cursor-pointer group">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl mb-2">
        📄
      </div>
      <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
        {t.name}
      </p>
      <p className="text-xs text-gray-400">{t.tests} · {t.views}</p>
      <button className="text-xs text-red-600 font-semibold mt-1 hover:underline">
        Xem bài test ›
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
function IELTSTestListPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="IELTS Online Test ▾" />

      <HeroBanner
        title="Luyện thi IELTS Online Test"
        titleRed="miễn phí - DOL Tự học"
        description="Luyện thi IELTS Online Test miễn phí cùng DOL Tự học. Trải nghiệm thi thật với giao diện trực tuyến kèm giải thích chi tiết với Linearthinking."
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">

        {/* Bài test mới nhất */}
        <section>
          <SectionTitle>Bài test mới nhất</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {LATEST.map((t) => <TestCard key={t.name} item={t} />)}
          </div>
        </section>

        {/* Bài làm gần đây */}
        <section>
          <SectionTitle>Bài làm gần đây</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECENT.map((t) => (
              <div
                key={t.name}
                className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-red-400 transition-all cursor-pointer group"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.sub}</p>
                </div>
                <button className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline">
                  ⏪ Làm tiếp
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Cambridge */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle>Bài test từ bộ IELTS Cambridge</SectionTitle>
            <button className="text-gray-400 hover:text-gray-700 text-lg">›</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CAMBRIDGE.map((b) => <BookCard key={b.name} b={b} />)}
          </div>
        </section>

        {/* Practice Test Plus */}
        <section>
          <SectionTitle>Bài test từ IELTS Practice Test Plus</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRACTICE_PLUS.map((b) => <BookCard key={b.name} b={b} />)}
          </div>
        </section>

        {/* Actual Test */}
        <section>
          <SectionTitle>Bài test từ IELTS Actual Test</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ACTUAL.map((t) => <ActualCard key={t.name} t={t} />)}
          </div>
        </section>

        {/* Official Guide */}
        <section>
          <SectionTitle>Bài test từ Official Guide & IELTS Trainer</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL.map((t) => (
              <div
                key={t.name}
                className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-red-400 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {t.emoji}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-400">{t.tests} · {t.views}</p>
                  <button className="text-xs text-red-600 font-semibold mt-1 hover:underline">
                    Xem bài test ›
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
const PAGES = [
  { id: "home",               label: "🏠 Trang chủ",         domain: "Senglish",   Component: SenglishHomePage },
  { id: "leaderboard",        label: "🏆 Xếp hạng",          domain: "Senglish",   Component: LeaderboardPage },
  { id: "progress",           label: "📊 Tiến trình",         domain: "Senglish",   Component: ProgressPage },
  { id: "vocab",              label: "📚 Từ vựng",            domain: "Senglish",   Component: VocabPage },
  { id: "speaking",           label: "💬 Luyện nói",          domain: "Senglish",   Component: SpeakingPage },
  { id: "ai-dict",            label: "🤖 Từ điển AI",         domain: "Senglish",   Component: AIDictPage },
  { id: "shadowing",          label: "🎤 Shadowing",           domain: "Senglish",   Component: ShadowingPage },
  { id: "listening-test",     label: "🎧 Listening Test",     domain: "IELTS Test", Component: ListeningTestPage },
  { id: "reading-test",       label: "📖 Reading Test",       domain: "IELTS Test", Component: ReadingTestPage },
  { id: "ielts-test-list",    label: "📝 Test List",           domain: "DOL",        Component: IELTSTestListPage },
  { id: "writing-list",       label: "📋 Writing List",        domain: "DOL",        Component: WritingListPage },
  { id: "writing-detail",     label: "✍️ Writing Detail",     domain: "DOL",        Component: WritingDetailPage },
  { id: "dictation-list",     label: "🎙 Dictation List",     domain: "DOL",        Component: DictationListPage },
  { id: "dictation-practice", label: "✏️ Dictation Practice", domain: "DOL",        Component: DictationPracticePage },
];

const DOMAINS = ["Senglish", "IELTS Test", "DOL"];

export default function App() {
  const [active, setActive] = useState("home");
  const { Component } = PAGES.find((p) => p.id === active) ?? PAGES[0];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[200] bg-gray-950 border-b border-gray-800">
        <div className="flex items-center px-2 py-1.5 overflow-x-auto gap-0">
          {DOMAINS.map((domain) => (
            <div key={domain} className="flex items-center gap-0.5 mr-4 shrink-0">
              <span className="text-gray-600 text-[10px] mr-1 uppercase tracking-widest">{domain}</span>
              {PAGES.filter((p) => p.domain === domain).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    active === p.id
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pt-9"><Component /></div>
    </>
  );
}
