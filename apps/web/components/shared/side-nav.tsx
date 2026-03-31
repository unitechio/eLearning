"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, BookOpen, Mic, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vocabulary", href: "/vocabulary", icon: BookOpen },
  { label: "Speaking", href: "/speaking", icon: Mic },
  { label: "Writing", href: "/writing", icon: PenTool },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl w-64 border-r-0 font-inter text-sm font-medium z-50">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">Cognitive Atelier</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">AI Learning Partner</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl transition-colors",
                isActive 
                  ? "bg-slate-200/50 dark:bg-slate-800/50 text-indigo-700 dark:text-indigo-300" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/30"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 px-2 mb-4">
          <img 
            alt="User Profile Avatar" 
            className="w-10 h-10 rounded-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd9Ay7JVByvZYIe4mdhlMaP9t57XZlGs6-hy00uPNCM9gVhwbmbE5oN1KhtqEkYqcLBUQtK4TB4_-qiiUFPlZOIUsnPBFpKuSFmgPhzrjELoTrimWXB949ARfGjsCceJufRTX7Nv5G8KbPOzoIArsvgIactdUPWmQsWjAXorXYE-_GnkTeRhm1apLbY8q38iT7crtPZvkneezrwdj__KTiru09bQm9uMsO_zk6dNpGo_GQZeIfRC9cEQDuV9lBtetZwyiObiT_1fXc" 
          />
          <div className="overflow-hidden">
            <p className="font-semibold text-on-surface truncate">Alex Chen</p>
            <p className="text-xs text-on-surface-variant truncate">Target: Band 8.5</p>
          </div>
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm active:scale-95 duration-150 shadow-lg shadow-primary/20">
          Start Practice
        </button>
      </div>
    </aside>
  );
}
