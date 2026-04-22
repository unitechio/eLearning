import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export function SpeechAnalysis() {
  return (
    <div className="max-w-7xl mx-auto mt-16 pt-16 border-t-2 border-slate-100">
      <h2 className="text-3xl font-black font-headline mb-8 flex items-center gap-4 text-slate-900">
        Detailed Analysis
        <span className="text-sm font-bold bg-primary/10 text-primary px-4 py-1.5 rounded-full uppercase tracking-widest">AI Evaluated</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        {[
          { label: 'Pronunciation', score: '8.5', desc: 'Clear intonation, some minor stress issues on multi-syllabic words.', color: 'text-primary' },
          { label: 'Fluency', score: '8.0', desc: 'Good flow with minimal self-correction. Natural hesitation observed.', color: 'text-secondary' },
          { label: 'Grammar', score: '7.5', desc: 'Wide range of structures. 2 tense errors detected in the second half.', color: 'text-tertiary' }
        ].map((item) => (
          <div key={item.label} className="bg-white p-8 rounded-2xl flex flex-col items-center text-center shadow-sm border border-slate-100">
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle className="text-slate-100" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8" />
                <circle 
                  className={item.color} 
                  cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" 
                  strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - parseFloat(item.score)/10)} 
                  strokeWidth="8" strokeLinecap="round" 
                />
              </svg>
              <span className={`absolute text-3xl font-black font-headline ${item.color}`}>{item.score}</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-slate-800">{item.label}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Detailed Corrections */}
      <div className="mt-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <h4 className="font-headline font-bold text-xl mb-8 text-slate-900">Grammatical Corrections</h4>
        <div className="space-y-6">
          <div className="p-6 bg-red-50/50 rounded-xl flex items-start gap-5 border border-red-100">
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-slate-500 line-through text-lg italic">"I have visited it about three years ago..."</p>
              <p className="text-primary font-bold text-xl mt-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> "I visited it about three years ago..."
              </p>
              <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-widest">Rule: Use Past Simple for finished actions with a specific time reference.</p>
            </div>
          </div>
          <div className="p-6 bg-red-50/50 rounded-xl flex items-start gap-5 border border-red-100">
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-slate-500 line-through text-lg italic">"The mountains was very beautiful."</p>
              <p className="text-primary font-bold text-xl mt-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> "The mountains were very beautiful."
              </p>
              <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-widest">Rule: Subject-verb agreement (Plural subject).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
