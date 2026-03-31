"use client";

import { useWritingStore } from "@/hooks/use-writing";
import { Sparkles, CheckCircle2, Route, BookA, AlertTriangle, Send } from "lucide-react";

export function AiWritingFeedback() {
  const { wordCount } = useWritingStore();

  return (
    <aside className="w-96 bg-slate-50 border-l border-slate-100 h-full flex flex-col p-6 overflow-y-auto shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg text-slate-800">AI Feedback</h3>
        <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded tracking-widest">
          Live Analysis
        </span>
      </div>

      {/* Score Cards (Asymmetric Bento) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Current Band</span>
          <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">7.5</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Word Count</span>
          <div className="text-3xl font-black text-slate-800">{wordCount}</div>
        </div>
      </div>

      {/* Analysis Categories */}
      <div className="space-y-4">
        {/* Task Achievement */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-primary w-5 h-5" />
              <span className="font-bold text-sm text-slate-700">Task Response</span>
            </div>
            <span className="text-sm font-bold text-primary">8.0</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Your introduction clearly states your position and aligns perfectly with the prompt requirements.</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "80%" }}></div>
          </div>
        </div>

        {/* Coherence */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Route className="text-secondary w-5 h-5" />
              <span className="font-bold text-sm text-slate-700">Coherence</span>
            </div>
            <span className="text-sm font-bold text-secondary">7.0</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">Transitions between paragraphs are smooth. Consider using more varied linking words in paragraph two.</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        {/* Grammatical Range */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <BookA className="text-teal-600 w-5 h-5" />
              <span className="font-bold text-sm text-slate-700">Grammar</span>
            </div>
            <span className="text-sm font-bold text-teal-600">7.5</span>
          </div>
          <div className="bg-red-50 p-3 rounded-lg flex items-start gap-3 border border-red-100">
            <AlertTriangle className="text-red-500 w-5 h-5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-800">Subject-Verb Agreement</p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">"...platforms hinder..."</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight (Floating Style) */}
      <div className="mt-8 relative p-6 rounded-2xl overflow-hidden group bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <div className="absolute -right-4 -top-4 opacity-10 blur-sm">
          <Sparkles className="w-24 h-24 text-secondary drop-shadow-md" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-secondary w-4 h-4" />
            <span className="text-xs font-black uppercase text-secondary tracking-widest">AI Insight</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            "Your use of the word <span className="font-bold text-secondary underline decoration-secondary">catalyst</span> is excellent. To reach Band 8.5, try incorporating a 'reduced relative clause' in your next sentence."
          </p>
        </div>
      </div>

      {/* Submit Action */}
      <button className="mt-auto w-full bg-gradient-to-br from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[0.99] transition-all active:scale-95">
        <span>Finish &amp; Submit</span>
        <Send className="w-5 h-5" />
      </button>

    </aside>
  );
}
