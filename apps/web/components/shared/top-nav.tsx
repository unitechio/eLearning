"use client";

import { Search, Bell, Settings } from "lucide-react";

export function TopNav() {
  return (
    <header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl font-inter text-sm shadow-sm dark:shadow-none">
      <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96">
        <Search className="text-on-surface-variant w-5 h-5 mr-3" />
        <input 
          className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full p-0" 
          placeholder="Search lessons or analysis..." 
          type="text" 
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-all">
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-800 dark:text-slate-200">Trial Period</span>
          <div className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-md text-[10px] font-bold uppercase tracking-wider">
            Premium
          </div>
        </div>
      </div>
    </header>
  );
}
