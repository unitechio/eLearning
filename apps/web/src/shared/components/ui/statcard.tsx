import React from "react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
type StatCardProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
  dark?: boolean;
};

export function StatCard({ icon, value, label, dark = false }: StatCardProps) {
  return (
    <article
      className={`rounded-xl p-4 flex items-center gap-3 ${
        dark
          ? "bg-inverse-surface text-inverse-on-surface"
          : "bg-surface-container-lowest border border-outline-variant shadow-sm"
      }`}
    >
      <span className="text-2xl shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <p className={`font-bold ${dark ? "text-inverse-on-surface" : "text-on-surface"}`}>
          {value}
        </p>
        <p className={`text-xs ${dark ? "text-inverse-on-surface/60" : "text-on-surface-variant"}`}>
          {label}
        </p>
      </div>
    </article>
  );
}

// ─── Streak Badge ─────────────────────────────────────────────────────────────
type StreakBadgeProps = {
  days?: number;
};

export function StreakBadge({ days }: StreakBadgeProps) {
  if (!days) return null;

  return (
    <span className="text-xs text-orange-400 flex items-center gap-0.5">
      🔥 {days} ngày
    </span>
  );
}

// ─── Level Badge ──────────────────────────────────────────────────────────────
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type LevelBadgeProps = {
  level: Level;
  className?: string;
};

const levelColorMap: Record<Level, string> = {
  A1: "bg-surface-container text-on-surface-variant",
  A2: "bg-green-100 text-green-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-blue-500 text-white",
  C1: "bg-secondary text-secondary-foreground",
  C2: "bg-primary text-primary-foreground",
};

export function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  return (
    <span
      className={`text-xs font-bold px-1.5 py-0.5 rounded font-label ${levelColorMap[level]} ${className}`}
    >
      {level}
    </span>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
type EmptyStateProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
};

export function EmptyState({
  icon = "📭",
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-3" aria-hidden="true">{icon}</span>
      <p className="font-bold text-on-surface">{title}</p>
      {description && (
        <p className="text-sm text-on-surface-variant mt-1 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Tab Bar (horizontal) ─────────────────────────────────────────────────────
type TabBarProps<T extends string> = {
  tabs: T[];
  active: T;
  onChange?: (tab: T) => void;
  dark?: boolean;
};

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  dark = false,
}: TabBarProps<T>) {
  return (
    <nav
      aria-label="Tabs"
      className={`flex gap-1 ${
        dark ? "bg-inverse-surface/80" : "bg-surface-container"
      } p-1 rounded-xl`}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange?.(tab)}
          aria-current={active === tab ? "page" : undefined}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            active === tab
              ? "bg-primary text-primary-foreground shadow-sm"
              : dark
              ? "text-inverse-on-surface/50 hover:text-inverse-on-surface"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
