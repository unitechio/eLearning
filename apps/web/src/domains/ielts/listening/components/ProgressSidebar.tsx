import React from 'react';
import { BrainCircuit } from 'lucide-react';

export function ProgressSidebar() {
  return (
    <aside className="w-80 space-y-6 sticky top-24 h-fit">
      {/* Note-Taking Component is now separate but was in sidebar in HTML */}
      {/* AI Tutor Feedback */}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary">AI Insight</h4>
            <p className="text-[10px] text-primary/60 font-bold uppercase tracking-wider">Analyzing Answers...</p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed italic">
          "You seem to be missing key prepositions in fill-in-the-blank questions. Listen specifically for 'in', 'at', and 'from' in the next passage."
        </p>
      </div>

      {/* Progress Arc */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col items-center">
        <h4 className="font-bold text-sm mb-6 w-full text-slate-800">Current Performance</h4>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-surface-container-high"
              cx="64"
              cy="64"
              fill="transparent"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
            />
            <circle
              className="text-secondary drop-shadow-[0_0_8px_rgba(107,56,212,0.4)]"
              cx="64"
              cy="64"
              fill="transparent"
              r="58"
              stroke="currentColor"
              strokeDasharray="364.4"
              strokeDashoffset="91"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-on-surface">75%</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Accuracy</span>
          </div>
        </div>
        <div className="mt-6 w-full space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-zinc-500">Target Score</span>
            <span className="text-on-surface">Band 8.5</span>
          </div>
          <div className="w-full h-1 bg-surface-container-low rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-tertiary"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
