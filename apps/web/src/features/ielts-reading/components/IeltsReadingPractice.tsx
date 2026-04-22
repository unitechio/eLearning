import React from 'react';
import { Timer } from 'lucide-react';
import { ReadingPassage } from './ReadingPassage';
import { ReadingQuestions } from './ReadingQuestions';
import { AiAssistant } from './AiAssistant';

export function IeltsReadingPractice() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Sub-header for Practice State (if needed, or use TopNav) */}
      <div className="h-14 border-b border-outline-variant/10 flex items-center justify-between px-8 bg-surface-container-low/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Timer className="w-5 h-5" />
            <span className="font-mono tracking-wider">54:12</span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant/30"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Progress</span>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[35%] rounded-full"></div>
            </div>
            <span className="text-xs font-bold text-primary">14/40</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-full text-xs font-black uppercase tracking-widest transition-all">
            Review Mode
          </button>
          <button className="px-4 py-1.5 bg-primary text-white hover:bg-primary/90 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="flex-1 flex overflow-hidden">
        <ReadingPassage />
        <ReadingQuestions />
      </main>

      {/* AI Assistant */}
      <AiAssistant />
    </div>
  );
}
