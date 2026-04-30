import React from 'react';

export const SPEEDS = ["0.5x", "0.75x", "1x", "1.25x", "1.5x"] as const;

type AudioSpeed = (typeof SPEEDS)[number];

interface AudioPlayerProps {
  speed?: AudioSpeed;
  onSpeed?: (speed: AudioSpeed) => void;
  progress?: number;
  duration?: string;
  elapsed?: string;
  onPlay?: () => void;
  onReplay?: () => void;
  playing?: boolean;
  dark?: boolean;
}

export function AudioPlayer({
  speed = "1x",
  onSpeed,
  progress = 0,
  duration = "00:06",
  elapsed = "00:00",
  onPlay,
  onReplay,
  playing = false,
  dark = false,
}: AudioPlayerProps) {
  const track = dark ? "bg-gray-700" : "bg-gray-200";
  const btn = dark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-500";
  const pill = dark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700";
  const pillOn = dark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800";

  return (
    <div className="flex items-center gap-3">
      {/* Play / Pause */}
      <button
        onClick={onPlay}
        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-sm transition-colors shadow-sm shrink-0"
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Replay */}
      <button
        onClick={onReplay}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors shrink-0 ${btn}`}
      >
        ↩
      </button>

      {/* Progress bar */}
      <div className={`flex-1 h-1.5 ${track} rounded-full cursor-pointer relative`}>
        <div
          className="h-1.5 bg-red-600 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 font-mono whitespace-nowrap shrink-0">
        {elapsed}/{duration}
      </span>

      {/* Speed pills */}
      <div className="flex gap-0.5 shrink-0">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed?.(s)}
            className={`text-xs px-1.5 py-0.5 rounded transition-all ${
              speed === s ? pillOn : pill
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loop */}
      <button className={`text-xs border rounded px-2 py-1 transition-colors shrink-0 ${
        dark ? "border-gray-700 text-gray-500 hover:border-gray-500" : "border-gray-300 text-gray-500 hover:border-red-400"
      }`}>
        ⟳
      </button>
    </div>
  );
}
