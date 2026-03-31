"use client";

import { useSpeakingStore } from "@/hooks/use-speaking";
import { Gauge, Languages, Sparkles, RefreshCcw } from "lucide-react";

export function FeedbackPanel() {
  const { isRecording, scoringResult, setScoringResult } = useSpeakingStore();

  if (isRecording) {
    return (
      <div className="h-full bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col items-center justify-center space-y-4 p-12 text-center text-slate-400">
        <Sparkles className="w-12 h-12 text-slate-300 animate-pulse" />
        <p className="font-semibold text-sm">AI is listening and evaluating in real-time...</p>
      </div>
    );
  }

  if (!scoringResult) {
    return (
      <div className="h-full bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col items-center justify-center space-y-4 p-12 text-center text-slate-400">
        <Gauge className="w-12 h-12 text-slate-200" />
        <p className="font-semibold text-sm text-slate-400">Your feedback will appear here after you finish recording.</p>
      </div>
    );
  }

  return (
    <aside className="space-y-6 animate-in fade-in duration-500 delay-150">
      {/* Overall Score Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Estimated Band Score
          </p>
          <h3 className="text-5xl font-extrabold text-slate-800 tracking-tighter">
            {scoringResult.overall_band.toFixed(1)} <span className="text-xl font-medium text-slate-300">/ 9.0</span>
          </h3>
        </div>
        
        <div className="w-20 h-20 rounded-full border-[6px] border-secondary/20 flex flex-col items-center justify-center relative bg-slate-50 shadow-inner">
          <div className="absolute inset-0 rounded-full border-[6px] border-secondary border-t-transparent -rotate-45"></div>
          <span className="text-secondary font-black text-sm relative z-10">Top</span>
          <span className="text-secondary font-black text-xs relative z-10">5%</span>
        </div>
      </div>

      {/* Feedback Categories */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <Gauge className="text-primary w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-700">Fluency & Coherence</h4>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full tracking-wider">
              {scoringResult.criteria.fluency.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {scoringResult.feedback.split('.')[0]}.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-secondary/20 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <Languages className="text-secondary w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-700">Lexical Resource</h4>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary rounded-full tracking-wider">
              {scoringResult.criteria.lexical.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {scoringResult.feedback.split('.')[1] || "Good vocabulary usage noticed."}.
          </p>
        </div>

        {/* Interactive Transcript/Insight Card */}
        {scoringResult.mistakes.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-6 rounded-2xl space-y-4 border border-indigo-100 shadow-sm relative overflow-hidden">
            <h4 className="font-bold text-sm flex items-center gap-2 text-indigo-900">
              <Sparkles className="text-indigo-600 w-4 h-4" />
              AI-Generated Insight
            </h4>
            <div className="text-slate-800 leading-relaxed text-sm italic border-l-4 border-indigo-300 pl-4 py-2 bg-white/60 rounded-r-lg">
              "...<span className="text-red-500 font-semibold underline decoration-wavy underline-offset-4">{scoringResult.mistakes[0].text}</span>..."
            </div>
            <p className="text-xs text-slate-600 font-medium bg-white/80 p-3 rounded-xl border border-white">
              <strong className="text-indigo-700">Tip:</strong> Instead of <span className="font-bold">{scoringResult.mistakes[0].text}</span>, try using <span className="text-indigo-600 font-bold italic">{scoringResult.mistakes[0].suggestion}</span> to reach Band 8.0+.
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setScoringResult(null)}
        className="w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-100 hover:text-primary transition-all flex items-center justify-center gap-3 border border-slate-200 shadow-sm active:scale-[0.98]"
      >
        <RefreshCcw className="w-5 h-5" />
        Try Again to Improve
      </button>
    </aside>
  );
}
