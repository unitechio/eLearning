"use client";

import { Search, Bell, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopNav() {
  return (
    <header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full w-96 border border-zinc-200 dark:border-zinc-800 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
        <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors mr-2" />
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder:text-zinc-500" 
          placeholder="Search lessons or analysis..." 
          type="text" 
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-950"></span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:inline-block">Trial Period</span>
          <div className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-current" />
            Premium
          </div>
        </div>
      </div>
    </header>
  );
}
