import React from "react";

// ─── Stat card ────────────────────────────────────────────────────────────────
type StatCardProps = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
  dark?: boolean;
};

export function StatCard({ icon, value, label, dark = false }: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-4 flex items-center gap-3 ${
        dark
          ? "bg-gray-900"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <span className="text-2xl shrink-0">{icon}</span>
      <div>
        <p className={`font-bold ${dark ? "text-white" : "text-gray-900"}`}>
          {value}
        </p>
        <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Streak badge ──────────────────────────────────────────────────────────────
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

// ─── Level badge ───────────────────────────────────────────────────────────────
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type LevelBadgeProps = {
  level: Level;
  className?: string;
};

export function LevelBadge({ level, className = "" }: LevelBadgeProps) {
  const colors: Record<Level, string> = {
    A1: "bg-gray-200 text-gray-700",
    A2: "bg-green-100 text-green-700",
    B1: "bg-blue-100 text-blue-700",
    B2: "bg-blue-500 text-white",
    C1: "bg-purple-500 text-white",
    C2: "bg-red-600 text-white",
  };

  return (
    <span
      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
        colors[level]
      } ${className}`}
    >
      {level}
    </span>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
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
      <span className="text-5xl mb-3">{icon}</span>
      <p className="font-bold text-gray-700">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Tab bar (horizontal) ─────────────────────────────────────────────────────
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
    <div
      className={`flex gap-1 ${
        dark ? "bg-gray-800" : "bg-gray-100"
      } p-1 rounded-xl`}
    >
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
