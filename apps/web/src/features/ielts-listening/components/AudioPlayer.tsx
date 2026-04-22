import { Play, RotateCcw, RotateCw, Volume2 } from 'lucide-react';

export function AudioPlayer() {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0px_24px_48px_-12px_rgba(26,27,34,0.06)] border border-outline-variant/10">
      <div className="flex flex-col items-center gap-6">
        {/* Waveform Simulation */}
        <div className="w-full h-24 flex items-end justify-between gap-1 px-4">
          {[40, 60, 35, 80, 55, 90, 45, 70, 30, 50, 85, 40, 60, 75, 25, 90, 45, 35, 65, 55, 80, 40, 70, 30, 50, 60, 40, 85, 55, 25, 75, 45].map((height, i) => (
            <div
              key={i}
              className={`w-1 flex-1 bg-outline-variant rounded-full transition-all duration-200 ${i < 7 ? 'bg-primary' : ''}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-outline">01:42</span>
            <div className="h-1.5 w-64 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary"></div>
            </div>
            <span className="text-sm font-bold text-outline">04:55</span>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-zinc-400 hover:text-primary transition-colors">
              <RotateCcw className="w-8 h-8" />
            </button>
            <button className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
              <Play className="w-8 h-8 fill-current" />
            </button>
            <button className="text-zinc-400 hover:text-primary transition-colors">
              <RotateCw className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
            <button className="px-3 py-1.5 rounded-full text-xs font-bold text-outline hover:text-primary transition-colors">0.8x</button>
            <button className="px-3 py-1.5 rounded-full text-xs font-bold bg-white text-primary shadow-sm">1.0x</button>
            <button className="px-3 py-1.5 rounded-full text-xs font-bold text-outline hover:text-primary transition-colors">1.2x</button>
          </div>
        </div>
      </div>
    </div>
  );
}
