import React from "react";
import { Search, Bell, Settings } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex justify-between items-center w-full h-20 px-10 sticky top-0 z-40 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl font-inter text-sm transition-all duration-300 border-b border-slate-100/50 dark:border-slate-900/50">
      <div className="flex items-center bg-surface-container-low/50 border border-slate-200/20 px-6 py-3 rounded-2xl w-[450px]">
        <Search className="text-on-surface-variant w-5 h-5 mr-3 opacity-60" />
        <input 
          className="bg-transparent border-none focus:ring-0 outline-none text-sm w-full p-0 placeholder:text-on-surface-variant/50 font-medium" 
          placeholder="Search lessons, vocabulary or analytics..." 
          type="text" 
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-on-surface-variant hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all active:scale-95 group">
            <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl text-on-surface-variant hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all active:scale-95 group">
            <Settings className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 mx-4"></div>

        <div className="flex items-center gap-3 bg-surface-container-low/50 px-4 py-2 rounded-2xl border border-slate-200/20">
          <div className="text-right">
            <span className="block font-bold text-slate-800 dark:text-slate-200 leading-none">Trial Mode</span>
            <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1 opacity-60">12 Days Left</span>
          </div>
          <div className="px-3 py-1.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-primary/20">
            Upgrade
          </div>
        </div>
      </div>
    </header>
  );
}

