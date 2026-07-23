import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Maximize2, 
  Plus, 
  Minus, 
  Share2, 
  Download, 
  Play, 
  Pause 
} from 'lucide-react';
import { cn } from '@/shared/lib';

interface MediaPreviewProps {
  url: string;
  title: string;
  fileSize: string;
  type: 'image' | 'video';
  onClose: () => void;
  onShare?: () => void;
}

export function MediaPreview({ url, title, fileSize, type, onClose, onShare }: MediaPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(50, prev - 10));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <article 
        className="w-full max-w-4xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] text-slate-800 dark:text-slate-100 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Media preview"
      >
        {/* Top Header */}
        <header className="h-14 border-b border-slate-250 dark:border-slate-850 px-5 flex items-center justify-between bg-white dark:bg-slate-950 shrink-0">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white leading-none">{title}</h3>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-black uppercase mt-1">
              {type === 'image' ? 'PNG' : 'MP4'} • {fileSize}
            </p>
          </div>

          <nav className="flex items-center gap-2" aria-label="Media actions">
            <button 
              type="button" 
              onClick={() => navigator.clipboard.writeText(url)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-550 dark:text-slate-400 transition"
              aria-label="Copy link"
            >
              <Link2 className="h-4.5 w-4.5" />
            </button>
            <button 
              type="button" 
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-550 dark:text-slate-400 transition"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4.5 w-4.5" />
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-550 dark:text-slate-400 transition"
              aria-label="Close"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </nav>
        </header>

        {/* Content Area */}
        <section className="flex-1 bg-slate-50 dark:bg-slate-900/60 p-6 flex items-center justify-center overflow-auto">
          <div 
            className="transition-transform duration-200 ease-out origin-center max-w-full max-h-full rounded-2xl overflow-hidden shadow-lg border border-slate-150 dark:border-slate-800/40 relative"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {type === 'image' ? (
              <img 
                src={url} 
                alt={title} 
                className="max-h-[55vh] object-contain rounded-2xl"
              />
            ) : (
              <div className="relative group">
                <video 
                  src={url} 
                  className="max-h-[55vh] rounded-2xl" 
                  controls 
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button 
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:scale-105 transition"
                    aria-label="Play video"
                  >
                    <Play className="h-6 w-6 ml-0.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Control Bar */}
        <footer className="h-14 border-t border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between bg-white dark:bg-slate-950 shrink-0">
          {/* Zoom controls */}
          <section className="flex items-center gap-2 border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 rounded-xl px-2 py-1">
            <button 
              type="button" 
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-350 min-w-10 text-center">
              {zoom}%
            </span>
            <button 
              type="button" 
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </section>

          {/* Action buttons */}
          <section className="flex gap-2">
            {onShare && (
              <button 
                type="button" 
                onClick={onShare}
                className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            )}
            <a 
              href={url}
              download
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition hover:bg-slate-850 dark:hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
          </section>
        </footer>
      </article>
    </div>
  );
}
