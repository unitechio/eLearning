import React from 'react';
import { Pause, Play, X, Check, AlertCircle } from 'lucide-react';
import { getFileIcon, getFileColorVariant, formatFileSize } from '../utils/file-utils';
import { cn } from '@/shared/lib/utils';

interface UploadProgressItemProps {
  readonly filename: string;
  readonly progress: number; // 0 to 100
  readonly size: number; // in bytes
  readonly status: 'uploading' | 'paused' | 'completed' | 'failed';
  readonly onCancel?: () => void;
  readonly onPauseToggle?: () => void;
  readonly error?: string;
}

export function UploadProgressItem({
  filename,
  progress,
  size,
  status,
  onCancel,
  onPauseToggle,
  error,
}: UploadProgressItemProps) {
  const FileIcon = getFileIcon(filename);
  const { bg, text, iconColor } = getFileColorVariant(filename);

  const uploadedSize = (size * progress) / 100;

  return (
    <article className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900 font-sans">
      {/* Light blue progress overlay background */}
      {status === 'uploading' && (
        <span
          className="absolute inset-y-0 left-0 bg-blue-50/40 dark:bg-blue-950/5 transition-all duration-300 ease-out z-0"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Left File Icon Badge */}
        <figure className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`} aria-hidden="true">
          <FileIcon className={`h-5 w-5 ${iconColor}`} />
        </figure>

        {/* Center Details */}
        <div className="min-w-0 flex-1 text-left">
          <h3 className="truncate text-sm font-bold text-slate-800 dark:text-white">
            {filename}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1.5">
            {status === 'uploading' && (
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Uploading {progress}%
              </span>
            )}
            {status === 'paused' && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Paused {progress}%
              </span>
            )}
            {status === 'completed' && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="h-3 w-3" /> Completed
              </span>
            )}
            {status === 'failed' && (
              <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Failed
              </span>
            )}
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              {status === 'completed'
                ? formatFileSize(size)
                : `${formatFileSize(uploadedSize)} of ${formatFileSize(size)}`}
            </span>
          </p>
          {status === 'failed' && error && (
            <p className="mt-1 text-[10px] text-rose-500 font-medium truncate">
              {error}
            </p>
          )}
        </div>

        {/* Right Actions */}
        <nav className="flex items-center gap-1.5 shrink-0" aria-label="Upload controls">
          {(status === 'uploading' || status === 'paused') && onPauseToggle && (
            <button
              type="button"
              onClick={onPauseToggle}
              aria-label={status === 'uploading' ? 'Pause upload' : 'Resume upload'}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {status === 'uploading' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Cancel upload"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Horizontal Progress Bar */}
      {(status === 'uploading' || status === 'paused') && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              status === 'paused' ? 'bg-amber-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
}
