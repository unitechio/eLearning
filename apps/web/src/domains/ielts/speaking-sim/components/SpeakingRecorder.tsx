import React from 'react';
import { Mic } from 'lucide-react';

export function SpeakingRecorder() {
  return (
    <div className="space-y-8">
      <section className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px] ring-1 ring-slate-200/50">
        <div className="mb-8 flex items-center justify-center gap-1.5 h-24">
          {/* Simulated Waveform */}
          {[4, 8, 14, 20, 10, 24, 12, 16, 6, 12, 20, 8].map((h, i) => (
            <div 
              key={i} 
              className={`w-1.5 rounded-full ${h > 15 ? 'bg-primary' : 'bg-primary/30'}`} 
              style={{ height: `${h * 4}px` }}
            />
          ))}
        </div>
        <button className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 ring-8 ring-primary/20 hover:scale-110 active:scale-95 transition-all">
          <Mic className="w-8 h-8 fill-current" />
        </button>
        <p className="mt-6 font-bold text-primary animate-pulse tracking-wide">Lumina AI is listening...</p>
      </section>

      {/* Live Transcript Overlay */}
      <section className="p-6 bg-white rounded-xl border-l-4 border-primary shadow-sm">
        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Live Transcript</h4>
        <p className="text-xl text-slate-700 leading-relaxed italic opacity-80">
          "I'd like to talk about a small village in the Swiss Alps called Lauterbrunnen. I visited it about three years ago during a solo backpacking trip... It was truly <span className="text-primary font-bold underline decoration-primary/30 underline-offset-4">breathtaking</span>..."
        </p>
      </section>
    </div>
  );
}
