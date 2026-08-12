import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Download, ExternalLink, X, FileQuestion } from 'lucide-react';
import { getFileCategory, formatFileSize } from '../utils/file-utils';
import { Button } from '@/shared/components/ui/button';

interface DocumentPreviewProps {
  readonly filename: string;
  readonly url: string;
  readonly mimeType?: string;
  readonly size?: number;
  readonly onClose: () => void;
}

export function DocumentPreview({
  filename,
  url,
  mimeType = '',
  size = 0,
  onClose,
}: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const category = getFileCategory({ mime_type: mimeType, extension: filename.split('.').pop() });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleFullscreen = () => setIsFullscreen((prev) => !prev);

  return (
    <article
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-slate-950/90 text-white font-sans transition-all",
        isFullscreen ? "p-0" : "p-4 md:p-8"
      )}
    >
      {/* Top Bar Controls */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">{filename}</h2>
          {size > 0 && <p className="text-xs text-white/40">{formatFileSize(size)}</p>}
        </div>

        <nav className="flex items-center gap-2" aria-label="Preview controls">
          {category === 'image' && (
            <>
              <button
                type="button"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <ZoomOut className="h-4.5 w-4.5" />
              </button>
              <span className="text-xs font-semibold select-none">{zoom}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <ZoomIn className="h-4.5 w-4.5" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Maximize className="h-4.5 w-4.5" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in new tab"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4.5 w-4.5" />
          </a>
          <a
            href={url}
            download={filename}
            aria-label="Download file"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Download className="h-4.5 w-4.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Main Preview Content Area */}
      <section className="flex-1 overflow-auto flex items-center justify-center p-4">
        {category === 'image' && (
          <figure className="max-h-full max-w-full flex items-center justify-center">
            <img
              src={url}
              alt={filename}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl transition-all duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </figure>
        )}

        {category === 'video' && (
          <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
            <video src={url} controls className="h-full w-full object-contain" autoPlay>
              <track kind="captions" />
            </video>
          </div>
        )}

        {category === 'audio' && (
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/5 p-6 shadow-2xl">
            <audio src={url} controls className="w-full" autoPlay />
          </div>
        )}

        {category === 'pdf' && (
          <iframe
            src={`${url}#toolbar=0`}
            title={filename}
            className="h-full w-full max-w-5xl rounded-xl border border-white/5 bg-slate-900 shadow-2xl"
          />
        )}

        {!['image', 'video', 'audio', 'pdf'].includes(category) && (
          <div className="text-center max-w-sm p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl flex flex-col items-center gap-4">
            <figure className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40" aria-hidden="true">
              <FileQuestion className="h-8 w-8" />
            </figure>
            <div>
              <h3 className="text-base font-bold text-white">Preview unavailable</h3>
              <p className="mt-1.5 text-xs text-white/40">
                This file type ({mimeType || filename.split('.').pop()}) cannot be previewed directly in the browser.
              </p>
            </div>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2">
              <a href={url} download={filename}>
                Download File ({formatFileSize(size)})
              </a>
            </Button>
          </div>
        )}
      </section>
    </article>
  );
}

import { cn } from '@/shared/lib/utils';
