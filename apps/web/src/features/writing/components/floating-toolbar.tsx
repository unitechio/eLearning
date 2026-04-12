"use client";

import { Sparkles, Mic, FileText, SpellCheck2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingToolbar() {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1 p-2 bg-slate-900/90 backdrop-blur-xl rounded-full shadow-2xl z-50 border border-slate-700/50">
      
      <button className="p-3 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 group">
        <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      
      <div className="w-[1px] h-6 bg-white/20 mx-1"></div>
      
      <button className="px-4 py-2 text-white/90 text-sm font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
        <SpellCheck2 className="w-4 h-4" />
        Explain
      </button>
      
      <button className="px-4 py-2 text-white/90 text-sm font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Rewrite
      </button>
      
      <button className="px-4 py-2 text-white/90 text-sm font-bold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Synonyms
      </button>
      
      <div className="w-[1px] h-6 bg-white/20 mx-1"></div>
      
      <button className="p-3 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 group">
        <Mic className="w-5 h-5 group-hover:scale-110 transition-transform text-red-400" />
      </button>

    </div>
  );
}
