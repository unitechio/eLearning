import React from 'react';
import { PenTool, TrendingUp } from 'lucide-react';

export function WritingPrompt() {
  return (
    <aside className="w-80 flex flex-col bg-slate-50 p-8 border-r border-slate-200/50">
      <div className="mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-3 block">IELTS Writing Task 2</span>
        <h1 className="text-2xl font-black font-headline leading-tight text-slate-900 mb-6 tracking-tight">Global Urbanization</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50">
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
            "Some people believe that the rapid expansion of cities has a negative impact on the environment. Others argue that urban living is more sustainable than rural living. Discuss both views and give your opinion."
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Length</p>
            <p className="text-sm font-black text-slate-800">250 Words</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Time</p>
            <p className="text-sm font-black text-slate-800">40 Minutes</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
          <p className="text-xs font-black text-primary mb-3 uppercase tracking-widest">Goal Score: 8.5</p>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4 rounded-full shadow-lg shadow-primary/20"></div>
          </div>
          <p className="text-[10px] mt-3 text-slate-500 font-medium">Consistency is key to mastery.</p>
        </div>
      </div>
    </aside>
  );
}
