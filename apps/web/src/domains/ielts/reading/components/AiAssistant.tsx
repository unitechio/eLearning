import React from 'react';
import { BrainCircuit } from 'lucide-react';

export function AiAssistant() {
  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4 group">
      {/* AI Expansion Tooltip */}
      <div className="bg-white p-5 rounded-2xl shadow-2xl border border-primary/20 w-80 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit className="w-5 h-5 text-secondary" />
          <span className="text-xs font-black uppercase tracking-widest text-secondary">AI Insight</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-primary">Stochastic parameters</span> refers to variables that are randomly determined or involving a joint probability distribution. In this context, it means the agents follow probabilistic rules rather than fixed commands.
        </p>
      </div>
      
      <button className="flex items-center gap-3 bg-[#6b38d4] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
        <span className="font-bold pl-4">AI Assistant</span>
        <div className="bg-white/20 p-2 rounded-full">
          <BrainCircuit className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
}
