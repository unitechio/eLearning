import React from "react";

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
  "aria-label"?: string;
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
  "aria-label": ariaLabel = "Trình phát âm thanh",
}: AudioPlayerProps) {
  const trackBg = dark ? "bg-inverse-surface/40" : "bg-surface-container-high";
  const replayBtn = dark
    ? "bg-inverse-surface/60 hover:bg-inverse-surface text-inverse-on-surface"
    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant";
  const speedPill = dark
    ? "text-inverse-on-surface/40 hover:text-inverse-on-surface"
    : "text-on-surface-variant/60 hover:text-on-surface";
  const speedPillActive = dark
    ? "bg-inverse-surface text-inverse-on-surface"
    : "bg-surface-container text-on-surface";

  return (
    <figure
      aria-label={ariaLabel}
      className="flex items-center gap-3"
    >
      {/* Play / Pause */}
      <button
        type="button"
        onClick={onPlay}
        aria-label={playing ? "Tạm dừng" : "Phát"}
        className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center text-sm transition-colors shadow-sm shadow-primary/20 shrink-0"
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Replay */}
      <button
        type="button"
        onClick={onReplay}
        aria-label="Phát lại"
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors shrink-0 ${replayBtn}`}
      >
        ↩
      </button>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`flex-1 h-1.5 ${trackBg} rounded-full cursor-pointer relative overflow-hidden`}
      >
        <div
          className="h-1.5 bg-primary rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time */}
      <span className="text-xs text-on-surface-variant font-mono whitespace-nowrap shrink-0">
        {elapsed}/{duration}
      </span>

      {/* Speed pills */}
      <div className="flex gap-0.5 shrink-0" role="group" aria-label="Tốc độ phát">
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeed?.(s)}
            aria-pressed={speed === s}
            className={`text-xs px-1.5 py-0.5 rounded transition-all ${
              speed === s ? speedPillActive : speedPill
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Loop */}
      <button
        type="button"
        aria-label="Lặp lại"
        className={`text-xs border rounded px-2 py-1 transition-colors shrink-0 ${
          dark
            ? "border-inverse-surface/40 text-inverse-on-surface/40 hover:border-inverse-surface"
            : "border-outline-variant text-on-surface-variant hover:border-primary/50"
        }`}
      >
        ⟳
      </button>
    </figure>
  );
}
