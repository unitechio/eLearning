import React from 'react';
import { BrainCircuit, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

export function AiWritingPanel() {
  return (
    <aside className="w-96 bg-white p-8 border-l border-slate-200/50 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <BrainCircuit className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-extrabold text-xl leading-none font-headline tracking-tight">AI Coach</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Live Feedback Enabled</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metric Sections */}
        {[
          { 
            label: 'Coherence', status: 'Good', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary',
            text: '"Excellent use of transition markers. Consider using \'In contrast\' instead of \'Conversely\' to vary your cohesive devices."'
          },
          { 
            label: 'Lexical Resource', status: 'Alert', color: 'text-tertiary', bg: 'bg-tertiary/5', border: 'border-tertiary',
            text: '"Defenestration is used incorrectly here. It means throwing someone out of a window. Did you mean \'destruction\' or \'degradation\'?"',
            action: 'Replace with \'Degradation\''
          },
          { 
            label: 'Grammar', status: 'Strong', color: 'text-secondary', bg: 'bg-secondary/5', border: 'border-secondary',
            text: '"Complex sentence structure detected. Great use of subordinating conjunctions in paragraph two."'
          }
        ].map((item) => (
          <div key={item.label} className="group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</span>
              <span className={`text-[10px] font-black px-2.5 py-1 ${item.bg} ${item.color} rounded-lg border border-current/20`}>{item.status}</span>
            </div>
            <div className={`p-5 bg-slate-50 rounded-2xl border-l-4 ${item.border} transition-all group-hover:translate-x-1 shadow-sm`}>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.text}
              </p>
              {item.action && (
                <button className={`mt-4 text-[10px] font-black px-3 py-1.5 bg-tertiary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md shadow-tertiary/20`}>
                  {item.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip Card */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-secondary to-primary-container text-white relative overflow-hidden shadow-xl shadow-secondary/20">
        <div className="relative z-10">
          <Lightbulb className="w-10 h-10 mb-6 opacity-40 fill-white" />
          <h4 className="font-black text-lg mb-2">Advanced Tip</h4>
          <p className="text-sm text-white/80 leading-relaxed italic font-medium">
            "Band 8+ candidates often use more passive voice structures to maintain academic objectivity."
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </aside>
  );
}
