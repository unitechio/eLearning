"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Mic2, 
  FileEdit, 
  PlayCircle, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vocabulary", href: "/vocabulary", icon: BookOpen },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Speaking", href: "/speaking", icon: Mic2 },
  { name: "Writing", href: "/writing", icon: FileEdit },
  { name: "Practice", href: "/practice", icon: PlayCircle },
  { name: "Settings", href: "/settings/mockup", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-zinc-50 dark:bg-zinc-900 flex flex-col p-4 space-y-2 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-xl">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-none">Cognitive Atelier</h1>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">AI Learning Studio</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-4">
        <div className="bg-indigo-600/5 rounded-xl p-4 border border-indigo-600/10">
          <p className="text-[10px] font-bold text-indigo-600 mb-1 uppercase tracking-wider">Plan Status</p>
          <div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <span>Free Plan</span>
            <Link href="/pricing" className="text-purple-600 hover:underline">Upgrade</Link>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 text-sm font-medium">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
